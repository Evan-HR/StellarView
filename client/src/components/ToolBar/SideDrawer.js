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
		axios.get("/api/logout");
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
										<Link
											to="/profile"
											onClick={this.props.close}
											style={{ textDecoration: "none" }}
										>
											<div className="sidebarLink">
												Favorites
											</div>
										</Link>
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
										<div
											className="sidebarLink"
											onClick={e => {
												this.handleLogout(e);
												this.props.close();
											}}
										>
											Logout
										</div>
									</li>
								);
							} else {
								return (
									<li>
										<div
											className="sidebarLink"
											onClick={this.props.close}
										>
											<Login
												handleLogin={
													this.props.handleLogin
												}
											/>
										</div>
									</li>
								);
							}
						}}
					</AuthConsumer>
					<li>
						<div className="sidebarLink" onClick={this.props.close}>
							<Register handleLogin={this.props.handleLogin} />
						</div>
					</li>
					<li>
						<Link
							to="/faq"
							onClick={this.props.close}
							style={{ textDecoration: "none" }}
						>
							<div className="sidebarLink">FAQ</div>
						</Link>
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
	background: ${props => props.theme.white};
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

	.sidebarLink {
		cursor: pointer;
		color: ${props => props.theme.prettyDark};;
		transition: color 0.2s ease;
		text-decoration: none;
		font-size: 1.5rem;
		display: block;

		:hover,:active {
		color: ${props => props.theme.colorBad};
		transition: color 0.2s ease;
	}
	}



	li {
		margin: 0.5rem 0;
	}

	${({ open }) => open && `transform: translateX(0);`}
`;
