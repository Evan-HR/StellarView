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
		e.preventDefault();
		axios.get("/logout");
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
														favorites
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
													<Link
														onClick={e =>
															this.handleLogout(e)
														}
													>
														logout
													</Link>
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
									<Link to="/faq">faq</Link>
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
		position: absolute;
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
		font-family: IBM Plex Sans;
		font-weight:600;
		text-decoration: none;
		letter-spacing:0.08em;
		transition: color 0.2s ease;
		color: whitesmoke;
		
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
		font-family: IBM Plex Sans;
		.Stellar{
			font-weight: 600;
		}
		.Gaze{
			font-weight: 300;
		}
		/* text-transform: uppercase;
		font-weight: 400;
		font-size: 70px;
		text-shadow: 4px 5px #e6e6d8, 6px 7px #c6a39a; */
		/* transform: matrix(1, -0.05, 0, 1, 0, 0); */
		:hover{
			.logo_A {
				transition: color 1.0s ease;
				color: ${props => props.theme.gold2};
			}
			.logo_tele{		
				transform: rotate(-5deg);
				transition: transform 1s;
			}
		}

		.logo_A{
			transition: color 1.0s ease;
			color: ${props => props.theme.franRed};
		}

		.logo_tele{
			/* transform: translate(-505%,-120%); */
			transform: rotate(5deg);
			transition: transform 1s;
			position: absolute;
			margin-left: -121px;
			margin-top: -10px;			
		}
	}

	.Link{
		text-decoration:none;
	}

	.toolbar__logo a{
		text-decoration: none;
		color: whitesmoke;
	}
`;
