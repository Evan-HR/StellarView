//Input form
import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import qs from "qs";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { sizing } from "@material-ui/system";
import { AuthConsumer } from "./AuthContext";
import styled from "styled-components";

class BaseParkForm extends Component {
	state = {
		reqData: {
			lat: "",
			lng: "",
			dist: 25,
			lightpol: 1.5,
			error: "",
			placeName: ""
		},
		isLoadingLocation: false,
		isGeocodingLocation: false,
		isInvalidLocation: false,
		formErrors: {}
	};

	constructor(props) {
		super(props);
		this.sliderLight = this.state.reqData.lightpol;
		this.sliderDist = this.state.reqData.dist;
	}

	//There are two cases when we would want to load results form url query:
	// 1: We hit back/forward to go to previous searches
	// 2: We load page from a link with query information

	// componentDidMount runs RIGHT after post-render
	componentDidMount() {
		// this.getMyLocation();
		console.log("USER LOC: ", this.props.userLocation);

		//On page load, load results from query is possible
		console.log("Form mounted, searching...");
		this.loadQuery();
	}

	componentDidUpdate() {
		//On back button load previous results
		window.onpopstate = e => {
			console.log("Back button pressed");
			this.loadQuery();
		};
	}

	//Load query into state
	loadQuery = () => {
		let query = qs.parse(this.props.history.location.search, {
			ignoreQueryPrefix: true
		});
		console.log(query);
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
						console.log("Submitting..", this.state.reqData);
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
			...this.state,
			reqData: {
				...this.state.reqData,
				placeName: changeEvent.target.value
			},
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
				console.log(data);
				this.setState({
					isGeocodingLocation: false,
					reqData: {
						...this.state.reqData,
						lat: parseFloat(data[0].lat),
						lng: parseFloat(data[0].lon)
					}
				});
				var latLng = new window.google.maps.LatLng(
					parseFloat(data[0].lat),
					parseFloat(data[0].lon)
				); //Makes a latlng
				this.props.googleMap.panTo(latLng); //Make map global
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

	//   In order to have access to  this.state inside
	//    getCurrentPosition's callback, you either need to
	//    bind the success callback or make use of arrow function.
	getMyLocation = e => {
		this.setState({ isLoadingLocation: true });
		console.log(this.props);
		if (
			!this.props.authState.userLocation ||
			(this.props.authState.userLocation.lat === "" &&
				this.props.authState.userLocation.lng === "")
		) {
			console.log("Getting new location");
			navigator.geolocation.getCurrentPosition(
				position => {
					this.setState({
						...this.state,
						reqData: {
							...this.state.reqData,
							lat: position.coords.latitude,
							lng: position.coords.longitude,
							error: null
						},
						isLoadingLocation: false
					});
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
			console.log("Fetching auth location");
			if (window.google) {
				this.props.googleMap.panTo(
					new window.google.maps.LatLng(
						this.props.authState.userLocation.lat,
						this.props.authState.userLocation.lng
					)
				);
			}
			this.setState({
				reqData: {
					...this.state.reqData,
					lat: this.props.authState.userLocation.lat,
					lng: this.props.authState.userLocation.lng
				},
				isLoadingLocation: false
			});
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

	//props to send one-way information to ParksData
	//this.state is the "X" in getParkData()
	//fetchP(x) --> getParkData(x)
	onSubmit = e => {
		if (e) e.preventDefault();
		//console.log(this.state.reqData);
		const errors = this.validate(this.state.reqData);
		if (errors.length === 0) {
			var d = new Date();

			this.setState({
				...this.state,
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
			this.setState({ ...this.state, formErrors: errors });
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
		console.log("Updating history...");
		//this.props.history.push({ query: "test" });
		let query = qs.parse(this.props.history.location.search, {
			ignoreQueryPrefix: true
		});
		if (
			query.lat !== parseFloat(reqData.lat).toFixed(4) ||
			query.lng !== parseFloat(reqData.lng).toFixed(4) ||
			query.dist !== reqData.dist.toString() ||
			query.lightpol !== parseFloat(reqData.lightpol).toFixed(2)
		) {
			this.props.history.push({
				search: `?lat=${parseFloat(reqData.lat).toFixed(
					4
				)}&lng=${parseFloat(reqData.lng).toFixed(4)}&dist=${
					reqData.dist
				}&lightpol=${parseFloat(reqData.lightpol).toFixed(2)}`
			});
		} else {
			console.log("Attempting to repeat current search.");
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
					<span class="spinner-border spinner-border-sm" />
					Locating
				</React.Fragment>
			);
		} else {
			return "Near Me";
		}
	};

	renderFormErrors = () => {
		if (Object.keys(this.state.formErrors).length > 0) {
			return (
				<React.Fragment>
					<b class="text-danger">
						{this.state.formErrors.join(", ")}
					</b>
					<br />
				</React.Fragment>
			);
		}
	};

	render() {
		//console.log("Fetching parks?", this.props.isFetchingParks);
		return (
			<div className="border border-primary">
				{/* <br />
				lat: {this.state.reqData.lat}, lng: {this.state.reqData.lng}
				<br />
				dist: {this.state.reqData.dist}, lightpol:{" "}
				{this.state.reqData.lightpol}
				<br /> */}
				<h3>Input Form</h3>
				<form
					onSubmit={e => {
						e.preventDefault();
					}}
				>
					<input
						type="text"
						name="placeName"
						value={this.state.reqData.placeName || ""}
						onChange={this.handlePlaceChange}
					/>
					<button
						className={
							"btn m-1" +
							(this.state.isInvalidLocation
								? " btn-danger"
								: " btn-primary")
						}
						disabled={
							this.state.reqData.placeName === "" ||
							this.state.isGeocodingLocation
						}
						onClick={e => {
							this.getPlaceCoordinates(e);
						}}
					>
						🔎
					</button>

					<button
						// onClick={this.getParkData.bind(this, this.state.formInput)}
						className="btn btn-primary m-1"
						type="button"
						disabled={this.state.isLoadingLocation}
						onClick={this.getMyLocation}
					>
						<strong>{this.renderLocationSpinner()}</strong>
					</button>
					<button
						className="btn btn-danger m-2"
						onClick={this.props.clearParks}
						// className={this.clearButtonClass()}
						type="button"
					>
						<strong>Clear</strong>
					</button>
				</form>
				<form className="mx-5">
					<br />
					<input
						placeholder="Latitude"
						type="number"
						min="-90"
						max="90"
						step="any"
						value={this.state.reqData.lat || ""}
						id="Lat"
						name="lat"
						required
						//does this character by character, each char is a new 'event'
						onChange={this.handleLatChange}
					/>
					<input
						placeholder="Longitude"
						type="number"
						min="-180"
						max="180"
						step="any"
						value={this.state.reqData.lng || ""}
						id="Long"
						name="lng"
						required
						onChange={this.handleLngChange}
					/>
					<br />
					<br />
					<b>Distance:</b>
					<br />
					<Slider
						//defaultValue={this.state.reqData.dist}
						// getAriaValueText={valuetext}
						aria-labelledby="discrete-slider-custom"
						min={5}
						max={200}
						step={1}
						valueLabelDisplay="auto"
						marks={marksDist}
						value={parseFloat(this.state.reqData.dist)}
						onChange={this.handleDistanceChange}
					/>
					<br />
					<b>Light Pollution:</b>
					<br />
					<Slider
						//defaultValue={this.state.reqData.lightpol}
						// getAriaValueText={valuetext}
						aria-labelledby="discrete-slider-custom"
						min={0}
						max={6}
						step={0.05}
						valueLabelDisplay="auto"
						marks={marksLight}
						value={parseFloat(this.state.reqData.lightpol)}
						onChange={this.handleLightPolChange}
						// onChangeCommitted={() =>
						// 	this.handleLightPolChange(this.sliderLight)
						// }
					/>
					<br />
					{this.renderFormErrors()}

					<MainButton
						onClick={e => this.onSubmit(e)}
						disabled={this.props.isFetchingParks}
					>
						Stargaze
					</MainButton>
				</form>
			</div>
		);
	}
}

const marksDist = [
	{
		value: 5,
		label: "5"
	},
	{
		value: 25,
		label: "25"
	},
	{
		value: 50,
		label: "50"
	},
	{
		value: 100,
		label: "100"
	},
	{
		value: 200,
		label: "200"
	}
];

const marksLight = [
	{
		value: 0,
		label: "0"
	},
	{
		value: 0.4,
		label: "0.4"
	},
	{
		value: 1,
		label: "1"
	},
	{
		value: 3,
		label: "3"
	},
	{
		value: 6,
		label: "6"
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

////////////////////////////////////////////
const MainButton = styled.button`
	background-color: transparent;
	display: inline-block;
	border-color: transparent;
	padding: 1.5em 2.6em;
	border-radius: 0;
	color: black;
	margin-top: 2rem;
	font-weight: bold;
	font-size: 0.8rem;
	letter-spacing: 1px;
	text-transform: uppercase;
	text-decoration: none;
	position: relative;
	transition: all 250ms ease;
	&:before,
	&:after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border: 2px solid;
		transition: 0.25s;
	}
	&:before {
		transform: translateX(-0.25em) translateY(0.25em);
	}
	&:after {
		transform: translateX(0.25em) translateY(-0.25em);
	}

	&:hover {
		&:before,
		&:after {
			transform: translateX(0) translateY(0);
		}
	}
`;
