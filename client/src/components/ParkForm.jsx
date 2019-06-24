//Input form
import React, { Component } from "react";

class ParkForm extends Component {
	state = {
		lat: "",
		lng: "",
		dist: "",
		lightpol: "",
		error: ""
	};

	//componentDidMount runs RIGHT after post-render
	componentDidMount() {
		this.getMyLocation();
	}

	//   In order to have access to  this.state inside
	//    getCurrentPosition's callback, you either need to
	//    bind the success callback or make use of arrow function.
	getMyLocation = e => {
		navigator.geolocation.getCurrentPosition(
			position => {
				this.setState({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					error: null
				});
			},
			error => this.setState({ error: error.message }),
			{ enableHighAccuracy: true }
		);
	};

	handleSubmit(event) {
		alert("submitted info " + this.input.curren);
	}

	handleDistanceChange = changeEvent => {
		this.setState({
			dist: changeEvent.target.value
		});
	};

	handleLatChange = changeEvent => {
		this.setState({
			lat: changeEvent.target.value
		});
	};

	handleLngChange = changeEvent => {
		this.setState({
			lng: changeEvent.target.value
		});
	};

	handleLightPolChange = changeEvent => {
		this.setState({
			lightpol: changeEvent.target.value
		});
	};

	onSubmit = (e) => {
		e.preventDefault();
		console.log(this.state);
	}

	render() {
		return (
			<div className="border border-primary">
				<button
					// onClick={this.getParks.bind(this, this.state.formInput)}
					className="btn btn-primary btn-sm m-2"
					type="button"
				>
					<strong>Get parks</strong>
				</button>
				<button
					// onClick={this.getParks.bind(this, this.state.formInput)}
					className="btn btn-primary btn-sm m-2"
					type="button"
					onClick={this.getMyLocation}
				>
					<strong>Get location</strong>
				</button>
				<button
					// onClick={this.clearParks}
					// className={this.clearButtonClass()}
					// disabled={this.state.parks.length === 0}
					type="button"
				>
					<strong>Clear</strong>
				</button>
				<br />
				lat: {this.state.lat}, lng: {this.state.lng}
				<br />
				dist: {this.state.dist}, lightpol: {this.state.lightpol}
				<br />
				<h3>Input Form</h3>
				<form onSubmit={this.handleSubmit} />
				<input
					placeholder="Latitude"
					type="number"
					min="-90"
					max="90"
					step="any"
					value={this.state.lat}
					id="Lat"
					name="lat"
					required
					//does this character by character, each char is a new 'event'
					onChange={this.handleLatChange}
				/>
				<input
					placeholder="Longitude"
					type="number"
					min="-180"
					max="180"
					step="any"
					value={this.state.lng}
					id="Long"
					name="lng"
					required
					onChange={this.handleLngChange}
				/>
				<br />
				<br />
				Distance:
				<br />
				<br />
				<input
					type="radio"
					value="5"
					name="dist"
					required
					checked={this.state.dist === "5"}
					onChange={this.handleDistanceChange}
				/>
				less than 5 km
				<br />
				<input
					type="radio"
					value="25"
					name="dist"
					checked={this.state.dist === "25"}
					onChange={this.handleDistanceChange}
				/>
				less than 25 km
				<br />
				<input
					type="radio"
					value="50"
					name="dist"
					checked={this.state.dist === "50"}
					onChange={this.handleDistanceChange}
				/>
				less than 50 km
				<br />
				<input
					type="radio"
					value="100"
					name="dist"
					checked={this.state.dist === "100"}
					onChange={this.handleDistanceChange}
				/>
				less than 100 km
				<br />
				<input
					type="radio"
					value="200"
					name="dist"
					checked={this.state.dist === "200"}
					onChange={this.handleDistanceChange}
				/>
				less than 200 km
				<br />
				<input
					type="radio"
					value="300"
					name="dist"
					checked={this.state.dist === "300"}
					onChange={this.handleDistanceChange}
				/>
				less than 300 km
				<br />
				<br />
				<input
					placeholder="Max Light Pollution"
					type="number"
					min="0"
					max="40"
					step="any"
					id="lightpoll"
					name="lightpol"
					required
					onChange={this.handleLightPolChange}
				/>
				<button onClick={(e) => this.onSubmit(e)}>Submit</button>
				<form />
				<br />
				<br />
				<br />
			</div>
		);
	}
}

export default ParkForm;
