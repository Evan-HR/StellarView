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

	renderMoonData() {
		if (this.props.parkList.length > 0) {
			var moonDataString = "";
			var moonIllum = this.props.moon;
			var moonType = this.props.moonType;
			moonDataString = `The moon is ${moonType}, meaning it is ${moonIllum}% illuminated.`;

			return moonDataString;
		}
	}

	renderParkCardList = () => {
		if (this.props.parkList.length > 0) {
			return (
				<div >
					{this.props.parkList.map(this.renderParkCard)}
				</div>
			);
		} else {
			return (
				<div className="text-center">
					<div
						className="card text-white bg-danger mb-3"
						// style={{ "max-width": "18rem" }}
					>
						<div className="card-header">No parks available.</div>
						{/* <div className="card-body">
						<h5 className="card-title">Danger card title</h5>
						<p className="card-text">
							Some quick example text to build on the card title
							and make up the bulk of the card's content.
						</p>
					</div> */}
					</div>
				</div>
			);
		}
	};

	renderParkCard = park => {
		return (
			<div
				className="card mb-3"
				style={{ textTransform: "capitalize" }}
			>
				<div className="card-header text-white bg-primary">
					{park.name_alt}
				</div>
				<div className="card-body bg-light">
					{/* <h5 className="card-title">Primary card title</h5> */}
					<p className="card-text">
						{park.light_pol} <br />
						{parseFloat(park.distance).toFixed(2)}km <br />
						{park.cloudDesc} <br />
						{park.humidity}% Humidity <br />
					</p>
				</div>
			</div>
		);
	};

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
				{this.renderParkCardList()}

				{/* <table className="table table-hover">
					<thead>
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
					</thead>
					<tbody>{this.renderParkTable()}</tbody>
				</table> */}
			</div>
		);
	}
}

export default ParkTable;
