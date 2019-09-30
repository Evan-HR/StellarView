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
import { notifyCloseModal } from "./ParkMoreInfoModal";
import { notifyCloseLoginModal } from "./Login";
import { notifyCloseRegisterModal } from "./Register";
import { notifyCloseTutorialModal } from "./Tutorial";
import Tutorial from "./Tutorial";
import ee from "eventemitter3";

const emitter = new ee();

export const notifyInfoModalIsOpen = msg => {
	emitter.emit("infoModalIsOpen", msg);
};

export const notifyInfoModalIsClosed = msg => {
	emitter.emit("infoModalIsClosed", msg);
};

export const notifyLoginModalIsOpen = msg => {
	emitter.emit("loginModalIsOpen", msg);
};

export const notifyLoginModalIsClosed = msg => {
	emitter.emit("loginModalIsClosed", msg);
};

export const notifyRegisterModalIsOpen = msg => {
	emitter.emit("registerModalIsOpen", msg);
};

export const notifyRegisterModalIsClosed = msg => {
	emitter.emit("registerModalIsClosed", msg);
};

export const notifyTutorialModalIsOpen = msg => {
	emitter.emit("tutorialModalIsOpen", msg);
};

export const notifyTutorialModalIsClosed = msg => {
	emitter.emit("tutorialModalIsClosed", msg);
};

function inRange(x, min, max) {
	return (x - min) * (x - max) <= 0;
}

//Returns a score function that is:
// f(x)=0 if x<min
// f(x)=1 if x>max
// f(x)=linear between min and max
function linearScore(x, minX, maxX) {
	// if (minX > maxX) {
	// 	let temp = minX;
	// 	minX = maxX;
	// 	maxX = temp;
	// }
	let y = 0;
	let minY = 0;
	let maxY = 1;
	// if (x < minX) return minY;
	// if (x > maxX) return maxY;
	y = ((maxY - minY) / (maxX - minX)) * (x - minX) + minY;
	if (y > 1) y = 1;
	if (y < 0) y = 0;
	return y;
}

export function parkScore(moonFraction, humidity, cloudCov, lightPol) {
	// console.log("MOON FRACTION % IS !!!!!!!!!!!!!!", moonFraction);
	// console.log("CLOUD COV IS !!!!!!!!!!!!!!", cloudCov);
	// console.log("LIGHT POL IS !!!!!!!!!!!!!!", lightPol);
	// console.log("humidity COV IS !!!!!!!!!!!!!!", humidity);
	var moonScore = linearScore(1 - moonFraction, 0.2, 0.7);
	var lightPolScore = ((-1 * 1) / 3) * (lightPol - 3);
	var humidityScore = linearScore(humidity, 0.4, 0.8);
	var cloudScore = linearScore(cloudCov, 0.2, 0.4);

	const finalScore =
		0.35 * moonScore +
		0.25 * cloudScore +
		0.15 * humidityScore +
		0.25 * lightPolScore;

	if (finalScore < 0) {
		finalScore = 0;
	} else if (finalScore >= 1) {
		finalScore = 0.99;
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
		infoModalIsOpen: false,
		loginModalIsOpen: false,
		registerModalIsOpen: false,
		tutorialModalIsOpen: false
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
			// console.log("Main component heard about modal OPENING");
			this.setState({ infoModalIsOpen: true });
		});
		emitter.on("infoModalIsClosed", () => {
			// console.log("Main component heard about modal CLOSING");
			this.setState({ infoModalIsOpen: false });
		});
		emitter.on("loginModalIsOpen", msg => {
			// console.log("Main component heard about modal OPENING");
			this.setState({ loginModalIsOpen: true });
		});
		emitter.on("loginModalIsClosed", () => {
			// console.log("Main component heard about modal CLOSING");
			this.setState({ loginModalIsOpen: false });
		});
		emitter.on("registerModalIsOpen", msg => {
			// console.log("Main component heard about modal OPENING");
			this.setState({ registerModalIsOpen: true });
		});
		emitter.on("registerModalIsClosed", () => {
			// console.log("Main component heard about modal CLOSING");
			this.setState({ registerModalIsOpen: false });
		});
		emitter.on("tutorialModalIsOpen", () => {
			// console.log("Main component heard about modal CLOSING");
			this.setState({ tutorialModalIsOpen: true });
		});
		emitter.on("tutorialModalIsClosed", () => {
			// console.log("Main component heard about modal CLOSING");
			this.setState({ tutorialModalIsOpen: false });
		});
	}

	componentDidUpdate = () => {
		window.onpopstate = e => {
			// console.log("Detected back button");
			if (this.state.infoModalIsOpen) {
				// console.log("Notifying modal");
				notifyCloseModal();
			} else if (this.state.loginModalIsOpen) {
				// console.log("Notifying modal");
				notifyCloseLoginModal();
			} else if (this.state.registerModalIsOpen) {
				// console.log("Notifying modal");
				notifyCloseRegisterModal();
			} else if (this.state.tutorialModalIsOpen) {
				// console.log("Notifying modal");
				notifyCloseTutorialModal();
			} else {
				// console.log("Notifying park form");
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
		// console.log(reqData);
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

	renderResults = () => {
		return (
			<ResultsPageStyle>
				<div className="formMoonCards">
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

						{this.state.parks.length > 0 ? (
							<div className="sortByContainer">
								<div className="sortBy">
									Sort parks by:{"  "}
									<button
										onClick={this.sortParksDist}
										disabled={
											this.state.sortedBy === "dist"
										}
									>
										Distance
									</button>
									<button
										onClick={this.sortParksScore}
										disabled={
											this.state.sortedBy === "score"
										}
									>
										Score
									</button>
								</div>
							</div>
						) : (
							""
						)}
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
				</div>
			</ResultsPageStyle>
		);
	};

	renderLanding = () => {
		return (
			<LandingPageStyle>
				{/* {this.renderParkForm()} */}
				<TelescopeCircle />

				<span className="tutorial">
					<Tutorial>View Tutorial</Tutorial>
				</span>

				{/* {this.renderParkMap()} */}
			</LandingPageStyle>
		);
	};

	render() {
		return (
			<MainContentWrapper
				active={this.state.hideForm}
				hideMap={this.state.hideMap}
				pathname={window.location.pathname}
			>
				{/* <div className="HeresResults">We found some spots.</div> */}
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
	.tutorial {
		font-size: 20px;
		font-weight: 500;
		cursor: pointer;
		color: ${props => props.theme.yellow};
		transition: color 0.2s ease;
		:hover,
		:active {
			color: ${props => props.theme.colorMedium};
			transition: color 0.2s ease;
		}
	}

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
		width: 90%;
		max-width: 500px;
		height: 45vh;
		top: 10%;
		background-color: gray;
		display: ${props => (props.pathname === "/home" ? "none" : "block")};
		margin: 40px auto 40px auto;
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
			width: 95%;
			height: 80vh;
			top: 10%;
			position: sticky;
			max-width: none;
			margin: 0 auto;
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
			: `.parkFormStyle {
			width: 90%;


		max-width: 500px;
		margin: 30px auto auto auto;
	
		
		@media screen and (min-width: 600px) {
				width: 100%;
				margin: 30px auto 0.5rem auto;
			}
			@media screen and (min-width: 1025px) {
				width: 90%;
				margin: auto auto;
			}
	}`}
`;
