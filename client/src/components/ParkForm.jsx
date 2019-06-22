//Input form
import React, { Component } from "react";

class ParkForm extends Component {
	state = {
        formInput: {
            lat: "",
            lng: "",
            dist: "",
            lightpol: ""
        }
    };

	render() {
		return (
			<div className="border border-primary">
				<button
					onClick={this.getParks.bind(this, formInput)}
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
				lat: {formInput.lat}, lng: {formInput.lng}
				<br />
			</div>
		);
	}
}

export default ParkForm;
