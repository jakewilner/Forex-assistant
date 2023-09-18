import { render, screen } from '@testing-library/react';
import App from './App';
import { Currency } from './pages/Currency';
import selectEvent from 'react-select-event';

test('App Render/Navbar', () => {
    render(<App/>)
    expect(window.location.pathname).toMatch('/')
    expect(screen.findByText('Home Page')).toBeInTheDocument()

    const aboutButton = document.getElementById('about-link')
    aboutButton.click()

    expect(screen.findByText('About us')).toBeInTheDocument()
    expect(window.location.pathname).toMatch('/about')

    const currencyButton = document.getElementById('currency-link')
    currencyButton.click()

    expect(screen.findByText('Currency page')).toBeInTheDocument()
    expect(window.location.pathname).toMatch('/currency')
})

test('Currency Page'), async () => {
    render(<Currency/>)

    const countryDrop = document.getElementById('country-dropdown')
    const metricDrop = document.getElementById('metric-dropdown')

    selectEvent.select(metricDrop, ['Inflation'])

    await selectEvent.select(countryDrop, 'United States').then(expect(screen.findByText('United States')).toBeInTheDocument())
    await selectEvent.select(countryDrop, 'Canada').then(expect(screen.findByText('Canada')).toBeInTheDocument())
    await selectEvent.select(countryDrop, 'European Union').then(expect(screen.findByText('European Union')).toBeInTheDocument())

    await selectEvent.select(countryDrop, 'Germany').then(expect(screen.findByText('Canada')).toBeInTheDocument())
    
    await selectEvent.select(metricDrop, 'Interest Rates').then(expect(document.getElementById('graph')).toBeInTheDocument())
    await selectEvent.select(metricDrop, 'Interest Index').then(expect(document.getElementById('table')).toBeInTheDocument())

}