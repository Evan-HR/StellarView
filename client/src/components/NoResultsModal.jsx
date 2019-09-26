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

	renderNoParks = () => {
		return (
			<NoResultsStyle>
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
						<span>
							No parks have good visibility! Try again later!{" "}
							{this.props.moonPhase}
							{JSON.stringify(this.props.scoreBreakdown)}
						</span>
					</div>
				) : (
					<div className="messageBox">
						<i className="reportIcon fas fa-exclamation-triangle fa-2x"></i>
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

	i {
		color: ${props => props.theme.yellow};
	}
	span {
		max-width: 300px;
		display: block;
		margin: 10px auto;
	}
	/* min-height: 100vh; */

	@media screen and (min-width: 320px) {
		width: 100vw;
	}

	@media screen and (min-width: 600px) {
		width: 60vw;
	}

	@media screen and (min-width: 801px) {
		width: 45vw;
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
