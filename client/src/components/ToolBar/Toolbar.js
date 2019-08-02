import React from "react";
import "./Toolbar.css";
import hamburgerMenu from "../style/Media/sharp-menu-24px.svg";
import styled from "styled-components";

const toolbar = props => (
	<header className="toolbar">
		<nav className="toolbar__navigation">
			<Hamburger>
				<img src={hamburgerMenu} alt="Menu" />
			</Hamburger>
			<div className="toolbar__logo">
				<a href="/">STELLARVIEW</a>
			</div>
			<div className="spacer" />
			<div className="toolbar_navigation-items">
				<ul>
					<li>
						<a href="/">Login</a>
					</li>
					<li>
						<a href="/">Products</a>
					</li>
					<li>
						<a href="/">Users</a>
					</li>
				</ul>
			</div>
		</nav>
	</header>
);

export default toolbar;

/////////////////////////////////////////////////////
const Hamburger = styled.button`
	background: none;
	height: 6vh;
	width: 6vh;
	border: none;
	display: block;

	/* On screens that are 768px or less*/
	@media screen and (max-width: 768px) {
		display: block;
	}
`;
