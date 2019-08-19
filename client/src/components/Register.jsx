import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "./style/Media/loginModalPlain.svg";
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

	renderRegisterFormStyle = () => {
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
								<div className="label">Preferred Name</div>
								<input type="text" />
							</div>
							<div className="row">
								<div className="label">E-Mail</div>
								<input type="text" />
							</div>
							<div className="row">
								<div className="label">Password</div>
								<input type="password" />
							</div>
							<div className="row">
								<div className="label">Re-Enter Password</div>
								<input type="password" />
							</div>
							<div className="row">
								<button>Submit</button>
							</div>
						</div>
		
					</div>
				</div>
			</LoginStyle>
		);
	};

	renderRegisterForm = () => {
		return(
<RegisterFormStyle>
							<Input
								type="text"
								placeholder="preferred name"
								name="name"
								onChange={this.handleNameChange}
								required
							/>
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
								name="password1"
								onChange={this.handlePasswordChange1}
								required
							/>
							<Input
								type="password"
								placeholder="re-enter password"
								name="password2"
								onChange={this.handlePasswordChange2}
								required
							/>
							<button
								className="SubmitButton"
								onClick={e => this.onSubmit(e)}
							>
								SUBMIT
							</button>
						</RegisterFormStyle>
		)
		
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
				<a onClick={() => this.openModal()}>
					<Link>register</Link>
				</a>
				<Modal
					closeTimeoutMS={800}
					className="modal-dialog"
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					// style={modalStyle}
					contentLabel="Register Modal"
					style={customStyles}
				>
					<div className="modal-content">
					

						{this.renderRegisterFormStyle()}

						{this.errorMsg()}
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default Register;
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

const RegisterFormStyle = styled.form`
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
	-webkit-box-shadow: -1px 4px 8px 2px rgba(0, 0, 0, 1);
	-moz-box-shadow: -1px 4px 8px 2px rgba(0, 0, 0, 1);
	border-radius: -1px 4px 8px 2px rgba(0, 0, 0, 1);

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
	margin: 20px auto;
	text-align: center;
	border: 2px solid ${props => props.theme.logoA};
	padding: 14px 10px;
	width: 200px;
	outline: none;
	color: white;
	border-radius: 24px;
	transition: 0.25s;

	&:focus {
		width: 280px;
		border-color: ${props => props.theme.gold2};
	}
`;

const HeaderStyle = styled.div`
	margin-left: 32%;
	color: whitesmoke;
`;

const LoginStyle = styled.div`
	font-family: IBM Plex Sans;
	padding-right: 30px;


		.close {
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: white;
  outline:none;
  /* text-shadow: 0 1px 0 #7C6E7E; */
  opacity: .5;
}

.close:hover {
  color: ${props => props.theme.cardDark};
  text-decoration: none;
}

.close:active {
 color: ${props => props.theme.colorBad};
}

.close:not(:disabled):not(.disabled):hover, .close:not(:disabled):not(.disabled):focus {
  opacity: .75;
}


	.login {
		position: absolute;

		transform: translate(-50%, -50%);
		width: 350px;
		height: 600px;
		background: whitesmoke;
		overflow: hidden;

		.banner {
			position: absolute;
			top: 0px;
			height: 0px;
			width: 100%;
			height: 190px;
			background: url(${props => props.background}) center no-repeat;
			background-size: 600px;
			/* transform: skew(0deg, -8deg) translateY(-25px); */
			z-index: 2;
		}
		.banner:before {
			content: "Register";
			position: absolute;
			width: 100px;
			height: 100px;
			background: ${props => props.theme.colorBad};
			color: #fff;
			bottom: -50px;
			left: 35%;
			line-height: 100px;
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

			.wrapper {
				padding-top: 30px;
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
