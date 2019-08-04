import React, { Component } from "react";
import DrawerToggleButton from "./DrawerToggleButton";
import styled from "styled-components";
import { AuthProvider, AuthConsumer } from "../AuthContext";
import { withRouter, Link } from "react-router-dom";
import Login from "../Login";
import axios from "axios";
import Register from "../Register";
import NavBarFAQ from "../NavBarFAQ";

class SideDrawer extends Component {
	state = {};

	render() {
		return (
			<SideDrawerStyle open={this.props.show}>
				<ul>
					<li>
						<a href="/" onClick={this.props.close}>
							Favorites
						</a>
					</li>
					<li>
						<a href="/" onClick={this.props.close}>
							Login
						</a>
					</li>
					<li>
						<a href="/" onClick={this.props.close}>
							Register
						</a>
					</li>
					<li>
						<NavBarFAQ onClick={this.props.close} />
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
	background: white;
	box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: 0;
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
		color: grey;
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
