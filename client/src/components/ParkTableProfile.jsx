//Displays park table
import React, { Component } from "react";
import ParkCard from "./ParkCard";
import ParkMapModal from "./ParkMapModal";

class ParkTableProfile extends Component {
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
		this.parkModalChild = React.createRef();
	}

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

	// renderMoonData() {
	// 	if (this.props.parkList.length > 0) {
	// 		var moonDataString = "";
	// 		var moonIllum = this.props.moon;
	// 		var moonType = this.props.moonType;
	// 		moonDataString = `The moon is ${moonType}, meaning it is ${moonIllum}% illuminated.`;

	// 		return moonDataString;
	// 	}
	// }

	renderPark = park => {
		return (
			<ParkCard
				park={park}
				handleMouseClick={this.handleCardMouseClick}
			/>
		);
	};

	handleCardMouseClick = parkID => {
		for (var i = 0; i < this.props.parkList.length; i++) {
			if (this.props.parkList[i].id === parkID) {
				let content = {
					park: this.props.parkList[i],
					moon: this.props.moonPhase,
					moonType: this.props.moonType
				};
				this.parkModalChild.current.openModal(content);
			}
		}
	};

	render() {
		console.log("ParkTable - rendered");
		return (
			<React.Fragment>
				<div className="border border-primary">
					{this.renderParkTable()}
				</div>
				<ParkMapModal ref={this.parkModalChild} />
			</React.Fragment>
		);
	}
}

export default ParkTableProfile;
