import React, { Component } from "react";
import StarReviewsStatic from "./StarReviewsStatic";
import PropTypes from "prop-types";
import styled from "styled-components";

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
			<div className="card">
				<CardStyle>
					<div
						className="ParkTitle"
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
						<span className="Title" style={{ textTransform: "capitalize" }}>
							{this.props.park.name_alt
								? this.props.park.name_alt
								: this.props.park.name}
						</span>

						<span className="Dist">
							<span className="DistCharacteristic">
								{this.props.park.distance < 9000 ? (
									<React.Fragment>
										{Math.trunc(
											parseFloat(this.props.park.distance)
										)}
									</React.Fragment>
								) : (
									<React.Fragment>?</React.Fragment>
								)}
							</span>
							<span className="DistMantissa">
								{this.props.park.distance < 9000 ? (
									<React.Fragment>
										.
										{Math.trunc(
											(parseFloat(
												this.props.park.distance
											) *
												100) %
												100
										)}
									</React.Fragment>
								) : (
									<React.Fragment>??</React.Fragment>
								)}{" "}
								<b> km</b>
							</span>
						</span>
					</div>

					<div className="WeatherSVG">I'm an svg</div>

					<div className="ParkTemp">
						{this.props.park.weather.temp} °C
					</div>

					<div className="WeatherDesc">
						{this.props.park.weather.cloudDesc}
					</div>

					<div className="WeatherInfo">
						{this.props.park.weather.city} forecast for{" "}
						{new Date(
							this.props.park.weather.time
						).toLocaleString()}
					</div>

					<div className="ParkScore">
						{this.renderLetterGrade(this.props.park.score)}
					</div>

					<div className="StarRev">
						{this.renderReviewScore(this.props.park.avgScore)}
					</div>

					<div className="NumRev">
						{this.renderNumReviews(this.props.park.numReviews)}
					</div>

					<div className="MoreInfo">More Info</div>
				</CardStyle>
			</div>
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

/////////////////////////////////////////////////////////////////////////////////////////

const CardStyle = styled.div`
	margin-bottom: 10px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr 1fr;
	grid-column-gap: 10px;
	grid-row-gap: 10px;
	grid-template-areas:
		"ParkTitle   ParkTitle   ParkTitle   ParkTitle"
		"WeatherInfo WeatherInfo WeatherInfo ParkScore"
		"WeatherSVG  ParkTemp    WeatherDesc ParkScore"
		"StarRev     StarRev     NumRev      MoreInfo";

	font-family: IBM Plex Sans;
	font-style: normal;
	font-weight: 600;
	font-size: 18px;
	line-height: 23px;
	text-align: left;

	color: #2f3334;

	.ParkTitle {
		grid-area: ParkTitle;
		border-bottom: 2px blueviolet solid;
		position: relative;

		span {
			position: absolute;
			bottom: 0;
		}

		.Title {
			left: 0;
		}

		.Dist {
			display: inline-block;
			margin: 0;
			font-weight: 300;
			right: 0;
			span {
				left: 0;
				position: relative;
			}

			.DistMantissa {
				font-size: 13px;
			}
		}
	}
	.ParkDist {
		grid-area: ParkDist;
		border-bottom: 2px blueviolet solid;
		/* border-style: solid;
		border-color: peru; */
	}
	.WeatherSVG {
		grid-area: WeatherSVG;
		border-style: solid;
		border-color: azure;
	}
	.ParkTemp {
		grid-area: ParkTemp;
		border-style: solid;
		border-color: wheat;
	}
	.ParkScore {
		grid-area: ParkScore;
		border-style: solid;
		border-color: lightsalmon;
	}
	.StarRev {
		grid-area: StarRev;
		border-style: solid;
		border-color: navajowhite;
	}
	.NumRev {
		grid-area: NumRev;
		border-style: solid;
		border-color: thistle;
	}
	.MoreInfo {
		grid-area: MoreInfo;
		border-style: solid;
		border-color: gainsboro;
	}
	.WeatherInfo {
		grid-area: WeatherInfo;
		border-style: solid;
		border-color: greenyellow;
	}
	.WeatherDesc {
		grid-area: WeatherDesc;
		border-style: solid;
		border-color: mintcream;
	}
`;
