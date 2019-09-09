import React, { Component, useState } from "react";
import Modal from "react-modal";
import Reviews from "./Reviews";
import FavPark from "./FavPark";
import styled from "styled-components";
import "./modal.css";
import MoonDisplay from "./MoonDisplay";
import { useSpring, animated as a } from "react-spring";
import humidityIcon from "./style/Media/cardIcons/humidity.svg";
import cloudIcon from "./style/Media/cardIcons/cloud.svg";
import cloudBadIcon from "./style/Media/cardIcons/cloudBad.svg";
import cloudGoodIcon from "./style/Media/cardIcons/cloudGood.svg";
import lightPolIcon from "./style/Media/cardIcons/lightPol.svg";
import ReportPark from "./ReportPark";

import CountUp from 'react-countup';

const modalStyle = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.9)",
		transition: "opacity 400ms ease-in-out"
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		padding: "0px",
		border: "none",
		borderRadius: "4px",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		maxWidth: "100vw",
		maxHeight: "100vh",
		overflow: "hidden"
	}
};

class ParkMapModal extends Component {
	state = {
		modalIsOpen: false
	};

	constructor(props) {
		super(props);
		this.park = { weather: {} };
		this.toRemountReviews = false;
	}

	//means..
	renderLightMsg(lightPol) {
		if (lightPol < 0.25) {
			return "many constellations are barely noticed among the large number of stars";
		} else if (lightPol < 0.4) {
			return "the M33 is visible to the naked-eye";
		} else if (lightPol < 1) {
			return "the M15, M4, M5, and M22 are naked-eye objects";
		} else if (lightPol < 3) {
			return "the Milky Way lacks detail, and the M33 is only visible when high in sky.";
		} else if (lightPol < 6) {
			return "the Milky Way is very weak and looks washed out.";
		}
	}

	getLightPolSky(lightPol) {
		if (lightPol < 0.25) {
			return "Pure Dark Sky";
		} else if (lightPol < 0.4) {
			return "Dark Sky";
		} else if (lightPol < 1) {
			return "Rural";
		} else if (lightPol < 3) {
			return "Rural/Suburban";
		} else if (lightPol < 6) {
			return "Suburban";
		}
	}

	// {this.props.park.light_pol < 0.25
	// 	? "Pure Dark Sky"
	// 	: this.props.park.light_pol < 0.4
	// 	? "Dark Sky"
	// 	: this.props.park.light_pol < 1
	// 	? "Rural"
	// : this.props.park.light_pol < 3
	// ? "Rural/Suburban"
	// : this.props.park.light_pol < 6
	// ? "Suburban"

	openModal = content => {
		if (content === "") {
			content = "No content.";
		}
		this.modalContent = content;
		this.park = content.park;
		this.moon = content.moon;
		this.moonType = content.moonType;
		console.log(this.park);
		this.setState({ modalIsOpen: true });
	};

	afterOpenModal = () => {
		document.body.style.overflow = "hidden"; //Prevents background scrolling
	};

	closeModal = () => {
		console.log("CLOSE GOT HERE!!!!!!");
		document.body.style.overflow = "visible";
		this.setState({ modalIsOpen: false });
	};

	refreshModal = () => {
		console.log("Refreshing..");
		this.toRemountReviews = true;
	};

	remountReviews = () => {
		this.toRemountReviews = false;
	};

