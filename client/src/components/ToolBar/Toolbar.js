import React, { Component } from "react";
import DrawerToggleButton from "./DrawerToggleButton";
import styled from "styled-components";
import { AuthProvider, AuthConsumer } from "../AuthContext";
import { withRouter, Link } from "react-router-dom";
import Login from "../Login";
import axios from "axios";
import Register from "../Register";
import FAQ from "../FAQ";
import logo from "../style/Media/LogoBlueGrey.svg"


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
					
						<a>
						
						<Link to="/">
					
						<img src={logo} alt="Home"/>
				
						</Link>
						</a>
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
								<a>
									<Link to="/faq">FAQ</Link>
								</a>
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
	z-index: 100;

	.toolbar__navigation {
		display: flex;
		align-items: center;
		height: 100%;
		/* padding: 0 9rem; */
		margin-left: 8%;
		margin-right: 6.9%;
		@media screen and (max-width: 768px){
			margin-left: 3%;
		}
		
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
		padding: 0 1rem;
	}
	/* On screens that are 768px or less*/
	@media screen and (max-width: 768px) {
		.toolbar_navigation-items {
			display: none;
			
		}
		.toolbar__navigation{
			padding: 0 0rem;
		}
	}

	.spacer {
		flex: 1;
	}

	.toolbar_navigation-items a:hover,
	.toolbar_navigation-items a:active {
		/* padding-bottom: 2.05em;
		border-bottom: 3px solid ${props => props.theme.gold}; */
		color:  ${props => props.theme.primaryLight};
	}

	.toolbar__logo{
		display: block;
max-width: 100%;
max-height:100%;
:hover{
	-webkit-transform: scale(1.03);
        -ms-transform: scale(1.03);
        transform: scale(1.03);
		transition:all 0.8s ease;
	}


	}


	/* .toolbar__logo a {
		color: white;
		text-decoration: none;
		font-size: 2rem;
	} */
`;
