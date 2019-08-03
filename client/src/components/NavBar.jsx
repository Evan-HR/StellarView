import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./AuthContext";
import axios from "axios";
import NavBarFAQ from "./NavBarFAQ";
import { withRouter, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import NavBarMobile from "./NavBarMobile";
import NavBarDesktop from "./NavBarDesktop";
import styled from "styled-components";

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
			<MyNavBar>

				<ul className="nav justify-content-center">
					<li className="nav-item">
						<a className="nav-link">
							<Link to="/">Home</Link>
						</a>
					</li>

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
									<Login
										handleLogin={this.props.handleLogin}
									/>
								);
							}
						}}
					</AuthConsumer>

					<Register handleLogin={this.props.handleLogin} />

					<NavBarFAQ />

					<AuthConsumer>
						{x => {
							if (x.isAuth === true) {
								return "hello, " + x.firstName;
							}
						}}
					</AuthConsumer>
				</ul>
			</MyNavBar>
		);
	}
}

export default withRouter(NavBar);

///////////////////////////////////////////////

const MyNavBar = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	list-style: none;
`;
