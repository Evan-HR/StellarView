import React, { Component } from "react";
import StarReviewsStatic from "./StarReviewsStatic";
import PropTypes from "prop-types";
import styled from "styled-components";
import humidityIcon from "./style/Media/cardIcons/humidity.svg";
import cloudIcon from "./style/Media/cardIcons/cloud.svg";
import lightPolIcon from "./style/Media/cardIcons/lightPol.svg";
import tempIcon from "./style/Media/cardIcons/temperature.svg";
import infoIcon from "./style/Media/cardIcons/moreInfo.svg";

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
			<CardBootstrap>
				<div className="card">
					<CardStyle>
						<div className="ParkTitle">
							<span
								className="Title"
								style={{ textTransform: "capitalize" }}
								onMouseEnter={() => {
									this.props.handleMouseOver(
										this.props.park.id
									);
								}}
								onMouseLeave={() => {
									this.props.handleMouseLeave(
										this.props.park.id
									);
								}}
								onClick={() => {
									this.props.handleMouseClick(
										this.props.park.id
									);
								}}
							>
								<b>
									{this.props.park.name_alt
										? this.props.park.name_alt
										: this.props.park.name}
								</b>
							</span>
						</div>

						<div className="Dist">
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
								<b>{this.props.park.weather.city}</b> forecast
								for <br />
								{new Date(
									this.props.park.weather.time
								).toLocaleString()}
							</span>
						</div>

						<div className="ParkScore">
							<span className="ScoreNumerator">
								{(this.props.park.score * 10).toFixed(1)}
							</span>

							<br />
							<span className="ScoreDenominator">/10</span>
						</div>

						<div className="StarRev">
							{this.renderReviewScore(this.props.park.avgScore)}
							{this.renderNumReviews(this.props.park.numReviews)}
						</div>

						<div className="MoreInfo">
							{/* <span className="infoIcon"> */}
							<img src={infoIcon} />
							{/* </span> */}
							<span className="infoText">
								More
								<br />
								Info
							</span>
						</div>
					</CardStyle>
				</div>
			</CardBootstrap>
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
	max-height: 300px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr 1fr;
	grid-column-gap: 10px;
	grid-row-gap: 10px;
	grid-template-areas:
		"ParkTitle   ParkTitle   ParkTitle    Dist"
		"WeatherInfo WeatherInfo WeatherInfo  ParkScore"
		"ParkHum     ParkCloud   ParkLightPol ParkScore"
		"ParkTemp    StarRev     StarRev      MoreInfo";

	font-family: IBM Plex Sans;
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 23px;
	text-align: left;

	color: ${props => props.theme.fontDark};

	.card {
		border: 1px solid rgba(0, 0, 0, 0);
	}

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
			/* text-shadow:
				-0.5px -0.5px 0 #000,
				0.5px -0.5px 0 #000,
				-0.5px 0.5px 0 #000,
				0.5px 0.5px 0 #000;   */
		}
	}

	.Dist {
		display: inline-block;
		margin: auto;
		font-weight: 300;

		span {
			left: 0;
			position: relative;
		}

		.DistMantissa {
			font-size: 13px;
		}
	}

	.WeatherInfo {
		grid-area: WeatherInfo;
		/* border-bottom: 2px ${props => props.theme.fontDark} solid; */

		font-family: IBM Plex Mono;
		font-weight:400;
		font-size: 14px;
		line-height: 18px;
		align-content: center;
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
			.ScoreNumeratorMantissa {
				font-size: 24px;
			}
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

const CardBootstrap = styled.div`
	.card {
		position: relative;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-direction: column;
		flex-direction: column;
		min-width: 0;
		word-wrap: break-word;
		background-color: #fff;
		background-clip: border-box;
		border: 1px solid rgba(0, 0, 0, 0.125);
	}

	.card > hr {
		margin-right: 0;
		margin-left: 0;
	}
`;
