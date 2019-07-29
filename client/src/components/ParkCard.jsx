import React, { Component } from "react";
import StarReviewsStatic from "./StarReviewsStatic";
import PropTypes from "prop-types";

class ParkCard extends Component {
	state = {};

	renderNumReviews(numReviews) {
		if (numReviews == 1) {
			return <div>{numReviews} review</div>;
		} else if (!numReviews) {
			return <div>No reviews</div>;
		} else {
			return <div>{numReviews} reviews</div>;
		}
	}

	renderReviewScore(reviewScore) {
		if (reviewScore) {
			return (
				<div>
					<StarReviewsStatic avgScore={reviewScore} />
				</div>
			);
		} else {
			return (
				<div>
					<StarReviewsStatic avgScore={0} />
				</div>
			);
		}
	}

	renderLetterGrade = () => {
		console.log("RENDER LETTER GRADE GET HERE??");
		return 2 * 3;
	};

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
							{this.props.park.distance < 9000 ? (
								<React.Fragment>
									{parseFloat(
										this.props.park.distance
									).toFixed(2)}
									<b> km</b>
								</React.Fragment>
							) : (
								<b className="text-muted">Location unknown</b>
							)}
							<br />
							{this.props.park.cloudDesc} <br />
							{this.props.park.clouds}% <br />
							{this.props.park.humidity}% Humidity <br />
							{this.renderReviewScore(this.props.park.avgScore)}
							<br />
							{this.renderNumReviews(this.props.park.numReviews)}
							<br />
							{this.renderLetterGrade()}
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
