//Store parks state and handle display
import React, { Component } from "react";
import ParkForm from "./ParkForm";
import ParkTable from "./ParkTable";
import ParkMap from "./ParkMap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import MoonComponent from "./Moon";
import { Spring, animated } from "react-spring/renderprops";
import humidityIcon from "./style/Media/cardIcons/humidity.svg";
import cloudBadIcon from "./style/Media/cardIcons/cloudBad.svg";
import lightPolIcon from "./style/Media/cardIcons/lightPol.svg";
import tempIcon from "./style/Media/cardIcons/temperature.svg";
import { withRouter } from "react-router-dom";
import TelescopeCircle from "./TelescopeCircle";
import NoResultsModal from "./NoResultsModal";

function inRange(x, min, max) {
	return (x - min) * (x - max) <= 0;
}

export function parkScore(moonFraction, humidity, cloudCov, lightPol) {
	// console.log("MOON FRACTION % IS !!!!!!!!!!!!!!", moonFraction);
	// console.log("CLOUD COV IS !!!!!!!!!!!!!!", cloudCov);
	// console.log("LIGHT POL IS !!!!!!!!!!!!!!", lightPol);
	// console.log("humidity COV IS !!!!!!!!!!!!!!", humidity);
	var moonScore = 0;
	if (moonFraction < 0.2) {
		moonScore = 1;
	} else if (inRange(moonFraction, 0.2, 0.7)) {
		moonScore = -2 * moonFraction + 1.4;
	} else {
		moonScore = 0;
	}
	var lightPolScore = 0.25 * (((-1 * 1) / 3) * (lightPol - 3));
	var humidityScore = 0;
	if (humidity < 0.4) {
		humidityScore += 0.15 * 1;
	} else if (inRange(humidity, 0.4, 0.8)) {
		humidityScore += 0.15 * (-2.5 * humidity + 2);
	} else if (0.8 < humidity) {
		humidityScore += 0;
	}
	var cloudScore = 0;
	if (cloudCov < 0.2) {
		cloudScore += 0.15 * 1;
	} else if (inRange(cloudCov, 0.2, 0.4)) {
		cloudScore += 0.15 * (-5 * cloudCov + 2);
	} else if (0.4 < cloudCov) {
		cloudScore += 0;
	}

	const finalScore = moonScore + cloudScore + humidityScore + lightPolScore;

	if (finalScore < 0) {
		finalScore = 0;
	} else if (finalScore > 100) {
		finalScore = 100;
	}

	// console.log(
	// 	"Moon score, cloudscore, humidity, lightpolscore ",
	// 	moonScore,
	// 	cloudScore,
	// 	humidityScore,
	// 	lightPolScore
	// );
	// console.log("final score: ", finalScore);
	return {
		finalScore: finalScore,
		moonScore: moonScore,
		cloudScore: cloudScore,
		humidityScore: humidityScore,
		lightPolScore: lightPolScore
	};
}

class BaseParksData extends Component {
	state = {
		parks: [],
		fetchReq: [],
		moonPhase: "",
		moonFraction: "",
		moonType: "",
		stellarData: {},
		isMapLoaded: false,
		isFetchingParks: false,
		hideForm: false,
		hideMap: true,
		sortedBy: "dist"
	};
	/* Note - park object is:
        {
            distance: number,
            id: number,
            lat: number,
            lng: number,
            light_pol: number,
            name: string,
            osmid: number,
        }
    */
	constructor(props) {
		super(props);
		this.googleMap = false;
		//I don't think markers should go in the state because, like googleMap,
		// They're referenced in odd places and may update at weird times from the rest of doms
		// Since they're google map things
		this.markers = {};
		this.noParksModalOpen = false;
	}

	handleMapLoaded = googleMapActual => {
		this.googleMap = googleMapActual;
		this.setState({ ...this.state, isMapLoaded: true });
	};

	handleCloseNoParksModal = () => {
		this.noParksModalOpen = false;
	};

	//Request parks from server
	//getParkData is a function, weird react notation perhaps?
	//note, reqData could be X, just a variable name! int x=

