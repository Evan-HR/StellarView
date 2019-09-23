import React from "react";
import styled from "styled-components";

const TelescopeCircle = props => (
	<TeleStyle>
		<div className="circle">
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
		</div>
	</TeleStyle>
);

export default TelescopeCircle;

const TeleStyle = styled.div`
	width: 250px;
	height: 250px;
	border-top-left-radius: 50%;
	border-top-right-radius: 50%;
	border-bottom-left-radius: 50%;
	border-bottom-right-radius: 50%;
	margin: 40px auto;
	z-index: 2;
	overflow: hidden;
	@media screen and (min-width: 420px) {
		width: 300px;
		height: 300px;
	}

	.circle {
		width: 300px;
		height: 300px;
		margin: auto auto;
		background: ${props => props.theme.darkAccent};
		/* border-top-left-radius: 50%;
border-top-right-radius: 50%;
border-bottom-left-radius: 50%;
border-bottom-right-radius: 50%; */
		/* moz-border-radius: 50%; */

		transition: all 500ms ease-in;
		z-index: 0;

		@media screen and (min-width: 320px) {
			width: 250px;
			height: 250px;
		}

		@media screen and (min-width: 420px) {
			width: 300px;
			height: 300px;
		}
	}

	.stars {
		position: relative;
		top: 50px;
		left: -50px;
		animation: orbit 20s linear infinite;
		z-index: 0;
	}

	.stars2 {
		position: relative;
		top: 100px;
		left: -50px;
		animation: orbit 50s linear infinite;
		z-index: 0;
	}

	.stars3 {
		position: relative;
		top: 110px;
		left: -50px;
		animation: orbit 15s linear infinite;
		z-index: 0;
	}

	.stars4 {
		position: relative;
		top: 120px;
		left: 300px;
		animation: orbitrev 22s linear infinite;
		z-index: 0;
	}

	.stars5 {
		position: relative;
		top: 31px;
		left: 300px;
		animation: orbitrev 12s linear infinite;
		z-index: 0;
	}

	.star-six {
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-bottom: 9px solid #edd9c0;
		position: absolute;
		z-index: 0;
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
		z-index: 0;
	}

	.moon {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		box-shadow: 3px 3px 0 0 #edd9c0;
		z-index: 0;
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
		z-index: 0;
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
		z-index: 0;
		left: 105px;
	}

	.starround6 {
		background-color: #edd9c0;
		width: 6px;
		height: 6px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		z-index: 0;
		border-radius: 5px;
		position: relative;
		top: 50px;
		right: 85px;
	}

	.circle:hover {
		transform: scale(1.06);
		transition: all 1000ms ease-in;
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
