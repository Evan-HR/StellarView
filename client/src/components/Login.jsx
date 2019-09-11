import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import { AuthConsumer } from "./AuthContext";
import { withRouter, Link, NavLink  } from "react-router-dom";
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
					<img className="formError" src={formError} />
					<div className="AlertText">
						Invalid login credentials! Please try again
					</div>
				</AlertStyle>
			);
		}
		if (this.state.loginSuccess) {
			return (
				<AlertStyle success={true}>
					<img className="formSuccess" src={formSuccess} />
					<div className="AlertText">Welcome back!</div>
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

	renderNewLogin = () => {
		return (
			<NewLoginStyle>
				{/* <StarBackground/> */}
				<button
					type="button"
					onClick={this.closeModal}
					className="close"
					aria-label="Close"
				>
					<i className="fas fa-window-close" />
				</button>
				<div className="grid">
					<form onSubmit={this.onSubmit} className="form login">
						<div className="form__field">
							<label htmlFor ="login__username">
								<svg className="icon">
									<use
										xmlnsXlink="http://www.w3.org/1999/xlink"
										xlinkHref="#email"
									></use>
								</svg>
								<span className="hidden">Username</span>
							</label>
							<input
								id="login__username"
								type="text"
								name="username"
								className="form__input"
								placeholder="Email"
								onChange={this.handleEmailChange}
								required
							/>
						</div>

						<div className="form__field">
							<label htmlFor ="login__password">
								<svg className="icon">
									<use
										xmlnsXlink="http://www.w3.org/1999/xlink"
										xlinkHref="#lock"
									></use>
								</svg>
								<span className="hidden">Password</span>
							</label>
							<input
								id="login__password"
								type="password"
								name="password"
								className="form__input"
								placeholder="Password"
								onChange={this.handlePasswordChange}
								required
							/>
						</div>

						<div className="form__field">
							<input type="submit" value="Sign In" />
						</div>
					</form>

					<p className="text--center">
						Not a member? <Register />
					</p>
				</div>
				{this.errorMsg()}
				<svg xmlns="http://www.w3.org/2000/svg" className="icons">
					<symbol id="arrow-right" viewBox="0 0 1792 1792">
						<path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" />
					</symbol>
					<symbol id="lock" viewBox="0 0 1792 1792">
						<path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
					</symbol>
					<symbol id="user" viewBox="0 0 1792 1792">
						<path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
					</symbol>
					<symbol id="email" viewBox="0 0 25 25">
						<path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
					</symbol>
				</svg>
			</NewLoginStyle>
		);
	};

	//classNameName changes model content, style gives you anything you specify to override defaults
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
						<Link to="/">Login</Link>
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
					<ModalStyle>
						{/* {this.renderLoginModal()} */}
						{/* {this.renderModalContent()} */}
						{this.renderNewLogin()}
						</ModalStyle>
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

const AlertStyle = styled.div`
	position: relative;

	.AlertText {
		/* padding: 10px;
		background-color: ${props => (props.success ? "#67e8956b" : "#daa97961")}; */

		font-weight: 500;
	}

	img {
		padding-bottom: 10px;
		width: 42px;

	}
`;

//style the "modal" here - don't worry about the ccontent shit
const NewLoginStyle = styled.div`
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
	height: 80vh;
	width: 60vw;
	position: relative;
	background: ${props => props.theme.prettyDark};
	font-family: "Lato", sans-serif;
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

	/* helpers/grid.css */

	.grid {
		margin-left: auto;
		margin-right: auto;
		max-width: 320px;
		max-width: 20rem;
		width: 90%;
	}

	/* helpers/hidden.css */

	.hidden {
		border: 0;
		clip: rect(0 0 0 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
	}

	/* helpers/icon.css */

	.icons {
		display: none;
	}

	.icon {
		display: inline-block;
		fill: #606468;
		font-size: 16px;
		font-size: 1rem;
		height: 1em;
		vertical-align: middle;
		width: 1em;
	}

	a {
		color: ${props => props.theme.colorMedium};
		outline: 0;
		text-decoration: none;
		transition: 0.25s;
	}

	a:focus,
	a:hover {
		text-decoration: none;
		color: ${props => props.theme.colorBad};
		transition: 0.25s;
	}

	/* modules/form.css */

	input {
		background-image: none;
		border: 0;
		color: ${props => props.theme.white};
		font: inherit;
		margin: 0;
		outline: 0;
		padding: 0;
		-webkit-transition: background-color 0.3s;
		transition: background-color 0.3s;
	}

	input[type="submit"] {
		cursor: pointer;

		background-position: center;
		transition: background 0.4s;

		:hover {
			background: rgba(0, 0, 0, 0.1)
				radial-gradient(circle, transparent 1%, rgba(0, 0, 0, 0.1) 1%)
				center/15000%;
		}
		:active {
			background-color: rgba(0, 0, 0, 0.1);
			background-size: 100%;
			transition: background 0s;
		}
	}

	.form {
		margin: -14px;
		margin: -0.875rem;
	}

	.form input[type="password"],
	.form input[type="text"],
	.form input[type="submit"] {
		width: 100%;
	}

	.form__field {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		margin: 14px;
		margin: 0.875rem;
	}

	.form__input {
		-webkit-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
	}

	/* modules/login.css */

	.login {
		color: #eee;
	}

	.login label,
	.login input[type="text"],
	.login input[type="password"],
	.login input[type="submit"] {
		border-radius: 0.25rem;
		padding: 16px;
		padding: 1rem;
	}

	.login label {
		background-color: #363b41;
		border-bottom-right-radius: 0;
		border-top-right-radius: 0;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		margin-bottom: 0rem;
	}

	.login input[type="password"],
	.login input[type="text"] {
		background-color: #3b4148;
		border-bottom-left-radius: 0;
		border-top-left-radius: 0;
	}

	.login input[type="password"]:focus,
	.login input[type="password"]:hover,
	.login input[type="text"]:focus,
	.login input[type="text"]:hover {
		background-color: #434a52;
	}

	.login input[type="submit"] {
		background-color: ${props => props.theme.colorBad};
		color: ${props => props.theme.prettyDark};
		font-weight: 600;
		text-transform: uppercase;
	}

	.login input[type="submit"]:focus,
	.login input[type="submit"]:hover {
		background-color: ${props => props.theme.colorMedium};
	}

	/* modules/text.css */

	p {
		margin-bottom: 24px;
		margin-bottom: 1.5rem;
		margin-top: 24px;
		margin-top: 1.5rem;
	}

	.text--center {
		text-align: center;
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