import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import backgroundImage from "./style/Media/loginModalPlain.svg";

import { AuthConsumer } from "./AuthContext";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";
import Register from "./Register";
import formError from "./style/Media/formError.svg";
import formSuccess from "./style/Media/formSuccess.svg";

Modal.setAppElement("#root");
class BaseLogin extends Component {
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
		console.log("Closing login modal");
		this.props.refreshInfoModal();
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
		if (this.state.errorDB) {
			return (
				<AlertStyle success={false}>
					<img src={formError} />
					<div className="AlertText">
						Invalid login credentials! Please try again
					</div>
				</AlertStyle>
			);
		}
		if (this.state.loginSuccess) {
			return (
				<AlertStyle success={true}>
					<img src={formSuccess} />
					<div className="AlertText">Login successful</div>
				</AlertStyle>
			);
		}
	}

	loginSuccess = () => {
		console.log("get here for some reason?");
		this.setState({ loginSuccess: true, errorDB: false });
		setTimeout(() => {
			this.closeModal();
			this.props.context.handleLogin();
			// this.props.justLoggedIn();
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
					<div className="banner">
						<button
							type="button"
							onClick={this.closeModal}
							className="close"
							aria-label="Close"
						>
							<i class="fas fa-window-close" />
						</button>
					</div>
					<div className="form">
						<div className="wrapper">
							<div className="row">
								<div className="label">E-Mail</div>
								<input
									type="text"
									className="email"
									name="email"
									// value={this.state.userEmail || ""}
									onChange={this.handleEmailChange}
									required
								/>
							</div>
							<div className="row">
								<div className="label">Password</div>
								<input
									type="password"
									name="password"
									onChange={this.handlePasswordChange}
									required
								/>
							</div>
							<div className="rowSubmit">
								<button onClick={this.onSubmit}>Submit</button>
							</div>
						</div>
						<div className="signup">
							Don't have an account? <Register />
						</div>
						{this.errorMsg()}
					</div>
				</div>
			</LoginStyle>
		);
	};

	//className changes model content, style gives you anything you specify to override defaults
	render() {
		return (
			<React.Fragment>
				<a
					onClick={() => {
						this.openModal();
					}}
				>
					{this.props.children ? (
						<React.Fragment>{this.props.children}</React.Fragment>
					) : (
						<Link>login</Link>
					)}
					{/* <Link>login</Link> */}
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
						{this.renderLoginModal()}
						{/* {this.renderModalContent()} */}
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

const Login = props => (
	<AuthConsumer>{x => <BaseLogin {...props} context={x} />}</AuthConsumer>
);

BaseLogin.defaultProps = {
	refreshInfoModal: () => {
		console.log("Default prop!");
	}
};

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
	font-family: IBM Plex Sans;
	padding-right: 30px;

	.close {
		float: right;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1;
		color: whitesmoke;
		outline: none;
		text-shadow: none;
		opacity: 0.5;
	}

	.close:hover {
		color: ${props => props.theme.colorBad};
		text-decoration: none;
	}

	.close:active {
		color: ${props => props.theme.colorBad};
	}

	.close:not(:disabled):not(.disabled):hover,
	.close:not(:disabled):not(.disabled):focus {
		opacity: 0.75;
	}

	.login {
		position: absolute;

		transform: translate(-50%, -51%);
		width: 350px;
		height: 80vh;
		max-width: 100vw;
		max-height: 100vh;
		/* background: whitesmoke; */
		overflow: hidden;
		border-radius: 0.3rem;

		.banner {
			position: absolute;
			top: 0px;
			height: 0px;
			width: 100%;
			height: 210px;
			background: url(${props => props.background}) center no-repeat;
			background-size: 600px;
			/* transform: skew(0deg, -8deg) translateY(-25px); */
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
			left: 38%;
			line-height: 80px;
			font-size: 17px;
			text-transform: uppercase;
			border-radius: 50%;
			text-align: center;
			/* transform: skew(0deg, 8deg) translateX(-50%); */
		}

		.form {
			position: absolute;
			top: 210px;
			background: #f6f6f6;
			width: 100%;
			height: calc(100% - 180px);
			display: flex;
			flex-direction: column;

			.wrapper {
				padding-top: 30px;
				/* position: absolute;
				left: 50%;
				transform: translateX(-50%); */
				width: 85%;
				margin: 0 auto;

				.rowSubmit {
					margin: 20px 0 10px 0;
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
						transition: 0.25s;
						width: 100%;
						color: whitesmoke;
						cursor: pointer;

						:hover,
						:active {
							color: ${props => props.theme.colorBad};
							transition: 0.25s;
						}
					}
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
			}

			.signup {
				position: absolute;
				text-align: center;
				width: 100%;
				font-size: 13px;
				bottom: 70px;
				color: #333;
				a {
					color: ${props => props.theme.colorBad};
					transition: 0.25s;
					text-decoration: none;
					font-weight: 600;
				}
				:hover,
				:active {
					color: ${props => props.theme.franNavy};
					transition: 0.25s;
					a {
						color: ${props => props.theme.franNavy};
						transition: 0.25s;
					}
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
`;

const HeaderStyle = styled.div`
	margin-left: 38%;
	color: whitesmoke;
`;

const AlertStyle = styled.div`
	position: relative;

	.AlertText {
		padding: 10px;
		background-color: ${props =>
			props.success ? "#67e8956b" : "#daa97961"};

		font-weight: 500;
	}

	img {
		padding-bottom: 10px;
		width: 42px;
	}
`;
