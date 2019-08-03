import React from "react";
import "./Toolbar.css";
import DrawerToggleButton from "./DrawerToggleButton";
import styled from "styled-components";


const toolbar = props => (
	<header className="toolbar">
		<nav className="toolbar__navigation">
			<div>
				<DrawerToggleButton click={props.drawerClickHandler}/>
			</div>
			<div className="toolbar__logo">
				<a href="/">STELLARGAZE</a>
			</div>
			<div className="spacer" />
			<div className="toolbar_navigation-items">
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
			</div>
		</nav>
	</header>
);

export default toolbar;

