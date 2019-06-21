import React, { Component } from "react";

class ParksComponent extends Component {
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

	clearParks = () => {
		this.setState({ parks: [] });
	};

	renderPark = park => (
		<tr>
			<td>{park.name}</td>
			<td>{park.light_pol}</td>
			<td>{park.distance}</td>
		</tr>
    );

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

	render() {
		console.log("ParksComponent - rendered");
		const parks = this.state.parks;
		var reqData = {
			lat: 43.25542,
			lng: -79.881315,
			dist: 50,
			lightpol: 2
		};
		//let clearButtonClass = this.clearButtonClass();

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
                    disabled={(this.state.parks.length === 0)}
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
