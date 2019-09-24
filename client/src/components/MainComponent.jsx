//Store parks state and handle display
import React, { Component } from "react";
import ParkForm, { notifyLoadQuery } from "./ParkForm";
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
import { notifyCloseModal } from "./ParkMoreInfoModal";
import ee from "eventemitter3";

const emitter = new ee();

export const notifyInfoModalIsOpen = msg => {
	emitter.emit("infoModalIsOpen", msg);
};

export const notifyInfoModalIsClosed = msg => {
	emitter.emit("infoModalIsClosed", msg);
};

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
	var lightPolScore = ((-1 * 1) / 3) * (lightPol - 3);
	var humidityScore = 0;
	if (humidity < 0.4) {
		humidityScore += 1;
	} else if (inRange(humidity, 0.4, 0.8)) {
		humidityScore += -2.5 * humidity + 2;
	} else if (0.8 < humidity) {
		humidityScore += 0;
	}
	var cloudScore = 0;
	if (cloudCov < 0.2) {
		cloudScore += 1;
	} else if (inRange(cloudCov, 0.2, 0.4)) {
		cloudScore += -5 * cloudCov + 2;
	} else if (0.4 < cloudCov) {
		cloudScore += 0;
	}

	const finalScore =
		0.45 * moonScore +
		0.15 * cloudScore +
		0.15 * humidityScore +
		0.25 * lightPolScore;

	if (finalScore < 0) {
		finalScore = 0;
	} else if (finalScore > 1) {
		finalScore = 1;
	}

	console.log(
		"Moon score, cloudscore, humidity, lightpolscore ",
		moonScore,
		cloudScore,
		humidityScore,
		lightPolScore
	);
	console.log("final score: ", finalScore);
	return {
		finalScore: finalScore,
		moonScore: moonScore,
		cloudScore: cloudScore,
		humidityScore: humidityScore,
		lightPolScore: lightPolScore
	};
}

