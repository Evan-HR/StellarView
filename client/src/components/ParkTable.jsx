//Displays park table
import React, { Component } from "react";

class ParkTable extends Component {
	state = {};
	/* Note - park object is:
        {
       { id: 6817,
[0]     osm_id: 217500775,
[0]     name: 'Unknown',
[0]     name_alt: 'Maple Avenue',
[0]     light_pol: 1.84691197,
[0]     lat: 43.19786151,
[0]     lng: -80.10863081,
[0]     distance: 20.26280157312762,
[0]     clouds: 90,
[0]     humidity: 72,
[0]     city: 'St. George' } ]
        }
    */

	renderParkTable = () => {
		if (this.props.parkList.length > 0) {
			return this.props.parkList.map(this.renderPark);
		} else {
			return (
				<tr>
					<td colSpan={3}>
						<strong style={{ color: "red" }}>
							No parks available.
						</strong>
					</td>
				</tr>
			);
		}
	};

	renderMoonData() {
		if (this.props.parkList.length > 0) {
			var moonDataString = "";
			var moonIllum = this.props.moon;
			var moonType = this.props.moonType;
			moonDataString = `The moon is ${moonType}, meaning it is ${moonIllum}% illuminated.`;

			return moonDataString;
		}
	}

	renderPark = park => (
		<tr>
			<td>{park.name_alt}</td>
			<td>{park.light_pol}</td>
			<td>{park.distance}</td>
			<td>{park.clouds}</td>
			<td>{park.cloudDesc}</td>
			<td>{park.humidity}</td>
			<td>{this.props.moon}</td>
			<td>{this.props.moonType}</td>
		</tr>
	);

	render() {
		console.log("ParkTable - rendered");
		return (
			<div className="border border-primary">
				{this.renderMoonData()}

				<table className="table table-hover">
					<tr>
						<th>Name</th>
						<th>Light</th>
						<th>Distance</th>
						<th>Cloud Coverage</th>
						<th>Cloud Type</th>
						<th>Humidity</th>
						<th>Moon %</th>
						<th>Moon Phase</th>
					</tr>
					<tbody>{this.renderParkTable()}</tbody>
				</table>
			</div>
		);
	}
}

export default ParkTable;
