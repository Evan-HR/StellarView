import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";

const modalStyle = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: "rgba(0,0,0,0.75)"
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		borderRadius: "25px",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		width: "95%",
		maxWidth: "600px",
		height: "95%",
		overflowY: "auto"
	}
};

class Register extends Component {
	state = {
		userName: "",
		userEmail: "",
		userPassword1: "",
		userPassword2: "",
		regErrors: [],
		errorDB: false,
		modalIsOpen: false
	};

	openModal = () => {
		this.setState({ ...this.state, modalIsOpen: true });
	};

	afterOpenModal = () => {
		document.body.style.overflow = "hidden"; //Prevents background scrolling
	};

	closeModal = () => {
		this.setState({ ...this.state, modalIsOpen: false, errorDB: false });
		document.body.style.overflow = "visible";
	};

	handleNameChange = changeEvent => {
		this.setState({
			userName: changeEvent.target.value
		});
	};

	handleEmailChange = changeEvent => {
		this.setState({
			userEmail: changeEvent.target.value
		});
	};

	handlePasswordChange1 = changeEvent => {
		this.setState({
			userPassword1: changeEvent.target.value
		});
	};

	handlePasswordChange2 = changeEvent => {
		this.setState({
			userPassword2: changeEvent.target.value
		});
	};

	handleErrorAlert = () => {
		this.setState({
			errorDB: true
		});
	};

	errorMsg() {
		if (this.state.errorDB === true) {
			return this.state.regErrors.map(errors => {
				return (
					<div class="alert alert-danger" role="alert">
						{errors.msg}
					</div>
				);
			});
		}
	}

	registerSuccess = () => {
		console.log("get here for some reason?");
		this.setState({
			modalIsOpen: false
		});
		console.log("REG SUCCESS, GOING TO LOGIN NOW");
		this.props.handleLogin();
	};

	onSubmit = e => {
		e.preventDefault();
		axios
			.post("/api/register", {
				name: this.state.userName,
				email: this.state.userEmail,
				password1: this.state.userPassword1,
				password2: this.state.userPassword2
			})
			//this.loginSuccess() will run function automatically
			.then(this.registerSuccess)

			.catch(err => {
				console.error(err.response.data.errors);
				//console.error("ERROR OCCURRED!", err);
				this.setState({
					errorDB: true,
					regErrors: err.response.data.errors
				});
				//this.handleErrorAlert();
				//.then(this.closemModal) is needed
			});
	};

	render() {
		return (
			<React.Fragment>
				<button
					className="btn btn-link"
					onClick={() => this.openModal()}
				>
					Register
				</button>
				<Modal
					className="modal-dialog"
					closeTimeoutMS={150}
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					// style={modalStyle}
					contentLabel="FAQ Modal"
				>
					<div className="modal-content">
						<div className="modal-header">
							<h1>Register</h1>
						</div>
						<div className="login-form">
							<form>
								<input
									type="text"
									placeholder="Preferred Name"
									name="name"
									onChange={this.handleNameChange}
									required
								/>
								<input
									type="email"
									placeholder="Email"
									name="email"
									onChange={this.handleEmailChange}
									required
								/>
								<input
									type="password"
									placeholder="password"
									name="password1"
									onChange={this.handlePasswordChange1}
									required
								/>
								<input
									type="password"
									placeholder="password"
									name="password2"
									onChange={this.handlePasswordChange2}
									required
								/>
								<button
									className="btn btn-primary m-2"
									onClick={e => this.onSubmit(e)}
								>
									Submit
								</button>
							</form>
						</div>

						{this.errorMsg()}
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default Register;
