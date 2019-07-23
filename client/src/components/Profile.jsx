import React, { Component } from "react";
import axios from "axios";
import ParkTableProfile from "./ParkTableProfile";

class Profile extends Component {
	state = {
		parks: [],
		profileInfoLoaded: false,
		parkDataLoaded:false,
		parkProfileData: {},
		parkDataForTable:{}
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
		axios.post("/api/getProfileParks", this.state.parkProfileData)
  .then((response) => {
	  console.log("response from first call: ",response)
    return axios.post("/api/getProfileParksWeather",response.data); // using response.data
  })
  .then((response) => {
	console.log('Response from second call', response);
	this.setState({
		parkDataForTable: response.data,
		parkDataLoaded: true
	});
  });

		// axios
		// 	.post("/api/getProfileParks", this.state.parkProfileData)
		// 	.then(response => {
		// 		console.log("profile response:", response.data);

		// 	})
			
		// 	.catch(err => {
		// 		//console.error(err);
		// 	});
	};

	sendToParkTable = () =>{
		console.log("sendtoParkTable() reached!");
		console.log("profileInfoLoaded : "+this.state.profileInfoLoaded)
		console.log("parkDataLoaded : "+this.state.parkDataLoaded)
		if(this.state.parkDataLoaded ===false){
			this.getParks();
		}
		
		if(this.state.profileInfoLoaded ===true&&this.state.parkDataLoaded===true){
			return(
				<ParkTableProfile
							parkList={this.state.parkDataForTable
								
							}
							// moon={this.state.moon}
							// moonType={this.state.moonType}
						/>
				)
		}
		
	}



	render() {
// if(this.state.profileInfoLoaded==true){
// 	this.getParks();
// }
		return (
			<div>
				{this.sendToParkTable()}
			</div>
		);
	}
}

export default Profile;
