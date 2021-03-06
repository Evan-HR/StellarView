import React, { Component } from "react";
import axios from "axios";
import { AuthConsumer } from "./AuthContext";
import ParkTableProfile from "./ParkTableProfile";
import { parkScore } from "./MainComponent";
import styled from "styled-components";

class BaseProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//parks: this.props.context.userFavorites,
			userFavorites: this.props.context.userFavorites,
			lat: this.props.context.userLocation.lat,
			lng: this.props.context.userLocation.lng,

			profileInfoLoaded: false,
			parkDataLoaded: false,
			//parkProfileData: {},
			parkDataForTable: {},
			isLoadingParks: false
		};
	}

	// componentDidMount() {
	// 	this.getParkData();
	// }

	// getProfileInfo=()=> {
	// 	console.log("COMP DID MOUNT !!! THIS RUNS FIRST!!!!!!!!!");
	// 	console.log("from PROFILE, location is: ", this.props.userLocation);
	// 	console.log("HASFAVSPOTS BOOL: ", this.props.hasFavSpots);
	// 	var now = new Date();
	// 	var isoDate = now.toISOString();
	// 	isoDate = new Date(isoDate);

	// 	this.setState({
	// 		parkProfileData: {
	// 			...this.state.parkProfileData,
	// 			userTime: isoDate,
	// 			userFavs: this.props.userFavorites,
	// 			lat: this.props.userLocation.lat,
	// 			lng: this.props.userLocation.lng
	// 		},
	// 		profileInfoLoaded: true
	// 	});
	// }

	getParkData = () => {
		// console.log("-------------------got to getParkData!");
		// console.log("userFavs is: ", this.props.context.userFavorites);
		// console.log("lat is: ", this.props.context.userLocation.lat);
		// console.log("hasFavSpots : ", this.props.context.hasFavSpots);

		if (this.props.context.hasFavSpots == true) {
			// console.log("hasFavSpots got here");
			var now = new Date();
			var isoDate = now.toISOString();
			isoDate = new Date(isoDate);
			//pass to getProfileParks
			var parkProfileData = {
				userTime: isoDate,
				// userFavs: this.props.context.userFavorites,
				// lat: this.props.context.userLocation.lat,
				// lng: this.props.context.userLocation.lng
				userFavs: this.props.context.userFavorites,
				lat: this.state.lat,
				lng: this.state.lng
			};

			//var parkProfileDataJSON = JSON.parse(parkProfileData)

			// console.log(
			// 	"console log before getProfileParks -- should crash after this: ",
			// 	parkProfileData
			// );

			axios
				.post("/api/getProfileParks", parkProfileData)
				.then(response => {
					// console.log("response from first call: ", response);
					var d = new Date();
					var userTime = d.getTime();
					return axios.post("/api/getProfileParksWeather", {
						userTime: userTime,
						parkData: response.data
					}); // using response.data
				})
				.then(response => {
					// console.log("Response from second call", response);

					for (var i = 0; i < response.data.parks.length; i++) {
						let tempScore = parkScore(
							response.data.moonFraction,
							response.data.parks[i].weather.humidity / 100,
							response.data.parks[i].weather.clouds / 100,
							response.data.parks[i].light_pol / 100
						);
						response.data.parks[i].score = tempScore.finalScore;
						response.data.parks[i].scoreBreakdown = tempScore;
					}

					this.setState({
						parkDataForTable: response.data.parks,
						parkDataLoaded: true,
						moonFraction: response.data.moonFraction,
						moonPhase: response.data.moonPhase,
						moonType: response.data.moonType,
						isLoadingParks: false
					});
				});
		} else {
			// console.log("NAAAAATHING!");
		}
	};

	sendToParkTable = () => {
		// console.log("sendtoParkTable hath entered");
		//console.log("testboolInfoLoad is : " + this.state.testBoolInfoLoaded);

		if (
			this.state.parkDataLoaded === true &&
			this.props.context.hasNoSpots === false
		) {
			return (
				<ParkTableProfile
					parkList={this.state.parkDataForTable}
					moonPhase={this.state.moonPhase}
					moonType={this.state.moonType}
				/>
			);
		} else {
			this.getParkData();
		}
	};

	renderNoSpotsMsg = () => {
		if (this.props.context.hasNoSpots === true) {
			return (
				<tr>
					<td colSpan={3}>
						<strong style={{ color: "red" }}>
							You have not added any parks to your favorites!
						</strong>
					</td>
				</tr>
			);
		}
	};

	render() {
		// console.log("RENDER!!!! STATE IS BELOW:");
		// console.log("USER ID IS : ", this.props.context.userID);
		// console.log("USER LAT IS : ", this.props.context.userLocation.lat);
		// console.log("USER FAV PARKS", this.props.context.userFavorites);
		// console.log("HAS FAV SPOTS", this.props.context.hasFavSpots);
		// console.log(this.state);
		return (
			<ProfileStyle>
				<div>
					<span className="firstName">Hello, {this.props.context.firstName}!</span>
					{this.renderNoSpotsMsg()}
					{this.sendToParkTable()}
				</div>
			</ProfileStyle>
		);
	}
}

const Profile = props => (
	<AuthConsumer>{x => <BaseProfile {...props} context={x} />}</AuthConsumer>
);

export default Profile;

const ProfileStyle = styled.div`
	.firstName {
		font-size: 20px;
		margin: 20px auto;
		display: block;
		color: ${props => props.theme.white};
	}
`;