	render() {
		return (
			<Modal
				// className="modal-dialog"
				closeTimeoutMS={800}
				isOpen={this.state.modalIsOpen}
				onAfterOpen={this.afterOpenModal}
				onRequestClose={this.closeModal}
				style={modalStyle}
				contentLabel="Example Modal"
			>
				{/* <div className="modal-content"> */}
				<ModalStyle>
					<div className="modal-header">
						{this.park.name === "Unknown" && this.park.name_alt
							? this.park.name_alt
							: this.park.name}

						<button
							type="button"
							onClick={this.closeModal}
							className="close"
							aria-label="Close"
						>
							<i class="fas fa-window-close" />
						</button>
					</div>
					<div className="ContentGrid">
						<div className="HeaderGrid">
							<div className="favPark">
								<FavPark parkID={this.park.id} />

								<div className="favParkText">Save</div>
							</div>

							<div className="reportPark">
								<ReportPark parkID={this.park.id} />

								<div className="reportParkText">Report</div>
							</div>

							<ScoreWrapper>
								<div className="ParkScore">
									<div className="Heading">
										<span>
											SCORE
										</span>
									</div>
									<span className="ScoreNumerator">
										<CountUp
											start={0}
											end={Math.round(
												this.park.score * 100
											)}
											delay={0}
										>
											{({ countUpRef }) => (
												<div className="Score">
													<span ref={countUpRef} />
													<span className="Percentage">%</span>
												</div>
											)}
										</CountUp>

										
									</span>
									<span className="Value">
										{this.park.score > 0.8
											? "Visible"
											: this.park.score > 0.6
											? "Partly Visible"
											: "Not Visible"}
									</span>
								</div>
							</ScoreWrapper>
						</div>

						<span className="textContainer">
							Tap a square for more info
						</span>

						<div className="weatherContainer">
							<div className="cloudContainer">
								<Card
									cardName="cloudCard"
									front={
										<React.Fragment>
											<WeatherWrapper>
												<div className="Heading">
													<span>Cloud Coverage</span>
												</div>
												{this.park.weather.clouds <
												40 ? (
													<img src={cloudGoodIcon} />
												) : (
													<img src={cloudBadIcon} />
												)}
												<div className="Value">
													<span>
														{
															this.park.weather
																.clouds
														}
														%
													</span>
												</div>
											</WeatherWrapper>
										</React.Fragment>
									}
									back={
										<React.Fragment>
											<span className="MoreInfoDesc">
												Cloud Coverage is the % of the
												sky that is covered by clouds.
												Under 25% is considered good.
											</span>
										</React.Fragment>
									}
								/>
							</div>
							<div className="lightPolContainer">
								<Card
									cardName="lightPolCard"
									front={
										<React.Fragment>
											<WeatherWrapper>
												<div className="Heading">
													<span>Light Pollution</span>
												</div>
												<img src={lightPolIcon} />
												<div className="Value">
													<span>
														{this.getLightPolSky(
															this.park.light_pol
														)}
													</span>
												</div>
											</WeatherWrapper>
										</React.Fragment>
									}
									back={
										<React.Fragment>
											<span className="MoreInfoDesc">
												The Bortle class of{" "}
												{this.getLightPolSky(
													this.park.light_pol
												)}{" "}
												means{" "}
												{this.renderLightMsg(
													this.park.light_pol
												)}
											</span>
										</React.Fragment>
									}
								/>
							</div>
							<div className="moonContainer">
								<Card
									cardName="moonCard"
									front={
										<React.Fragment>
											<WeatherWrapper>
												<div className="Heading">
													<span>Moon Phase</span>
												</div>
												<span className="MoonDisplayContainer">
													<MoonDisplay
														phase={this.moon}
													/>
												</span>
												<div className="Value">
													{this.moonType}
												</div>
											</WeatherWrapper>
										</React.Fragment>
									}
									back={
										<React.Fragment>
											<span className="MoreInfoDesc">
												Moon phase is the most important
												factor when viewing the stars.
												First Quarter and under is
												considered good.
											</span>
										</React.Fragment>
									}
								/>
							</div>
							<div className="humidityContainer">
								<Card
									cardName="humidityCard"
									front={
										<React.Fragment>
											<WeatherWrapper>
												<div className="Heading">
													<span>Humidity</span>
												</div>
												<img src={humidityIcon} />
												<div className="Value">
													<span>
														{
															this.park.weather
																.humidity
														}
														%
													</span>
												</div>
											</WeatherWrapper>
										</React.Fragment>
									}
									back={
										<React.Fragment>
											<span className="MoreInfoDesc">
												Humidity levels above 70% is
												considered poor for star
												visibility.
											</span>
										</React.Fragment>
									}
								/>
							</div>
						</div>

						<div className="reviewsContainer">
							{this.toRemountReviews ? (
								this.remountReviews()
							) : (
								<Reviews
									refreshInfoModal={this.refreshModal}
									parkID={this.park.id}
								/>
							)}
							{/* <Reviews
								refreshInfoModal={this.refreshModal}
								parkID={this.park.id}
							/> */}
						</div>
					</div>
				</ModalStyle>
				{/* </div> */}
			</Modal>
		);
	}
}

function Card(props) {
	const [flipped, set] = useState(false);
	const { transform, opacity } = useSpring({
		opacity: flipped ? 1 : 0,
		transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
		config: { mass: 5, tension: 500, friction: 80 }
	});
	return (
		<div onClick={() => set(state => !state)}>
			<a.div
				className={props.cardName}
				style={{
					opacity: opacity.interpolate(o => 1 - o),
					transform
				}}
			>
				{props.front}
			</a.div>
			<a.div
				className={props.cardName}
				style={{
					opacity,
					transform: transform.interpolate(
						t => `${t} rotateY(180deg)`
					)
				}}
			>
				{props.back}
			</a.div>
		</div>
	);
}

export default ParkMapModal;

