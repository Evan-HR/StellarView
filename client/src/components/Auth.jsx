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
			isAuth: null
		};
		this.callAPI();
		this.handleLogoutState = this.handleLogoutState.bind(this);
	}

	handleLogoutState() {
		this.setState({
			firstName: null,
			userID: null,
			isAuth: false
		});
	}

	callAPI() {
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

	render() {
		return (
			<AuthProvider value={this.state}>
				<App handleLogoutState={this.handleLogoutState} />
			</AuthProvider>
		);
	}
}

export default Auth;
