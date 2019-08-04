import React from 'react';
import styled from 'styled-components';
import Navlinks from './Navlinks';
import hamburgerMenu from "./style/Media/sharp-menu-24px.svg";

const NavBarDesktop = () => {
	return (
		<DesktopNav>
			<div className="logo">stellarview</div>
			<Navlinks />
			<Hamburger>
				<svg src={hamburgerMenu} alt="Menu" />
			</Hamburger>
		</DesktopNav>
	);
};

export default NavBarDesktop;

// recall, flex A flex container expands items to fill
// available free space, or shrinks them to prevent overflow.
//vh 15% height means 15% of the viewport's height
// font-family: 'Open Sans', sans-serif;
// font-family: 'Merriweather Sans', sans-serif;
// font-family: 'IBM Plex Mono', monospace;
// font-family: 'IBM Plex Sans', sans-serif;
//'Yeseva One', cursive;
//font-family: 'Barlow', sans-serif;

///////////////////////////////////////
const DesktopNav = styled.nav`
display: flex;
flex-flow: row nowrap;
justify-content: space-evenly;
align-items: center;
/* background: ${props => props.theme.background2}; */


height: 15vh;

box-shadow: 0 10px 0 ${props => props.theme.primaryDark};

.logo{
    color: #2b3757;
    font-size: 4vh;
}

.nav-links{
    display: flex;
flex-flow: row nowrap;
justify-content: space-evenly;
align-items: center;
width: 35vw;

list-style: none;

/* On screens that are 768px or less*/
@media screen and (max-width: 768px) {
    display: none;
}
}

.link{
color: black;
font-size: 2.5vh;
text-decoration: none;

}


`;

const Hamburger = styled.button`
	background: transparent;
	height: 6vh;
	width: 6vh;
	border: none;
	display: none;

	/* On screens that are 768px or less*/
	@media screen and (max-width: 768px) {
		display: block;
	}
`;
