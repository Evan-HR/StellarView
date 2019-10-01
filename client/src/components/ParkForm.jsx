//Input form
import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import qs from "qs";
// import { makeStyles } from "@material-ui/core/styles";
import MuiSlider from "@material-ui/core/Slider";
import { sizing } from "@material-ui/system";
import { AuthConsumer } from "./AuthContext";
import styled from "styled-components";
// import nearMeButton from "./style/Media/round-my_location-24px.svg";
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import LocationSearchInput from "./LocationSearchInput";
import { notify } from "./Notification";
import searchIcon from "./style/Media/search-solid.svg";
import SVG from "react-inlinesvg";
import ee from "eventemitter3";

const emitter = new ee();

export const notifyLoadQuery = msg => {
	emitter.emit("parkFormToLoadQuery", msg);
};

class BaseParkForm extends Component {
	state = {
		reqData: {
			lat: "",
			lng: "",
			dist: 25,
			lightpol: 1.75,
			error: "",
			placeName: ""
		},
		isLoadingLocation: false,
		isGeocodingLocation: false,
		isInvalidLocation: false,
		formErrors: {},
		advancedSearch: false,
		placesComplete: false
	};

	constructor(props) {
		super(props);
		this.sliderLight = this.state.reqData.lightpol;
		this.sliderDist = this.state.reqData.dist;
		this.autoComplete = false;
		emitter.on("parkFormToLoadQuery", () => {
			// console.log("Park form got back button event");
			this.loadQuery();
		});
	}

	//There are two cases when we would want to load results form url query:
	// 1: We hit back/forward to go to previous searches
	// 2: We load page from a link with query information

	// componentDidMount runs RIGHT after post-render
	componentDidMount() {
		// this.getMyLocation();
		// console.log("USER LOC: ", this.props.userLocation);

		//On page load, load results from query is possible
		// console.log("Form mounted, searching...");
		this.loadQuery();
	}

	componentDidUpdate() {
		if (window.google && !this.autoComplete) {
			this.loadAutoComplete();
		}
		//On back button load previous results
		// window.onpopstate = e => {
		// 	console.log("Back button pressed");
		// 	console.log(window.location.href);
		// 	if (window.location.hash === "#modal") {
		// 		notifyCloseModal();
		// 	} else {
		// 		this.loadQuery();
		// 	}
		// };
	}

	//Load query into state
	loadQuery = () => {
		let query = qs.parse(window.location.search, {
			ignoreQueryPrefix: true
		});
		// console.log(query);
		// console.log("First mount? ", this.state.firstLoad)
		if (Object.keys(query).length !== 0) {
			if (
				query.lat !== this.state.reqData.lat ||
				query.lng !== this.state.reqData.lng ||
				query.dist !== this.state.reqData.dist ||
				query.lightpol !== this.state.reqData.lightpol
			) {
				// console.log("Loading from firstmount", this.state.firstLoad)
				this.setState(
					{
						reqData: {
							...this.state.reqData,
							lat: query.lat,
							lng: query.lng,
							dist: query.dist,
							lightpol: parseFloat(query.lightpol),
							error: ""
						}
					},
					//SetState callback
					() => {
						// console.log("Submitting..", this.state.reqData);
						this.onSubmit();
					}
				);
			}
			//THe quick and dirty way to load map results would be.......
		}
	};

	// Can't get update to happen on address change
	// don't know if that's what we would want either actually
	// componentDidUpdate(prevProps) {
	// 	if (prevProps !== this.props) {
	// 		console.log("Prev location:", prevProps.history.location.search);
	// 		console.log("Curr location:", this.props.history.location.search);
	// 	}
	// }

	handlePlaceChange = changeEvent => {
		this.setState({
			reqData: {
				...this.state.reqData,
				placeName: changeEvent.target.value
			},
			placesComplete: false,
			isInvalidLocation: false
		});
	};

