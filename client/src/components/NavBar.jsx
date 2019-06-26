import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./AuthContext";
class NavBar extends Component {
	state = {};
	//each href will be a get request from the server.js
	render() {
		return (
			<ul class="nav justify-content-center">
				<li class="nav-item">
					<a class="nav-link" href="/">
						Home
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/login.html">
						Login
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/profile">
						Profile
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/faq">
						FAQ
					</a>
				</li>
				<AuthConsumer>
					{x => {
						if (x.isAuth === false) {
							return x.userID;
						}
					}}
				</AuthConsumer>
			</ul>
		);
	}
}

export default NavBar;
