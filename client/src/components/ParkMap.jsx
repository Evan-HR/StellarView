//Displays parks google map
import React, { Component, createRef } from "react";

/* Notes:
Couldn't figure out how to make google.etc work, 
instead you have to use window.google.etc
*/

// const google = window.google;

class ParkMap extends Component {
	state = {
		mapLoaded: false
	};
	googleMapRef = createRef();

	componentDidMount() {
		const googleMapScript = document.createElement("script");
		//NOTE: Find a better way to secure the api key
		googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${
			process.env.REACT_APP_DUSTINMAPKEY //TODO: See if this can be hidden better
		}`;
		window.document.body.appendChild(googleMapScript);
		googleMapScript.addEventListener("load", () => {
			this.googleMap = this.createGoogleMap();
			this.googleMapBounds = new window.google.maps.LatLngBounds();
			this.markers = [];
			this.currentLocationMarker = null;
			let loadedState = this.state;
			loadedState.mapLoaded = true;
			this.setState(loadedState);
		});
	}

	createGoogleMap = () => {
		return new window.google.maps.Map(this.googleMapRef.current, {
			zoom: 10,
			center: {
				lat: 43.64,
				lng: -79.38
			},
			disableDefaultUI: true
		});
	};

	addCurrentLocationMarker = () => {
		let location = {
			lat: this.props.location.lat,
			lng: this.props.location.lng
		};
		this.currentLocationMarker = new window.google.maps.Marker({
			position: location,
			icon: {
				url:
					"http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png",
				anchor: new window.google.maps.Point(15, 17)
			},
			map: this.googleMap
		});
		this.googleMapBounds.extend(location);
	};

	addParkMarker = park => {
		//TODO: See if possible to modularize this function
		let location = { lat: park.lat, lng: park.lng };
		this.googleMapBounds.extend(location);
		var marker = new window.google.maps.Marker({
			position: location,
			map: this.googleMap,
			title: park.name,
			icon: {
				url:
					park.name === "Unknown"
						? "http://maps.google.com/mapfiles/kml/pal2/icon12.png"
						: "http://maps.google.com/mapfiles/kml/pal2/icon4.png",
				anchor: new window.google.maps.Point(16, 16),
				scaledSize: new window.google.maps.Size(21, 21)
			}
		});
		this.markers.push(marker); //Maybe this can be moved out of the function
	};

	centerMap = () => {
		if (this.props.location.length !== 0) {
			var latLng = new window.google.maps.LatLng(
				this.props.location.lat,
				this.props.location.lng
			); //Makes a latlng
			this.googleMap.panTo(latLng); //Make map global
		}
	};

	render() {
		console.log("ParkMap - rendered");
		const mapStyles = {
			width: "100%",
			height: "100%"
		};
		if (this.state.mapLoaded) {
			//Clear existing markers
			//TODO: Definitely possible to optimize
			// -Not deleting markers when there's no change? But then have to check for changes
			console.log("#Markers:", this.markers.length);
			if (this.markers.length > 0) {
				this.googleMapBounds = new window.google.maps.LatLngBounds();
				console.log("Removing markers..");
				this.markers.map(marker => marker.setMap(null));
				this.markers = [];
				this.currentLocationMarker.setMap(null);
				this.currentLocationMarker = null;
			}

			//Add new markers if possible
			if (this.props.location.length !== 0) {
				console.log("Adding markers..");
				this.addCurrentLocationMarker();
				this.props.parkList.map(this.addParkMarker);
				if (this.markers.length > 0) {
					this.googleMap.panToBounds(this.googleMapBounds);
					this.googleMap.fitBounds(this.googleMapBounds);
				} else {
					this.googleMap.setCenter(
						this.currentLocationMarker.position
					);
					this.googleMap.setZoom(10);
				}
			}
		}
		return (
			<React.Fragment>
				<div
					ref={this.googleMapRef}
					className="border border-primary"
					style={{ width: "100%", height: "400px" }}
				/>
				<div>
					<button onClick={this.centerMap}>Re-center</button>
				</div>
			</React.Fragment>
		);
	}
}

export default ParkMap;
