import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./AuthContext";
import axios from "axios";
import NavBarFAQ from "./NavBarFAQ";
import { withRouter, Link } from "react-router-dom";

class NavBar extends Component {
	state = {};
	//each href will be a get request from the server.js

	handleLogout(e) {
		e.preventDefault();
		axios.get("/logout");
		this.props.handleLogoutState();
	}

	render() {
		return (
			<ul className="nav justify-content-center">
				<li className="nav-item">
					<a className="nav-link" href="/">
						Home
					</a>
				</li>
				<AuthConsumer>
					{x => {
						if (x.isAuth === true) {
							return (
								<li className="nav-item">
									<button onClick={e => this.handleLogout(e)}>
										Logout
									</button>
								</li>
							);
						} else {
							return (
								<li className="nav-item">
									<a className="nav-link" href="/login.html">
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
								<li className="nav-item">
									<a
										className="nav-link"
										//href="/profile"
									>
										<Link to="/profile">Profile</Link>
									</a>
								</li>
							);
						} else {
							return (
								<li className="nav-item">
									<a className="nav-link" href="/login.html">
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

export default withRouter(NavBar);
