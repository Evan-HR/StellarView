//Displays parks google map
import React, { Component, createRef } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

class ParkMap extends Component {
	state = {};

	// googleMapRef = createRef();

	// componentDidMount() {
	// 	const googleMapScript = document.createElement("script");
	// 	//NOTE: Find a better way to secure the api key
	// 	googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${}`;
	// 	console.log(process.env.DUSTINMAPKEY);
	//     window.document.body.appendChild(googleMapScript);
	//     googleMapScript.addEventListener('load', this.createGoogleMap())
	// }

	// createGoogleMap = () => {
	// 	new window.google.maps.Map(this.googleMapRef.current, {
	// 		zoom: 10,
	// 		center: {
	// 			lat: 43.64,
	// 			lng: -79.38
	// 		}
	// 		// disableDefaultUI: true
	// 	});
	// };

	render() {
		// const mapStyles = {
		// 	width: "100%",
		// 	height: "100%"
		// };
		console.log(process.env.REACT_APP_DUSTINMAPKEY);
		return (
			// <div
			// 	ref={this.googleMapRef}
			// 	className="border border-primary"
			// 	style={{ width: "600px", height: "400px" }}
			// />
			<div>
				<Map
					google={this.props.google}
					zoom={10}
					// style={mapStyles}
					initialCenter={{
						lat: 43.64,
						lng: -79.38
                    }}
                    disableDefaultUI="true"
				/>
			</div>
		);
	}
}

// export default ParkMap;
export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_DUSTINMAPKEY
})(ParkMap);
