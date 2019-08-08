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
				    <div class="stars"></div>
					<div class="twinkling"></div>

				<GlobalStyle />
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


@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono|Rubik|Barlow|IBM+Plex+Sans|Major+Mono+Display|Nunito+Sans|Open+Sans&display=swap');

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
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  background-color: black;


@keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
}
@-webkit-keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
}
@-moz-keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
}
@-ms-keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
}

.stars, .twinkling {
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  width:100%;
  height:100%;
  display:block;
}

.stars {
  background:#000 url("./components/style/Media/stars.png") repeat top center;
  z-index:-2;
}

.twinkling{
  background:transparent url("./components/style/Media/twinkling.png") repeat top center;
  z-index:-1;

  -moz-animation:move-twink-back 450s linear infinite;
  -ms-animation:move-twink-back 450s linear infinite;
  -o-animation:move-twink-back 450s linear infinite;
  -webkit-animation:move-twink-back 450s linear infinite;
  animation:move-twink-back 450s linear infinite;

}


	
  font-family: 'Barlow', sans-serif;
	text-align: center;
	height: 100%;

}

`;
