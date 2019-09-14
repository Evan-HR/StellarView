import React, { useState, Component } from "react";
import styled from "styled-components";
import MoonDisplay from "./MoonDisplay";
import { useSpring, animated as a } from "react-spring";

function Moon(props) {
	const springStyle = useSpring({ opacity: props.moonPhase ? 1 : 0 });

	return (
		<a.div style={springStyle}>
			<MoonStyle>
				{props.moonPhase ? (
					<React.Fragment>
						<div className="moonDisplay">
							<span>{props.moonType.split(" ")[0]}</span>
							<span className="MoonDisplayContainer">
								<MoonDisplay phase={props.moonPhase} />
							</span>
							<span>{props.moonType.split(" ")[1]}</span>
						</div>
						<div className="stellarDataDisplay">
							<span className="Nightfall">Nightfall at</span>
							{new Date(props.stellarData.night).toLocaleString()}
						</div>
					</React.Fragment>
				) : (
					""
				)}
			</MoonStyle>
		</a.div>
	);
}

export default Moon;
///////////////////////////////////////////////////////////////
const MoonStyle = styled.div`
	color: ${props => props.theme.white};
	/* font-family: IBM Plex Sans; */
	font-family: "Lato", sans-serif;
	font-weight: 600;
	font-style: normal;
	font-size: 40px;
	text-align: center;
	text-transform: uppercase;

	.stellarDataDisplay{
		font-weight: 300;
    font-family: monospace;
    font-size: 18px;
	padding: 15px 10px 20px 10px;
	margin-bottom: 10px;
	text-transform: none;
	.Nightfall{
		/* font-family: "Lato", sans-serif; */
		padding-right: 12px;
		font-weight: 400;
		color: ${props => props.theme.yellow};
	}
	}
	.moonDisplay {
		height: 140px;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		align-content: space-between;

		.MoonDisplayContainer {
			border-radius: 100px;
			box-shadow: 0 0 20px #485261;
			width: 90px;
		}
	}
`;
