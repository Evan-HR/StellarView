import React from 'react';
import styled from 'styled-components';
import Navlinks from './Navlinks';

const NavBarMobile = () => {
    return ( 
        <MobileNav>
            <Navlinks/>
        </MobileNav>
     );
}
 
export default NavBarMobile;

/////////////////////////////////////

const MobileNav = styled.nav`

width: 50vw;
background: ${props => props.theme.primary};
align-self: flex-end;

.nav-links{
    display: flex;
flex-flow: column nowrap;
justify-content: space-evenly;
align-items: center;
height: 60vh;

list-style: none;
}

.link{
color: black;
font-size: 2.5vh;
text-decoration: none;
list-style: none;

}

`