class BaseMainComponent extends Component {
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
		sortedBy: "dist",
		infoModalIsOpen: false
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
		this.markers = {};
		this.noParksModalOpen = false;
		emitter.on("infoModalIsOpen", msg => {
			console.log("Main component heard about modal OPENING");
			this.setState({ infoModalIsOpen: true });
		});
		emitter.on("infoModalIsClosed", () => {
			console.log("Main component heard about modal CLOSING");
			this.setState({ infoModalIsOpen: false });
		});
	}

	componentDidUpdate = () => {
		window.onpopstate = e => {
			console.log("Detected back button");
			if (this.state.infoModalIsOpen) {
				console.log("Notifying modal");
				notifyCloseModal();
			} else {
				console.log("Notifying park form");
				notifyLoadQuery();
			}
		};
	};

	handleMapLoaded = googleMapActual => {
		this.googleMap = googleMapActual;
		this.setState({ ...this.state, isMapLoaded: true });
	};

	handleCloseNoParksModal = () => {
		this.noParksModalOpen = false;
	};

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
				// console.log("Removing expired data from storage:", data);
				localData = false;
				sessionStorage.removeItem(storageKey);
			}
		}

		if (localData) {
			// console.log("Loaded from storage:", JSON.parse(localData));
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
			axios
				.post("/api/getParkData", reqData)
				.then(response => {
					// console.log(response.data);
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
						// console.log("Saved to storage:", response.data);
					} else {
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
					<animated.div className="parkMapStyle" style={props}>
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

			// <div className="parkMapStyle">
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
		return (
			<div className="parkFormStyle">
				<ParkForm
					fetchParks={this.getParkData}
					clearParks={this.clearParks}
					isFetchingParks={this.state.isFetchingParks}
					googleMap={this.googleMap}
					markers={this.markers}
				/>
			</div>
		);
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
		if (
			!this.state.isFetchingParks
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
				{/* {this.renderNoResults()} */}
				{/* {this.renderParkMap()} */}
				{/* <div className="formMoonCards"> */}
				{/* <button
						onClick={() => {
							this.setState({ hideForm: !this.state.hideForm });
						}}
					>
						Toggle form
					</button> */}
				{/* <div className="FormMoonWrapper"> */}

				<div className="formMoonSort">
					{/* {this.renderParkForm()} */}

					<div className="moonStyle">
						<MoonComponent
							moonPhase={this.state.moonPhase}
							parkList={this.state.parks}
							moonType={this.state.moonType}
							stellarData={this.state.stellarData}
						/>
					</div>

					<div className="sortByContainer">
						<div className="sortBy">
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
				</div>

				<div className="parkTableStyle">
					<ParkTable
						parkList={this.state.parks}
						moon={this.state.moonPhase}
						moonType={this.state.moonType}
						googleMap={this.googleMap}
						markers={this.markers}
						isLoadingParks={this.state.isFetchingParks}
					/>
				</div>
				{/* </div> */}
			</ResultsPageStyle>
		);
	};

	renderLanding = () => {
		return (
			<LandingPageStyle>
				{/* {this.renderParkForm()} */}
				<TelescopeCircle />
				{/* {this.renderParkMap()} */}
			</LandingPageStyle>
		);
	};

	render() {
		// console.log("MainComponent - rendered");
		// console.log("Current location: ", window.location.pathname);
		return (
			<MainContentWrapper
				active={this.state.hideForm}
				hideMap={this.state.hideMap}
				pathname={window.location.pathname}
			>
				{this.renderParkMap()}
				<div className="formMoonCards">
					{this.renderParkForm()}
					{window.location.pathname === "/home"
						? this.renderLanding()
						: this.renderResults()}
				</div>
			</MainContentWrapper>
		);
	}
}

const MainComponent = parkProps => (
	<Router>
		<Route
			path={["/home", "/search"]}
			render={routerProps => (
				//Combine props passed to parkForm with router props
				<BaseMainComponent {...{ ...parkProps, ...routerProps }} />
			)}
		/>
	</Router>
);

export default withRouter(MainComponent);

//////////////////////////////////////////

const LandingPageStyle = styled.div`
	.parkFormStyle {
		width: 90%;
		margin: auto auto;
		margin-top: 10vh;
		max-width: 530px;
		/* overflow: hidden; */

		@media screen and (min-width: 320px) {
			width: 85%;
			margin: auto auto;
			margin-top: 10vh;
		}

		@media screen and (min-width: 480px) {
			width: 85%;
			margin: auto auto;
			margin-top: 10vh;
		}

		@media screen and (min-width: 600px) {
			width: 75%;
			margin: auto auto;
			margin-top: 5.5vh;
		}

		@media screen and (min-width: 1000px) {
			width: 55%;
			margin: auto auto;
			margin-top: 7vh;
		}
	}
`;

const ResultsPageStyle = styled.div`
	margin: 0 auto 0 auto;
	margin-top: -80vh;
	overflow: none;

	.formMoonCards {
		z-index: 0;
		grid-area: formMoonCards;
		margin-bottom: -30px;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-areas:
			"formMoonSort"
			"cards";
	}

	.parkTableStyle {
		grid-area: cards;
	}

	.formMoonSort {
		width: 95%;
		margin: auto auto;
		display: grid;
		grid-area: formMoonSort;

		grid-template-areas:
			"form"
			"moonContainer"
			"sort";

		@media screen and (min-width: 350px) {
			padding: 0 5px;
		}

		@media screen and (min-width: 600px) {
			padding: 0;
		}

		.parkFormStyle {
			grid-area: form;
			width: 90%;
			margin: auto auto;
			@media screen and (min-width: 600px) {
				width: 100%;
				margin: 0rem 0 0.5rem 0;
			}
			${({ active }) => active && `display: none;`}
		}

		.moonStyle {
			background: none;
			grid-area: moonContainer;
			margin-bottom: 3rem;
		}

		.sortByContainer {
			font-family: "Lato", sans-serif;
			grid-area: sort;
			margin-bottom: 0.7rem;

			.sortBy {
				color: ${props => props.theme.white};
				transition: color 0.2s ease;
				button {
					all: unset;
					color: ${props => props.theme.yellow};
					font-weight: 600;
					cursor: pointer;
					margin: 0 0px 0 15px;
					:hover {
						color: ${props => props.theme.highlightPink};
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
	}

	@media screen and (max-width: 320px) {
		margin-top: 2vh;
		width: 100%;
		grid-template-columns: 1fr;
		grid-template-rows: ${props =>
			props.hideMap ? "0px auto" : "50% auto"};
		grid-template-areas: "formMoonCards";

		.formMoonCards {
			overflow: none;
		}

		.parkMapStyle {
			display: ${props => (props.hideMap ? "none" : "fixed")};
		}
	}

	@media screen and (min-width: 320px) {
		margin-top: 2vh;
		width: 100%;
		grid-template-columns: 1fr;
		grid-template-rows: ${props =>
			props.hideMap ? "0px auto" : "50% auto"};
		grid-template-areas: "formMoonCards";
		.formMoonCards {
			overflow: none;
		}

		.parkMapStyle {
			display: ${props => (props.hideMap ? "none" : "fixed")};
		}
	}

	@media screen and (min-width: 600px) {
		margin-top: 2vh;
		width: 95%;
		grid-template-columns: 1fr;
		grid-template-areas: "formMoonCards";

		.formMoonCards {
			overflow: none;
		}

		.parkMapStyle {
			display: ${props => (props.hideMap ? "none" : "fixed")};
		}
	}

	@media screen and (min-width: 500px) {
		.formMoonCards {
			max-width: 530px;
			margin: 0 auto;
		}
	}

	@media screen and (min-width: 600px) {
		.formMoonCards {
			max-width: 530px;
			margin: 0 auto;
		}
	}

	@media screen and (min-width: 1025px) {
		margin-top: 3%;
		.parkFormStyle {
			grid-area: form;
			${({ active }) => active && `display: none;`}
		}
	}
`;

//where both map and FormMoonCards located
const MainContentWrapper = styled.div`
	margin: 0 auto 0 auto;
	/* display: block; */

	.parkMapStyle {
		/* height: 80vh; */
		width: 95%;
		height: 80vh;
		top: 10%;
		background-color: gray;
		display: none;
		margin: 0 auto;
	}

	@media screen and (min-width: 1025px) {
		margin: 0 5%;
		display: ${props => (props.pathname === "/home" ? "block" : "grid")};
		/* display: grid; */
		grid-template-columns: minmax(470px, 0.5fr) 1fr;
		grid-template-areas: "formMoonCards map";

		.formMoonCards {
			grid-area: formMoonCards;
		}
		.parkMapStyle {
			display: ${props =>
				props.pathname === "/home" ? "none" : "fixed"};
			grid-area: map;
			position: sticky;
		}
	}

	${props =>
		props.pathname === "/home"
			? `.parkFormStyle {
		width: 90%;
		margin: auto auto;
		margin-top: 10vh;
		max-width: 530px;
		/* overflow: hidden; */

		@media screen and (min-width: 320px) {
			width: 85%;
			margin: auto auto;
			margin-top: 10vh;
		}

		@media screen and (min-width: 480px) {
			width: 85%;
			margin: auto auto;
			margin-top: 10vh;
		}

		@media screen and (min-width: 600px) {
			width: 75%;
			margin: auto auto;
			margin-top: 5.5vh;
		}

		@media screen and (min-width: 1000px) {
			width: 55%;
			margin: auto auto;
			margin-top: 7vh;
		}
	}`
			: "	"}
`;
