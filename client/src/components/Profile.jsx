import React, { Component } from "react";
import axios from "axios";
import ParkTable from "./ParkTable";

class Profile extends Component {
	state = {
		parks: [],
		moon: "",
		moonType:""
	};

	componentDidMount() {
		this.getParks();
	}

getParks=() => {
			axios
				.post("/api/getProfileParks", this.props.userFavorites)
				.then(response => {
					console.log("profile response:",response.data);
					this.setState({
						parks: response.data[0],
						moon: response.data[1],
						moonType: response.data[2],
					});

				})
				.catch(err => {
					//console.error(err);
					
				});
		}

	render() {
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
