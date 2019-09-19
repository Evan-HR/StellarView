import React from "react";
import hamburgerMenu from "../style/Media/sharp-menu-24px.svg";
import styled from "styled-components";

const drawerToggleButton = props => (
	<Hamburger onClick={props.click}>
		<img src={hamburgerMenu} />
	</Hamburger>
);

export default drawerToggleButton;

////////////////////////////////////////////
const Hamburger = styled.button`
	background: transparent;
	border: none;
	display: block;
	cursor: pointer;

	/* margin-right: 1em;
	margin-top: 0.8em; */

	img {
		pointer-events: none;
	}

	/* On screens that are 768px or more*/
	@media screen and (min-width: 600px) {
		display: none;
	}
`;
