import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import backgroundImage from "./style/Media/formModalBackground.jpg";

import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";

Modal.setAppElement("#root");
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
					Invalid login credentials! Please try again
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

	renderLoginModal = () => {
		return (
			<LoginStyle background={backgroundImage}>
				<div className="login">
					<div className="banner" />
					<div className="form">
						<div className="wrapper">
							<div className="row">
								<div className="label">Username</div>
								<input type="text" />
							</div>
							<div className="row">
								<div className="label">Password</div>
								<input type="password" />
							</div>
							<div className="row">
								<button>Submit</button>
							</div>
						</div>
						<div className="signup">
							Don't have an account? <a href="#">Signup</a>
						</div>
					</div>
				</div>
			</LoginStyle>
		);
	};

	renderModalContent = () => {
		if (!this.state.loginSuccess) {
			return (
				<LoginFormStyle>
					<Input
						type="email"
						placeholder="email"
						name="email"
						onChange={this.handleEmailChange}
						required
					/>

					<Input
						type="password"
						placeholder="password"
						name="password"
						onChange={this.handlePasswordChange}
						required
					/>

					<button
						className="SubmitButton"
						onClick={e => this.onSubmit(e)}
					>
						SUBMIT
					</button>
				</LoginFormStyle>
			);
		} else {
			return (
				<div className="text-success text-center m-3">
					<h1>
						<b>Login Successful!</b>
					</h1>
				</div>
			);
		}
	};

	//className changes model content, style gives you anything you specify to override defaults

	render() {
		return (
			<React.Fragment>
				<a onClick={() => this.openModal()}>
					<Link>login</Link>
				</a>

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
						{/* <div className="modal-header">
							<HeaderStyle>
								<h1>LOGIN</h1>
							</HeaderStyle>

							<button
								type="button"
								onClick={this.closeModal}
								className="close"
								aria-label="Close"
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div> */}
						{this.renderLoginModal()};
						{/* {this.renderModalContent()} */}
						{this.errorMsg()}
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default Login;

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
	}

	// 	,

	// 	content: {
	// backgroundColor:"green"
	// 	}
};

const LoginStyle = styled.div`
	.login {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 300px;
		height: 450px;
		background: #f6f6f6;
		overflow: hidden;
		box-shadow: 0px 0px 50px 2px #aaa;

		.banner {
			position: absolute;
			top: 0px;
			height: 0px;
			width: 100%;
			height: 210px;
			background: url(${props => props.background}) center no-repeat;
			background-size: cover;
			transform: skew(0deg, -8deg) translateY(-25px);
			z-index: 2;
		}
		.banner:before {
			content: "Login";
			position: absolute;
			width: 80px;
			height: 80px;
			background: ${props => props.theme.colorBad};
			color: #fff;
			bottom: -35px;
			left: 50%;
			line-height: 80px;
			font-size: 17px;
			text-transform: uppercase;
			border-radius: 50%;
			text-align: center;
			transform: skew(0deg, 8deg) translateX(-50%);
		}

		.form {
			position: absolute;
			top: 210px;
			background: #f6f6f6;
			width: 100%;
			height: calc(100% - 180px);

			.wrapper {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				width: 85%;
			}
			.row {
				margin: 20px 0px;
				.label {
					font-size: 12px;
					font-weight: 600;
					color: rgb(100, 100, 100);
				}

				input {
					margin-top: 2px;
					font-size: 13px;
					color: rgb(70, 70, 70);
					border: none;
					border-bottom: 1px solid rgba(100, 100, 100, 0.6);
					outline: none;
					height: 25px;
					background: transparent;
					width: 100%;
				}
				button {
					margin-top: 0px;
					font-size: 13px;
					color: rgb(100, 100, 100);
					border: none;
					outline: none;
					height: 40px;
					text-transform: uppercase;
					background: ${props => props.theme.starDark};
					width: 100%;
					color: #fff;
					cursor: pointer;
				}
			}

			.signup {
				position: absolute;
				text-align: center;
				width: 100%;
				font-size: 13px;
				bottom: 50px;
				color: #333;
				a {
					color: ${props => props.theme.colorBad};
					text-decoration: none;
					font-weight: 600;
				}
			}
		}
	}
`;

const LoginFormStyle = styled.form`
	width: 498px;
	/* padding: 40px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%); */
	background: ${props => props.theme.modalOverlay};
	text-align: center;
	border-bottom-left-radius: 0.3rem;
	border-bottom-right-radius: 0.3rem;
	-webkit-box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 1);
	-moz-box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 1);
	box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 1);

	.SubmitButton {
		border: 0;
		background: none;
		display: block;
		margin: 20px auto;
		text-align: center;
		border: 2px solid ${props => props.theme.green};
		padding: 14px 25px;
		outline: none;
		color: white;
		border-radius: 24px;
		transition: 0.25s;
		cursor: pointer;

		&:hover {
			background: ${props => props.theme.green};
		}

		&:active {
			background: ${props => props.theme.gold2};
			border: 2px solid ${props => props.theme.gold2};
			/* padding: 17px 28px; */
		}
	}
`;

const Input = styled.input`
	border: 0;
	background: none;
	display: block;
	line-height: normal;
	margin: 20px auto;
	text-align: center;
	border-bottom: 2px solid ${props => props.theme.clickable};
	/* padding: 14px 10px; */
	width: 200px;
	outline: none;
	color: white;
	/* border-radius: 24px; */
	transition: 0.25s;

	&:focus {
		width: 280px;
		border-color: ${props => props.theme.gold2};
	}
`;

const HeaderStyle = styled.div`
	margin-left: 38%;
	color: whitesmoke;
`;
