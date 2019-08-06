import React, { Component } from "react";
import StarReviewsStatic from "./StarReviewsStatic";
import PropTypes from "prop-types";
var grade = require("letter-grade");

class ParkCard extends Component {
	state = {};

	renderNumReviews(numReviews) {
		if (numReviews === 1) {
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

	inRange(x, min, max) {
		return (x - min) * (x - max) <= 0;
	}

	renderLetterGrade = () => {
		const moon = this.props.moon;
		const humidity = this.props.park.weather.humidity / 100;
		const cloudCov = this.props.park.weather.clouds / 100;
		const lightPol = this.props.park.light_pol;

		//addition between these
		var moonScore = 0.45 * (-1 * (2 * this.props.moon - 1));
		var lightPolScore = 0.25 * (((-1 * 1) / 3) * (lightPol - 3));
		var humidityScore = 0;
		if (humidity < 0.4) {
			humidityScore += 0.15 * 1;
		} else if (this.inRange(humidity, 0.4, 0.8)) {
			humidityScore += 0.15 * (-2.5 * humidity + 2);
		} else if (0.8 < humidity) {
			humidityScore += 0;
		}
		var cloudScore = 0;
		if (cloudCov < 0.2) {
			cloudScore += 0.15 * 1;
		} else if (this.inRange(cloudCov, 0.2, 0.4)) {
			cloudScore += 0.15 * (-5 * cloudCov + 2);
		} else if (0.4 < cloudCov) {
			cloudScore += 0;
		}

		const finalScore =
			moonScore + cloudScore + humidityScore + lightPolScore;
		//print to be sure
		// console.log(
		// 	" park: " + this.props.park.name_alt + " moon: " + moon,
		// 	"moonScore: " + moonScore + " humidity: " + humidity,
		// 	" humidityScore: " + humidityScore + " lightpollution: " + lightPol,
		// 	" lightPolScore: " + lightPolScore + " cloudcov: " + cloudCov,
		// 	" cloudScore: " + cloudScore
		// );
		// console.log(" finalScore: " + finalScore);

		return grade(finalScore * 100);
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
							{this.props.park.weather.city} forecast for{" "}
							{new Date(
								this.props.park.weather.time
							).toLocaleString()}
							: <br />
							{this.props.park.weather.cloudDesc} <br />
							{this.props.park.weather.temp} °C
							<br />
							{this.props.park.weather.humidity}% Humidity <br />
							{this.renderReviewScore(this.props.park.avgScore)}
							<br />
							{this.renderNumReviews(this.props.park.numReviews)}
							<br />
							Overall score: {this.renderLetterGrade()}
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
