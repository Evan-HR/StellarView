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
import CountUp from 'react-countup';

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
						starSize={"20px"}
						avgScore={reviewScore}
					/>
				</div>
			);
		} else {
			return (
				<div>
					<StarReviewsStatic starSize={"20px"} avgScore={0} />
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
						<div
							className="ParkTitle"
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
							<span className="Title">
								{this.props.park.name_alt
									? this.props.park.name_alt
									: this.props.park.name}
							</span>

							<div className="Dist">
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
									)}{" "}
									<b> km</b>
								</span>
							</div>
						</div>

						<div className="WeatherIcons">
							<div className="ParkHum">
								<img
									src={humidityIcon}
									alt="Humidity"
									title="Humidity Level"
								/>
								<br />
								{this.props.park.weather.humidity < 40
									? "Great"
									: this.props.park.weather.humidity < 70
									? "Okay"
									: "Poor"}
							</div>

							<div className="ParkCloud">
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
								{/* <img src={cloudIcon} /> */}
								<br />
								{this.props.park.weather.clouds < 20
									? "Great"
									: this.props.park.weather.clouds < 35
									? "Okay"
									: "Poor"}
							</div>

							<div className="ParkLightPol">
								<img
									src={lightPolIcon}
									alt="Light Pollution"
									title="Light Pollution"
								/>
								<br />
								{this.props.park.light_pol < 1
									? "Great"
									: this.props.park.light_pol < 3
									? "Okay"
									: "Poor"}
							</div>
							<div className="ParkTemp">
								<span className="tempIcon">
									<img
										src={tempIcon}
										alt="Temperature"
										title="Temperature"
									/>
								</span>
								<br />
								<span className="tempNum">
									{Math.round(this.props.park.weather.temp)}{" "}
									°C
								</span>

								{/* {this.props.park.weather.temp < 15
									? "Chilly"
									: this.props.park.weather.temp < 25
									? "Comfortable"
									: "Inadequate"} */}
							</div>
						</div>

						<div className="WeatherInfo">
							<span>
								<b>{this.props.park.weather.city}</b> forecast
								for{" "}
								{new Date(
									this.props.park.weather.time
								).toLocaleString()}
							</span>
						</div>

						<div className="ScoreLabel">
							
							<CountUp
											start={0}
											end={Math.round(this.props.park.score * 100)}
											delay={0}
										>
											{({ countUpRef }) => (
												<div className="Score">
													<span className="ScoreTitle">Score:{" "}</span>
													<span ref={countUpRef} />
													<span className="Percentage">%</span>
													
												</div>
											)}
										</CountUp>
						
						</div>
						<div className="ParkScoreIcon">
							{this.props.park.score > 0.8 ? (
								<i class="far fa-eye visibleGoodIcon"></i>
							) : this.props.park.score > 0.6 ? (
								<i class="far fa-eye visiblePartlyIcon"></i>
							) : (
								<i class="fas fa-eye-slash invisibleIcon"></i>
							)}
							<br />
							{this.props.park.score > 0.8
								? "Visible"
								: this.props.park.score > 0.6
								? "Partly Visible"
								: "Not Visible"}
						</div>

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

						<div
							className="moreInfo"
							onClick={() => {
								this.props.handleMouseClick(this.props.park.id);
							}}
						>
							<i className="faqIcon fas fa-question-circle moreInfoIcon" />
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

