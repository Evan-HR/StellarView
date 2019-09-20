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
	prettyDate(time) {
		var date = new Date(time);
		var localeSpecificTime = date.toLocaleTimeString();
		return localeSpecificTime.replace(/:\d+ /, " ");
	}

	renderReviewScore(reviewScore) {
		if (reviewScore) {
			return (
				<div>
					<StarReviewsStatic
						starSize={"14px"}
						avgScore={reviewScore}
					/>
				</div>
			);
		} else {
			return (
				<div>
					<StarReviewsStatic starSize={"14px"} avgScore={0} />
				</div>
			);
		}
	}

	inRange(x, min, max) {
		return (x - min) * (x - max) <= 0;
	}

	render() {
		return (
			<ParkCardWrapper
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
				<CardStyle>
					<div className="ParkHeader">
						<span className="ParkTitle">
							{this.props.park.name_alt
								? this.props.park.name_alt
								: this.props.park.name}
						</span>

						<div className="CarIcon">
							<i className="fas fa-car"></i>
							<div className="CarIconDesc">
								{this.props.park.distance < 9000 ? (
									<React.Fragment>
										{Math.trunc(
											parseFloat(this.props.park.distance)
										)}
										{" km"}
									</React.Fragment>
								) : (
									<React.Fragment>n/a</React.Fragment>
								)}
							</div>
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

					<div className="cardContent">
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
							{this.props.park.weather.clouds < 35 ? (
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
								{this.prettyDate(this.props.park.weather.time)}
								{/* {new Date(
								this.props.park.weather.time
							).toLocaleString()} */}
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
										<div
											className="ScoreNumber"
											ref={countUpRef}
										/>
										<div className="Percentage">%</div>
									</React.Fragment>
								)}
							</CountUp>
						</div>

						<div className="MoreInfoDesc">Tap for more</div>

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
					</div>
				</CardStyle>
			</ParkCardWrapper>
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
	font-family: "Lato", sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 23px;
	color: ${props => props.theme.fontDark};
	min-height: 30vh;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: 1/3fr 2/3fr;
	/* grid-gap: 1em; */

	grid-template-areas:
		"ParkHeader   ParkHeader   ParkHeader    ParkHeader 	ParkHeader 	  ParkHeader"
		"cardContent  cardContent cardContent 	 cardContent  	cardContent   cardContent";

	@media screen and (min-width: 320px) {
		grid-template-rows: 1/3fr 2/3fr;
	
	}
	@media screen and (min-width: 480px) {
	
	}

	.ParkHeader {
		display: grid;
		grid-area: ParkHeader;
		grid-template-columns: 1fr 0.2fr;
		grid-template-areas: "ParkTitle CarIcon";
		min-height: 13vh;
		background: ${props => props.theme.cardHeader};
		padding: 0 0.7rem;
		:hover,
		:active {
			background: ${props => props.theme.cardHeaderHover};
		}
		@media screen and (min-width: 320px) {
			padding: 0 0.7rem;
		}
		@media screen and (min-width: 480px) {
			padding: 0 0.8rem;
		}

		.ParkTitle {
			display: flex;
			grid-area: ParkTitle;

			color: ${props => props.theme.prettyDark};
			font-weight: 500;
			font-size: 22px;
			text-align: left;
			margin: auto auto auto 0px;
			line-height: 30px;
			/* padding-left: 1rem; */

			@media screen and (min-width: 320px) {
				margin: auto auto auto 0px;
				/* padding-left: 1rem; */
			}
			@media screen and (min-width: 480px) {
				margin: auto auto auto 20px;
				font-size: 25px;
			}
		}

		.CarIcon {
			grid-area: CarIcon;
			margin: auto 0 auto auto;
			font-size: 22px;
			/* padding-right: 1rem; */
			.CarIconDesc {
				margin: auto auto;
				font-size: 14px;
			}
		}

		.VisibleIcon {
			display: flex;
			display: none;
			grid-area: VisibleIcon;
			margin: auto auto;

			/* margin: auto 10px auto 10px; */
			.visibleGoodIcon {
				font-size: 20px;
				color: ${props => props.theme.parkMapGreen};
			}

			.visiblePartlyIcon {
				font-size: 20px;
				color: #92704f;
			}
			.invisibleIcon {
				font-size: 20px;
			}
		}

		.VisibleIconDesc {
			display: flex;
			display: none;
			grid-area: VisibleIconDesc;
			font-size: 13px;
			margin: auto auto;
		}
	}

	.cardContent {
		display: grid;
		grid-area: cardContent;
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: 1fr 1fr 0.5fr 1fr;
		/* grid-gap: 1em; */

		grid-template-areas:
			"ScoreDesc   ScoreDesc    WeatherInfo  	  WeatherInfo 	WeatherInfo 	  WeatherInfo"
			"Score 		 Score 		 HumidityIcon 	  CloudIcon 	LightPolIcon 	  TempIcon "
			"Score 		 Score 		 HumidityIconDesc CloudIconDesc LightPolIconDesc  TempIconDesc "
			"StarRev 	 StarRev 	 StarRev 	  	  StarRev  		MoreInfoDesc 	  MoreInfoDesc";

		@media screen and (min-width: 320px) {
			padding: 10px 10px;
			grid-template-rows: 1fr 1fr 0.5fr 1fr;
		}

		@media screen and (min-width: 480px) {
		}

		.WeatherInfo {
			display: flex;

			grid-area: WeatherInfo;
			font-weight: 400;
			font-size: 13px;
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
			margin: 0 auto;
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
			margin: 0 auto;
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
			margin: 0 auto;
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

			/* margin: auto auto; */
			margin: 0 auto;
		}

		.StarRev {
			grid-area: StarRev;
			cursor: pointer;
			display: flex;
			/* float: left; */
			margin: 10px auto auto 0px;

			.StarScore {
				display: flex;
				.widget-svg {
					height: 11px;
					width: 11px;
				}
			}
			.StarNumRev {
				display: flex;
				font-size: 12px;
				padding-top: 5px;
				margin: 0px 0px 0px 14px;
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
			font-size: 12px;
			padding-top: 0px;
			margin: 14px 0px auto auto;
		}

		.ScoreDesc {
			display: flex;
			grid-area: ScoreDesc;
			font-size: 14px;
			
			margin: auto auto 0 0px;
			font-weight: 400;
			padding-bottom: 2px;
			@media screen and (min-width: 320px) {
				padding-bottom: 2px;
			}

			@media screen and (min-width: 480px) {
			
			}
		}

		.Score {
			display: flex;
			grid-area: Score;
			font-size: 60px;
			font-weight: 600;
			padding-top: 15px;
			align-items: baseline;
			margin: auto 0;
			.Percentage {
				display: inline-block;
				font-size: 25px;
			}

			@media screen and (min-width: 320px) {
				font-size: 60px;
				padding-top: 15px;
			}

			@media screen and (min-width: 480px) {
				font-size: 80px;
			}
		}
	}
`;

const ParkCardWrapper = styled.div`
	background: ${props => props.theme.cardDark};
	padding-bottom: 10px;
	margin-bottom: 1rem;
	position: relative;

	/* min-width: 320px; */
	cursor: pointer;

	:hover {
		background: ${props => props.theme.cardLight};
		/* background: linear-gradient(
			0deg,
			${props => props.theme.cardLight} 70%,
			${props => props.theme.cardHeaderHover} 70%
		); */
	}
	:active {
		background: ${props => props.theme.cardDark};
		/* background: linear-gradient(
			0deg,
			${props => props.theme.cardDark} 70%,
			${props => props.theme.cardHeader} 70%
		); */
	}

	@media screen and (min-width: 320px) {
		padding-bottom: 10px;
	}

	@media screen and (min-width: 480px) {
		padding-bottom: 15px;
	}

	@media screen and (min-width: 600px) {
		border-radius: 20px;
	}

	@media screen and (min-width: 567px) {
		padding-left: 0vw;
		padding-right: 0vw;
	}

	@media screen and (min-width: 600px) {
		padding-left: 5vw;
		padding-right: 5vw;
	}
	@media screen and (min-width: 685px) {
		padding-left: 7vw;
		padding-right: 7vw;
	}
	@media screen and (min-width: 830px) {
		padding-left: 9vw;
		padding-right: 9vw;
	}

	@media screen and (min-width: 900px) {
		padding-left: 11vw;
		padding-right: 11vw;
	}

	@media screen and (min-width: 989px) {
		padding-left: 0vw;
		padding-right: 0vw;
	}

	@media screen and (min-width: 1060px) {
		padding-left: 1vw;
		padding-right: 1vw;
	}
	@media screen and (min-width: 1292px) {
		padding-left: 2.5vw;
		padding-right: 2.5vw;
	}

	@media screen and (min-width: 1460px) {
		padding-left: 5vw;
		padding-right: 5vw;
	}

	@media screen and (min-width: 1600px) {
		padding-left: 6vw;
		padding-right: 6vw;
	}
`;
