import React, { Component } from "react";
import Modal from "react-modal";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";

Modal.setAppElement("#root");
class NoResultsModal extends Component {
	state = {
		modalIsOpen: false
	};

	openModal = () => {
		this.setState({ ...this.state, modalIsOpen: true });
	};

	afterOpenModal = () => {
		document.body.style.overflow = "hidden"; //Prevents background scrolling
	};

	closeModal = () => {
		this.setState({ ...this.state, modalIsOpen: false });
		document.body.style.overflow = "visible";
		// this.props.handleCloseNoParksModal();
	};

	renderMessage = (moonPhaseNum, scoreBreakdown) => {
		// var moonScore = scoreBreakdown.moonScore;
		var humidityScore = scoreBreakdown.humidityScore;
		var cloudScore = scoreBreakdown.cloudScore;
		// console.log("scores: "+moonScore+humidityScore+cloudScore+lightPolScore);
		function inRange(x, min, max) {
			return (x - min) * (x - max) <= 0;
		}

		//moon
		var daysUntilGoodMoon;
		var goodMoonCondition = false;
		var nextGoodMoonType = "";
		if (
			inRange(moonPhaseNum, 0.9375, 1) ||
			inRange(moonPhaseNum, 0, 0.0625)
		) {
			//new moon
			goodMoonCondition = true;
		} else if (inRange(moonPhaseNum, 0.0625, 0.1875)) {
			goodMoonCondition = true;
			//Waxing Crescent
		} else if (inRange(moonPhaseNum, 0.1875, 0.3125)) {
			goodMoonCondition = true;
		} else if (inRange(moonPhaseNum, 0.3125, 0.4375)) {
			//"Waxing Gibbous";
			daysUntilGoodMoon = 11;
			nextGoodMoonType += "Last Quarter";
		} else if (inRange(moonPhaseNum, 0.4375, 0.5625)) {
			//"full moon";
			daysUntilGoodMoon = 7;
			nextGoodMoonType += "Last Quarter";
		} else if (inRange(moonPhaseNum, 0.5625, 0.6875)) {
			//Waning Gibbous
			daysUntilGoodMoon = 4;
			nextGoodMoonType += "Last Quarter";
		} else if (inRange(moonPhaseNum, 0.6875, 0.8125)) {
			//Last Quarter

			goodMoonCondition = true;
		} else if (inRange(moonPhaseNum, 0.8125, 0.9375)) {
			//Waning Crescent"
			goodMoonCondition = true;
		} else {
			//New Moon
			goodMoonCondition = true;
		}

		//weather
		// var badHumidity = true;
		// var badClouds = true;
		// if(humidityScore>.60){
		// 	badHumidity = false;
		// }
		// if(cloudScore>.60){
		// 	badClouds = false;
		// }

		//dynamic string message

		// var humidityPhrase;
		// var cloudPhrase;

		var whyBadString = "";
		if (goodMoonCondition) {
			whyBadString += `Moon brightness isn't a problem tonight, but it's forecasted to be a bit too humid and/or cloudy right now. Try again tomorrow, and close to see nearby parks with adequate light pollution.`;
		} else {
			whyBadString += `The moon is shining too bright right now, hiding the stars.  Try again in ${daysUntilGoodMoon} days when the moon is a ${nextGoodMoonType}`;
		}

		// if (badHumidity){
		// 	humidityPhrase+="Humidity levels seem alright...";
		// }else{
		// 	humidityPhrase+="Humidity levels are poor...";
		// }

		// if (badClouds){
		// 	cloudPhrase+="It's too cloudy!";
		// }else{
		// 	cloudPhrase+="It's not very cloudy, that's good!";
		// }

		//returns moon icon + moonPhrase, humidity icon + phrase, etc.
		return <span>{whyBadString}</span>;
	};

