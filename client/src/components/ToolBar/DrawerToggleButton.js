import React from "react";
import hamburgerMenu from "../style/Media/sharp-menu-24px.svg";
import styled from "styled-components";

const drawerToggleButton = props =>(
<Hamburger onClick={props.click}>
<object type="image/svg+xml" data={hamburgerMenu}/>
</Hamburger>
);

export default drawerToggleButton;


////////////////////////////////////////////
const Hamburger = styled.button`
background: transparent;
border: none;
display: block;
cursor: pointer;

margin-right: 2em;

object{
	pointer-events: none;
}

/* On screens that are 768px or more*/
@media screen and (min-width: 768px) {
	display: none;
}
`