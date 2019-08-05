import React, { Component } from "react";
import DrawerToggleButton from "./DrawerToggleButton";
import styled from "styled-components";
import { AuthProvider, AuthConsumer } from "../AuthContext";
import { withRouter, Link } from "react-router-dom";
import Login from "../Login";
import axios from "axios";
import Register from "../Register";
import FAQ from "../FAQ";

class SideDrawer extends Component {
	state = {};
	handleLogout(e) {
		e.preventDefault();
		axios.get("/logout");
		this.props.handleLogoutState();
	}

	render() {
		return (
			<SideDrawerStyle open={this.props.show}>
				<ul>
					<AuthConsumer>
						{x => {
							if (x.isAuth === true) {
								return (
									<li>
										<a onClick={this.props.close}>
											<Link to="/profile">Favorites</Link>
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
										<a onClick={e => this.handleLogout(e)}>
											<Link>Logout</Link>
										</a>
									</li>
								);
							} else {
								return (
									<li>
										<a onClick={this.props.close}>
											<Login
												onClick={this.props.close}
												handleLogin={
													this.props.handleLogin
												}
											/>
										</a>
									</li>
								);
							}
						}}
					</AuthConsumer>
					<li>
						<a onClick={this.props.close}>
							<Register
								onClick={this.props.close}
								handleLogin={this.props.handleLogin}
							/>
						</a>
					</li>
					<li>
						<a onClick={this.props.close}>
						<Link to="/faq">FAQ</Link>
						</a>
					</li>
				</ul>
			</SideDrawerStyle>
		);
	}
}

export default SideDrawer;

/////////////////////////////////////////////////////

const SideDrawerStyle = styled.nav`
	height: 100%;
	background: ${props => props.theme.background3};
	box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: -10px;
	width: 70%;
	max-width: 400px;
	z-index: 8;
	transform: translateX(-100%);
	transition: transform 0.3s ease-out;

	ul {
		height: 100%;
		padding-left: 15%;
		list-style: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: left;
	}

	a {
		color: black;
		text-decoration: none;
		font-size: 1.5rem;
	}

	a:hover,
	a:active {
		color: ${props => props.theme.primaryLight};
	}

	li {
		margin: 0.5rem 0;
	}

	${({ open }) =>
		open &&
		`
    transform: translateX(0);
  `}
`;
