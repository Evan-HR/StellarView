import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./modal.css";
import { withRouter, Link } from "react-router-dom";


class Login extends Component {
	state = {
		userEmail: "",
		userPassword: "",
		errorDB: false,
		modalIsOpen: false,
		loginSuccess: false
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
		if (this.state.errorDB === true) {
			return (
				<div class="alert alert-danger" role="alert">
					❌ Invalid login credentials! Please try again
				</div>
			);
		}
	}

	loginSuccess = () => {
		console.log("get here for some reason?");
		this.setState({ loginSuccess: true, errorDB: false });
		setTimeout(() => {
			this.setState({
				modalIsOpen: false
			});
			this.props.handleLogin();
		}, 1250);
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

	renderModalContent = () => {
		if (!this.state.loginSuccess) {
			return (
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
			);
		} else {
			return (
				<div className="text-success text-center m-3">
					<h1>
						<b>✔️ Login Successful!</b>
					</h1>
				</div>
			);
		}
	};

	render() {
		return (
			<React.Fragment>
				<a onClick={() => this.openModal()}>
					<Link>Login</Link>
				</a>
				<Modal
					className="modal-dialog"
					closeTimeoutMS={150}
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					contentLabel="FAQ Modal"
				>
					<div className="modal-content">
						<div className="modal-header">
							<h1>Login</h1>
						</div>

						{this.renderModalContent()}

						{this.errorMsg()}
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default Login;