	/**
	 * For more info visit https://nominatim.org/release-docs/develop/api/Search/
	 */
	getPlaceCoordinates = () => {
		this.setState({ isGeocodingLocation: true });
		axios
			.get(
				//Internet Explorer didn't want to connect to OSM server, so the request has to be proxied through heroku
				//This can be avoided by redirecting the call through NODE
				`${"https://cors-anywhere.herokuapp.com/"}http://nominatim.openstreetmap.org/search?format=json&q=${
					this.state.reqData.placeName
				}`
			)
			.then(({ data }) => {
				// console.log(data);

				if (window.google) {
					var latLng = new window.google.maps.LatLng(
						parseFloat(data[0].lat),
						parseFloat(data[0].lon)
					); //Makes a latlng
					this.props.googleMap.panTo(latLng); //Make map global
				}
				this.setState(
					{
						isGeocodingLocation: false,
						reqData: {
							...this.state.reqData,
							lat: parseFloat(data[0].lat),
							lng: parseFloat(data[0].lon)
						}
					},
					() => this.onSubmit()
				);
			})
			.catch(error => {
				console.log(error);
				this.setState({
					...this.state,
					isGeocodingLocation: false,
					isInvalidLocation: true
				});
			});
	};

	renderInvalidLocation = () => {
		this.setState({
			...this.state,
			isInvalidLocation: true
		});
	};
	//   In order to have access to  this.state inside
	//    getCurrentPosition's callback, you either need to
	//    bind the success callback or make use of arrow function.
	getMyLocation = e => {
		this.setState({ isLoadingLocation: true, isInvalidLocation: false });
		// console.log(this.props);
		if (
			!this.props.authState.userLocation ||
			(this.props.authState.userLocation.lat === "" &&
				this.props.authState.userLocation.lng === "")
		) {
			// console.log("Getting new location");
			navigator.geolocation.getCurrentPosition(
				async position => {
					console.log(
						`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
					);
					let address = await axios.get(
						`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
					);
					address = address["data"]["address"]["city"];
					// console.log(address);
					this.setState(
						{
							...this.state,
							reqData: {
								...this.state.reqData,
								lat: position.coords.latitude,
								lng: position.coords.longitude,
								placeName: address,
								error: null
							},
							isLoadingLocation: false
						},
						() => this.onSubmit()
					);
					if (window.google) {
						this.props.googleMap.panTo(
							new window.google.maps.LatLng(
								position.coords.latitude,
								position.coords.longitude
							)
						);
					}
					this.props.authState.setUserLocation(
						position.coords.latitude,
						position.coords.longitude
					);
				},
				error => {
					this.setState({
						...this.state,
						reqData: {
							...this.state.reqData,
							error: error.message
						},
						isLoadingLocation: false
					});
				},
				{ enableHighAccuracy: true }
			);
		} else {
			// console.log("Fetching auth location");
			if (window.google && this.props.googleMap) {
				this.props.googleMap.panTo(
					new window.google.maps.LatLng(
						this.props.authState.userLocation.lat,
						this.props.authState.userLocation.lng
					)
				);
			}
			let address = null;
			// let address = await axios.get(
			// 	`https://nominatim.openstreetmap.org/reverse?format=json&lat=${

			// 		this.props.authState.userLocation.lat
			// 	}&lon=${this.props.authState.userLocation.lng}`
			// );
			// address = address["data"]["address"]["city"];
			this.setState(
				{
					reqData: {
						...this.state.reqData,
						lat: this.props.authState.userLocation.lat,
						lng: this.props.authState.userLocation.lng,
						placeName: address
					},
					isLoadingLocation: false
				},
				() => this.onSubmit()
			);
		}
	};

	//Material UI
	handleDistanceChange = (changeEvent, value) => {
		this.setState({
			reqData: { ...this.state.reqData, dist: value }
		});
	};
	// handleDistanceChange = changeEvent => {
	// 	this.setState({
	// 		reqData: { ...this.state.reqData, dist: changeEvent.target.value }
	// 	});
	// };

