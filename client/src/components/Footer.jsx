import React, { Component } from "react";
import styled from "styled-components";

class Footer extends Component {
	render() {
		return (
			<FooterStyle>
				© Vlad Falach {" | "} 
				<a target="_blank" rel="noopener noreferrer" href="http://dustinjurkaulionis.com">
					Dustin Jurkaulionis
				</a>{" | "}
				 Evan Reaume
			</FooterStyle>
		);
	}
}

export default Footer;

const FooterStyle = styled.div`
	width: 80%;
	display: flex;
	/* margin-top: 20px; */
	justify-content: center;
	font-family: Lato;
	align-items: center;
	padding: 30px 10px 15px 10px;
	height: 100px;
	/* font-family: monospace; */
	font-weight: 500;
	font-size: 14px;
	letter-spacing: 0.2em;
	background-color: ${props => props.theme.prettyDark};
	color: ${props => props.theme.cardLight};
	margin: auto auto;
	font-weight: 400;
	font-size: 11px;

	a {
		all: unset;
		padding: 0px 4px;
		:hover,
		:active {
			color: ${props => props.theme.colorBad};
			transition: color 0.2s ease;
			cursor: pointer;
		}
	}

	@media screen and (min-width: 320px) {
		font-size: 11px;
	}

	@media screen and (min-width: 420px) {
		font-size: 12px;
	}

	@media screen and (min-width: 600px) {
		font-size: 12px;
	}
`;
