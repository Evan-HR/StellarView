//Displays parks google map
import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import ReactDOM from "react-dom";

/* Notes:
Couldn't figure out how to make google.etc work, 
instead you have to use window.google.etc
*/

// const google = window.google;

//TODO: Move the style to a different place
const styleSelector = {
	retro: [
		{ elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
		{ elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
		{ elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
		{
			featureType: "administrative",
			elementType: "geometry.stroke",
			stylers: [{ color: "#c9b2a6" }]
		},
		{
			featureType: "administrative.land_parcel",
			elementType: "geometry.stroke",
			stylers: [{ color: "#dcd2be" }]
		},
		{
			featureType: "administrative.land_parcel",
			elementType: "labels.text.fill",
			stylers: [{ color: "#ae9e90" }]
		},
		{
			featureType: "landscape.natural",
			elementType: "geometry",
			stylers: [{ color: "#dfd2ae" }]
		},
		{
			featureType: "poi",
			elementType: "geometry",
			stylers: [{ color: "#dfd2ae" }]
		},
		{
			featureType: "poi",
			elementType: "labels.text.fill",
			stylers: [{ color: "#93817c" }]
		},
		{
			featureType: "poi.business",
			stylers: [{ visibility: "off" }]
		},

		{
			featureType: "poi.park",
			elementType: "geometry.fill",
			stylers: [{ color: "#a5b076" }]
		},
		{
			featureType: "poi.park",
			elementType: "labels.text.fill",
			stylers: [{ color: "#447530" }]
		},
		{
			featureType: "road",
			elementType: "geometry",
			stylers: [{ color: "#f5f1e6" }]
		},
		{
			featureType: "road.arterial",
			elementType: "geometry",
			stylers: [{ color: "#fdfcf8" }]
		},
		{
			featureType: "road.highway",
			elementType: "geometry",
			stylers: [{ color: "#f8c967" }]
		},
		{
			featureType: "road.highway",
			elementType: "geometry.stroke",
			stylers: [{ color: "#e9bc62" }]
		},
		{
			featureType: "road.highway.controlled_access",
			elementType: "geometry",
			stylers: [{ color: "#e98d58" }]
		},
		{
			featureType: "road.highway.controlled_access",
			elementType: "geometry.stroke",
			stylers: [{ color: "#db8555" }]
		},
		{
			featureType: "road.local",
			elementType: "labels.text.fill",
			stylers: [{ color: "#806b63" }]
		},
		{
			featureType: "transit.line",
			elementType: "geometry",
			stylers: [{ color: "#dfd2ae" }]
		},
		{
			featureType: "transit.line",
			elementType: "labels.text.fill",
			stylers: [{ color: "#8f7d77" }]
		},
		{
			featureType: "transit.line",
			elementType: "labels.text.stroke",
			stylers: [{ color: "#ebe3cd" }]
		},
		{
			featureType: "transit.station",
			elementType: "geometry",
			stylers: [{ color: "#dfd2ae" }]
		},
		{
			featureType: "water",
			elementType: "geometry.fill",
			stylers: [{ color: "#b9d3c2" }]
		},
		{
			featureType: "water",
			elementType: "labels.text.fill",
			stylers: [{ color: "#92998d" }]
		}
	]
};
//TODO: Move the whole MODAL to its own component
const modalStyle = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: "linear-gradient(rgba(0,0,255,0.25), rgba(255,0,0,0.75))"
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		borderRadius: "25px",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)"
	}
};

class ParkMap extends Component {
	state = {
		mapLoaded: false,
		modalIsOpen: false
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
			this.googleMapInfowindow = null;
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

	/**
	 * Add marker to initial location, passed in through prop
	 */
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

	openModal = () => {
		this.setState({ ...this.state, modalIsOpen: true });
	};

	closeModal = () => {
		this.setState({ ...this.state, modalIsOpen: false });
	};

	/**
	 * Create a marker for the park on this.googleMap object.
	 * Additionally, creates infobox listener, adds park coordinate to map bounds,
	 * and pushes the marker object into this.parks array
	 */
	addParkMarker = park => {
		//TODO: See if possible to modularize this function
		let location = { lat: park.lat, lng: park.lng };
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
		marker.addListener("click", () => {
			console.log("Clicked marker at", marker.title);
			let infoWindowID = "infowindow" + park.id;
			let contentString = `
            <b>${park.name}</b><br>
			${park.light_pol}<br>
			<div id=${infoWindowID} />
            `; //Infobox div!
			if (this.googleMapInfowindow) {
				this.googleMapInfowindow.close();
			}
			this.googleMapInfowindow = new window.google.maps.InfoWindow({
				content: contentString,
				enableEventPropagation: true
			});
			this.googleMapInfowindow.open(this.googleMap, marker);
			// this.googleMap.setCenter(marker.position);

			/**
			 * Okay I need to explain this before I forget:
			 * GoogleMaps built in infoboxes only take in HTML content, so you can't
			 * call react functions from the onClick events or whatever. SO the easy solution
			 * is to pass in a div with an id, and then have react RENDER that div and replace
			 * it with react content, ie this button. Ofcourse there's a race condition since
			 * the infobox takes time to be ready, so we have to attach a listener to the
			 * infobox, which wait until the dom is loaded before calling react render on it.
			 *
			 */

			let button = (
				<button onClick={() => this.openModal()}>Pardon</button>
			);
			window.google.maps.event.addListener(
				this.googleMapInfowindow,
				"domready",
				function(e) {
					ReactDOM.render(
						button,
						document.getElementById(infoWindowID)
					);
				}
			);
		});
		this.markers.push(marker); //Maybe this can be moved out of the function
		this.googleMapBounds.extend(location);
	};

	/**
	 * Center map on initial location passed in through prop
	 */
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
		//NOTE: mapStyles is NEEDED for map to display
		const mapStyles = {
			width: "100%",
			height: "100%"
		};
		//IMPORTANT: Have to wait until the map finished loading before accessing it
		if (this.state.mapLoaded) {
			//Clear existing markers
			//TODO: Definitely possible to optimize
			// -Not deleting markers when there's no change? But then have to check for changes
			this.googleMap.setOptions({ styles: styleSelector.retro });
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
					style={{ width: "100%", height: "600px" }}
				/>
				<div>
					<button onClick={this.centerMap}>Re-center</button>
					<button onClick={this.openModal}>Modal</button>
					<Modal
						isOpen={this.state.modalIsOpen}
						// onAfterOpen={this.afterOpenModal}
						onRequestClose={this.closeModal}
						style={modalStyle}
						contentLabel="Example Modal"
					>
						<h2 ref={subtitle => (this.subtitle = subtitle)}>
							Hello
						</h2>
						<button onClick={this.closeModal}>close</button>
						<div>Content goes here blah blah blah</div>
					</Modal>
				</div>{" "}
			</React.Fragment>
		);
	}
}

export default ParkMap;
