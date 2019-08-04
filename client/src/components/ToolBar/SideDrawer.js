import React from 'react';
//import './SideDrawer.css';
import styled,{ css }  from 'styled-components';

const sideDrawer = props =>{
let drawerClasses = 'side-drawer';
if(props.show){
    drawerClasses = 'side-drawer open';
}
    return(
		<sideDrawerStyle>
<nav className={drawerClasses}>
    <ul>
					<li>
						<a href="/">Login</a>
					</li>
					<li>
						<a href="/">Register</a>
					</li>
					<li>
						<a href="/">Favorites</a>
					</li>
				</ul>
  
</nav>
</sideDrawerStyle>
);
    };

export default sideDrawer;

//////////////////////////////////////////

const Tab = styled.button`
  width: 100%;
  outline: 0;
  border: 0;
  height: 100%;
  justify-content: center;
  align-items: center;
  line-height: 0.2;

  ${({ active }) => active && `
    background: blue;
  `}
`;