	handleLatChange = changeEvent => {
		this.setState({
			reqData: { ...this.state.reqData, lat: changeEvent.target.value }
		});
	};

	handleLngChange = changeEvent => {
		this.setState({
			reqData: { ...this.state.reqData, lng: changeEvent.target.value }
		});
	};

	//MaterialUISlider
	handleLightPolChange = (e, value) => {
		// console.log(changeEvent, value);
		this.setState({
			reqData: {
				...this.state.reqData,
				lightpol: value
			}
		});
	};

	// handleLightPolChange = changeEvent => {
	// 	this.setState({
	// 		reqData: {
	// 			...this.state.reqData,
	// 			lightpol: changeEvent.target.value
	// 		}
	// 	});
	// };

	//props to send one-way information to MainComponent
	//this.state is the "X" in getParkData()
	//fetchP(x) --> getParkData(x)
	onSubmit = e => {
		if (e) e.preventDefault();
		// console.log(this.state.reqData);
		const errors = this.validate(this.state.reqData);
		if (errors.length === 0) {
			var d = new Date();
			this.setState({
				formErrors: [],
				reqData: { ...this.state.reqData, utime: d.getTime() }
			});
			this.updateHistoryQuery(this.state.reqData);
			this.props.fetchParks(
				this.convertReqToFloat({
					...this.state.reqData,
					utime: d.getTime()
				})
			);
		} else {
			this.setState({ formErrors: errors });
		}
		//getParkData(reqdata) of parent
	};

	convertReqToFloat = reqData => {
		return {
			lat: parseFloat(reqData.lat),
			lng: parseFloat(reqData.lng),
			dist: parseFloat(reqData.dist),
			lightpol: parseFloat(reqData.lightpol),
			utime: reqData.utime
		};
	};

	updateHistoryQuery = reqData => {
		// console.log("Updating history...");
		//this.props.history.push({ query: "test" });
		let query = qs.parse(window.location.search, {
			ignoreQueryPrefix: true
		});
		if (
			query.lat !== parseFloat(reqData.lat).toFixed(4) ||
			query.lng !== parseFloat(reqData.lng).toFixed(4) ||
			query.dist !== reqData.dist.toString() ||
			query.lightpol !== parseFloat(reqData.lightpol).toFixed(2)
		) {
			this.props.history.push(
				`/search?lat=${parseFloat(reqData.lat).toFixed(
					4
				)}&lng=${parseFloat(reqData.lng).toFixed(4)}&dist=${
					reqData.dist
				}&lightpol=${parseFloat(reqData.lightpol).toFixed(2)}`
			);
		} else {
			// console.log("Attempting to repeat current search.");
		}
	};

	validate = reqData => {
		const errors = [];
		if (
			!reqData.lat ||
			reqData.lat === "" ||
			reqData.lat < -90 ||
			reqData.lat > 90 ||
			!reqData.lng ||
			reqData.lng === "" ||
			reqData.lng < -180 ||
			reqData.lng > 180
		)
			errors.push("Invalid location");
		if (
			!reqData.dist ||
			reqData.dist === "" ||
			reqData.dist < 0 ||
			reqData.dist > 300
		)
			errors.push("Invalid distance");
		if (
			!reqData.lightpol ||
			reqData.lightpol === "" ||
			reqData.lightpol < 0 ||
			reqData.lightpol > 40
		)
			errors.push("Invalid light pollution");
		return errors;
	};

	// updateQuery = reqData => {
	// 	console.log("Adding test query");
	// 	//this.props.history.push({ query: "test" });
	// 	history.push({
	// 		search: `?lat=${reqData.lat}&lng=${reqData.lng}&dist=${
	// 			reqData.dist
	// 		}&lightpol=${reqData.lightpol}`
	// 	});
	// };

	renderLocationSpinner = () => {
		if (this.state.isLoadingLocation) {
			return (
				<React.Fragment>
					<span className="spinner-border spinner-border-sm" />
					{/* {"  "}Locating */}
				</React.Fragment>
			);
		} else {
			return "Near Me";
		}
	};