	//YOU NEED THE / in the ADDRESS!!
	//don't put "getParkData", must be "/name"
	//getParkData gets called, and does a fetch to
	//app.post("/api/getParkData")
	getParkData = reqData => {
		console.log(reqData);
		// this.updateHistoryQuery(reqData);
		this.setState({ isFetchingParks: true });
		let storageKey = JSON.stringify(reqData);
		let localData = sessionStorage.getItem(storageKey);

		//Pull from local storage if possible
		if (localData) {
			//Check if it's expired
			let data = JSON.parse(localData);
			let now = new Date();
			let expiration = new Date(data.timestamp);
			expiration.setMinutes(expiration.getMinutes() + 60);
			if (!data.timestamp || now.getTime() > expiration.getTime()) {
				console.log("Removing expired data from storage:", data);
				localData = false;
				sessionStorage.removeItem(storageKey);
			}
		}

		if (localData) {
			console.log("Loaded from storage:", JSON.parse(localData));
			this.setState({
				parks: JSON.parse(localData).parks,
				moonPhase: JSON.parse(localData).moonPercent,
				moonFraction: JSON.parse(localData).moonFraction,
				moonType: JSON.parse(localData).moonType,
				stellarData: JSON.parse(localData).stellarData,

				fetchReq: reqData,
				isFetchingParks: false
			});
		} else {
			// let fetchingState = this.state;
			// fetchingState.isFetching = true;
			// this.setState(fetchingState);
			axios
				.post("/api/getParkData", reqData)
				.then(response => {
					console.log(response.data);
					if (!(response.status === 204)) {
						let maxScore = 0;
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
							parks: response.data.parks,
							moonPhase: response.data.moonPercent,
							moonFraction: response.data.moonfraction,
							moonType: response.data.moonType,
							stellarData: response.data.stellarData,
							fetchReq: reqData,
							isFetchingParks: false
						});
						let d = new Date();
						response.data.timestamp = d.getTime();
						sessionStorage.setItem(
							JSON.stringify(reqData),
							JSON.stringify(response.data)
						);
						console.log("Saved to storage:", response.data);
					} else {
						console.log("GOT HERE 204 204 MUMBAI NO EXIST!");
						this.setState({ parks: [], isFetchingParks: false });
						// return <NoResultsModal />;
					}
				})
				.catch(err => {
					console.error(err);
					this.setState({ parks: [], isFetchingParks: false });
				});
		}
	};

	//Clear button handler
	clearParks = () => {
		this.setState({ parks: [], fetchReq: [] });
	};

	renderParkMap = () => {
		return (
			<Spring
				native
				//force
				config={{ tension: 2000, friction: 100, precision: 1 }}
				from={{
					transform: this.state.hideMap
						? "translate3d(0,30px,0)"
						: "translate3d(0,0,0)",
					opacity: this.state.hideMap ? 0 : 1
				}}
				to={{
					transform: this.state.hideMap
						? "translate3d(0,0,0)"
						: "translate3d(0,30px,0)",
					opacity: this.state.hideMap ? 1 : 0
				}}
			>
				{props => (
					<animated.div className="ParkMapStyle" style={props}>
						<ParkMap
							parkList={this.state.parks}
							markers={this.markers}
							location={this.state.fetchReq}
							onMapLoaded={this.handleMapLoaded}
							moonPhase={this.state.moonPhase}
							moonType={this.state.moonType}
						/>
					</animated.div>
				)}
			</Spring>

			// <div className="ParkMapStyle">
			// 	<ParkMap
			// 		parkList={this.state.parks}
			// 		markers={this.markers}
			// 		location={this.state.fetchReq}
			// 		onMapLoaded={this.handleMapLoaded}
			// 		moon={this.state.moonPhase}
			// 		moonType={this.state.moonType}
			// 	/>
			// </div>
		);
	};

	renderParkForm = () => {
		if (true) {
			return (
				<div className="ParkFormStyle">
					<ParkForm
						fetchParks={this.getParkData}
						clearParks={this.clearParks}
						isFetchingParks={this.state.isFetchingParks}
						googleMap={this.googleMap}
						markers={this.markers}
					/>
				</div>
			);
		}
	};

	sortParksDist = () => {
		let parksArray = this.state.parks;
		parksArray.sort((a, b) =>
			a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0
		);
		this.setState({ parks: parksArray, sortedBy: "dist" });
	};

	sortParksScore = () => {
		let parksArray = this.state.parks;
		parksArray.sort((a, b) =>
			a.score > b.score ? -1 : b.score > a.score ? 1 : 0
		);
		this.setState({ parks: parksArray, sortedBy: "score" });
	};

	renderNoResults = () => {
		if (!this.state.isFetchingParks 
			// && !this.noParksModalOpen
			) {
			if (this.state.parks.length) {
				if (
					Math.max(...this.state.parks.map(park => park.score)) < 0.6
				) {
					this.noParksModalOpen = true;
					return (
						<NoResultsModal
							noVis={true}
							moonPhase={this.state.moonPhase}
							scoreBreakdown={this.state.parks[0].scoreBreakdown}
							handleCloseNoParksModal={
								this.handleCloseNoParksModal
							}
						/>
					);
				} else {
					return "";
				}
			} else {
				console.log("Drawing noresultsmodal for no parks");
				this.noParksModalOpen = true;
				return (
					<NoResultsModal
						handleCloseNoParksModal={this.handleCloseNoParksModal}
					/>
				);
			}
		}
	};

	renderResults = () => {
		return (
			<ResultsPageStyle>
				{this.renderNoResults()}
				{/* {this.renderParkMap()} */}
				<div className="RightSideContainerFull">
					{/* <button
						onClick={() => {
							this.setState({ hideForm: !this.state.hideForm });
						}}
					>
						Toggle form
					</button> */}
					{/* <div className="FormMoonWrapper"> */}
					{this.renderParkForm()}

					<div className="MoonStyle">
						<MoonComponent
							moonPhase={this.state.moonPhase}
							parkList={this.state.parks}
							moonType={this.state.moonType}
							stellarData={this.state.stellarData}
						/>
					</div>

					<div className="SortByContainer">
						<div className="SortBy">
							Sort parks by:{"  "}
							<button
								onClick={this.sortParksDist}
								disabled={this.state.sortedBy === "dist"}
							>
								Distance
							</button>
							<button
								onClick={this.sortParksScore}
								disabled={this.state.sortedBy === "score"}
							>
								Score
							</button>
						</div>
					</div>

					<div className="ParkTableStyle">
						<ParkTable
							parkList={this.state.parks}
							moon={this.state.moonPhase}
							moonType={this.state.moonType}
							googleMap={this.googleMap}
							markers={this.markers}
							isLoadingParks={this.state.isFetchingParks}
						/>
					</div>
				</div>
			</ResultsPageStyle>
		);
	};

	renderLanding = () => {
		return (
			<LandingPageStyle>
				{this.renderParkForm()}
				<TelescopeCircle />
				{/* {this.renderParkMap()} */}
			</LandingPageStyle>
		);
	};

	//recursively calls render on it's children
	render() {
		console.log("ParksData - rendered");
		console.log("Current location: ", window.location.pathname);
		return (
			<MainContentWrapper
				active={this.state.hideForm}
				hideMap={this.state.hideMap}
				pathname={window.location.pathname}
			>
				{this.renderParkMap()}
				{window.location.pathname === "/home"
					? this.renderLanding()
					: this.renderResults()}
			</MainContentWrapper>
		);
	}
}

