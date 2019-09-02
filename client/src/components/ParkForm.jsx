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
import nearMeButton from "./style/Media/round-my_location-24px.svg";
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// const theme1 = createMuiTheme({
// 	overrides: {
// 		MuiSlider: {

// 			root: {
// 				color:'#BDC2C6',
// 			},
// 		},
// 	},
//   });

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
		advancedSearch: false
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
				async position => {
					console.log(
						`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
					);
					let address = await axios.get(
						`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
					);
					address = address["data"]["address"]["city"];
					console.log(address);
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
			console.log("Fetching auth location");
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
			this.props.history.push(
				`/search?lat=${parseFloat(reqData.lat).toFixed(
					4
				)}&lng=${parseFloat(reqData.lng).toFixed(4)}&dist=${
					reqData.dist
				}&lightpol=${parseFloat(reqData.lightpol).toFixed(2)}`
			);
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
				</React.Fragment>
			);
		}
	};

	render() {
		//console.log("Fetching parks?", this.props.isFetchingParks);
		return (
			<SearchFormStyle advancedSearch={this.state.advancedSearch}>
				<div className="citySearch">
					<form
						onSubmit={e => {
							e.preventDefault();
						}}
					>
						<input
							className="searchTerm"
							type="text"
							name="placeName"
							placeholder="Enter your city e.g. London, ON"
							value={this.state.reqData.placeName || ""}
							onChange={this.handlePlaceChange}
						/>

						<button
							className={
								"searchButton"
								// (this.state.isInvalidLocation
								// 	? " btn-danger"
								// 	: " btn-primary")
							}
							disabled={
								this.state.reqData.placeName === "" ||
								this.state.isGeocodingLocation
							}
							onClick={e => {
								this.getPlaceCoordinates(e);
							}}
						>
							<i className="fa fa-search" />
						</button>
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
						<span>NEAR ME</span>

						<img src={nearMeButton} />
						{/* <strong>{this.renderLocationSpinner()}</strong> */}
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
						Advanced Search
						<i class="fas fa-caret-down" />
					</button>
				</div>

				<div className="AdvancedSearch">
					<form>
						<span className="FormTitle">Max Distance (km)</span>

						<br />
						<SliderStyle>
							<MuiSlider
								aria-labelledby="discrete-slider-custom"
								min={5}
								max={300}
								step={5}
								valueLabelDisplay="auto"
								marks={marksDist}
								value={parseFloat(this.state.reqData.dist)}
								onChange={this.handleDistanceChange}
							/>
						</SliderStyle>
						<br />
						<span className="FormTitle">Light Pollution</span>
						<br />
						<SliderStyle>
							<MuiSlider
								aria-labelledby="discrete-slider-custom"
								min={0}
								max={6.5}
								step={null}
								valueLabelDisplay="auto"
								marks={marksLight}
								value={parseFloat(this.state.reqData.lightpol)}
								onChange={this.handleLightPolChange}
							/>
						</SliderStyle>
					</form>
				</div>

				{this.renderFormErrors()}

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
		value: 0.4,
		label: "Dark"
	},
	{
		value: 1.0,
		label: "Rural"
	},
	{
		value: 3.0,
		label: "Brighter Rural"
	},
	{
		value: 6.0,
		label: "Suburban"
	}
	// {
	// 	value: 6,
	// 	label: "6"
	// }
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

const SearchFormStyle = styled.div`
	background-color: ${props => props.theme.bodyBackground};
	font-family: IBM Plex Sans;
	padding: 13px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: ${props =>
		props.advancedSearch
			? `auto auto auto`
			: `auto auto`}; /* Three rows, two with explicit widths */
	grid-gap: 10px;
	grid-template-areas:
		"searchBar searchBar myLocation"
		"advancedSearchToggle advancedSearchToggle advancedSearchToggle"
		${props =>
			props.advancedSearch
				? `"advancedSearch advancedSearch advancedSearch"`
				: ``};
	.AdvancedSearch {
		${props => (props.advancedSearch ? `` : `display: none`)}
		grid-area:advancedSearch;

		.FormTitle {
			color: whitesmoke;
			font-weight: 600;
		}
	}

	.myLocation {
		color: whitesmoke;
		font-size: 13px;
		.nearMe {
			all: unset;
			cursor: pointer;
			background-color: ${props => props.theme.prettyDark};
			height: 36px;
			width: 100%;
			color: ${props => props.theme.whitesmoke};
			transition: color 0.2s ease;
			img {
				width: 28px;
				margin-left: 5px;
			}
			:hover,
			:active {
				color: ${props => props.theme.colorBad};
				transition: color 0.2s ease;
			}
		}
		grid-area: myLocation;
	}

	.advancedSearchToggle {
		grid-area: advancedSearchToggle;

		button {
			float: left;
			i {
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
		/* border: 1px solid #00b4cc; */
		background: ${props => props.theme.prettyDark};
		text-align: center;

		color: #fff;
		/* border-radius: 0 5px 5px 0; */
		cursor: pointer;
		font-size: 20px;
		border: none;
		float: left;
		:hover,
		:active {
			color: ${props => props.theme.colorBad};
			transition: color 0.2s ease;
		}
	}

	.searchTerm:focus {
		color: whitesmoke;
	}
	/* .search {
		width: 100%;
		position: relative;
		display: flex;
		grid-area: searchBar;
	} */

	.searchTerm {
		width: calc(100% - 40px);
		background: ${props => props.theme.lightDark};
		/* border: 3px solid #00b4cc; */
		/* border-right: none; */
		padding: 5px;
		height: 36px;
		/* border-radius: 5px 0 0 5px; */
		outline: none;
		color: whitesmoke;
		border: none;
		float: left;
	}

	.ToggleAdvancedSearch {
		all: unset;
		cursor: pointer;
		color: #bdbdbd;
		:hover,
		:active {
			color: ${props => props.theme.colorBad};
			transition: color 0.2s ease;
		}

		/* margin-top: 5px; */
	}
`;

// const muiTheme = getMuiTheme({
// 	slider: {
// 	  trackColor: 'yellow',
// 	  selectionColor: 'green'
// 	},
//   });

const SliderStyle = styled.div`
	.MuiSlider-root {
		color: ${props => props.theme.cardLight};
	}
	.MuiSlider-markLabel {
		color: #bdbdbd;
		font-family: IBM Plex Sans;
	}
	.MuiSlider-markLabelActive {
		color: ${props => props.theme.colorBad};
	}
`;
