// import React, { Component } from "react";

// export default class AddressInput extends Component {
// 	render() {
// 		return (
// 			<form
// 				onSubmit={e => {
// 					e.preventDefault();
// 				}}
// 			>
// 				<input
// 					id="address-field"
// 					className="searchTerm"
// 					type="text"
// 					name="placeName"
// 					placeholder="Enter your location"
// 					value={this.state.reqData.placeName || ""}
// 					onChange={this.handlePlaceChange}
// 				/>

// 				<button
// 					className={"searchButton"}
// 					type="submit"
// 					disabled={
// 						this.state.reqData.placeName === "" ||
// 						this.state.isGeocodingLocation
// 					}
// 					onClick={e => {
// 						console.log("Enter got here first");
// 						if (this.state.placesComplete) {
// 							this.setState(
// 								{ placesComplete: false },
// 								this.onSubmit
// 							);
// 						} else {
// 							console.log(
// 								"Didn't use autocomplete yet!",
// 								this.state
// 							);
// 						}
// 						// this.onSubmit();
// 						// this.onPlaceChanged();
// 						// this.getPlaceCoordinates(e);
// 					}}
// 				>
// 					<i className="fa fa-search" />
// 				</button>
// 			</form>
// 		);
// 	}
// }
