import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "./style/Media/loginModalPlain.svg";
import formError from "./style/Media/formError.svg";
import formSuccess from "./style/Media/formSuccess.svg";
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
					<AlertStyle success={false}>
						<img src={formError} />
						<div className="AlertText">{errors.msg}</div>
					</AlertStyle>
				);
			});
		}
	}

	renderRegisterFormStyle = () => {
		return (
			<RegisterStyle background={backgroundImage}>
				<div className="register">
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
								<input
									type="text"
									placeholder="preferred name"
									name="name"
									onChange={this.handleNameChange}
									required
								/>
							</div>
							<div className="row">
								<div className="label">E-Mail</div>
								<input
									type="email"
									placeholder="email"
									name="email"
									onChange={this.handleEmailChange}
									required
								/>
							</div>
							<div className="row">
								<div className="label">Password</div>
								<input
									type="password"
									placeholder="password"
									name="password1"
									onChange={this.handlePasswordChange1}
									required
								/>
							</div>
							<div className="row">
								<div className="label">Re-Enter Password</div>
								<input
									type="password"
									placeholder="re-enter password"
									name="password2"
									onChange={this.handlePasswordChange2}
									required
								/>
							</div>
							<div className="rowSubmit">
								<button onClick={this.onSubmit}>Submit</button>
							</div>
						</div>
						{this.errorMsg()}
					</div>
				</div>
			</RegisterStyle>
		);
	};

	// renderRegisterForm = () => {
	// 	return (
	// 		<RegisterFormStyle>
	// 			<Input
	// 				type="text"
	// 				placeholder="preferred name"
	// 				name="name"
	// 				onChange={this.handleNameChange}
	// 				required
	// 			/>
	// 			<Input
	// 				type="email"
	// 				placeholder="email"
	// 				name="email"
	// 				onChange={this.handleEmailChange}
	// 				required
	// 			/>
	// 			<Input
	// 				type="password"
	// 				placeholder="password"
	// 				name="password1"
	// 				onChange={this.handlePasswordChange1}
	// 				required
	// 			/>
	// 			<Input
	// 				type="password"
	// 				placeholder="re-enter password"
	// 				name="password2"
	// 				onChange={this.handlePasswordChange2}
	// 				required
	// 			/>
	// 			<button
	// 				className="SubmitButton"
	// 				onClick={e => this.onSubmit(e)}
	// 			>
	// 				SUBMIT
	// 			</button>
	// 		</RegisterFormStyle>
	// 	);
	// };

	registerSuccess = () => {
		console.log("get here for some reason?");
		this.setState({
			modalIsOpen: false
		});
		console.log("REG SUCCESS, GOING TO LOGIN NOW");
		this.props.handleLogin();
	};

	onSubmit = e => {
		console.log("SUBMIT BUTTON PRESSED");
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
					<Link>Register</Link>
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

						{/* {this.errorMsg()} */}
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





const HeaderStyle = styled.div`
	margin-left: 32%;
	color: whitesmoke;
`;

const RegisterStyle = styled.div`
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

	.register {
		position: absolute;

		transform: translate(-50%, -50%);
		width: 350px;
		height: 80vh;
		max-width: 100vw;
		max-height: 100vh;
		overflow: hidden;
		border-radius: 0.3rem;

		.banner {
			position: absolute;
			top: 0px;

			width: 100%;
			height: 210px;
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
				/* position: absolute;
				left: 50%;
				transform: translateX(-50%); */
				width: 85%;
				margin: 0 auto;
			}

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
						
						:hover,:active{
							
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


	}
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
