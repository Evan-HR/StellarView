import React from 'react';
import './SideDrawer.css';

const sideDrawer = props =>{
let drawerClasses = 'side-drawer';
if(props.show){
    drawerClasses = 'side-drawer open';
}
    return(
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
);
    };

export default sideDrawer;