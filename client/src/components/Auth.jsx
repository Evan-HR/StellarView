import React from "react";

import { AuthProvider, AuthConsumer } from "./AuthContext";
import App from "../App";
import axios from "axios";
//import { Cookies } from "react-cookie";

// {"cookie":{"originalMaxAge":null,"expires":null,
// "httpOnly":true,"path":"/"},"passport":{"user":{"user_id":81}}}
export class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: null,
			userID: null,
			isAuth: null,
			isLoggingIn: false,
			userLocation: { lat: "", lng: "" },
			userReviews: [],
			hasFavSpots: false,
			hasNoSpots: false,
			userFavorites: []
		};
		console.log("AFTER REG, PRE-GETUSERAUTH, should be SECOND");
		//this.getWeatherInfo();
		this.getUserAuth();
		console.log(
			"AFTER REG and getUserAuth() in constructor, should be THIRD"
		);
		// this.getUserInfo();
		// this.getUserReviews();
		this.handleLogoutState = this.handleLogoutState.bind(this);
		//this.getUserInfo = this.getUserInfo.bind(this);
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(position => {
			this.setState({
				userLocation: {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
			});
		});
	}

	handleLogoutState() {
		this.setState({
			firstName: null,
			userID: null,
			isAuth: false,
			hasFavSpots: false,
			hasNoSpots: false,
			userReviews: [],
			userFavorites: []
		});
	}

	//for register function
	handleLogin = () => {
		console.log("REGISTER GOT HERE, should be FIRST");

		this.getUserInfo();
		//this.getUserFavSpots();
	};

	getUserAuth() {
		console.log("FIRST: GETUSERAUTH()");
		var self = this;
		axios
			.get("/api/getUserAuth")
			.then(function(response) {
				console.log("response is: ", response.data);
				if (response.data == true) {
					console.log("get here ya?");
					self.getUserInfo();
					// self.getUserReviews();
					// self.getUserFavSpots();
				}
			})

			.catch(error => {
				console.log(error);
			});
	}

	getWeatherInfo() {
		axios
			.get("/api/getWeatherInfo")
			//put .then here
			.catch(error => {
				console.log(error);
			});
	}

	getUserInfo() {
		var self = this;
		console.log("SECOND: getUserInfo()");
		axios
			.get("/api/getUserInfo")

			.then(({ data }) => {
				this.setState({
					firstName: data.firstName,
					isAuth: data.isAuth,
					userID: data.userID
				});
				self.getUserFavSpots();
				self.getUserReviews();
			})
			.catch(error => {
				console.log(error);
			});
	}

	getUserFavSpots() {
		console.log("FOURTH: getUserFavSpots()");
		axios
			.get("/api/getUserFavSpots")

			.then(favSpots => {
				if (favSpots.status == 204) {
					console.log("204!!!!!!! NO FAV SPOTS!!")
					this.setState({
						hasNoSpots: true
						
					});
				}
					else{
						console.log("fav spots: ", favSpots);
						this.setState({
							userFavorites: favSpots.data,
							hasFavSpots: true,
							hasNoSpots: false
						});
					}

			})
			.catch(error => {
				console.log(error);
			});
	}

	getUserReviews() {
		console.log(
			"GETUSERREVIEWS GOT HERE  -  SHOULD BE ONLY ONCE!!!!!!!!!!!"
		);
		console.log("THIRD: getUserReviews()");
		axios
			.get("/api/getUserReviews")

			.then(reviews => {
				this.setState({
					userReviews: reviews.data
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		return (
			<AuthProvider value={this.state}>
				<App
					handleLogoutState={this.handleLogoutState}
					handleLogin={this.handleLogin}
				/>
			</AuthProvider>
		);
	}
}

export default Auth;
