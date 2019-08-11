import React, { Component } from "react";
import DrawerToggleButton from "./DrawerToggleButton";
import styled from "styled-components";
import { AuthProvider, AuthConsumer } from "../AuthContext";
import { withRouter, Link } from "react-router-dom";
import Login from "../Login";
import axios from "axios";
import Register from "../Register";
import FAQ from "../FAQ";
import logo from "../style/Media/LogoBlueGrey.svg";
import logo2 from "../style/Media/telescopeLogo2.svg";

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
							<Link to="/">
								STELL<span className="logo_A">A</span>RGAZE
								<img
									className="logo_tele"
									src={logo2}
									alt="Home"
								/>
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
	position: fixed;
	width: 100%;
	background: black;
	height: 100px;
	top: 0;
	left: 0;
	z-index: 100;
	
	@media screen and (max-width: 767.999px){
		position: absolute;
		}



	.toolbar__center{
		display: block;
		width:85%;
		height: 100%;
		margin: 0 auto 0 auto;
		
		@media screen and (max-width: 767.999px){
		width: 95%;
		}
	}

	.toolbar__navigation {
		display: flex;
		align-items: center;
		height: 100%;
		border-bottom: 2px solid #7C6E7E;

		
	}

	.toolbar_navigation-items a {
		color: white;
		
		text-decoration: none;
		letter-spacing:0.15em;
		transition: color 0.2s ease;
  		color: white;
	}

	.toolbar_navigation-items ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
	}


	.toolbar_navigation-items li {
		padding: 0 0.5rem;
	}

	.toolbar_navigation-items li:last-child {padding: 0 0 0 0.5rem;}
	/* On screens that are 768px or less*/

	
	@media screen and (max-width: 767.999px) {
		.toolbar_navigation-items {
			display: none;


			
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
  		color: ${props => props.theme.primaryLight};
		
	}

	.toolbar__logo{
		
		color: #d7ceb2;
		font-size: 40px;
		letter-spacing:0.2em;
		display: block;
		margin-top: 6px;
max-width: 100%;
max-height:100%;


:hover{

		.logo_A {
			transition: color 1.0s ease;
  color: ${props => props.theme.gold};
		}

		.logo_tele{
			
			transform: rotate(-5deg);
			
			transition: transform 1s;
		}
	}

	.logo_A{
		transition: color 1.0s ease;
  color: ${props => props.theme.secondaryDark2};
		
	}

	.logo_tele{
		/* transform: translate(-505%,-120%); */
					transform: rotate(5deg);
			
			transition: transform 1s;
			position: absolute;
    margin-left: -201px;
    margin-top: -2px;
		
	}


	}

	.Link{
		text-decoration:none;
		color: white;
	}

	.toolbar__logo a{
		text-decoration: none;
		color:white;
	}






`;