const ModalStyle = styled.div`
	/* max-height: 100vh;
	max-width: 100vw; */
	display: flex;
	flex-direction: column;
	width: 452px;
	height: 95vh;
	font-family: 'Lato', sans-serif;
	border: none;
	color: ${props => props.theme.fontDark};
	background: ${props => props.theme.moreInfoBackground};

	.modal-header {
		font-family: 'Lato', sans-serif;
		font-style: normal;
		font-weight: normal;
		color: ${props => props.theme.white};
		font-size: 30px;
		padding: 2rem 1rem;
		background: ${props => props.theme.mapBlue};
		border: none;
		border-top-left-radius: 0rem;
    border-top-right-radius: 0rem;
		/* border-bottom: 2px solid #9ea6ad; */
		.close {
		position: absolute;
		top: 0px;
		right: 0px;
		float: right;
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		color: whitesmoke;
		outline: none;
		text-shadow: none;
		opacity: 0.5;
	}

	.close:hover {
		color: ${props => props.theme.colorBad};
		text-decoration: none;
	}

	.close:active {
		color: ${props => props.theme.colorBad};
	}

	.close:not(:disabled):not(.disabled):hover,
	.close:not(:disabled):not(.disabled):focus {
		opacity: 0.75;
	}

	}



	.ContentGrid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto auto auto;
		grid-template-areas:
			"HeaderGrid    			   HeaderGrid"
			"infoText 				   infoText"
			"weatherContainer    	   weatherContainer"
			"reviewsContainer          reviewsContainer";
		grid-row-gap: 20px;
		grid-column-gap: 20px;
		padding: 20px 20px 0 20px;
		height: 100%;
		overflow-y: auto;
		background: ${props => props.theme.white};


.textContainer{
	grid-area: infoText;
	font-size: 20px;
}

.HeaderGrid{
		display: grid;
		grid-area: HeaderGrid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto auto;
		grid-template-areas:
		"favPark 	 ParkScore reportPark"
		"favParkText ParkScore reportParkText";

		.ParkScore {
			grid-area: ParkScore;
			display: inline-block;
			vertical-align: middle;
			text-align: center;
			margin: auto auto;
			display: flex;
			flex-direction: column;

			.Heading{
				font-size: 30px;
			}

	
			

			.ScoreNumerator {
				/* font-family: Barlow; */
				font-weight: 600;
				font-size: 64px;
				.Percentage {
					font-size: 24px;
				}
			}

			.ScoreDenominator {
				/* font-family: Barlow; */
				font-weight: 500;

				font-size: 24px;
			}
		}

				/* .shareIcon {
					color: ${props => props.theme.fontDark};
					grid-area: shareIcon;
				}
				.faqIcon {
					color: ${props => props.theme.fontDark};
					grid-area: faqIcon;
				} */
				i{
						font-size: 40px;
					}

					
				.favPark {
					margin: auto 0;
					grid-area: favPark;
				
					
					.favParkText{
						grid-area: favParkText;
						font-size: 20px;
					}

				}
				.reportPark {
					margin: auto 0;
					grid-area: reportPark;
					button{
						outline: none;
					}
				
					.reportParkText{
						grid-area: reportParkText;
						font-size: 20px;
					}
				}
				
			
			
		
	}


		.Heading,
		.Value {
			font-style: normal;
			font-weight: 600;
			font-size: 18px;
			display: flex;
			justify-content: center; /* align horizontal */
			align-items: center; /* align vertical */

			span {
				display: inline-block;
				vertical-align: middle;
				line-height: normal;
			}
		}

		.MoreInfoDesc {
			text-align: left;
			display: block;
			padding: 6px;
			font-weight: 500;
		}



		.weatherContainer {
			img {
				/* width: 100%; */
				width: 70px;
				margin-left: auto;
				margin-right: auto;
			}

			grid-area: weatherContainer;
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
			grid-row-gap: 20px;
			grid-column-gap: 20px;
			grid-template-areas:
				"cloudContainer    lightPolContainer"
				"moonContainer     humidityContainer";


			.cloudContainer {
				height: 157px;
				grid-area: cloudContainer;
				position: relative;
				cursor: pointer;

				.cloudCard {
					height: 157px;
					position: absolute;
					width: 100%;
					background-color: ${props => props.theme.cardLight};
				}
			}
			.lightPolContainer {
				height: 157px;
				grid-area: lightPolContainer;
				position: relative;
				cursor: pointer;

				.lightPolCard {
					height: 157px;
					position: absolute;
					width: 100%;
					background-color: ${props => props.theme.cardDark};
				}
			}
			.moonContainer {
				height: 157px;
				grid-area: moonContainer;
				position: relative;
				cursor: pointer;

				.moonCard {
					height: 157px;
					position: absolute;
					width: 100%;
					background-color: ${props => props.theme.cardDark};
				}

				.MoonDisplayContainer {
					width: 59px;
					margin: auto;
				}
			}
			.humidityContainer {
				height: 157px;
				grid-area: humidityContainer;
				position: relative;
				cursor: pointer;

				.humidityCard {
					height: 157px;
					position: absolute;
					width: 100%;
					background-color: ${props => props.theme.cardLight};
				}
			}
		}

		.reviewsContainer {
			grid-area: reviewsContainer;
			/* background-color: purple; */
		}
	}
`;

const HeaderStyle = styled.div`
	color: ${props => props.theme.fontDark};
	font-family: "Lato", sans-serif;
	font-style: normal;

	font-size: 36px;
`;

const WeatherWrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 10px 0px 10px 0px;
	justify-content: space-between;
`;

const ScoreWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;
