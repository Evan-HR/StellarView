import React from "react";

import { AuthProvider, AuthConsumer } from "./AuthContext";
import App from "../App";
import axios from "axios";
//import { Cookies } from "react-cookie";

// {"cookie":{"originalMaxAge":null,"expires":null,
// "httpOnly":true,"path":"/"},"passport":{"user":{"user_id":81}}}
export class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: null,
			userID: null,
			isAuth: null,
			isLoggingIn: false,
			userReviews: []
		};
		//console.log("GET HERE AFTER SUBMIT?");
		//this.getWeatherInfo();
		this.getUserInfo();
		this.getUserReviews();
		this.handleLogoutState = this.handleLogoutState.bind(this);
	}

	handleLogoutState() {
		this.setState({
			firstName: null,
			userID: null,
			isAuth: false
		});
	}

	handleLogin = () => {
		console.log("FORCE UPDATE RUN???????????????");

		this.getUserInfo();
		this.getUserReviews();
	};

	getWeatherInfo() {
		axios
			.get("/api/getWeatherInfo")
			//put .then here
			.catch(error => {
				console.log(error);
			});
	}

	getUserInfo() {
		axios
			.get("/api/getUserInfo")

			.then(({ data }) => {
				this.setState({
					firstName: data.firstName,
					isAuth: data.isAuth,
					userID: data.userID
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	getUserReviews() {
		axios
			.get("/api/getUserReviews")

			.then(reviews => {
				this.setState({
					userReviews: reviews.data
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		return (
			<AuthProvider value={this.state}>
				<App
					handleLogoutState={this.handleLogoutState}
					handleLogin={this.handleLogin}
				/>
			</AuthProvider>
		);
	}
}

export default Auth;
