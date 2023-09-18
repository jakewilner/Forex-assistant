import { useCallback, useMemo, useReducer, useState } from 'react';
import Select from 'react-select';
import { Graph } from '../components/Graph';
import { MyTable } from '../components/Table';
import './pages.css';
import axios from 'axios';

const COUNTRIES = [
		{ value: 'Australia', label: 'Australia' },
		{ value: 'Canada', label: 'Canada' },
		{ value: 'European Union', label: 'European Union' },
		{ value: 'France', label: 'France' },
		{ value: 'Germany', label: 'Germany' },
		{ value: 'Italy', label: 'Italy' },
		{ value: 'Japan', label: 'Japan' },
		{ value: 'New Zealand', label: 'New Zealand' },
		{ value: 'Russia', label: 'Russia' },
		{ value: 'Switzerland', label: 'Switzerland' },
		{ value: 'United States', label: 'United States' }
	],
	METRICS = [
		{ value: 'inflation', label: 'Inflation' },
		{ value: 'interest', label: 'Interest Rates' },
		{ value: 'inflationIndex', label: 'Inflation Index' }
	],
    BORDER_COLORS = [
        'rgb(255,225,25)',
        'rgb(0,130,200)',
        'rgb(128,128,128)',
        'rgb(128,0,0)',
        'rgb(245,130,48)',
        'rgb(0,0,128)',
        'rgb(220,190,255)',
        'rgb(230,25,75)',
        'rgb(60,180,75)',
        'rgb(70,240,240)',
        'rgb(240,50,230)',
    ],
    BACKGROUND_COLORS = [
        'rgba(255,225,25,0.5)',
        'rgba(0,130,200,0.5)',
        'rgba(128,128,128,0.5)',
        'rgba(128,0,0,0.5)',
        'rgba(245,130,48,0.5)',
        'rgba(0,0,128,0.5)',
        'rgba(220,190,255,0.5)',
        'rgba(230,25,75,0.5)',
        'rgba(60,180,75,0.5)',
        'rgba(70,240,240,0.5)',
        'rgba(240,50,230,0.5)',
    ];

export const Currency = () => {

	const [rawData, dispatch] = useReducer(
		(prevData, { country, dataType, data }) => {
			return { ...prevData, [dataType]: { ...prevData[dataType], [country]: data } };
		},
		{ inflation: {}, interest: {}, inflationIndex: {} }
	);
	const [selectedCountries, setSelectedCountries] = useState([]);
	const [metric, setMetric] = useState('inflationIndex');

	const labels = useMemo(
		() => (selectedCountries.length === 0 ? [] : rawData[metric][selectedCountries[0]].map(({ month }) => month)),
		[rawData, selectedCountries]
	);
	const tableLabels = useMemo(() => ['Country', ...labels], [labels]);

	const tableData = useMemo(
		() => selectedCountries.map((country) => [country, ...rawData[metric][country].map((data) => data.value)]),
		[rawData, selectedCountries, metric, rawData]
	);
	const graphData = useMemo(
		() => ({
			labels,
			datasets: selectedCountries.map((country) => ({
				label: country,
				data: rawData[metric][country].map(({ value }) => value),
				borderColor: BORDER_COLORS[selectedCountries.indexOf(country)],
				backgroundColor: BACKGROUND_COLORS[selectedCountries.indexOf(country)]
			}))
		}),
		[labels, selectedCountries, metric, rawData]
	);

	const handleChange = useCallback(
		(selectedOptions) => {
			if (selectedOptions.length < selectedCountries.length) {
				setSelectedCountries(selectedOptions.map(({ value }) => value));
			} else {
				Promise.all(
					selectedOptions.map(({ value }) => {
						if (selectedCountries.includes(value)) {
							return Promise.resolve(value);
						} else {
							return Promise.all([
								axios
									.get(`http://localhost:5000/inflation?country=${value}`)
									.then((res) => dispatch({ country: value, dataType: 'inflation', data: res.data })),
								axios
									.get(`http://localhost:5000/interest-rates?country=${value}`)
									.then((res) => dispatch({ country: value, dataType: 'interest', data: res.data })),
								axios
									.get(`http://localhost:5000/inflation-index?country=${value}`)
									.then((res) => dispatch({ country: value, dataType: 'inflationIndex', 
									data: res.data.map((item) => {
										item.value = Math.round(item.value*1000)/1000
										return item
									})
							}))
							]).then(() => value);
						}
					})
				).then((countries) => setSelectedCountries(countries));
			}
		},
		[selectedCountries]
	);

	return (
		<div className="currency">
			<div className="title">
				<h1>Currency page</h1>
			</div>
			<div className="dropdown">
				<Select isMulti options={COUNTRIES} onChange={handleChange} aria-label="dropdown menu" id='country-dropdown'/>
				<Select options={METRICS} defaultValue={METRICS[2]} onChange={({ value }) => setMetric(value)} aria-label="dropdown menu" id='metric-dropdown'/>
			</div>
			<div className="graph">
				<Graph data={graphData} aria-label="line graph content" />
			</div>
			<div className="table" aria-label="table content">
				<MyTable labels={tableLabels} data={tableData} />
			</div>
		</div>
	);
};