const CardStyle = styled.div`

	/* margin: 13px; */
	/* margin-bottom: 10px;
	margin-left: 13px;
	margin-right: 13px; */
	max-height: 300px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr 1fr;
	/* grid-column-gap: 10px;
	grid-row-gap: 10px; */
	grid-template-areas:
		"ParkTitle   ParkTitle   ParkTitle    ParkTitle"
		"WeatherInfo WeatherInfo WeatherInfo  ScoreLabel"
		"WeatherIcons WeatherIcons WeatherIcons ParkScoreIcon"
		/* "ParkHum     ParkCloud   ParkLightPol ParkScore" */
		"StarRev    StarRev     StarRev      moreInfo";

		font-family: 'Lato', sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 23px;
	text-align: left;

	color: ${props => props.theme.fontDark};

	.moreInfo{
		grid-area: moreInfo;
		margin: auto 0px 0px auto;
    padding: 0px 10px 10px 0;
	cursor: pointer;
	.moreInfoIcon{

		font-size: 1.2em;
		:hover,
	:active {
		color: ${props => props.theme.colorBad};
		transition: color 0.1s ease;
	

	}

	}

	}


	.ScoreLabel{
		grid-area: ScoreLabel;
		text-align: center;
        margin: auto 5px 15px 0;
	font-size: 20px;
    font-weight: 600;

	.ScoreTitle{
		font-size: 20px;
    font-weight: 300;
	}

	}


	.ParkTitle {
		background: ${props => props.theme.mapBlue};
		-webkit-transition: background-color 0.1s linear;
    -ms-transition: background-color 0.1s linear;
    transition: background-color 0.1s linear;
	
		grid-area: ParkTitle;
		/* border-bottom: 1px ${props => props.theme.fontDark} solid; */
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* padding-bottom: 8px; */
		color: whitesmoke;
		padding: 0 13px 0 13px;
		cursor: pointer;
		:hover{
			
			background: ${props => props.theme.lightBlue};
		
    -webkit-transition: background-color 0.1s linear;
    -ms-transition: background-color 0.1s linear;
    transition: background-color 0.1s linear;
		}

		.Title {
			

			font-size: 25px;
			 
			line-height: 34px;
	
		}
		
		.Dist {
/* cursor: crosshair; */
			padding-left: 10px;
    display: inline-block;
    min-width: 73px;

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
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    align-content: center;
	/* padding-left: 15px; */
    text-align: center;
   
    margin: auto 0px auto 0px;
	}

	.WeatherIcons {
		grid-area: WeatherIcons;
		display: flex;
		justify-content: space-between;
		.ParkHum {
			/* grid-area: ParkHum; */
			/* text-align: center;
			margin: auto auto; */
			text-align: center;
			margin: auto auto;

		}
		.ParkCloud {
			/* grid-area: ParkCloud; */
			text-align: center;
			margin: auto auto;
		}
		.ParkLightPol {
			/* grid-area: ParkLightPol; */
			text-align: center;
			margin: auto auto;
		}

		.ParkTemp {
		/* grid-area: ParkTemp; */
		text-align: center;
		margin: auto auto;

		/* .tempIcon {
			height: 2em;
			width: 2em;
		} */

		span {
			display: inline-block;
		}
	}
	}
	
	.ParkScore {
		grid-area: ParkScore;
		
		font-style: normal;
		font-weight: 600;
		display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;

  /* .ScoreLabel{
	grid-area: ParkScore;
		font-family: Barlow;
		font-style: normal;
		font-weight: 600;
		font-size: 20px;
    font-weight: 600;
		display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;

  } */

  

.ScoreWrapper{
	position: absolute;

		.ScoreNumerator {
			display:inline;
			font-size: 54px;
		
		}
		.Percentage {
			display:inline;
				font-size: 30px;
			}
		
		
	}
	}

	
	.ParkScoreIcon {
		grid-area: ParkScoreIcon;
		display: block;
		align-content: center;
    text-align: center;
    margin: auto 0px auto 0px;
		/* margin: 0px auto auto auto; */
  /* width: 50px; */
  .visibleGoodIcon{
	  font-size:32px;
	  color: ${props => props.theme.parkMapGreen};
  }

  .visiblePartlyIcon{
	font-size:32px;
	  color: #92704f;
  }
  .invisibleIcon{
	font-size:32px;
	  /* color: ${props => props.theme.colorBad}; */
  }
  

			
		}

	.StarRev {
		grid-area: StarRev;
	cursor: pointer;
		
		display: flex;
    float: left;

	margin: auto auto;
		.StarScore{
display: inline-block;
		}
		.StarNumRev{
			display: inline-block;
		
			font-size: 14px;
			margin: 4px 0 0 14px;
			:hover,
	:active {
		color: ${props => props.theme.colorBad};
		transition: color 0.2s ease;

	}
		}
	}

`;

const CardBootstrap = styled.div`
	.card {
		margin-bottom: 13px;
		position: relative;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-direction: column;
		flex-direction: column;
		min-width: 0;
		word-wrap: break-word;
		background-color: #fff;
		background-clip: border-box;
		border: none !important;
		border-radius: 0px;
	}

	.card > hr {
		margin-right: 0;
		margin-left: 0;
	}
`;
