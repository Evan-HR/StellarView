import React, { Component } from "react";

//import logo from "./logo.svg";

import "./App.css";

class App extends Component {
	state = {
		parks: []
	};

	getParks = reqData => {
		console.log(JSON.stringify(reqData));
		fetch("/api/getParks", {
			method: "POST", //Important
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(reqData)
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({ parks: data });
			})
			.catch(err => console.error(err));
	};

	renderPark = park => (
		<tr>
			<td>{park.name}</td>
			<td>{park.light_pol}</td>
			<td>{park.distance}</td>
		</tr>
	);

	render() {
		const parks = this.state.parks;
		var reqData = {
			lat: 43.25542,
			lng: -79.881315,
			dist: 50,
			lightpol: 2
		};
		//console.log("parks ", parks);
		return (
			<div className="App">
				<button
					onClick={this.getParks.bind(this, reqData)}
					className="btn btn-primary btn-sm m-2"
					type="button"
				>
					Get parks at
				</button>
				<br />
				lat: {reqData.lat}, lng: {reqData.lng}
				<br />
				<table className="table table-hover">
					<tr>
						<th>Name</th>
						<th>Light</th>
						<th>Distance</th>
					</tr>
					<tbody>{parks.map(this.renderPark)}</tbody>
				</table>
			</div>
		);
	}
}

export default App;