const ParksData = parkProps => (
	<Router>
		<Route
			path={["/home", "/search"]}
			render={routerProps => (
				//Combine props passed to parkForm with router props
				<BaseParksData {...{ ...parkProps, ...routerProps }} />
			)}
		/>
	</Router>
);

export default withRouter(ParksData);

//////////////////////////////////////////

const LandingPageStyle = styled.div`
	.ParkFormStyle {
		width: 95%;
		margin: auto auto;
		margin-top: 10vh;

		@media screen and (min-width: 320px) {
			width: 95%;
			margin: auto auto;
			margin-top: 10vh;
		}

		@media screen and (min-width: 420px) {
			width: 90%;
			margin: auto auto;
			margin-top: 10vh;
		}

		@media screen and (min-width: 769px) {
			width: 50%;
		
			margin: auto auto;
			margin-top: 10vh;
		}


	}
`;

const ResultsPageStyle = styled.div`
	display: grid;
	margin: 0 auto 0 auto;
	margin-top: -80vh;
	overflow: none;
	

	grid-template-columns: 1fr 1fr;
	grid-column-gap: 10px;
	grid-row-gap: 10px;
	grid-template-areas: ". rightSide";
	.Placeholder1 {
		display: none;
		grid-area: placeholder1;
		background-color: azure;
	}
	.RightSideContainerFull {
		z-index: 0;
		grid-area: rightSide;
		margin-bottom: -30px; /* Spacing between cards offset */
		/* overflow-y: scroll;
		overflow-x: hidden; */
		/* background-color: ${props => props.theme.white}; */
	}
	.ParkFormStyle {
		/* height: 11vh; */
		/* height: 50%; */
		grid-area: form;
		${({ active }) => active && `display: none;`}
	}
	/* .FormMoonWrapper{
		min-height: 33.33vh;
	} */

	.MoonStyle {
		/* height: 50%; */
		/* background: ${props => props.theme.moonCard}; */
		background: none;
	}

	.helpCard{
		font-family: 'Lato', sans-serif;
		height: 140px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		grid-template-areas: 
		"help help help help help"
		"iconA iconB iconC iconD iconE"
		"descA descB descC descD descE";
		padding: 0px 10px 10px 15px;
		font-size: 14px;
		/* box-shadow: inset 0px 0px 0px 4px #485261;

		background: ${props => props.theme.cardLight}; */

		background: -moz-linear-gradient(0deg, rgba(189,194,198,0.95) 0%, rgba(172,177,181,1) 100%); /* ff3.6+ */
		background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(189,194,198,0.95)), color-stop(100%, rgba(172,177,181,1))); /* safari4+,chrome */
		background: -webkit-linear-gradient(0deg, rgba(189,194,198,0.95) 0%, rgba(172,177,181,1) 100%); /* safari5.1+,chrome10+ */
		background: -o-linear-gradient(0deg, rgba(189,194,198,0.95) 0%, rgba(172,177,181,1) 100%); /* opera 11.10+ */
		background: -ms-linear-gradient(0deg, rgba(189,194,198,0.95) 0%, rgba(172,177,181,1) 100%); /* ie10+ */
		background: linear-gradient(90deg, rgba(189,194,198,0.95) 0%, rgba(172,177,181,1) 100%); /* w3c */
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#BDC2C6', endColorstr='#ACB1B5',GradientType=1 ); /* ie6-9 */

		img,i{
			margin: auto auto auto auto;
		}
		span{
			margin: 0px auto auto auto;
		}
		.help{
			color: ${props => props.theme.fontDark};
			font-size: 20px;
			
			font-weight: 600;
			margin: auto auto 0px auto;
			grid-area: help;
		}

		.iconA{
			grid-area: iconA
		}
		.iconB{
			grid-area: iconD
		}
		.iconC{
			font-size: 52px;
			grid-area: iconC
		}
		.iconD{
			grid-area: iconB
		}
		.iconE{
			
			grid-area: iconE
		}

		.descA{
			grid-area: descA
		}
		.descB{
			grid-area: descD
		}
		.descC{
			grid-area: descC
		}
		.descD{
			grid-area: descB
		}
		.descE{
			grid-area: descE
		}

	}

	.SortByContainer {
		font-family: 'Lato', sans-serif;
	
		padding: 13px 0px 13px 0px;
		width: 100%;

		.SortBy {
			color: ${props => props.theme.white};
			transition: color 0.2s ease;
			button{	
				all: unset;
				color: ${props => props.theme.yellow};
				font-weight: 600;
				cursor: pointer;
				margin: 0 0px 0 15px;
				:hover {
					color: ${props => props.theme.colorBad};
					transition: color 0.2s ease;
				}
				:active {
					color: ${props => props.theme.yellow};
					transition: color 0.2s ease;
		-webkit-transform: scale(1.05);
		transform: scale(1.05);

				}
			}
			display: flex;
			justify-content: flex-start;
		}
	}

	.ParkTableStyle {
		/* ${({ active }) => {
			if (active) return `max-height:600px;`;
			else return `max-height:300px`;
		}} */
	}

	/* formerly min-width: 769px*/
	@media screen and (max-width: 989px) {
		margin-top: 4rem;
		width: 100%;
		grid-template-columns: 1fr;
		grid-template-rows: ${props => (props.hideMap ? "0px auto" : "50% auto")};
		grid-template-areas:
			/* "map" */
			"rightSide";
		.RightSideContainerFull {
			overflow: none;
		}

		.ParkMapStyle {
			display: ${props => (props.hideMap ? "none" : "fixed")};
		}
	}
	
	@media screen and (min-width: 990px) and (max-width: 1300px) {
		/* width: 90%; */
		/* margin-top: 0rem; */
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		grid-template-areas:
			". rightSide"
			". rightSide";
		.ParkFormStyle {
			grid-area: form;
			${({ active }) => active && `display: none;`}
		}
	}
`;

const MainContentWrapper = styled.div`
	width: 90vw;
	margin: 0 auto 0 auto;
	.ParkMapStyle {
		/* grid-area: map; */

		position: -webkit-sticky;
		position: sticky;
		height: 80vh;
		width: 42.5vw;
		top: 10vh;
		background-color: gray;
		display: ${props => (props.pathname === "/home" ? "none" : "fixed")};
	}
	@media screen and (max-width: 989px) {
		.ParkMapStyle {
			display: ${props => (props.hideMap ? "none" : "fixed")};
		}
	}
`;
