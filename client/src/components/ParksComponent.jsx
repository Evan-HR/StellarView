import React, { Component } from "react";

class ParksComponent extends Component {
	state = {
		parks: []
	};

	//Request parks from server
	//getParks is a function, weird react notation perhaps?
	//note, reqData could be X, just a variable name! int x=

	//YOU NEED THE / in the ADDRESS!!
	//don't put "getParks", must be "/name"
	//getParks gets called, and does a fetch to
	//app.post("/api/getParks")
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
			//RESPONSE IS "x", any OUTPUT from previous
			//function CALL (FETCH POST REQ to server.js getParks)
			//.then WAITS for the response from fetch/server.js
			//data is "response" lol! can call either x/y
			//update STATE as a JSON array
			//react says "oh shit something changed"
			// note, everytime setState is called, it
			//automatically goes to RENDER() function!
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({ parks: data });
			})
			.catch(err => console.error(err));
	};

	//Clear button handler
	clearParks = () => {
		this.setState({ parks: [] });
	};

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

	//Clear button style
	clearButtonClass() {
		let classes = "btn btn-danger btn-sm m-2";
		if (this.state.parks.length > 0) {
			console.log("Clear button enabled");
			classes += " active";
		} else {
			console.log("Clear button disabled");
			classes += " disabled";
		}
		return classes;
	}

	//recursively calls render on it's children
	render() {
		console.log("ParksComponent - rendered");

		//"copies" into temp array parks
		const parks = this.state.parks;
		//Placeholder request
		var reqData = {
			lat: 43.25542,
			lng: -79.881315,
			dist: 50,
			lightpol: 2
		};
		//let clearButtonClass = this.clearButtonClass();
		//bind(this,reqData) passes reqData to getParks
		//bind seems to be needed for onClick buttons /w args

		return (
			<div className="ParksDiv">
				<button
					onClick={this.getParks.bind(this, reqData)}
					className="btn btn-primary btn-sm m-2"
					type="button"
				>
					<strong>Get parks</strong>
				</button>
				<button
					onClick={this.clearParks}
					className={this.clearButtonClass()}
					disabled={this.state.parks.length === 0}
					type="button"
				>
					<strong>Clear</strong>
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

export default ParksComponent;
