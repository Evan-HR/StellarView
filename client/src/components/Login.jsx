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

class Login extends Component {
	state = {
		userEmail: "",
		userPassword: "",
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

	handleEmailChange = changeEvent => {
		this.setState({
			userEmail: changeEvent.target.value
		});
	};

	handlePasswordChange = changeEvent => {
		this.setState({
			userPassword: changeEvent.target.value
		});
	};

	handleErrorAlert = () => {
		this.setState({
			errorDB: true
		});
	};

	errorMsg() {
		if (this.state.errorDB == true) {
			return (
				<div class="alert alert-danger" role="alert">
					Invalid login credentials! Please try again
				</div>
			);
		}
	}

	loginSuccess = () => {
		console.log("get here for some reason?");
		this.setState({
			modalIsOpen: false
		});

		this.props.handleLogin();
	};

	onSubmit = e => {
		e.preventDefault();
		axios
			.post("/api/login", {
				email: this.state.userEmail,
				password: this.state.userPassword
			})
			//this.loginSuccess() will run function automatically
			.then(this.loginSuccess)

			.catch(err => {
				console.error("ERROR OCCURRED!", err);
				this.handleErrorAlert();
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
					Login
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
							<h1>Login</h1>
						</div>
						<div className="login-form">
							<form>
								<input
									type="email"
									placeholder="email"
									name="email"
									onChange={this.handleEmailChange}
									required
								/>
								<input
									type="password"
									placeholder="password"
									name="password"
									onChange={this.handlePasswordChange}
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

export default Login;
