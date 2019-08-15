import React, { Component } from "react";
import styled from "styled-components";

//moon images, in proper order
import newMoon from "./style/Media/Moon/moon-phase-new.svg";
import waxingCrescent from "./style/Media/Moon/moon-phase-waxingcrescent.svg";
import firstQuarter from "./style/Media/Moon/moon-phase-firstquarter.svg";
import waxingGibbous from "./style/Media/Moon/moon-phase-waxinggibbous.svg";
import fullMoon from "./style/Media/Moon/moon-phase-full.svg";
import waningGibbous from "./style/Media/Moon/moon-phase-waninggibbous.svg";
import lastQuarter from "./style/Media/Moon/moon-phase-lastquarter.svg";
import waningCrescent from "./style/Media/Moon/moon-phase-waningcrescent.svg";

class Moon extends Component {
	state = {};
	renderMoonData() {
		function inRange(x, min, max) {
			return (x - min) * (x - max) <= 0;
		}

		if (this.props.parkList.length > 0) {
			var moonDataString = "";
			var moonIllum = this.props.moon;
			moonIllum = Math.round(moonIllum * 100) / 100;
			var moonType = this.props.moonType;
			var moonSVG;

			// moonDataString = `The moon is ${moonType}, meaning it is ${moonIllum}% illuminated.`;
			// console.log("IN MOON.JSX:" ,moonDataString)
			//8 phases, 0/1 is peak new moon and 0.5 is full moon, so:
			//Length of phase => 1/8= 0.125
			//New moon start => 0-(0.125/2)=-0.0625 >> 0.9375
			//New moon end => 0+0.0625 >> 0.0625
			//etc...
			if (
				inRange(moonIllum, 0.9375, 1) ||
				inRange(moonIllum, 0, 0.0625)
			) {
				moonSVG = newMoon;
			} else if (inRange(moonIllum, 0.0625, 0.1875)) {
				moonSVG = waxingCrescent;
			} else if (inRange(moonIllum, 0.1875, 0.3125)) {
				moonSVG = firstQuarter;
			} else if (inRange(moonIllum, 0.3125, 0.4375)) {
				moonSVG = waxingGibbous;
			} else if (inRange(moonIllum, 0.4375, 0.5625)) {
				moonSVG = fullMoon;
			} else if (inRange(moonIllum, 0.5625, 0.6875)) {
				moonSVG = waningGibbous;
			} else if (inRange(moonIllum, 0.6875, 0.8125)) {
				moonSVG = lastQuarter;
			} else if (inRange(moonIllum, 0.8125, 0.9375)) {
				moonSVG = waningCrescent;
			} else {
				console.console.warn("Moon value error");
				moonSVG = newMoon;
			}

			return <MoonStyle src={moonSVG} alt="Moon phase" />;
		}
	}

	render() {
		return (
			<div>
				{this.renderMoonData()}

				{this.props.moonType}
			</div>
		);
	}
}

export default Moon;
///////////////////////////////////////////////////////////////

const MoonStyle = styled.img`
	padding-top: 15px;
	padding-bottom: 15px;
`;
