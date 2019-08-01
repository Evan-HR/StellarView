//Displays park table
import React, { Component } from "react";
import ParkCard from "./ParkCard";
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

class ParkTable extends Component {
	state = {};
	/* Note - park object is:
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
			if (inRange(moonIllum, 0, 0.125)) {
				moonSVG = newMoon;
			} else if (inRange(moonIllum, 0.125, 0.25)) {
				moonSVG = "Waxing Crescent";
			} else if (inRange(moonIllum, 0.25, 0.375)) {
				moonSVG = waxingCrescent;
			} else if (inRange(moonIllum, 0.375, 0.5)) {
				moonSVG = waxingGibbous;
			} else if (inRange(moonIllum, 0.5, 0.625)) {
				moonSVG = fullMoon;
			} else if (inRange(moonIllum, 0.625, 0.75)) {
				moonSVG = waningGibbous;
			} else if (inRange(moonIllum, 0.75, 0.875)) {
				moonSVG = lastQuarter;
			} else if (inRange(moonIllum, 0.875, 1)) {
				moonSVG = waningCrescent;
			}

			return <MoonStyle src={moonSVG} alt="Moon phase" />;
		}
	}

	renderParkCardList = () => {
		if (this.props.parkList.length > 0) {
			return <div>{this.props.parkList.map(this.renderParkCard)}</div>;
		} else {
			return (
				<div className="text-center">
					<div
						className="card text-white bg-danger mb-3"
						// style={{ "max-width": "18rem" }}
					>
						<div className="card-header">No parks available.</div>
						{/* <div className="card-body">
						<h5 className="card-title">Danger card title</h5>
						<p className="card-text">
							Some quick example text to build on the card title
							and make up the bulk of the card's content.
						</p>
					</div> */}
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

	// renderPark = park => (
	// 	<tr>
	// 		<td>{park.name_alt}</td>
	// 		<td>{park.light_pol}</td>
	// 		<td>{park.distance}</td>
	// 		<td>{park.clouds}</td>
	// 		<td>{park.cloudDesc}</td>
	// 		<td>{park.humidity}</td>
	// 		<td>{this.props.moon}</td>
	// 		<td>{this.props.moonType}</td>
	// 	</tr>
	// );

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
