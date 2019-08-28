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
import lightPolIcon from "./style/Media/cardIcons/lightPol.svg";

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
		borderRadius: "2px",
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
	}

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
		document.body.style.overflow = "visible";
		this.setState({ modalIsOpen: false });
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
						<div className="interactIconsContainer">
							<div className="interactIcons">
								<i className="shareIcon fas fa-share-alt fa-2x" />
								<i className="faqIcon fas fa-question-circle fa-2x" />
								<i>
									<FavPark
										className="favIcon"
										parkID={this.park.id}
									/>
								</i>
								<i className="reportIcon fas fa-exclamation-triangle fa-2x" />
							</div>
							{/* <br />
								Click each square for more info! */}
						</div>

						<ScoreWrapper>
							<div className="ParkScore">
								<div className="Heading">
									<span>Overall Score</span>
								</div>
								<span className="ScoreNumerator">
									{Math.round(this.park.score * 100)}
									<span className="Percentage">%</span>
								</span>

								<span className="Value">
									{this.park.score < 0.5
										? "Not Recommended."
										: this.park.weather.temp < 0.75
										? "Not Recommended."
										: "Recommended."}
								</span>
							</div>
						</ScoreWrapper>

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
												<img src={cloudIcon} />
												<div className="Value">
													<span>
														{
															this.park.weather
																.clouds
														}
													</span>
												</div>
											</WeatherWrapper>
										</React.Fragment>
									}
									back={
										<React.Fragment>
											More info!
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
														{this.park.light_pol}
													</span>
												</div>
											</WeatherWrapper>
										</React.Fragment>
									}
									back={
										<React.Fragment>
											More info!
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
											More info!
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
													</span>
												</div>
											</WeatherWrapper>
										</React.Fragment>
									}
									back={
										<React.Fragment>
											More info!
										</React.Fragment>
									}
								/>
							</div>
						</div>

						<div className="reviewsContainer">
							<Reviews parkID={this.park.id} />
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
	font-family: IBM Plex Sans;
	color: ${props => props.theme.fontDark};
	background: ${props => props.theme.moreInfoBackground};

	.modal-header {
		font-family: IBM Plex Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 30px;
		border-bottom: 2px solid #9ea6ad;
		.close {
			i {
				color: ${props => props.theme.prettyDark};
			}
			float: right;
			font-size: 1.5rem;
			font-weight: 700;
			line-height: 1;
			color: gray;
			outline: none;
			/* text-shadow: 0 1px 0 #7C6E7E; */
			opacity: 0.5;
		}

		.close:hover {
			color: ${props => props.theme.colorBad};
			text-decoration: none;
		}

		.close:active {
			color: ${props => props.theme.prettyDark};
		}

		.close:not(:disabled):not(.disabled):hover,
		.close:not(:disabled):not(.disabled):focus {
			opacity: 0.75;
		}
	}

	.ContentGrid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto auto;
		grid-template-areas:
			"interactIconsContainer    parkScore"
			"weatherContainer    	   weatherContainer"
			"reviewsContainer          reviewsContainer";
		grid-row-gap: 20px;
		grid-column-gap: 20px;
		padding: 20px 20px 0 20px;
		height: 100%;
		overflow-y: auto;

		/* img{
	position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
} */

		.interactIconsContainer {
			grid-area: interactIconsContainer;

			.interactIcons {
				height: 157px;
				display: grid;
				margin: auto auto;
				grid-template-rows: 1fr 1fr;
				grid-template-columns: 1fr 1fr;
				grid-template-areas:
					"shareIcon    faqIcon"
					"favIcon      reportIcon";

				i {
					width: 80%;
					button {
						all: unset;
					}
					color: ${props => props.theme.colorBad};

					margin: auto auto;
				}
				.shareIcon {
					color: ${props => props.theme.fontDark};
					grid-area: shareIcon;
				}
				.faqIcon {
					color: ${props => props.theme.fontDark};
					grid-area: faqIcon;
				}
				.favIcon {
					grid-area: favIcon;
				}
				.reportIcon {
					color: ${props => props.theme.colorMedium};
					grid-area: reportIcon;
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

		.ParkScore {
			grid-area: parkScore;
			display: inline-block;
			vertical-align: middle;
			text-align: center;
			margin: auto auto;
			display: flex;
			flex-direction: column;

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

			/* div {
				height: 157px;
			} */

			.cloudContainer {
				height: 157px;
				grid-area: cloudContainer;
				position: relative;

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
	font-family: IBM Plex Sans;
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
