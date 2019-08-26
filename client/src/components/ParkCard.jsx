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
								<img src={humidityIcon} />
								<br />
								{this.props.park.weather.humidity < 40
									? "Good"
									: this.props.park.weather.humidity < 80
									? "Okay"
									: "Poor"}
							</div>

							<div className="ParkCloud">
								<img src={cloudIcon} />
								<br />
								{this.props.park.weather.clouds < 40
									? "Good"
									: this.props.park.weather.clouds < 80
									? "Okay"
									: "Poor"}
							</div>

							<div className="ParkLightPol">
								<img src={lightPolIcon} />
								<br />
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
								<br/>
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
	<span>Score:</span>{" "}{Math.round(this.props.park.score * 10)}/10
</div>
						{/* <div className="ParkScore">

							<div className="ScoreWrapper">
								<span className="ScoreNumerator">
									
									{Math.round(this.props.park.score * 100)}
								</span>
								<span className="Percentage">%</span>
							</div>
						</div> */}
						<div className="ParkScoreIcon">
							{this.props.park.score < 0.5 ? (
								<i class="fas fa-ban fa-2x scoreBad"></i>
							) : (
								<i class="fas fa-check-circle fa-3x scoreGood"></i>
							)}
						</div>

						<div className="StarRev">
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

						{/* <div className="MoreInfo">
						
							<img src={infoIcon} />
						
							<span className="infoText">
								More
								<br />
								Info
							</span>
						</div> */}

						<div className="moreInfo">
						<i className="faqIcon fas fa-question-circle fa-2x" />
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
		"StarRev    StarRev     StarRev      MoreInfo";

	font-family: IBM Plex Sans;
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 23px;
	text-align: left;

	color: ${props => props.theme.fontDark};

	.card {
		
		/* border: 1px solid rgba(0, 0, 0, 0); */
	}

	.moreInfo{
		grid-area: MoreInfo;
		margin-left: auto;
    margin-right: auto;
	margin-top: 10px;
	}


	.ScoreLabel{
		grid-area: ScoreLabel;
		text-align: center;
        margin: auto 5px 15px 0;
	font-size: 20px;
    font-weight: 600;
	span{
		font-size: 15px;
		font-weight: 300;
	}
	}


	.ParkTitle {
		background: ${props => props.theme.bodyBackground};
		grid-area: ParkTitle;
		/* border-bottom: 1px ${props => props.theme.fontDark} solid; */
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* padding-bottom: 8px; */
		color: whitesmoke;
		padding: 0 13px 0 13px;

		.Title {
			

			font-size: 25px;
			 
			line-height: 34px;
	
		}
		
		.Dist {

			display: inline-block;
			/* margin: auto; */
			font-weight: 300;
			font-size: 25px;
			min-width: 66px;

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
    font-size: 14px;
    line-height: 18px;
    align-content: center;
	padding-left: 15px;
    text-align: left;
   
    margin: auto 0px 8px 0px;
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
    margin-left: 15px;
    margin: auto auto auto 0;
    padding-left: 15px;
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

		.tempIcon {
			height: 2em;
			width: 2em;
		}

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
  margin-left: auto;
  margin-right: auto;

			/* position: absolute;
			bottom: 0; */
			
			font-size: 22px;
			.scoreBad{
					color: ${props => props.theme.colorBad};
				}
				.scoreGood{
					color: ${props => props.theme.colorGood};
				}
			
		}

	.StarRev {
		grid-area: StarRev;
		text-align: center;
		
		display: flex;
    float: left;
	align-items: center;
	margin-left: 15px;
		.StarScore{
display: inline-block;
		}
		.StarNumRev{
			display: inline-block;
		
			font-size: 14px;
			margin: 10px 0 0 15px;
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
		/* border: 1px solid rgba(0, 0, 0, 0.125); */
	}

	.card > hr {
		margin-right: 0;
		margin-left: 0;
	}
`;
