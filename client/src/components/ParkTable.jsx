//Displays park table
import React, { Component } from "react";

class ParkTable extends Component {
	state = {};

	//Draw table entries per park
	//at this point, fields "name, light_pol, distance" aren't defined
	//which is why you don't see it populated on the table before "get parks" button
	renderPark = x => (
		<tr>
			<td>{x.name}</td>
			<td>{x.light_pol}</td>
			<td>{x.distance}</td>
		</tr>
	);

	render() {
		return (
			<div className="border border-primary">
				<table className="table table-hover">
					<tr>
						<th>Name</th>
						<th>Light</th>
						<th>Distance</th>
					</tr>
					<tbody>{this.props.parkList.map(this.renderPark)}</tbody>
				</table>
			</div>
		);
	}
}

export default ParkTable;
