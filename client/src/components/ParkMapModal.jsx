import React, { Component } from "react";
import Modal from "react-modal";
import "./modal.css";


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
		borderRadius: "25px",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		maxWidth: "95%",
		maxHeight: "95%"
	}
};

class ParkMapModal extends Component {
	state = {
		modalIsOpen: false
	};

	openModal = content => {
		if (content === "") {
			content = "No content.";
		}
		this.modalContent = content;
		this.setState({ ...this.state, modalIsOpen: true });
	};

	afterOpenModal = () => {
		document.body.style.overflow = "hidden"; //Prevents background scrolling
	};

	closeModal = () => {
		document.body.style.overflow = "visible";
		this.setState({ ...this.state, modalIsOpen: false });
	};

	render() {
		return (
			<Modal
				className="Modal__Bootstrap modal-dialog"
				closeTimeoutMS={150}
				isOpen={this.state.modalIsOpen}
				onAfterOpen={this.afterOpenModal}
				onRequestClose={this.closeModal}
				// style={modalStyle}
				contentLabel="Example Modal"
			>
				<div className="modal-content">{this.modalContent}</div>
			</Modal>
		);
	}
}

export default ParkMapModal;
