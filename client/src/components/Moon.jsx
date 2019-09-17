import React, { useState, Component } from "react";
import styled from "styled-components";
import MoonDisplay from "./MoonDisplay";
import { useSpring, animated as a } from "react-spring";

function Moon(props) {
	const springStyle = useSpring({ opacity: props.moonPhase ? 1 : 0 });

	function prettyDate(time) {
		var date = new Date(time);
		var localeSpecificTime = date.toLocaleTimeString();
		return localeSpecificTime.replace(/:\d+ /, " ");
	}

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
							<span className="Sunset">Sunset</span>
							<span className="SunsetTime">
								{prettyDate(props.stellarData.sunset)}

								{/* {new Date(
								props.stellarData.sunset
							).toLocaleTimeString()} */}
							</span>

							<span className="Nightfall">Nightfall</span>
							<span className="NightfallTime">
								{prettyDate(props.stellarData.night)}
							</span>

							<span className="Moonrise">Moonrise</span>
							<span className="MoonriseTime">
								{prettyDate(props.stellarData.moonrise)}
							</span>

							<span className="Moonset">Moonset</span>
							<span className="MoonsetTime">
								{prettyDate(props.stellarData.moonset)}
							</span>
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
	font-size: 35px;
	text-align: center;
	text-transform: uppercase;

	@media screen and (max-width: 569px) {
		font-size: 23px;
	}

	.stellarDataDisplay {

		font-weight: 300;
		font-size: 16px;
		padding: 15px 10px 20px 10px;
		margin-bottom: 10px;
		text-transform: none;
		display: grid;

		grid-template-columns: 1fr 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		grid-gap: 0px;
		grid-template-areas:
			"Sunset    Nightfall    Moonrise Moonset"
			"SunsetTime NightfallTime MoonriseTime  MoonsetTime";
		

		.Nightfall {
			/* font-family: "Lato", sans-serif; */
			grid-area: Nightfall;
			font-weight: 400;
			color: ${props => props.theme.yellow};
		}

		.NightfallTime {
			grid-area: NightfallTime;
		}
		.Moonrise {
			/* font-family: "Lato", sans-serif; */
			grid-area: Moonrise;
			font-weight: 400;
			color: ${props => props.theme.yellow};
		}
		.MoonriseTime {
			grid-area: MoonriseTime;
		}
		.Moonset {
			/* font-family: "Lato", sans-serif; */
			grid-area: Moonset;
			font-weight: 400;
			color: ${props => props.theme.yellow};
		}

		.MoonsetTime {
			grid-area: MoonsetTime;
		}
		.Sunset {
			/* font-family: "Lato", sans-serif; */
			grid-area: Sunset;

			font-weight: 400;
			color: ${props => props.theme.yellow};
		}

		.SunsetTime {
			grid-area: SunsetTime;
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
