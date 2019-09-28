import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import { AuthConsumer } from "./AuthContext";
import { withRouter, Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import Register from "./Register";
import MuiSlider from "@material-ui/core/Slider";
import {
	notifyLoginModalIsOpen,
	notifyLoginModalIsClosed
} from "./MainComponent";
import ee from "eventemitter3";
import searchIcon from "./style/Media/search-solid.svg";
import SVG from "react-inlinesvg";

const emitter = new ee();

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
		value: 100,
		label: "100"
	},
	{
		value: 150,
		label: "150"
	},
	{
		value: 250,
		label: "250"
	}
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
	}
	// {
	// 	value: 3.5
	// },
	// {
	// 	value: 4.0
	// }
];

export const notifyCloseLoginModal = msg => {
	emitter.emit("notifyCloseLoginModal", msg);
};

Modal.setAppElement("#root");
class Tutorial extends Component {
	state = {
		nextCounter: 0,
		globalStepMsgCounter: 0
	};

	constructor(props) {
		super(props);
		emitter.on("notifyCloseLoginModal", msg => {
			this.closeModal();
		});
	}

	openModal = () => {
		notifyLoginModalIsOpen();
		this.props.history.push(
			`${window.location.pathname}${window.location.search}#login`
		);
		this.setState({ modalIsOpen: true });
	};

	afterOpenModal = () => {
		document.body.style.overflow = "hidden"; //Prevents background scrolling
	};

	closeModal = () => {
		// console.log("Closing login modal");
		this.setState({ nextCounter: (this.state.nextCounter = 0) });
		notifyLoginModalIsClosed();
		this.props.history.push(
			`${window.location.pathname}${window.location.search}`,
			null
		);
		// this.props.refreshInfoModal();
		this.setState({ modalIsOpen: false, errorDB: false });
		document.body.style.overflow = "visible";
	};

	renderStepOneMessage = () => {
		if (this.state.nextCounter === 0) {
			return (
				<React.Fragment>
					<h3>SEARCH</h3>
					<span>
						First, start by entering a place name. When you begin
						typing, the form will autofill. Tap the place you'd like
						to search from and then tap the magnifying glass or
						select "Near Me".
					</span>
				</React.Fragment>
			);
		} else if (this.state.nextCounter === 1) {
			return (
				<React.Fragment>
					<h3>SEARCH</h3>
					<span>
						Please allow your browser to have access to your
						location.
					</span>
				</React.Fragment>
			);
		} else if (this.state.nextCounter === 2) {
			return (
				<React.Fragment>
					<h3>SEARCH</h3>
					<span>
						By default, we search up to 25km away from your
						location. Tap <i>Advanced Search</i> if you wish to
						customize your search.
					</span>
				</React.Fragment>
			);
		} else if (this.state.nextCounter === 3) {
			this.resetIncrementButton();
			this.incrementGlobal();
			return (
				<React.Fragment>
					<h3>SEARCH</h3>
					<span>
						The Max Light Pollution zone is the maximum light
						pollution you want the parks to be in. <i>Dark</i> means
						the M33 is easily seen with naked eye. <i>Rural</i>{" "}
						means M15, M4, M5, and M22 are naked-eye objects.
					</span>
				</React.Fragment>
			);
		}
	};

	renderStepTwoMessage = () => {
		if (this.state.nextCounter === 0) {
			return (
				<React.Fragment>
					<h3>RESEARCH</h3>
					<span>BLAH!</span>
				</React.Fragment>
			);
		} else if (this.state.nextCounter === 1) {
			return (
				<React.Fragment>
					<h3>RESEARCH</h3>
					<span>HUA!</span>
				</React.Fragment>
			);
		}
	};

	incrementButton = () => {
		// console.log("nextcounter", this.state.nextCounter);
		this.setState({ nextCounter: this.state.nextCounter + 1 });
	};

	resetIncrementButton = () => {
		this.setState({ nextCounter: 0 });
	};

