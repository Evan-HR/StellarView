import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./components/AuthContext";

import "./App.css";
import ParksComponent from "./components/ParksComponent";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Profile from "./components/Profile";
import Login from "./components/Login";

class App extends Component {
	//RENDER --> ReactDOM.render(<App />, document.getElementById("root"));
	render() {
		//console.log("parks ", parks);
		console.log("App - rendered");
		return (
			<div className="App">
				<Router>
					<NavBar
						handleLogoutState={this.props.handleLogoutState}
						handleLogin={this.props.handleLogin}
					/>
					<Route path="/" exact component={ParksComponent} />
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
			</div>
		);
	}
}

//IMPORTANT TO EXPORT!
export default App;
