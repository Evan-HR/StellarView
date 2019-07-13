import React, { Component } from "react";
import axios from "axios";
class Login extends Component {
	state = {
		userEmail: "",
		userPassword: ""
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

	onSubmit = e => {
		e.preventDefault();
		axios.post("/api/login", {
			email: this.state.userEmail,
			password: this.state.userPassword
		});
	};

	render() {
		return (
			<div className="login-form">
				<p>Login Form</p>

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
	}
}

export default Login;
