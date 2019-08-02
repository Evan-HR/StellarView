import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./components/AuthContext";
import ParksData from "./components/ParksData";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Profile from "./components/Profile";
import Login from "./components/Login";

import { createGlobalStyle  } from 'styled-components';
import {ThemeProvider} from 'styled-components';
import {theme} from './theme'



class App extends Component {
	//RENDER --> ReactDOM.render(<App />, document.getElementById("root"));
	render() {
		//console.log("parks ", parks);
		console.log("App - rendered");
		return (
			<React.Fragment>
				<GlobalStyle/>
				<Router>
					<NavBar
						handleLogoutState={this.props.handleLogoutState}
						handleLogin={this.props.handleLogin}
					/>
					<Route path="/" exact component={ParksData} />
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
												return (
													<Profile />
												);
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

const GlobalStyle  = createGlobalStyle`


@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono|Rubik|Barlow|IBM+Plex+Sans|Major+Mono+Display|Nunito+Sans|Open+Sans&display=swap');


html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
body{
	margin-left: 10%;
	margin-right: 10%;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  background-color: ${props => props.theme.background3};
	
  font-family: 'Barlow', sans-serif;
	text-align: center;

}

`
