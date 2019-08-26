import React, { Component } from "react";
import styled from "styled-components";
import MoonDisplay from "./MoonDisplay";

//moon images, in proper order
import newMoon from "./style/Media/Moon/moon-phase-new.svg";
import waxingCrescent from "./style/Media/Moon/moon-phase-waxingcrescent.svg";
import firstQuarter from "./style/Media/Moon/moon-phase-firstquarter.svg";
import waxingGibbous from "./style/Media/Moon/moon-phase-waxinggibbous.svg";
import fullMoon from "./style/Media/Moon/moon-phase-full.svg";
import waningGibbous from "./style/Media/Moon/moon-phase-waninggibbous.svg";
import lastQuarter from "./style/Media/Moon/moon-phase-lastquarter.svg";
import waningCrescent from "./style/Media/Moon/moon-phase-waningcrescent.svg";
import testMoon from "./style/Media/Moon/untitled.svg";
class Moon extends Component {
	state = {};

	render() {
		return (
			<MoonStyle>
				<div className="moonDisplay">
					<span>{this.props.moonType.split(" ")[0]}</span>
					<span className="MoonDisplayContainer">
						<MoonDisplay phase={this.props.moon} />
					</span>
					<span>{this.props.moonType.split(" ")[1]}</span>
				</div>
			</MoonStyle>
		);
	}
}

export default Moon;
///////////////////////////////////////////////////////////////
const MoonStyle = styled.div`
	color: whitesmoke;
	font-family: IBM Plex Sans;
	font-weight: 300;
	font-style: normal;
	font-size: 30px;
	text-align: center;
	text-transform: uppercase;

	.moonDisplay {
		height: 120px;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		align-content: space-between;

		.MoonDisplayContainer {
			width: 90px;
		}
	}
`;
