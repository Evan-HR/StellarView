import React, { Component } from "react";
import styled from "styled-components";

class Footer extends Component {
	render() {
		return (
			<FooterStyle>
				<span className="Copyright">©</span>
				<span className="Vlad">Vlad Falach</span>
				<span className="Dustin">
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="http://dustinjurkaulionis.com"
					>
						Dustin Jurkaulionis
					</a>
				</span>
				<span className="Evan">Evan Reaume</span>
			</FooterStyle>
		);
	}
}

export default Footer;

const FooterStyle = styled.div`
	width: 80%;
	display:grid;
	justify-content: center;
	font-family: Lato;
	align-items: center;
	height: 100px;
	font-weight: 500;
	letter-spacing: 0.2em;
	background-color: ${props => props.theme.prettyDark};
	color: ${props => props.theme.cardLight};
	margin: auto auto;
	font-weight: 400;
	font-size: 11px;
	padding: 0 13px;
	max-width: 600px;

	grid-template-columns: 20px 1fr 1fr 1fr;
	grid-template-areas:
			"Copyright Vlad Dustin Evan";
	.Copyright{
		grid-area: Copyright;
	}
	.Vlad{
		grid-area: Vlad;
	}
	.Dustin{
		grid-area: Dustin;
	}
	.Evan{
		grid-area: Evan;
	}

	a {
		all: unset;
		padding: 0px 4px;
		:hover,
		:active {
			color: ${props => props.theme.highlightPink};
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
