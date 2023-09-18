import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { About } from '../pages/About';
import { Currency } from '../pages/Currency';
import { Home } from '../pages/Home';
import './navbar.css';

export const MyNavbar = () => {
	let component;
	switch (window.location.pathname) {
		case '/':
			component = <Home />;
			break;
		case '/about':
			component = <About />;
			break;
		case '/currency':
			component = <Currency />;
			break;
		default:
			component = <div><br/>Page not found!</div>;
	}

	return (
		<>
			<Navbar bg="light" expand="lg">
				<div className="navtitle">
					<Navbar.Brand href="#home">Forex Trading Assistant</Navbar.Brand>
				</div>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="Links">
						<Nav.Link href="/" id='home-link'>Home</Nav.Link>
						<Nav.Link href="/about" id='about-link'>About</Nav.Link>
						<Nav.Link href="/currency" id='currency-link'>Currency</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			{component}
		</>
	);
};