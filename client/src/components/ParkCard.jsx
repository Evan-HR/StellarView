import React, { Component } from "react";
import StarReviewsStatic from "./StarReviewsStatic";
import PropTypes from "prop-types";
import styled from "styled-components";
import humidityIcon from "./style/Media/Humidity.svg";
import cloudIcon from "./style/Media/Humidity.svg";
import lightPolIcon from "./style/Media/Humidity.svg";
import tempIcon from "./style/Media/Humidity.svg";
import infoIcon from "./style/Media/Humidity.svg";

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

	render() {
		return (
			<div className="card">
				<CardStyle>
					<div className="ParkTitle">
						<span
							className="Title"
							style={{ textTransform: "capitalize" }}
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
							<b>
								{this.props.park.name_alt
									? this.props.park.name_alt
									: this.props.park.name}
							</b>
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

					<div className="ParkHum">
						<img src={humidityIcon} />
						{this.props.park.weather.humidity < 40
							? "Good"
							: this.props.park.weather.humidity < 80
							? "Okay"
							: "Poor"}
					</div>

					<div className="ParkCloud">
						<img src={cloudIcon} />
						{this.props.park.weather.clouds < 40
							? "Good"
							: this.props.park.weather.clouds < 80
							? "Okay"
							: "Poor"}
					</div>

					<div className="ParkLightPol">
						<img src={lightPolIcon} />
						{this.props.park.light_pol < 1
							? "Good"
							: this.props.park.light_pol < 3
							? "Okay"
							: "Poor"}
					</div>

					<div className="ParkTemp">
						<span className="tempIcon">
							<img src={tempIcon} />
						</span>
						<span className="tempNum">
							{Math.round(this.props.park.weather.temp)} °C
						</span>
						<br />
						{this.props.park.weather.temp < 15
							? "Chilly"
							: this.props.park.weather.temp < 25
							? "Comfortable"
							: "Inadequate"}
					</div>

					<div className="WeatherInfo">
						<span>
							<b>{this.props.park.weather.city}</b> forecast for{" "}
							{new Date(
								this.props.park.weather.time
							).toLocaleString()}
						</span>
					</div>

					<div className="ParkScore">
						<span className="ScoreNumerator">
							{Math.round(this.props.park.score * 10)}
						</span>
						<br />
						<span className="ScoreDenominator">/10</span>
					</div>

					<div className="StarRev">
						{this.renderReviewScore(this.props.park.avgScore)}
						{this.renderNumReviews(this.props.park.numReviews)}
					</div>

					<div className="MoreInfo">
						<span className="infoIcon">
							<img src={infoIcon} />
						</span>
						<span className="infoText">
							More
							<br />
							Info
						</span>
					</div>
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
	margin: 13px;
	/* margin-bottom: 10px;
	margin-left: 13px;
	margin-right: 13px; */
	max-height: 250px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr 1fr;
	grid-column-gap: 10px;
	grid-row-gap: 10px;
	grid-template-areas:
		"ParkTitle   ParkTitle   ParkTitle    ParkTitle"
		"WeatherInfo WeatherInfo WeatherInfo  ParkScore"
		"ParkHum     ParkCloud   ParkLightPol ParkScore"
		"ParkTemp    StarRev     StarRev      MoreInfo";

	font-family: IBM Plex Sans;
	font-style: normal;
	font-weight: 600;
	font-size: 18px;
	line-height: 23px;
	text-align: left;

	color: ${props => props.theme.fontDark};

	.ParkTitle {
		grid-area: ParkTitle;
		border-bottom: 2px ${props => props.theme.fontDark} solid;
		position: relative;

		span {
			position: absolute;
		}

		.Title {
			bottom: 8px;
			font-size: 36px;
			left: 0;
		}

		.Dist {
			bottom: 0;
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
	.WeatherInfo {
		grid-area: WeatherInfo;
		border-bottom: 2px ${props => props.theme.fontDark} solid;

		font-family: IBM Plex Mono;
		font-size: 14px;
		line-height: 18px;
		position: relative;
		span {
			position: absolute;
			text-align: center;
			bottom: 0;
		}
	}
	.ParkHum {
		grid-area: ParkHum;
		text-align: center;
		margin: auto auto;
	}
	.ParkCloud {
		grid-area: ParkCloud;
		text-align: center;
		margin: auto auto;
	}
	.ParkLightPol {
		grid-area: ParkLightPol;
		text-align: center;
		margin: auto auto;
	}
	.ParkTemp {
		grid-area: ParkTemp;
		text-align: center;
		margin: auto auto;

		.tempIcon {
			height: 2em;
			width: 2em;
		}

		span {
			display: inline-block;
		}
	}
	.ParkScore {
		grid-area: ParkScore;
		font-family: Barlow;
		font-style: normal;
		font-weight: 300;
		display: inline-block;
		vertical-align: middle;
		text-align: center;
		margin: auto auto;

		.ScoreNumerator {
			font-size: 64px;
		}

		.ScoreDenominator {
			font-size: 24px;
		}
	}
	.StarRev {
		grid-area: StarRev;
		text-align: center;
		margin: auto auto;
	}
	.MoreInfo {
		grid-area: MoreInfo;
		text-align: center;
		margin: auto auto;

		.infoIcon {
			height: 2em;
			width: 2em;
		}

		.infoText {
			vertical-align: center;
		}

		span {
			display: inline-block;
		}
	}
`;