	renderFormErrors = () => {
		if (Object.keys(this.state.formErrors).length > 0) {
			return (
				<ErrorStyle>
					<b className="text-danger">
						{this.state.formErrors.join(", ")}
					</b>
				</ErrorStyle>
			);
		}
	};

	loadAutoComplete = () => {
		const field = document.getElementById("address-field");
		this.autoComplete = new window.google.maps.places.Autocomplete(field);
		// this.enableEnterKey(field);
		this.autoComplete.addListener("place_changed", this.onPlaceChanged);
		// this.autoCompleteLoaded = true;
	};

	onPlaceChanged = () => {
		// console.log("Getting location from places");
		let place = this.autoComplete.getPlace();
		// if (places == 0) {
		// 	return;
		// }

		// var place = places[0];
		// console.log("Valid place:", place);
		if (place && place.geometry && place.geometry.location) {
			let location = place.geometry.location.toJSON();
			// console.log(location);
			if (window.google) {
				this.props.googleMap.panTo(place.geometry.location); //Make map global
			}
			this.setState(
				{
					reqData: {
						...this.state.reqData,
						placeName: place.formatted_address,
						lat: location.lat,
						lng: location.lng
					},
					placesComplete: true
				}
				// () => this.onSubmit()
			);
		}
	};

	render() {
		//console.log("Fetching parks?", this.props.isFetchingParks);
		return (
			<SearchFormStyle
				advancedSearch={this.state.advancedSearch}
				isInvalidLocation={this.state.isInvalidLocation}
			>
				<div className="citySearch">
					<form
						onSubmit={e => {
							e.preventDefault();
						}}
					>
						<input
							id="address-field"
							className="searchTerm"
							type="text"
							name="placeName"
							placeholder="Enter your location"
							value={this.state.reqData.placeName || ""}
							onChange={this.handlePlaceChange}
						/>

						<div
							className={"searchButton"}
							
							disabled={
								this.state.reqData.placeName === "" ||
								this.state.isGeocodingLocation
							}
							onClick={e => {
								// console.log("Enter got here first");
								if (this.state.placesComplete) {
									this.onSubmit();
								} else {
									this.renderInvalidLocation();
									// notify("Invalid location - please try again.");
									// console.log(
									// 	"Didn't use autocomplete yet!",
									// 	this.state
									// );
								}
								// this.onSubmit();
								// this.onPlaceChanged();
								// this.getPlaceCoordinates(e);
							}}
						>
							{/* <SVG src={searchIcon}></SVG> */}
							<i className="fa fa-search" />
						</div>
					</form>
				</div>

				<div className="myLocation">
					<button
						// onClick={this.getParkData.bind(this, this.state.formInput)}
						className="nearMe"
						type="button"
						disabled={this.state.isLoadingLocation}
						onClick={this.getMyLocation}
					>
						<strong>{this.renderLocationSpinner()}</strong>
					</button>
				</div>

				{/* CLEAR BUTTON!!!! */}

				{/* <button
						className="btn btn-danger m-2"
						onClick={this.props.clearParks}
						// className={this.clearButtonClass()}
						type="button"
					>
						<strong>Clear</strong>
					</button> */}

				<div className="advancedSearchToggle">
					<button
						className="ToggleAdvancedSearch"
						onClick={() =>
							this.setState({
								advancedSearch: !this.state.advancedSearch
							})
						}
					>
						<span>Advanced Search</span>
						<i className="fas fa-caret-down" />
					</button>
				</div>

				<div className="AdvancedSearch">
					{/* <LocationSearchInput /> */}
					<form>
						<span className="FormTitle">Max Distance (km)</span>

						<br />
						<SliderStyle>
							{/* old max was 250 */}
							<MuiSlider
								aria-labelledby="discrete-slider-custom"
								min={5}
								max={140}
								step={5}
								valueLabelDisplay="auto"
								marks={marksDist}
								value={parseFloat(this.state.reqData.dist)}
								onChange={this.handleDistanceChange}
							/>
						</SliderStyle>
						<br />
						<span className="FormTitle">
							Max Light Pollution Zone
						</span>
						<br />
						<SliderStyle>
							{/* old max was 4.0 */}
							<MuiSlider
								aria-labelledby="discrete-slider-custom"
								min={0.4}
								max={4.0}
								step={0.1}
								valueLabelDisplay="auto"
								marks={marksLight}
								value={parseFloat(this.state.reqData.lightpol)}
								onChange={this.handleLightPolChange}
							/>
						</SliderStyle>
					</form>
				</div>

				{this.renderFormErrors()}

				{this.state.isInvalidLocation ? (
					<span className="messageAboveForm">
						<span className=" invalidLocation">
							Invalid location - please try again.
						</span>
					</span>
				) : (
					<span className="messageAboveForm">
						<span className="generic">Let's stargaze:</span>
					</span>
				)}

				{/* <button
							onClick={e => this.onSubmit(e)}
							disabled={this.props.isFetchingParks}
						>
							Stargaze
						</button> */}
			</SearchFormStyle>
		);
	}
}