	incrementGlobal = () => {
		// console.log("nextcounter", this.state.nextCounter);
		this.setState({
			globalStepMsgCounter: this.state.globalStepMsgCounter + 1
		});
	};

	renderMessageSwitch = () => {
		if (this.state.globalStepMsgCounter === 0) {
			return this.renderStepOneMessage();
		} else if (this.state.globalStepMsgCounter === 1) {
			return this.renderStepTwoMessage();
		}
	};

	renderStepOne = () => {
		return (
			<TutorialStyle>
				<button
					type="button"
					onClick={this.closeModal}
					className="close"
					aria-label="Close"
				>
					<i className="fas fa-times" />
				</button>

				<div className="Explanation">
					{this.renderMessageSwitch()}

					<div className="Icon">
						<i
							class="far fa-arrow-alt-circle-right fa-2x"
							onClick={this.incrementButton}
						></i>
					</div>
				</div>
				<span className="ExampleTxt">Example Form</span>
				<SearchFormStyle>
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
								disabled
							/>

							<button className={"searchButton"}>
								<SVG src={searchIcon}></SVG>
								{/* <i className="fa fa-search" /> */}
							</button>
						</form>
					</div>

					<div className="myLocation">
						<button className="nearMe" type="button">
							<strong>Near me</strong>
						</button>
					</div>

					<div className="advancedSearchToggle">
						<button className="ToggleAdvancedSearch">
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
								<MuiSlider
									aria-labelledby="discrete-slider-custom"
									min={5}
									max={250}
									step={5}
									valueLabelDisplay="auto"
									marks={marksDist}
								/>
							</SliderStyle>
							<br />
							<span className="FormTitle">
								Max Light Pollution Zone
							</span>
							<br />
							<SliderStyle>
								<MuiSlider
									aria-labelledby="discrete-slider-custom"
									min={0.4}
									max={4.0}
									step={0.1}
									valueLabelDisplay="auto"
									marks={marksLight}
								/>
							</SliderStyle>
						</form>
					</div>
				</SearchFormStyle>
			</TutorialStyle>
		);
	};

	render() {
		return (
			<React.Fragment>
				<a
					onClick={() => {
						this.openModal();
					}}
				>
					{this.props.children ? (
						<React.Fragment>{this.props.children}</React.Fragment>
					) : (
						"Tutorial"
					)}
				</a>

				<Modal
					closeTimeoutMS={800}
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					contentLabel="Tutorial Modal"
					// className="modal-dialog"
					style={customStyles}
				>
					<ModalStyle>
						{/* {this.renderLoginModal()} */}
						{/* {this.renderModalContent()} */}
						{this.renderStepOne()}
					</ModalStyle>
				</Modal>
			</React.Fragment>
		);
	}
}

export default withRouter(Tutorial);

/////////////////////////////////

const customStyles = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.9)",
		transition: "opacity 400ms ease-in-out"
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		padding: "0px",
		border: "none",
		background: "black",
		borderRadius: "2.5px",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		maxWidth: "100vw",
		maxHeight: "100vh",
		overflow: "hidden"
	}
};

