import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import backgroundImage from "../components/style/Media/darkerFormModal.png";

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

	renderModalContent = () => {
		if (!this.state.loginSuccess) {
			return (
				
					<LoginFormStyle>
						<Input type="email"
							placeholder="email"
							name="email"
							onChange={this.handleEmailChange}
							required/>

						<Input
							type="password"
							placeholder="password"
							name="password"
							onChange={this.handlePasswordChange}
							required
						/>
						
						<button className="SubmitButton"
							
							onClick={e => this.onSubmit(e)}
						>
							Submit
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
						<div className="modal-header">

<HeaderStyle>
<h1>LOGIN</h1>
</HeaderStyle>

						
						
							<button type="button" onClick={this.closeModal} className="close" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
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

/////////////////////////////////

const customStyles = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.9)',
		transition: "opacity 400ms ease-in-out"
	}

	// 	,

	// 	content: {
	// backgroundColor:"green"
	// 	}
};

const LoginFormStyle=styled.form`
width: 500px;
/* padding: 40px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%); */
background: #191919;
text-align: center;

.SubmitButton{
	border:0;
	background:none;
	display: block;
	margin: 20px auto;
	text-align: center;
	border: 2px solid #2ecc71;
	padding: 14px 10px;
	outline: none;
	color: white;
	border-radius: 24px;
	transition: 0.25s;
	cursor: pointer;

	&:hover{
		background: #2ecc71;
	}

}



`;

const Input = styled.input`
border:0;
	background:none;
	display: block;
	margin: 20px auto;
	text-align: center;
	border: 2px solid #3498db;
	padding: 14px 10px;
	width: 200px;
	outline: none;
	color: white;
	border-radius: 24px;
	transition: 0.25s;

	&:focus{
		width: 280px;
		border-color: aqua;
	}

`;

const HeaderStyle = styled.div`
	margin-left: 38%;
	color: whitesmoke;
`

