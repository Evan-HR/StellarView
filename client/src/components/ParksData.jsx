//Store parks state and handle display
import React, { Component } from "react";
import ParkForm from "./ParkForm";
import ParkTable from "./ParkTable";
import ParkMap from "./ParkMap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

class BaseParksData extends Component {
	state = {
		parks: [],
		fetchReq: [],
		moon: "",
		moonType: "",
		isMapLoaded: false,
		isFetchingParks: false,
		showForm: true
	};
	/* Note - park object is:
        {
            distance: number,
            id: number,
            lat: number,
            lng: number,
            light_pol: number,
            name: string,
            osmid: number,
        }
    */
	constructor(props) {
		super(props);
		this.googleMap = false;
		//I don't think markers should go in the state because, like googleMap,
		// They're referenced in odd places and may update at weird times from the rest of doms
		// Since they're google map things
		this.markers = {};
	}

	handleMapLoaded = googleMapActual => {
		this.googleMap = googleMapActual;
		this.setState({ ...this.state, isMapLoaded: true });
	};

	//Request parks from server
	//getParkData is a function, weird react notation perhaps?
	//note, reqData could be X, just a variable name! int x=

	//YOU NEED THE / in the ADDRESS!!
	//don't put "getParkData", must be "/name"
	//getParkData gets called, and does a fetch to
	//app.post("/api/getParkData")
	getParkData = reqData => {
		console.log(reqData);
		// this.updateHistoryQuery(reqData);
		this.setState({ isFetchingParks: true });
		let storageKey = JSON.stringify(reqData);
		let localData = sessionStorage.getItem(storageKey);

		if (localData) {
			//Check if it's expired
			let data = JSON.parse(localData);
			let now = new Date();
			let expiration = new Date(data.timestamp);
			expiration.setMinutes(expiration.getMinutes() + 60);
			if (!data.timestamp || now.getTime() > expiration.getTime()) {
				console.log("Removing expired data from storage:", data);
				localData = false;
				sessionStorage.removeItem(storageKey);
			}
		}
		if (localData) {
			console.log("Loaded from storage:", JSON.parse(localData));
			this.setState({
				parks: JSON.parse(localData).parks,
				moon: JSON.parse(localData).moonPercent,
				moonType: JSON.parse(localData).moonType,
				fetchReq: reqData,
				isFetchingParks: false
			});
		} else {
			// let fetchingState = this.state;
			// fetchingState.isFetching = true;
			// this.setState(fetchingState);
			axios
				.post("/api/getParkData", reqData)
				.then(response => {
					console.log(response.data);
					this.setState({
						parks: response.data.parks,
						moon: response.data.moonPercent,
						moonType: response.data.moonType,
						fetchReq: reqData,
						isFetchingParks: false
					});
					let d = new Date();
					response.data.timestamp = d.getTime();
					sessionStorage.setItem(
						JSON.stringify(reqData),
						JSON.stringify(response.data)
					);
					console.log("Saved to storage:", response.data);
				})
				.catch(err => {
					console.error(err);
					this.setState({ isFetchingParks: false });
				});
		}
	};

	//Clear button handler
	clearParks = () => {
		this.setState({ parks: [], fetchReq: [] });
	};

	renderParkMap = () => {
		if (this.state.parks.length > 0) {
			return (
				<div className="ParkMapStyle">
					<ParkMap
						parkList={this.state.parks}
						markers={this.markers}
						location={this.state.fetchReq}
						onMapLoaded={this.handleMapLoaded}
					/>
				</div>
			);
		} else {
			return <b>No park map :)</b>;
		}
	};

	renderParkForm = () => {
		if (true) {
			return (
				<div className="ParkFormStyle">
					<ParkForm
						fetchParks={this.getParkData}
						clearParks={this.clearParks}
						isFetchingParks={this.state.isFetchingParks}
						googleMap={this.googleMap}
						markers={this.markers}
					/>
				</div>
			);
		}
	};

	//recursively calls render on it's children
	render() {
		console.log("ParksData - rendered");

		//"copies" into temp array parks
		// const parks = this.state.parks;

		//let clearButtonClass = this.clearButtonClass();
		//bind(this,reqData) passes reqData to getParkData
		//bind seems to be needed for onClick buttons /w args

		return (
			<MainContentWrapper active={this.state.showForm}>
				{this.renderParkMap()}
				{/* <div className="ParkMapStyle"> Where am I </div> */}
				<div className="RightSideContainer">
					<button
						onClick={() => {
							this.setState({ showForm: !this.state.showForm });
						}}
					>
						Toggle form
					</button>
					{this.renderParkForm()}

					<div className="MoonStyle">MOON</div>

					<div className="ParkTableStyle">
						<ParkTable
							parkList={this.state.parks}
							moon={this.state.moon}
							moonType={this.state.moonType}
							googleMap={this.googleMap}
							markers={this.markers}
							isLoadingParks={this.state.isFetchingParks}
						/>
					</div>
				</div>
			</MainContentWrapper>
		);
	}
}

const ParksData = parkProps => (
	<Router>
		<Route
			path="/"
			render={routerProps => (
				//Combine props passed to parkForm with router props
				<BaseParksData {...{ ...parkProps, ...routerProps }} />
			)}
		/>
	</Router>
);

export default ParksData;

//////////////////////////////////////////

const MainContentWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 10px;
	grid-row-gap: 10px;
	grid-template-areas: "map rightSide";

	.ParkMapStyle {
		grid-area: map;
		max-height: 100vh;
		background-color: maroon;
	}
	.RightSideContainer {
		grid-area: rightSide;
		overflow-y: scroll;
		overflow-x: hidden;
		background-color: blue;
	}
	.ParkFormStyle {
		grid-area: form;
		background-color: limegreen;
		${({ active }) => active && `display: none;`}
	}
	/* .MoonStyle {
		grid-area: moon;
		background-color: orange;
	} */
	.ParkTableStyle {
		${({ active }) => {
			if (active) return `max-height:600px;`;
			else return `max-height:300px`;
		}}
	}

	margin: 0 auto 0 auto;
	margin-top: 8rem;
	overflow: hidden;
	width: 85%;
	@media screen and (max-width: 768px) {
		width: 95%;
	}
`;
