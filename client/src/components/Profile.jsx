import React, { Component } from "react";
import axios from "axios";
import ParkTable from "./ParkTable";

class Profile extends Component {
	state = {
		parks: [],
		moon: "",
		profileInfoLoaded: false,
		moonType: "",
		parkProfileData: {}
	};

	componentDidMount() {
		console.log("from PROFILE, location is: ", this.props.userLocation);
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
		axios
			.post("/api/getProfileParks", this.state.parkProfileData)
			.then(response => {
				console.log("profile response:", response.data);
				// this.setState({
				// 	parks: response.data[0],
				// 	moon: response.data[1],
				// 	moonType: response.data[2]
				// });
			})
			.catch(err => {
				//console.error(err);
			});
	};

	render() {
		if (this.state.profileInfoLoaded === true) {
			this.getParks();
		}

		return (
			<div>
				<ParkTable
					parkList={this.state.parks}
					moon={this.state.moon}
					moonType={this.state.moonType}
				/>
			</div>
		);
	}
}

export default Profile;
