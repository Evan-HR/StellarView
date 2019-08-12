//Displays park table
import React, { Component } from "react";
import ParkCard from "./ParkCard";
import styled from "styled-components";
import { Transition, animated } from "react-spring/renderprops";
import newMoon from "./style/Media/Moon/moon-phase-new.svg";
import waxingCrescent from "./style/Media/Moon/moon-phase-waxingcrescent.svg";
import firstQuarter from "./style/Media/Moon/moon-phase-firstquarter.svg";
import waxingGibbous from "./style/Media/Moon/moon-phase-waxinggibbous.svg";
import fullMoon from "./style/Media/Moon/moon-phase-full.svg";
import waningGibbous from "./style/Media/Moon/moon-phase-waninggibbous.svg";
import lastQuarter from "./style/Media/Moon/moon-phase-lastquarter.svg";
import waningCrescent from "./style/Media/Moon/moon-phase-waningcrescent.svg";

class ParkTable extends Component {
	state = {};
	/* Note [OUT OF DATE] - park object is:
        {
       { id: 6817,
[0]     osm_id: 217500775,
[0]     name: 'Unknown',
[0]     name_alt: 'Maple Avenue',
[0]     light_pol: 1.84691197,
[0]     lat: 43.19786151,
[0]     lng: -80.10863081,
[0]     distance: 20.26280157312762,
[0]     clouds: 90,
[0]     humidity: 72,
[0]     city: 'St. George' } ]
        }
    */

	constructor(props) {
		super(props);
		this.isAnimating = {};
	}

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

			moonDataString = `The moon is ${moonType}, meaning it is ${moonIllum}% illuminated.`;
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

	renderParkCardList = () => {
		if (this.props.parkList.length > 0) {
			return (
				<Transition
					native
					items={this.props.parkList}
					keys={item => item.id}
					from={{ transform: "translate3d(-40px,0,0)", opacity: 0 }}
					enter={{ transform: "translate3d(0,0px,0)", opacity: 1 }}
					leave={{ transform: "translate3d(-40px,0,0)", opacity: 0 }}
					//update={[{ opacity: 0.5 }, { opacity: 1 }]}
				>
					{item => props => (
						<animated.div style={props}>
							{this.renderParkCard(item)}
						</animated.div>
					)}
				</Transition>
			);
			// return <div>{this.props.parkList.map(this.renderParkCard)}</div>;
		} else {
			return (
				<div className="text-center">
					<div className="card text-white bg-danger mb-3">
						<div className="card-header">No parks available.</div>
					</div>
				</div>
			);
		}
	};

	renderParkCard = park => {
		return (
			<ParkCard
				park={park}
				moon={this.props.moon}
				handleMouseOver={this.handleCardMouseOver}
				handleMouseClick={this.handleCardMouseClick}
			/>
		);
	};

	handleCardMouseOver = parkID => {
		if (!this.isAnimating[parkID]) {
			this.isAnimating[parkID] = true;
			this.props.markers[parkID].setAnimation(
				window.google.maps.Animation.BOUNCE
			);
			setTimeout(() => {
				this.props.markers[parkID].setAnimation(null);
				delete this.isAnimating[parkID];
			}, 675);
		}
	};

	handleCardMouseClick = parkID => {
		this.props.googleMap.panTo(this.props.markers[parkID].position);
		this.props.googleMap.setZoom(10);
		window.google.maps.event.trigger(this.props.markers[parkID], "click");
	};

	renderParkTable = () => {
		if (this.props.parkList.length > 0) {
			return this.props.parkList.map(this.renderPark);
		} else {
			return (
				<tr>
					<td colSpan={3}>
						<strong style={{ color: "red" }}>
							No parks available.
						</strong>
					</td>
				</tr>
			);
		}
	};

	renderLoading = () => {
		return (
			<div
				class="spinner-grow text-primary"
				style={{ width: "3rem", height: "3rem" }}
			/>
		);
	};

	render() {
		console.log("ParkTable - rendered");
		return (
			<div className="border border-primary">
				{this.props.isLoadingParks ? (
					this.renderLoading()
				) : (
					<React.Fragment>
						{this.renderMoonData()}
						{this.renderParkCardList()}
					</React.Fragment>
				)}
			</div>
		);
	}
}

export default ParkTable;

///////////////////////////////////////////////////////////////

const MoonStyle = styled.img`
	padding-top: 15px;
	padding-bottom: 15px;
`;