	renderNoParks = () => {
		return (
			<NoResultsStyle noVis={this.props.noVis}>
				<button
					type="button"
					onClick={this.closeModal}
					className="close"
					aria-label="Close"
				>
					<i className="fas fa-times" />
				</button>
				{this.props.noVis ? (
					<div className="messageBox">
						{/* <div className="Symbol">
							<i className="reportIcon fas fa-exclamation-triangle fa-2x"></i>
						</div> */}

						<div className="openingMsg">
							<h1>We're sorry.</h1>
							<span>
								No parks in your area scored above 65%. <br></br>We do
								not recommend stargazing tonight.
							</span>
						</div>
						<div className="Symbol">
						<i class="far fa-question-circle fa-2x"></i>
						</div>
						<div className="whyExplanation">
							{this.renderMessage(
								this.props.moonPhase,
								JSON.parse(
									JSON.stringify(this.props.scoreBreakdown)
								)
							)}
						</div>
						{/* <div>
							{JSON.stringify(this.props.scoreBreakdown)}
							</div> */}
					</div>
				) : (
					<div className="messageBox">
						<div className="Symbol">
							<i className="reportIcon fas fa-exclamation-triangle fa-2x"></i>
						</div>

						<span>
							Sorry, we couldn't find any suitable parks in this
							area! Try increasing your max distance and/or light
							pollution value using <i>Advanced Search</i>.
						</span>
					</div>
				)}
			</NoResultsStyle>
		);
	};

	componentDidMount() {
		this.openModal();
	}

	//classNameName changes model content, style gives you anything you specify to override defaults
	render() {
		return (
			<React.Fragment>
				<Modal
					closeTimeoutMS={400}
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					contentLabel="Login Modal"
					// className="modal-dialog"
					style={customStyles}
				>
					<ModalStyle>
						{/* {this.renderLoginModal()} */}
						{/* {this.renderModalContent()} */}
						{this.renderNoParks()}
					</ModalStyle>
				</Modal>
			</React.Fragment>
		);
	}
}

export default NoResultsModal;

NoResultsModal.defaultProps = {
	handleCloseNoParksModal: () => {}
};

/////////////////////////////////

const customStyles = {
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
		borderRadius: "2.5px",
		backgroundColor: "rgba(0,0,0,0.9)",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		maxWidth: "100vw",
		maxHeight: "100vh",
		overflow: "hidden"
	}
};

//style the "modal" here - don't worry about the ccontent shit
const NoResultsStyle = styled.div`
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	width: 60vw;
	height: 30vh;
	border: none;
	max-width: 530px;
	width: 60vw;
	position: relative;
	background: ${props => props.theme.prettyDark};
	font-family: "Lato", sans-serif;
	color: ${props => props.theme.white};


	/* text-align: ${props => (props.noVis ? "left" : "center")}; */
	.Symbol {
		padding: 15px 0px;
		i {
			color: ${props => props.theme.colorMedium};
		}
	}

.whyExplanation{
	display: block;
		margin: auto auto;
		background: ${props => props.theme.moonBackground};

border-radius: 20px;

padding: 20px;
max-width: 400px;
	span {
		
	
		
	}
}

	/* min-height: 100vh; */

	@media screen and (min-width: 320px) {
		width: 100vw;
		width: ${props => (props.noVis ? "100vw" : "block")};
	}

	@media screen and (min-width: 600px) {
		width: 60vw;
	}

	@media screen and (min-width: 801px) {
		width: ${props => (props.noVis ? "70vw" : "45vw")};
		height: ${props => (props.noVis ? "70vh" : "30vh")};
	}

	.messageBox {
		width: 80%;
		margin: auto auto;
	}

	.close {
		outline: none;
		text-shadow: none;
		color: ${props => props.theme.white};
		position: absolute;
		top: -1px;
		right: 4px;
		float: right;
		font-size: 2rem;
		font-weight: 700;
		line-height: 1;
		:hover {
			color: ${props => props.theme.colorMedium};
			text-decoration: none;
		}
		:active {
			color: ${props => props.theme.white};
		}
	}
`;

const ModalStyle = styled.div`
	position: relative;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	width: 100%;
	pointer-events: auto;
	background-clip: padding-box;
	border-radius: 0.3rem;
	outline: 0;
`;