const marksDist = [
	{
		value: 5,
		label: "5"
	},
	{
		value: 25
	},
	{
		value: 50,
		label: "50"
	},
	{
		value: 75,
		label: "75"
	},
	{
		value: 100,
		label: "100"
	},
	{
		value: 140,
		label: "140"
	}
	// {
	// 	value: 250,
	// 	label: "250"
	// }
];

const marksLight = [
	{
		value: 0.4,
		label: "Dark"
	},
	{
		value: 1.0
	},
	{
		value: 1.75,
		label: "Rural"
	},
	{
		value: 3.0,
		label: "Rural/Suburban"
	},
	{
		value: 3.5
	},
	{
		value: 4.0
	}
];

const ParkForm = parkFormProps => (
	<AuthConsumer>
		{authState => (
			<BaseParkForm {...{ ...parkFormProps, authState: authState }} />
		)}
	</AuthConsumer>
);

export default withRouter(ParkForm);

const SearchFormStyle = styled.div`
	background: none;

	font-family: "Lato", sans-serif;

	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: ${props =>
		props.advancedSearch ? `auto auto auto` : `auto auto`};
	grid-gap: 10px;
	grid-template-areas:
"messageAboveForm messageAboveForm messageAboveForm"
		"searchBar searchBar searchBar"
	
		"advancedSearchToggle advancedSearchToggle myLocation"
		${props =>
			props.advancedSearch
				? `"advancedSearch advancedSearch advancedSearch"`
				: ``};

	@media screen and (min-width: 320) {
		grid-template-areas:
"messageAboveForm messageAboveForm messageAboveForm"
			"searchBar searchBar myLocation"
			"advancedSearchToggle advancedSearchToggle advancedSearchToggle"
			${props =>
				props.advancedSearch
					? `"advancedSearch advancedSearch advancedSearch"`
					: ``};
	}

	@media screen and (min-width: 480px) {
		grid-template-areas:
		"messageAboveForm messageAboveForm messageAboveForm"
			"searchBar searchBar myLocation"
			"advancedSearchToggle advancedSearchToggle advancedSearchToggle"
			${props =>
				props.advancedSearch
					? `"advancedSearch advancedSearch advancedSearch"`
					: ``};
	}

	.messageAboveForm{
		grid-area: messageAboveForm;
		text-align: left;
		font-weight: 600;
		animation: fadein 3s;
			@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}



		.invalidLocation{
			color: ${props => props.theme.colorBad};
		}
		.generic{
			color: ${props => props.theme.yellow};

		}
		
	}

	.AdvancedSearch {

		width: 90%;
		margin: auto auto;
		${props => (props.advancedSearch ? `` : `display: none`)}
		grid-area:advancedSearch;

		.FormTitle {
			color: ${props => props.theme.white};
			font-weight: 600;
		}
	}

	.myLocation {
		color: ${props => props.theme.white};
		font-size: 13px;

		.nearMe {
			all: unset;
			-webkit-appearance: none !important;
			-moz-appearance: none !important;
			appearance: none !important;
			cursor: pointer;

			background: ${props => props.theme.yellow};
			border-radius: 20px;
			height: 36px;
			width: 100%;
			-webkit-text-fill-color: rgba(0, 0, 0, 1); 
   -webkit-opacity: 1; 
			color: ${props => props.theme.prettyDark};
			transition: color 0.1s ease;
			font-size: 15px;
			font-weight: 600;

			:disabled {
				background: gray;
			}
			:hover:enabled {
				background-color: ${props => props.theme.colorMedium};
				/* color: ${props => props.theme.highlightPink}; */
			}
			:active:enabled {
				-webkit-transform: scale(1.05);
				transform: scale(1.05);
			}
		}
		grid-area: myLocation;
	}

	.advancedSearchToggle {
		grid-area: advancedSearchToggle;
		margin: auto 0;
		span {
			font-weight: 500;
		}

		button {
			float: left;
			i {
				margin-left: 5px;
				transform: rotate(
					${props => (props.advancedSearch ? `0deg` : `-90deg`)}
				);
			}
		}
	}

	.citySearch {
		grid-area: searchBar;
	}

	.searchButton {
		width: 40px;
		height: 36px;
		-webkit-appearance: none !important;
-moz-appearance: none !important;
appearance: none !important;
		
		svg{
			margin: auto auto;

display: block;
		}

		background: ${(props, isInvalidLocation) =>
			isInvalidLocation
				? props.theme.highlightPink
				: props.theme.prettyDark};
		text-align: center;

		color: ${props => props.theme.white};

		cursor: pointer;
		font-size: 20px;
		border: 2px solid #2a2c2d;
		float: left;
		background-position: center;
		transition: background 0.2s, color 0.1s ease;

		:focus {
			outline: 0;
		}

		:hover {
			background: ${props => props.theme.prettyDark}
				radial-gradient(circle, transparent 1%, rgba(0, 0, 0, 0.3) 1%)
				center/15000%;
			color: ${props => props.theme.colorMedium};
		}

		:active {
			background-color: rgba(0, 0, 0, 0.3);
			background-size: 100%;
			transition: background 0s;
		}
	}


	.searchTerm {
		-webkit-appearance: none !important;
			-moz-appearance: none !important;
			appearance: none !important;
			border-radius:0;
	
		width: calc(100% - 40px);
		background-color: ${props => props.theme.darkAccent};
		transition: background-color 0.1s ease;

		padding: 5px;
		height: 36px;

		outline: none;
		color: ${props => props.theme.white};
		border: none;
		float: left;

		:focus {
		color: ${props => props.theme.white};
	}

		:hover,
		:active {
			background-color: ${props => props.theme.moonBackground};
			transition: background-color 0.1s ease;
		}

		::placeholder {
			font-weight: 300;
			opacity: 0.5;
		}
	}

	.ToggleAdvancedSearch {
		all: unset;
		-webkit-appearance: none !important;
			-moz-appearance: none !important;
			appearance: none !important;
		
		cursor: pointer;
		color: #bdbdbd;
		:hover,
		:active {
			color: ${props => props.theme.colorMedium};
			transition: color 0.2s ease;
		}
	}
`;

const SliderStyle = styled.div`
	.MuiSlider-root {
		color: ${props => props.theme.cardLight};
	}
	.MuiSlider-markLabel {
		color: #bdbdbd;
		font-family: "Lato", sans-serif;
	}
	.MuiSlider-markLabelActive {
		color: ${props => props.theme.colorMedium};
	}
`;

const ErrorStyle = styled.div`
	color: ${props => props.theme.colorMedium};
`;
