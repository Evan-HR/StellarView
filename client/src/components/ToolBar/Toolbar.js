import React, { Component } from "react";
import DrawerToggleButton from "./DrawerToggleButton";
import styled from "styled-components";
import { AuthProvider, AuthConsumer } from "../AuthContext";
import { withRouter, Link } from "react-router-dom";
import Login from "../Login";
import axios from "axios";
import Register from "../Register";
import NavBarFAQ from "../NavBarFAQ";

class Toolbar extends Component {
	state = {};

	handleLogout(e) {
		e.preventDefault();
		axios.get("/logout");
		this.props.handleLogoutState();
	}

	render() {
		return (
			<ToolbarStyle>
				<nav className="toolbar__navigation">
					<div>
						<DrawerToggleButton
							click={this.props.drawerClickHandler}
						/>
					</div>
					<div className="toolbar__logo">
						<Link to="/">STELLARGAZE</Link>
					</div>
					<div className="spacer" />
					<div className="toolbar_navigation-items">
						<ul>
							<AuthConsumer>
								{x => {
									if (x.isAuth === true) {
										return (
											<li>
												<a>
													<Link to="/profile">
														Favorites
													</Link>
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
											<li>
												<a
													onClick={e =>
														this.handleLogout(e)
													}
												>
													<Link>Logout</Link>
												</a>
											</li>
										);
									} else {
										return (
											<li>
												<Login
													handleLogin={
														this.props.handleLogin
													}
												/>
											</li>
										);
									}
								}}
							</AuthConsumer>
							<li>
								<Register
									handleLogin={this.props.handleLogin}
								/>
							</li>
							<li>
								<NavBarFAQ />
							</li>
						</ul>
					</div>
				</nav>
			</ToolbarStyle>
		);
	}
}

export default withRouter(Toolbar);

////////////////////////////////////////////////

const ToolbarStyle = styled.header`
	position: fixed;
	width: 100%;
	background: black;
	height: 90px;
	top: 0;
	left: 0;

	.toolbar__navigation {
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0 2rem;
	}

	.toolbar_navigation-items a {
		color: white;
		text-decoration: none;
	}

	.toolbar_navigation-items ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
	}

	.toolbar_navigation-items li {
		padding: 0 0.75rem;
	}
	/* On screens that are 768px or less*/
	@media screen and (max-width: 768px) {
		.toolbar_navigation-items {
			display: none;
		}
	}

	.spacer {
		flex: 1;
	}

	.toolbar_navigation-items a:hover,
	.toolbar_navigation-items a:active {
		color: papayawhip;
	}

	.toolbar__logo a {
		color: white;
		text-decoration: none;
		font-size: 2rem;
	}
`;
