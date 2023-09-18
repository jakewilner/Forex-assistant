import Table from 'react-bootstrap/Table';

export function MyTable({ labels, data }) {
	const header = labels.map((item, i) => <th key={i}>{item}</th>);

	const body = data.map((list, i) => (
		<tr aria-label="table body row" key={i}>
			{list.map((item, i) => (
				<td key={i}>{item}</td>
			))}
		</tr>
	));

	return (
		<Table striped bordered hover id='table'>
			<thead>
				<tr aria-label="table header">{header}</tr>
			</thead>
			<tbody>{body}</tbody>
		</Table>
	);
}