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
		this.setState({ ...this.state, modalIsOpen: false});
		document.body.style.overflow = "visible";
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
					<i class="fas fa-window-close" />
				</button>
                <span>Sorry!  The stargazing conditions right now are poor in this area.  Please try again in X days.</span>
			</NoResultsStyle>
		);
    };
    
    componentDidMount(){
        this.openModal();
    }



	//classNameName changes model content, style gives you anything you specify to override defaults
	render() {
		return (
			<React.Fragment>
				<Modal
					closeTimeoutMS={800}
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					contentLabel="Login Modal"
					className="modal-dialog"
					style={customStyles}
				>
					<div className="modal-content">
						{/* {this.renderLoginModal()} */}
						{/* {this.renderModalContent()} */}
						{this.renderNoParks()}
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default NoResultsModal;

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
	width: 60vw;
	position: relative;
	background: ${props => props.theme.prettyDark};
	font-family: "Lato";
	color: ${props => props.theme.white};
	/* min-height: 100vh; */


	.close {
		position: absolute;
		top: 0px;
		right: 0px;
		float: right;
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		color: ${props => props.theme.white};
		outline: none;
		text-shadow: none;
		opacity: 0.5;
	}

	.close:hover {
		color: ${props => props.theme.colorBad};
		text-decoration: none;
	}

	.close:active {
		color: ${props => props.theme.white};
	}

	.close:not(:disabled):not(.disabled):hover,
	.close:not(:disabled):not(.disabled):focus {
		opacity: 0.75;
	}

`;
