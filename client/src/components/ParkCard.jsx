import React, { Component } from "react";
import StarReviewsStatic from "./StarReviewsStatic";
import PropTypes from "prop-types";
import styled from "styled-components";
import humidityIcon from "./style/Media/cardIcons/humidity.svg";
import cloudIcon from "./style/Media/cardIcons/cloud.svg";
import cloudBadIcon from "./style/Media/cardIcons/cloudBad.svg";
import cloudGoodIcon from "./style/Media/cardIcons/cloudGood.svg";
import lightPolIcon from "./style/Media/cardIcons/lightPol.svg";
import tempIcon from "./style/Media/cardIcons/temperature.svg";
import infoIcon from "./style/Media/cardIcons/moreInfo.svg";
import resultsGood from "./style/Media/resultsGood.svg";
import resultsBad from "./style/Media/resultsBad.svg";
import CountUp from "react-countup";

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
					<StarReviewsStatic
						starSize={"18px"}
						avgScore={reviewScore}
					/>
				</div>
			);
		} else {
			return (
				<div>
					<StarReviewsStatic starSize={"18px"} avgScore={0} />
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
				<CardBootstrap>
					<CardStyle>
						<div
							className="ParkHeader"
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
							<span className="ParkTitle">
								{this.props.park.name_alt
									? this.props.park.name_alt
									: this.props.park.name}
							</span>

							<div className="CarIcon">
								<i className="fas fa-car"></i>
							</div>
							<div className="CarIconDesc">
								<span className="DistCharacteristic">
									{this.props.park.distance < 9000 ? (
										<React.Fragment>
											{Math.trunc(
												parseFloat(
													this.props.park.distance
												)
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
									)}
									{" km"}
								</span>
							</div>

							<div className="VisibleIcon">
								{this.props.park.score > 0.8 ? (
									<i className="far fa-eye visibleGoodIcon"></i>
								) : this.props.park.score > 0.6 ? (
									<i className="far fa-eye visiblePartlyIcon"></i>
								) : (
									<i className="fas fa-eye-slash invisibleIcon"></i>
								)}
							</div>

							<span className="VisibleIconDesc">
								{this.props.park.score > 0.8
									? "Visible"
									: this.props.park.score > 0.6
									? "Partly Visible"
									: "Not Visible"}
							</span>
						</div>

						<div className="HumidityIcon">
							<img
								src={humidityIcon}
								alt="Humidity"
								title="Humidity Level"
							/>
						</div>
						<span className="HumidityIconDesc">
							{this.props.park.weather.humidity < 40
								? "Great"
								: this.props.park.weather.humidity < 70
								? "Okay"
								: "Poor"}
						</span>

						<div className="CloudIcon">
							{this.props.park.weather.clouds < 40 ? (
								<img
									src={cloudGoodIcon}
									alt="Cloud Coverage"
									title="Low Cloud Coverage"
								/>
							) : (
								<img
									src={cloudBadIcon}
									alt="Cloud Coverage"
									title="High Cloud Coverage"
								/>
							)}
						</div>

						<span className="CloudIconDesc">
							{this.props.park.weather.clouds < 20
								? "Great"
								: this.props.park.weather.clouds < 35
								? "Okay"
								: "Poor"}
						</span>

						<div className="LightPolIcon">
							<img
								src={lightPolIcon}
								alt="Light Pollution"
								title="Light Pollution"
							/>
						</div>
						<span className="LightPolIconDesc">
							{this.props.park.light_pol < 1
								? "Great"
								: this.props.park.light_pol < 3
								? "Okay"
								: "Poor"}
						</span>

						<div className="TempIcon">
							<img
								src={tempIcon}
								alt="Temperature"
								title="Temperature"
							/>
						</div>
						<span className="TempIconDesc">
							{Math.round(this.props.park.weather.temp)}° C
						</span>

						<div className="WeatherInfo">
							<span>
								<b>{this.props.park.weather.city}</b> forecast
								for{" "}
						
								{new Date(
									this.props.park.weather.time
								).toLocaleString()}
							</span>
						</div>

						<span className="ScoreDesc">Visibility Score</span>

						<div className="Score">
							<CountUp
								start={0}
								end={Math.round(this.props.park.score * 100)}
								delay={0}
							>
								{({ countUpRef }) => (
									<React.Fragment>
										<span ref={countUpRef} />
										<span className="Percentage">%</span>
									</React.Fragment>
								)}
							</CountUp>
						</div>

						<div className="MoreInfoDesc">Tap for more info</div>

						<div
							className="StarRev"
							onClick={() => {
								this.props.handleMouseClick(this.props.park.id);
							}}
						>
							<div className="StarScore">
								{this.renderReviewScore(
									this.props.park.avgScore
								)}
							</div>
							<div className="StarNumRev">
								{this.renderNumReviews(
									this.props.park.numReviews
								)}
							</div>
						</div>
					</CardStyle>
				</CardBootstrap>
			</div>
		);
	}
}

ParkCard.defaultProps = {
	handleMouseOver: () => {},
	handleMouseLeave: () => {},
	handleMouseClick: () => {}
};

export default ParkCard;

const CardStyle = styled.div`
	min-height: 30vh;
	/* max-width: 100vw; */
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-template-rows: repeat(6, 1fr);
	/* grid-gap: 1em; */

	grid-template-areas:
		"ParkHeader   ParkHeader   ParkHeader     ParkHeader 	ParkHeader 	  	  ParkHeader"
		"ParkHeader   ParkHeader   ParkHeader     ParkHeader    ParkHeader   	  ParkHeader"
		"ScoreDesc   ScoreDesc    WeatherInfo  	  WeatherInfo 	WeatherInfo 	  WeatherInfo"
		"Score 		 Score 		 HumidityIcon 	  CloudIcon 	LightPolIcon 	  TempIcon "
		"Score 		 Score 		 HumidityIconDesc CloudIconDesc LightPolIconDesc  TempIconDesc "
		"StarRev 	 StarRev 	 StarRev 	  	  StarRev  MoreInfoDesc 	  MoreInfoDesc";

	font-family: "Lato", sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 23px;

	color: ${props => props.theme.fontDark};

	.ScoreDesc {
		display: flex;
		grid-area: ScoreDesc;
		font-size: 14px;
		margin: auto auto 0 auto;
		font-weight: 400;
	}

	.Score {
		display: flex;
	
		margin: auto auto;
		grid-area: Score;
		font-size: 80px;
		font-weight: 600;
		.Percentage {
			display: inline-block;
			font-size: 25px;
		}
	}

	.ParkHeader {
		display: grid;
		grid-area: ParkHeader;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-template-rows: auto auto;

		grid-template-areas:
			"ParkTitle   ParkTitle   ParkTitle   	  ParkTitle 	VisibleIcon 	  CarIcon"
			"ParkTitle   ParkTitle   ParkTitle    	  ParkTitle		VisibleIconDesc   CarIconDesc";

		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: ${props => props.theme.cardHeader};
		-webkit-transition: background-color 0.1s linear;
		-ms-transition: background-color 0.1s linear;
		transition: background-color 0.1s linear;
		min-height: 10vh;

		cursor: pointer;
		:hover {
			background: ${props => props.theme.cardHeaderHover};
			-webkit-transition: background-color 0.1s linear;
			-ms-transition: background-color 0.1s linear;
			transition: background-color 0.1s linear;
		}

		:active {
			background: ${props => props.theme.cardHeader};
			-webkit-transition: background-color 0.1s linear;
			-ms-transition: background-color 0.1s linear;
			transition: background-color 0.1s linear;
		}

		.ParkTitle {
			display: flex;
			grid-area: ParkTitle;
			color: ${props => props.theme.prettyDark};
			font-weight: 500;
			font-size: 25px;
			text-align: left;
			margin: auto auto auto 20px;
			/* padding-left: 20px;
			padding-right: 20px; */
			line-height: 30px;
		}

		.CarIcon {
			display: flex;
			grid-area: CarIcon;
			margin: auto auto 0 auto;
			font-size: 32px;
		}

		.CarIconDesc {
			display: flex;
			grid-area: CarIconDesc;
			margin: 0 auto auto auto;
			font-size: 14px;
			.DistMantissa {
				font-size: 14px;
			}
		}

		.VisibleIcon {
			display: flex;
			grid-area: VisibleIcon;
			margin: auto auto 0 auto;

			/* margin: auto 10px auto 10px; */
			.visibleGoodIcon {
				font-size: 32px;
				color: ${props => props.theme.parkMapGreen};
			}

			.visiblePartlyIcon {
				font-size: 32px;
				color: #92704f;
			}
			.invisibleIcon {
				font-size: 32px;
			}
		}

		.VisibleIconDesc {
			display: flex;
			grid-area: VisibleIconDesc;
			font-size: 14px;
			margin: 0 auto auto auto;
		}
	}

	.WeatherInfo {
		display: flex;

		grid-area: WeatherInfo;
		font-weight: 400;
		font-size: 14px;
		margin: auto auto 0 auto;
	}
	.HumidityIcon {
		display: flex;
		
		grid-area: HumidityIcon;
		margin: auto auto 0 auto;
	}
	.HumidityIconDesc {
		display: flex;

		grid-area: HumidityIconDesc;
		font-size: 14px;
		margin: auto auto;
	}
	.CloudIcon {
		display: flex;

		grid-area: CloudIcon;
		margin: auto auto 0 auto;
	}
	.CloudIconDesc {
		display: flex;

		grid-area: CloudIconDesc;
		font-size: 14px;
		margin: auto auto;
	}
	.LightPolIcon {
		display: flex;

		grid-area: LightPolIcon;
		margin: auto auto 0 auto;
	}
	.LightPolIconDesc {
		display: flex;

		grid-area: LightPolIconDesc;
		font-size: 14px;
		margin: auto auto;
	}

	.TempIcon {
		display: flex;
		grid-area: TempIcon;

		margin: auto auto 0 auto;
	}
	.TempIconDesc {
		display: flex;
		grid-area: TempIconDesc;
		font-size: 14px;

		margin: auto auto;
	}

	.StarRev {
		grid-area: StarRev;
		cursor: pointer;
		display: flex;
		float: left;
		margin: 0 auto auto 20px;

		.StarScore {
			display: flex;
		}
		.StarNumRev {
			display: flex;
			font-size: 14px;
			margin: 4px 0 0 14px;
			:hover,
			:active {
				color: ${props => props.theme.colorBad};
				transition: color 0.2s ease;
			}
		}
	}

	.MoreInfoDesc {
		display: flex;
		grid-area: MoreInfoDesc;
		font-size: 14px;
		margin: 4px 20px auto auto;
	}
`;

const CardBootstrap = styled.div`
	position: relative;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	min-width: 0;
	word-wrap: break-word;
	/* background-color: ${props => props.theme.white}; */
	background-clip: border-box;
	border: none !important;
	border-radius: 20px;

	hr {
		margin-right: 0;
		margin-left: 0;
	}
`;
