import React, { Component, useState } from "react";
import Modal from "react-modal";
import Reviews from "./Reviews";
import FavPark from "./FavPark";
import styled from "styled-components";
import "./modal.css";
import MoonDisplay from "./MoonDisplay";
import { useSpring, animated as a } from "react-spring";

const modalStyle = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: "linear-gradient(rgba(0,0,255,0.25), rgba(255,0,0,0.75))"
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
									<i className="shareIcon fas fa-share-alt" />
									<i className="faqIcon fas fa-question-circle" />
									<FavPark className="favIcon" parkID={this.park.id}/>
									<i className="reportIcon fas fa-exclamation-triangle" />
								</div>
								{/* <br />
								Click each square for more info! */}
							</div>

							<div className="parkScore">
								<span className="ScoreNumerator">
									{(this.park.score * 10).toFixed(1)}
								</span>
								<br />
								<span className="ScoreDenominator">/10</span>
							</div>

							<div className="weatherContainer">
								<div className="cloudContainer">
									<Card
										cardName="cloudCard"
										front={
											<React.Fragment>
												<i className="cloudIcon fas fa-cloud" />
												<br />
												{this.park.weather.clouds}
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
												<i className="lightPolIcon fas fa-meteor" />
												<br />
												{this.park.light_pol}
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
												<MoonDisplay
													phase={this.moon}
												/>
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
												<i className="humidityIcon fas fa-tint" />
												<br />
												{this.park.weather.humidity}
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

	.modal-header {
		.close {
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
			color: ${props => props.theme.cardDark};
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
		grid-template-rows: auto auto auto;
		grid-template-areas:
			"interactIconsContainer    parkScore"
			"weatherContainer    	   weatherContainer"
			"reviewsContainer          reviewsContainer";
		grid-row-gap: 20px;
		grid-column-gap: 20px;
		padding: 0 20px 0 20px;
		height: 100%;
		overflow-y: auto;

		.interactIconsContainer {
			grid-area: interactIconsContainer;
			background-color: navy;

			.interactIcons {
				height: 157px;
				display: grid;
				margin: auto auto;
				grid-template-rows: 1fr 1fr;
				grid-template-columns: 1fr 1fr;
				grid-template-areas:
					"shareIcon    faqIcon"
					"favIcon      reportIcon";
				background-color: azure;
				i {
					margin: auto auto;
				}
				.shareIcon {
					grid-area: shareIcon;
				}
				.faqIcon {
					grid-area: faqIcon;
				}
				.favIcon {
					grid-area: favIcon;
				}
				.reportIcon {
					grid-area: reportIcon;
				}
			}
		}

		.parkScore {
			height: 157px;
			width: 100%;
			background-color: ${props => props.theme.cardLight};
			grid-area: parkScore;
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

		.weatherContainer {
			grid-area: weatherContainer;
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
			grid-row-gap: 20px;
			grid-column-gap: 20px;
			grid-template-areas:
				"cloudContainer    lightPolContainer"
				"moonContainer     humidityContainer";

			div {
				/* width: 181px; */
				height: 157px;
			}

			.cloudContainer {
				grid-area: cloudContainer;
				position: relative;

				.cloudCard {
					position: absolute;
					width: 100%;
					background-color: ${props => props.theme.colorBad};
				}
			}
			.lightPolContainer {
				grid-area: lightPolContainer;
				position: relative;

				.lightPolCard {
					position: absolute;
					width: 100%;
					background-color: ${props => props.theme.colorBad};
				}
			}
			.moonContainer {
				grid-area: moonContainer;
				position: relative;

				.moonCard {
					position: absolute;
					width: 100%;
					background-color: ${props => props.theme.colorBad};
				}
			}
			.humidityContainer {
				grid-area: humidityContainer;
				position: relative;

				.humidityCard {
					position: absolute;
					width: 100%;
					background-color: ${props => props.theme.colorBad};
				}
			}
		}

		.reviewsContainer {
			grid-area: reviewsContainer;
			background-color: purple;
		}
	}
`;

const HeaderStyle = styled.div`
	color: ${props => props.theme.fontDark};
	font-family: IBM Plex Sans;
	font-style: normal;
	font-weight: normal;
	font-size: 36px;
`;