//style the "modal" here - don't worry about the ccontent shit
const TutorialStyle = styled.div`
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	/* -webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center; */
	height: 90vh;
	position: relative;
	background: ${props => props.theme.prettyDark};
	font-family: "Lato", sans-serif;
	color: ${props => props.theme.white};
	width: 100vw;

	@media screen and (min-width: 320px) {
		width: 100vw;
	}

	@media screen and (min-width: 600px) {
		width: 60vw;
	}

	@media screen and (min-width: 801px) {
		width: 45vw;
	}

	h3 {
		margin: 15px;
		margin-bottom: 30px;
	}

	.ExampleTxt {
		margin: 10px;
		margin-top: 50px;
	}

	.Explanation {
		background: ${props => props.theme.moonBackground};
		border-radius: 8px;
		/* padding: 20px; */
		text-align: left;
		font-size: 15px;

		padding: 20px;
		.Icon {
			color: ${props => props.theme.colorMedium};
			cursor: pointer;
			text-align: right;
			animation: nextGlow 2s;
			-moz-animation: nextGlow 2s infinite;
			-webkit-animation: nextGlow 2s infinite;

			@keyframes nextGlow {
				0% {
					color: ${props => props.theme.colorMedium};
				}
				50% {
					color: ${props => props.theme.colorBad};
				}
				100% {
					color: ${props => props.theme.colorMedium};
				}
			}

			@-moz-keyframes nextGlow {
				0% {
					color: ${props => props.theme.colorMedium};
				}
				50% {
					color: ${props => props.theme.colorBad};
				}
				100% {
					color: ${props => props.theme.colorMedium};
				}
			}

			@-webkit-keyframes nextGlow {
				0% {
					color: ${props => props.theme.colorMedium};
				}
				50% {
					color: ${props => props.theme.yellow};
				}
				100% {
					color: ${props => props.theme.colorMedium};
				}
			}
		}
	}

	.close {
		outline: none;
		text-shadow: none;
		color: ${props => props.theme.white};
		position: absolute;
		top: -1px;
		right: 4px;
		float: right;
		font-size: 2rem;
		font-weight: 700;
		line-height: 1;
	}

	.close:hover {
		color: ${props => props.theme.pink};
		text-decoration: none;
	}

	.close:active {
		color: ${props => props.theme.colorMedium};
	}
`;

const ModalStyle = styled.div`
	position: relative;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	width: 100%;
	pointer-events: auto;
	background-clip: padding-box;
	border-radius: 0.3rem;
	outline: 0;
`;

const SearchFormStyle = styled.div`
	background: none;

	font-family: "Lato", sans-serif;

	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: auto auto auto;
	grid-gap: 10px;
	grid-template-areas:
		"searchBar searchBar searchBar"
		"advancedSearchToggle advancedSearchToggle myLocation"
		"advancedSearch advancedSearch advancedSearch";

	@media screen and (min-width: 320) {
		grid-template-areas:
			"searchBar searchBar myLocation"
			"advancedSearchToggle advancedSearchToggle advancedSearchToggle"
			"advancedSearch advancedSearch advancedSearch";
	}

	@media screen and (min-width: 480px) {
		grid-template-areas:
			"searchBar searchBar myLocation"
			"advancedSearchToggle advancedSearchToggle advancedSearchToggle"
			"advancedSearch advancedSearch advancedSearch";
	}

	.messageAboveForm {
		grid-area: messageAboveForm;
		text-align: left;
		font-weight: 600;
		animation: fadein 3s;
		@keyframes fadein {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		.invalidLocation {
			color: ${props => props.theme.colorBad};
		}
		.generic {
			color: ${props => props.theme.yellow};
		}
	}

	.AdvancedSearch {
		width: 90%;
		margin: auto auto;
		grid-area: advancedSearch;

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

			background: ${props => props.theme.yellow};
			border-radius: 20px;
			height: 36px;
			width: 100%;
			color: ${props => props.theme.prettyDark};
			transition: color 0.1s ease;
			font-size: 15px;
			font-weight: 600;
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
			}
		}
	}

	.citySearch {
		grid-area: searchBar;
	}

	.searchButton {
		width: 40px;
		height: 36px;

		svg {
			margin: auto auto;

			display: block;
		}

		background: ${props => props.theme.prettyDark};
		text-align: center;

		color: ${props => props.theme.white};

		font-size: 20px;
		border: 2px solid #2a2c2d;
		float: left;
		background-position: center;
	}

	.searchTerm:focus {
		color: ${props => props.theme.white};
	}

	.searchTerm {
		width: calc(100% - 40px);
		background-color: ${props => props.theme.darkAccent};
		transition: background-color 0.1s ease;

		padding: 5px;
		height: 36px;

		outline: none;
		color: ${props => props.theme.white};
		border: none;
		float: left;
	}

	.ToggleAdvancedSearch {
		all: unset;

		color: #bdbdbd;
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
