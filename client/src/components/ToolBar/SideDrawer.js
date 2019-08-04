import React from "react";
//import './SideDrawer.css';
import styled from "styled-components";

const sideDrawer = props => {
	return (
		<SideDrawerStyle open={props.show}>
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
		</SideDrawerStyle>
	);
};

export default sideDrawer;

//////////////////////////////////////////

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
		list-style: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	a {
		color: black;
		text-decoration: none;
		font-size: 1.5rem;
	}

	a:hover,a:active{
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
