import React, { Component } from "react";
import axios from "axios";
import ParkTableProfile from "./ParkTableProfile";

class Profile extends Component {
	state = {
		parks: [],
		profileInfoLoaded: false,
		parkDataLoaded: false,
		parkProfileData: {},
		parkDataForTable: {},
		isLoadingParks: false
	};

	componentDidMount() {
		console.log("COMP DID MOUNT !!! THIS RUNS FIRST!!!!!!!!!");
		console.log("from PROFILE, location is: ", this.props.userLocation);
		console.log("HASFAVSPOTS BOOL: ", this.props.hasFavSpots);
		var now = new Date();
		var isoDate = now.toISOString();
		isoDate = new Date(isoDate);

		this.setState({
			parkProfileData: {
				...this.state.parkProfileData,
				userTime: isoDate,
				userFavs: this.props.userFavorites,
				lat: this.props.userLocation.lat,
				lng: this.props.userLocation.lng
			},
			profileInfoLoaded: true
		});
	}

	getParks = () => {
		console.log("GETPARKS FUNCTION RAN, SHOULD BE THIRD!!!!");
		console.log("THIS.PROPS.USERFAVORITES: ", this.props.userFavorites);
		if (this.props.hasFavSpots == true) {
			axios
				.get("/api/getProfileParks", this.state.parkProfileData)
				.then(response => {
					console.log("response from first call: ", response);
					return axios.get(
						"/api/getProfileParksWeather",
						response.data
					); // using response.data
				})
				.then(response => {
					console.log("Response from second call", response);
					this.setState({
						parkDataForTable: response.data,
						parkDataLoaded: true,
						isLoadingParks: false
					});
				});
		}
	};

	sendToParkTable = () => {
		console.log("SENDTOPARKTABLE RAN!!!  SHOULD BE SECOND!!!!");
		// console.log("sendtoParkTable() reached!");
		// console.log("profileInfoLoaded : " + this.state.profileInfoLoaded);
		console.log(
			"IS PARK DATA LOADED? IF FALSE, RUN GETPARKS(): " +
				this.state.parkDataLoaded
		);

		if (this.state.parkDataLoaded === false) {
			// this.setState({isLoadingParks: true})
			this.getParks();
		}

		if (
			this.state.profileInfoLoaded === true &&
			this.state.parkDataLoaded === true
		) {
			return (
				<ParkTableProfile
					parkList={this.state.parkDataForTable}
					// moon={this.state.moon}
					// moonType={this.state.moonType}
				/>
			);
		}
	};

	render() {
		// if(this.state.profileInfoLoaded==true){
		// 	this.getParks();
		// }
		return (
			<div>
				Hello, {this.props.firstName}!<br />
				{this.sendToParkTable()}
			</div>
		);
	}
}

export default Profile;
