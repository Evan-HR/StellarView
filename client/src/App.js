import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./components/AuthContext";
import ParksData from "./components/ParksData";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
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
import starBackground from "./components/style/Media/starsBackground.png";
import starsTwinkle from "./components/style/Media/twinkling.png";
import StarBackground from "./components/StarBackground";

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

{/* <StarBackground/> */}


				<GlobalStyle/>
				<Router>
					<ToolBar
						drawerClickHandler={this.drawerToggleClickHandler}
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

					<Route path="/" exact component={ParksData} />
					<Route path="/faq" component={FAQ} />
					<AuthConsumer>
						{authState => {
							console.log(authState);
							return (
								<Route
									path="/profile"
									render={() => {
										console.log(authState);
										if (authState.isAuth !== null) {
											if (authState.isAuth === true)
												return <Profile />;
											else return <Redirect to="/" />;
										}
									}}
								/>
							);
						}}
					</AuthConsumer>
				</Router>
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

const GlobalStyle = createGlobalStyle`


@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono|Rubik|Barlow|IBM+Plex+Sans|Major+Mono+Display|Nunito+Sans|Source+Sans+Pro|Open+Sans&display=swap');
@import url('https://fonts.googleapis.com/css?family=Mr+Dafoe|Monoton');


height: 100%;

html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  
  

  height: 100%;
  overflow-x: hidden;
  
}
body{
	
	/* margin-left: 2%;
	margin-right: 2%; */
	height: 100vh;
	overflow: hidden;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  /* radial-gradient(220% 105% at top center,black 30%,#151515 60%,#252629 100%) */
  /* background: radial-gradient(220% 105% at top center, black 30%,${props => props.theme.modalOverlay} 60%,${props => props.theme.darker} 100%); */

    background: -webkit-linear-gradient(70deg, #fff810  30%, rgba(0,0,0,0) 30%), -webkit-linear-gradient(30deg, #63e89e 60%, #ff7ee3 60%);
    background: -o-linear-gradient(70deg, #fff810  30%, rgba(0,0,0,0) 30%), -o-linear-gradient(30deg, #63e89e 60%, #ff7ee3 60%);
    background: -moz-linear-gradient(70deg, #fff810  30%, rgba(0,0,0,0) 30%), -moz-linear-gradient(30deg, #63e89e 60%, #ff7ee3 60%);
    background: linear-gradient(70deg, #fff810  30%, rgba(0,0,0,0) 30%), linear-gradient(30deg, #63e89e 60%, #ff7ee3 60%);
	background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* Resize the background image to cover the entire container */

	
  font-family: 'Barlow', sans-serif;
	text-align: center;
	height: 100%;

}

`;
