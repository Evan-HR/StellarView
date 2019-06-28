import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./AuthContext";
import axios from "axios";
import NavBarFAQ from "./NavBarFAQ";

class NavBar extends Component {
	state = {};
	//each href will be a get request from the server.js

	handleLogout() {
		axios.get("/logout");
		this.props.handleLogoutState();
	}

	render() {
		return (
			<ul class="nav justify-content-center">
				<li class="nav-item">
					<a class="nav-link" href="/">
						Home
					</a>
				</li>
				<AuthConsumer>
					{x => {
						if (x.isAuth === true) {
							return (
								<li class="nav-item">
									<button onClick={() => this.handleLogout()}>
										Logout
									</button>
								</li>
							);
						} else {
							return (
								<li class="nav-item">
									<a class="nav-link" href="/login.html">
										Login
									</a>
								</li>
							);
						}
					}}
				</AuthConsumer>

				<AuthConsumer>
					{x => {
						if (x.isAuth === true) {
							return (
								<li class="nav-item">
									<a class="nav-link" href="/profile.html">
										Profile
									</a>
								</li>
							);
						} else {
							return (
								<li class="nav-item">
									<a class="nav-link" href="/login.html">
										Profile
									</a>
								</li>
							);
						}
					}}
				</AuthConsumer>

				<NavBarFAQ />

				{/* <li class="nav-item">
					<a class="nav-link" href="/faq">
						FAQ
					</a>
				</li> */}
				<AuthConsumer>
					{x => {
						if (x.isAuth === true) {
							return "hello, " + x.firstName;
						}
					}}
				</AuthConsumer>
			</ul>
		);
	}
}

export default NavBar;
