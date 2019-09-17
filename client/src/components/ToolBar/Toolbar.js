import React, { Component } from "react";
import DrawerToggleButton from "./DrawerToggleButton";
import styled from "styled-components";
import { AuthProvider, AuthConsumer } from "../AuthContext";
import { withRouter, Link } from "react-router-dom";
import Login from "../Login";
import axios from "axios";
import Register from "../Register";
import FAQ from "../FAQ";
// import logo from "../style/Media/LogoBlueGrey.svg";
// import logo2 from "../style/Media/telescopeLogo2.svg";

class Toolbar extends Component {
	state = {};

	handleLogout(e) {
		console.log("Loggin out...");
		e.preventDefault();
		axios.get("/api/logout");
		this.props.handleLogoutState();
	}

	render() {
		return (
			<ToolbarStyle>
				<div className="toolbar__center">
					<nav className="toolbar__navigation">
						<div>
							<DrawerToggleButton
								click={this.props.drawerClickHandler}
							/>
						</div>

						<div className="toolbar__logo">
							<Link to="/home">
								<span className="Stellar">STELLAR</span>
								<span className="Gaze">GAZE</span>
							</Link>
						</div>
						<div className="spacer" />
						<div className="toolbar_navigation-items">
							<ul>
								<AuthConsumer>
									{x => {
										if (x.isAuth === true) {
											return (
												<li>
													<Link to="/profile">
														<div className="toolbarLink">
															FAVORITES
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
														className="toolbarLink"
														onClick={e =>
															this.handleLogout(e)
														}
													>
														LOGOUT
													</div>
												</li>
											);
										} else {
											return (
												<li>
													<Login
														handleLogin={
															this.props
																.handleLogin
														}
													>
														<div className="toolbarLink">
															LOGIN
														</div>
													</Login>
												</li>
											);
										}
									}}
								</AuthConsumer>
								<li>
									<Register
										handleLogin={this.props.handleLogin}
									>
										<div className="toolbarLink">
											REGISTER
										</div>
									</Register>
								</li>
								<li>
									<Link to="/faq">
										<div className="toolbarLink">FAQ</div>
									</Link>
								</li>
							</ul>
						</div>
					</nav>
				</div>
			</ToolbarStyle>
		);
	}
}

export default withRouter(Toolbar);

////////////////////////////////////////////////

const ToolbarStyle = styled.header`
	width: 100%;
	/* background: ${props => props.theme.darkBlue3}; */
	height: 120px;
	top: 0;
	left: 0;
	/* z-index: 100; */
	
	@media screen and (max-width: 767.999px) {
		
	}

	.toolbar__center{
		display: block;
		width:85%;
		height: 100%;
		margin: 0 auto 0 auto;
		@media screen and (max-width: 767.999px) {
			width: 95%;
		}
	}

	.toolbar__navigation {
		display: flex;
		align-items: center;
		height: 100%;
		bottom: 0;
		/* border-bottom: 2px solid #7C6E7E; */
	}

	.toolbar_navigation-items{
		margin-top: 1%;
	}


	.toolbar_navigation-items a {
		/* font-family: IBM Plex Sans; */
		font-family: 'Lato', sans-serif;
		font-weight:600;
		text-decoration: none;
		letter-spacing:0.08em;
		transition: color 0.2s ease;
		color: ${props => props.theme.white};
	}

	.toolbar_navigation-items ul {
		text-transform: uppercase;
		list-style: none;
		padding: 0;
		display: flex;	
	}

	.toolbar_navigation-items li {
		padding: 0 0.5rem;
	}

	.toolbar_navigation-items li:last-child {
		padding: 0 0 0 0.5rem;
	}

	/* On screens that are 768px or less*/
	@media screen and (max-width: 767.999px) {
		.toolbar_navigation-items {
			display: none;
			height: 60px;
		}
		height: 60px;
		.toolbar__logo{
			padding-top: 10px;
			a{
				font-size: 50px;
			}
		}
	}

	@media screen and (min-width: 769px) and (max-width: 1300px) {
		.toolbar__center{
			width: 90%;
		}
	}

	.spacer {
		flex: 1;
	}

	.toolbar_navigation-items a:hover,
	.toolbar_navigation-items a:active {
		/* padding-bottom: 2.05em;
		border-bottom: 3px solid ${props => props.theme.gold}; */
		transition: color 0.2s ease;
  		color: ${props => props.theme.colorBad};		
	}

	.toolbar__logo{	
		font-weight: 400;
		font-size: 60px;
		font-family: 'Lato', sans-serif;
		.Stellar{
			font-weight: 600;
		}
		.Gaze{
			font-weight: 300;
		}
		
	}

	.Link{
		text-decoration:none;
	}

	.toolbar__logo a{
		text-decoration: none;
		color: ${props => props.theme.white};
	}
	
	.toolbarLink {
		cursor: pointer;
		font-family: 'Lato', sans-serif;
		font-weight:600;
		text-decoration: none;
		letter-spacing:0.08em;
		transition: color 0.2s ease;
		color: ${props => props.theme.white};
	}

	.toolbarLink:hover, .toolbarLink:active {
		transition: color 0.2s ease;
  		color: ${props => props.theme.colorBad};
	}

`;
