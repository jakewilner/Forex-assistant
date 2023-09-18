const axios = require('axios').default;
const express = require('express');
const papa = require('papaparse');
const fs = require('fs');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const INTEREST_RATE_DATA = {},
	NASDAQ_COUNTRY_CODES = {
		Australia: 'AUS',
		Canada: 'CAN',
		Germany: 'DEU',
		'European Union': 'EUR',
		France: 'FRA',
		Italy: 'ITA',
		Japan: 'JPN',
		'New Zealand': 'NZL',
		Russia: 'RUS',
		Switzerland: 'CHE',
		'United States': 'USA'
	},
	CORRUPTION_DATA = {
		Australia: 73,
		Canada: 74,
		Germany: 80,
		'European Union': 70,
		France: 71,
		Italy: 56,
		Japan: 73,
		'New Zealand': 88,
		Russia: 29,
		Switzerland: 84,
		'United States': 67
	},
	FOOD_DEPENDENCY_DATA = {
		Australia: 75.4,
		Canada: 79.1,
		Germany: 77,
		'European Union': 75,
		France: 80.2,
		Italy: 75,
		Japan: 79.5,
		'New Zealand': 77.8,
		Russia: 69.1,
		Switzerland: 78.2,
		'United States': 78
	};

const initialData = papa.parse(fs.readFileSync('interest.csv').toString(), {
	header: true,
	dynamicTyping: true
});

initialData.data.forEach((row) => {
	INTEREST_RATE_DATA[row.Country] = Object.keys(row)
		.filter((key) => key !== 'Country')
		.map((month) => ({
			centralBank: 'Hardcoded',
			country: row.Country,
			month,
			value: row[month]
		}))
		.sort((a, b) => new Date(a.last_updated) - new Date(b.last_updated));
});

function updateInterestRates() {
	const today = new Date();

	Object.keys(INTEREST_RATE_DATA).forEach((country) => {
		if (country === 'Japan') {
			const month = today.getMonth() + 1;

			INTEREST_RATE_DATA.Japan = [
				...INTEREST_RATE_DATA.Japan.slice(1),
				{ centralBank: 'Hardcoded', country: 'Japan', month: `${today.getFullYear()}-${month < 10 ? `0${month}` : month}`, value: -0.1 }
			];
		} else if (country === 'European Union' || country === 'Germany' || country === 'France' || country === 'Italy') {
			axios
				.get('https://api.api-ninjas.com/v1/interestrate?name=Euribor - 12 months', {
					headers: { 'X-Api-Key': process.env.API_NINJA_KEY }
				})
				.then((res) => {
					const data = res.data.non_central_bank_rates[0];
					const [month, _, year] = data.last_updated.split('-');

					INTEREST_RATE_DATA[country] = [
						...INTEREST_RATE_DATA[country].slice(1),
						{ centralBank: data.central_bank, country: data.country, month: `${year}-${month}`, value: data.rate_pct }
					];
				});
		} else {
			axios
				.get(`https://api.api-ninjas.com/v1/interestrate?country=${country}&central_bank_only=true`, {
					headers: { 'X-Api-Key': process.env.API_NINJA_KEY }
				})
				.then((res) => {
					const data = res.data.central_bank_rates[0];
					const [month, _, year] = data.last_updated.split('-');

					INTEREST_RATE_DATA[country] = [
						...INTEREST_RATE_DATA[country].slice(1),
						{ centralBank: data.central_bank, country: data.country, month: `${year}-${month}`, value: data.rate_pct }
					];
				});
		}
	});
	const nextMonth = today.getMonth() === 11 ? new Date(today.getFullYear() + 1, 0, 1) : new Date(today.getFullYear(), today.getMonth() + 1, 1);

	setTimeout(updateInterestRates, nextMonth - today);
}

updateInterestRates();

async function getInflation(country) {
	const today = new Date(),
		month = today.getMonth() + 1;

	return axios
		.get(`https://data.nasdaq.com/api/v3/datasets/RATEINF/INFLATION_${NASDAQ_COUNTRY_CODES[country]}.json?api_key=${process.env.NASDAQ_API_KEY}`)
		.then((res) => {
			let data = res.data.dataset.data
				.slice(0, 12)
				.map(([date, value]) => ({ month: date.split('-').slice(0, 2).join('-'), value }))
				.sort((a, b) => new Date(a.month) - new Date(b.month));

			while (!data.find((point) => point.month === `${today.getFullYear()}-${month < 10 ? `0${month}` : month}`)) {
				const latestPoint = data[data.length - 1],
					[_, latestMonth] = latestPoint.month.split('-');

				data = [...data.slice(1), { month: `${today.getFullYear()}-${Number(latestMonth) + 1}`, value: latestPoint.value }];
			}

			return data;
		});
}

async function getUnemployment(country) {
	if (country === 'European Union') {
		return Promise.resolve(9.7);
	}

	return axios
		.get(`https://api.api-ninjas.com/v1/country?name=${country}`, {
			headers: { 'X-Api-Key': process.env.API_NINJA_KEY }
		})
		.then((res) => {
			return Number(res.data[0].unemployment);
		});
}

const app = express();

app.use(cors());

app.get('/inflation', (req, res) => {
	if (!req.query.country) {
		res.status(400).json({ error: 'Missing country query parameter' });
		return;
	}

	if (!(req.query.country in INTEREST_RATE_DATA)) {
		res.status(400).json({ error: 'Invalid country' });
		return;
	}

	getInflation(req.query.country).then((inflation) => {
		res.status(200).json(inflation);
	});
});

app.get('/interest-rates', (req, res) => {
	if (!req.query.country) {
		res.status(400).json({ error: 'Missing country query parameter' });
		return;
	}

	if (!(req.query.country in INTEREST_RATE_DATA)) {
		res.status(400).json({ error: 'Invalid country' });
		return;
	}

	res.json(INTEREST_RATE_DATA[req.query.country]);
});

app.get('/inflation-index', async (req, res) => {
	if (!req.query.country) {
		res.status(400).json({ error: 'Missing country query parameter' });
		return;
	}

	if (!(req.query.country in INTEREST_RATE_DATA)) {
		res.status(400).json({ error: 'Invalid country' });
		return;
	}

	const inflationData = await getInflation(req.query.country),
		interestRateData = INTEREST_RATE_DATA[req.query.country],
		uneployment = await getUnemployment(req.query.country),
		corruption = CORRUPTION_DATA[req.query.country],
		foodDependency = FOOD_DEPENDENCY_DATA[req.query.country];

	res.json(
		inflationData.map((point, i) => ({
			month: point.month,
			value: point.value * (2 * (13.75 - interestRateData[i].value) + (10 + uneployment) + (100 - corruption) / 12 + (100 - foodDependency) / 10)
		}))
	);
});

app.listen(5000, () => console.log('Server started on port 5000'));

