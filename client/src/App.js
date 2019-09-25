import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./components/AuthContext";
import MainComponent from "./components/MainComponent";
import {
	Link,
	NavLink,
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from "react-router-dom";
import Profile from "./components/Profile";
import Login from "./components/Login";
import ToolBar from "./components/ToolBar/Toolbar";
import SideDrawer from "./components/ToolBar/SideDrawer";
import Backdrop from "./components/Backdrop/Backdrop";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import FAQ from "./components/FAQ";
import backgroundImage from "./components/style/Media/starrynight_loop.svg";
import Footer from "./components/Footer";
import ScrollUpButton from "react-scroll-up-button";
import NotFoundPage from "./components/NotFoundPage";
import StarBackgroundLess from "./components/StarBackgroundLess";

class App extends Component {
	state = {
		sideDrawerOpen: false
	};

	//if sidedraweropen, save as false
	drawerToggleClickHandler = () => {
		this.setState(prevState => {
			return { sideDrawerOpen: !prevState.sideDrawerOpen };
		});
	};

	sideDrawerLinkClickHandler = () => {
		this.setState({ sideDrawerOpen: false });
	};

	backdropClickHandler = () => {
		this.setState({ sideDrawerOpen: false });
	};

	//RENDER --> ReactDOM.render(<App />, document.getElementById("root"));
	render() {
		let backdrop;
		if (this.state.sideDrawerOpen) {
			backdrop = <Backdrop click={this.backdropClickHandler} />;
		}
		//console.log("parks ", parks);
		console.log("App - rendered");
		return (
			<React.Fragment>
				<ScrollUpButton />
				<GlobalStyle />
				{/* <StarBackgroundLess/> */}
				<SiteStyle>
					<div className="SiteContent">
						<Router>
							<ToolBar
								drawerClickHandler={
									this.drawerToggleClickHandler
								}
								handleLogoutState={this.props.handleLogoutState}
								handleLogin={this.props.handleLogin}
							/>
							<SideDrawer
								show={this.state.sideDrawerOpen}
								close={this.sideDrawerLinkClickHandler}
								handleLogoutState={this.props.handleLogoutState}
								handleLogin={this.props.handleLogin}
							/>
							{backdrop}
							<Switch>
								<Route
									path="/profile"
									render={() => (
										<AuthConsumer>
											{authState => {
												console.log(authState);
												if (authState.isAuth !== null) {
													if (
														authState.isAuth ===
														true
													)
														return <Profile />;
													else
														return (
															<Redirect to="/" />
														);
												}
											}}
										</AuthConsumer>
									)}
								/>
								<Route
									exact
									path="/"
									render={() => {
										return <Redirect to="/home" />;
									}}
								/>

								<Route
									path={["/home", "/search"]}
									component={MainComponent}
								/>
								<Route path="/FAQ" component={FAQ} />

								<Route
									//Since /profile is outside the switch,
									//make sure it's not getting picked up by *
									path="*"
									component={NotFoundPage}
								/>
							</Switch>
						</Router>
					</div>
					<Footer />
				</SiteStyle>
			</React.Fragment>
		);
	}
}

//IMPORTANT TO EXPORT!
export default App;

////////////////////////////////////////////////////////////////

// font-family: 'Open Sans', sans-serif;
// font-family: 'Merriweather Sans', sans-serif;
// font-family: 'IBM Plex Mono', monospace;
// font-family: 'IBM Plex Sans', sans-serif;
//'Yeseva One', cursive;
//font-family: 'Barlow', sans-serif;

const SiteStyle = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	.SiteContent {
		flex: 1 0 auto;
	}
`;

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Lato:300,400,600,700&display=swap');

html {
	line-height: 1.15;
	-webkit-text-size-adjust: 100%;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	height: 100%;
	overflow-x: hidden;
	min-height: 100vh;
}

body{
	height: 100%;
	font-size: 1rem;
	font-weight: 300;
	line-height: 1.5;
	font-family: 'Lato', sans-serif;
	background-color: ${props => props.theme.prettyDark} !important;
	text-align: center !important;
}


.pac-container {
	background-color:${props => props.theme.white};
	font-family: 'Lato', sans-serif;
}

`;
