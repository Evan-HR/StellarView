import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./AuthContext";
import axios from "axios";
import NavBarFAQ from "./NavBarFAQ";
import Login from "./Login";
import Register from "./Register";

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
			<ul class="nav justify-content-center">
				<li class="nav-item">
					<a class="nav-link" href="/">
						Home
					</a>
				</li>
				{/* <AuthConsumer>
					{x => {
						if (x.isAuth === true) {
							return (
								<li class="nav-item">
									<button onClick={e => this.handleLogout(e)}>
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
				</AuthConsumer> */}

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

				<AuthConsumer>
					{x => {
						if (x.isAuth === true) {
							return (
								<li class="nav-item">
									<button
										className="btn btn-link"
										onClick={e => this.handleLogout(e)}
									>
										Logout
									</button>
								</li>
							);
						} else {
							return (
								<Login handleLogin={this.props.handleLogin} />
							);
						}
					}}
				</AuthConsumer>

				<Register />

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
