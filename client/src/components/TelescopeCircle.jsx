import React from "react";
import styled from "styled-components";

const TelescopeCircle = props => (
	<TeleStyle>
		<div className="stars">
			<div className="star-six"></div>
			<div className="starround2"></div>
			<div className="starround6"></div>
		</div>

		<div className="stars2">
			<div className="starround2"></div>
			<div className="moon"></div>
		</div>

		<div className="stars3">
			<div className="starround4"></div>
			<div className="starround2"></div>
		</div>

		<div className="stars4">
			<div className="starround2"></div>
			<div className="star-six"></div>
		</div>

		<div className="stars5">
			<div className="starround4"></div>
			<div className="starround2"></div>
		</div>
	</TeleStyle>
);

export default TelescopeCircle;

const TeleStyle = styled.div`
	/* width: 320px;
	height: 320px; */

	/* margin: auto auto; */
	clip-path: circle(50% at 50% 50%);
	background: ${props => props.theme.darkAccent};

	transition: all 500ms ease-in;
	width: 300px;
	height: 300px;
	margin: 40px auto 20px auto;
	overflow: hidden;
	transition: all 500ms ease-in;

	:hover {
		transform: scale(1.06);
		transition: all 1000ms ease-in;
	}

	@media screen and (min-width: 320px) {
	}
	@media screen and (min-width: 420px) {
	}

	@media screen and (min-width: 320px) {
		width: 250px;
		height: 250px;
	}

	@media screen and (min-width: 420px) {
		width: 300px;
		height: 300px;
	}

	.stars {
		position: relative;
		top: 50px;
		left: -50px;
		animation: orbit 20s linear infinite;
	}

	.stars2 {
		position: relative;
		top: 100px;
		left: -50px;
		animation: orbit 50s linear infinite;
	}

	.stars3 {
		position: relative;
		top: 110px;
		left: -50px;
		animation: orbit 15s linear infinite;
	}

	.stars4 {
		position: relative;
		top: 120px;
		left: 300px;
		animation: orbitrev 22s linear infinite;
	}

	.stars5 {
		position: relative;
		top: 31px;
		left: 300px;
		animation: orbitrev 12s linear infinite;
	}

	.star-six {
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-bottom: 9px solid #edd9c0;
		position: absolute;
	}

	.star-six:after {
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 9px solid #edd9c0;
		position: absolute;
		content: "";
		top: 3px;
		left: -5px;
	}

	.moon {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		box-shadow: 3px 3px 0 0 #edd9c0;
	}

	.starround4 {
		background-color: #edd9c0;
		width: 4px;
		height: 4px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		position: relative;
		top: 20px;

		left: 35px;
	}

	.starround2 {
		background-color: #edd9c0;
		width: 2px;
		height: 2px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		position: relative;
		top: 50px;

		left: 105px;
	}

	.starround6 {
		background-color: #edd9c0;
		width: 6px;
		height: 6px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		position: relative;
		top: 50px;
		right: 85px;
	}

	@keyframes orbit {
		50% {
			left: 400px;
			opacity: 0.5;
		}
		51% {
			opacity: 0;
		}
		100% {
			opacity: 0.8;
			left: -100px;
		}
	}

	@keyframes orbitrev {
		50% {
			left: -30px;
			opacity: 0.5;
		}
		51% {
			opacity: 0;
		}
		100% {
			opacity: 0.8;
			left: 300px;
		}
	}
`;
