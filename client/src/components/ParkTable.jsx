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

	renderParkCardList = () => {
		if (this.props.parkList.length > 0) {
			return (
				<ParkCardListStyle>
					<Transition
						native
						items={this.props.parkList}
						keys={item => item.id}
						from={{
							transform: "translate3d(-40px,0,0)",
							opacity: 0
						}}
						enter={{
							transform: "translate3d(0,0px,0)",
							opacity: 1
						}}
						leave={{
							transform: "translate3d(-40px,0,0)",
							opacity: 0
						}}
						//update={[{ opacity: 0.5 }, { opacity: 1 }]}
					>
						{item => props => (
							<animated.div
								className="cardAnimationContainer"
								style={props}
							>
								{this.renderParkCard(item)}
							</animated.div>
						)}
					</Transition>
				</ParkCardListStyle>
			);
			// return <div>{this.props.parkList.map(this.renderParkCard)}</div>;
		} else {
			return (
				<div className="text-center">
					<div className="card text-white bg-danger">
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
			<React.Fragment>
				{this.props.isLoadingParks ? (
					this.renderLoading()
				) : (
					<React.Fragment>{this.renderParkCardList()}</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

export default ParkTable;

///////////////////////////////////////////////////////////////

//OOF
const ParkCardListStyle = styled.div`
	.cardAnimationContainer:nth-of-type(even) .card {
		background-color: ${props => props.theme.cardDark};
	}

	.cardAnimationContainer:nth-of-type(odd) .card {
		background-color: ${props => props.theme.cardLight};
	}
`;
