import React, { Component } from "react";
import PropTypes from "prop-types";

class ParkCard extends Component {
	state = {};

	render() {
		return (
			<React.Fragment>
				<div
					className="card mb-3"
					style={{ textTransform: "capitalize" }}
				>
					<div className="card-header text-white bg-primary">
						<button
							className="btn btn-link text-white"
							onMouseEnter={() => {
								this.props.handleMouseOver(this.props.park.id);
							}}
							onMouseLeave={() => {
								this.props.handleMouseLeave(this.props.park.id);
							}}
							onClick={() => {
								this.props.handleMouseClick(this.props.park.id);
							}}
						>
							{this.props.park.name_alt
								? this.props.park.name_alt
								: this.props.park.name}
						</button>
					</div>
					<div className="card-body bg-light">
						{/* <h5 className="card-title">Primary card title</h5> */}
						<p className="card-text">
							{parseFloat(this.props.park.light_pol).toFixed(2)}
							<br />
							{this.props.park.dist}km <br />
							{this.props.park.cloudDesc} <br />
							{this.props.park.humidity}% Humidity <br />
						</p>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

//Default no-op functions if no prop, so that it doesn't complain about them not existing
ParkCard.defaultProps = {
	handleMouseOver: () => {},
	handleMouseLeave: () => {},
	handleMouseClick: () => {}
};

export default ParkCard;
