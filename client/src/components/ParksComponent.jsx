//Store parks state and handle display
import React, { Component } from "react";
import ParkForm from "./ParkForm";
import ParkTable from "./ParkTable";
import ParkMap from "./ParkMap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";

class BaseParksComponent extends Component {
	state = {
		parks: [],
		fetchReq: [],
		moon: "",
		isMapLoaded: false,
		isFetchingParks: false
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
	//getParks is a function, weird react notation perhaps?
	//note, reqData could be X, just a variable name! int x=

	//YOU NEED THE / in the ADDRESS!!
	//don't put "getParks", must be "/name"
	//getParks gets called, and does a fetch to
	//app.post("/api/getParks")
	getParks = reqData => {
		console.log(reqData);
		// this.updateHistoryQuery(reqData);
		this.setState({ isFetchingParks: true });

		let localData = sessionStorage.getItem(JSON.stringify(reqData));

		if (localData) {
			console.log("Loaded from storage:", JSON.parse(localData));
			this.setState({
				parks: JSON.parse(localData)[0],
				moon: JSON.parse(localData)[1],
				moonType: JSON.parse(localData)[2],
				fetchReq: reqData,
				isFetchingParks: false
			});
		} else {
			// let fetchingState = this.state;
			// fetchingState.isFetching = true;
			// this.setState(fetchingState);
			axios
				.post("/api/getParks", reqData)
				.then(response => {
					console.log(response.data);
					this.setState({
						parks: response.data[0],
						moon: response.data[1],
						moonType: response.data[2],
						fetchReq: reqData,
						isFetchingParks: false
					});
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

	//recursively calls render on it's children
	render() {
		console.log("ParksComponent - rendered");

		//"copies" into temp array parks
		// const parks = this.state.parks;

		//let clearButtonClass = this.clearButtonClass();
		//bind(this,reqData) passes reqData to getParks
		//bind seems to be needed for onClick buttons /w args

		return (
			<div className="ParksDiv">
				{/* <div className="container"> */}

				<div className="row">
					<div className="col">
						<ParkMap
							parkList={this.state.parks}
							markers={this.markers}
							location={this.state.fetchReq}
							onMapLoaded={this.handleMapLoaded}
						/>
					</div>
					<div className="col">
						<ParkForm
							fetchParks={this.getParks}
							clearParks={this.clearParks}
							isFetchingParks={this.state.isFetchingParks}
							googleMap={this.googleMap}
							markers={this.markers}
						/>
						<br />
						<div
							style={{
								maxHeight: "300px",
								overflowY: "scroll"
							}}
						>
							<ParkTable
								parkList={this.state.parks}
								moon={this.state.moon}
								moonType={this.state.moonType}
								googleMap={this.googleMap}
								markers={this.markers}
							/>
						</div>
					</div>
				</div>
				{/* </div> */}
			</div>
		);
	}
}

const ParksComponent = parkProps => (
	<Router>
		<Route
			path="/"
			render={routerProps => (
				//Combine props passed to parkForm with router props
				<BaseParksComponent {...{ ...parkProps, ...routerProps }} />
			)}
		/>
	</Router>
);

export default ParksComponent;
