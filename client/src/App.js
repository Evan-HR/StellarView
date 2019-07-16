import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./components/AuthContext";

import "./App.css";
import ParksComponent from "./components/ParksComponent";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Profile from "./components/Profile";
// import Reviews from "./components/Reviews";

class App extends Component {
	//RENDER --> ReactDOM.render(<App />, document.getElementById("root"));
	render() {
		//console.log("parks ", parks);
		console.log("App - rendered");
		return (
			<div className="App">
				<Router>
					<NavBar handleLogoutState={this.props.handleLogoutState} />{" "}
					{/* <AuthConsumer>
					{" "}
					{({ isAuth }) => (
						<Route
							render={props =>
								isAuth ? (
									<Component {...props} />
								) : (
									<Redirect to="/" />
								)
							}
							{...rest}
						/>
					)}{" "}
				</AuthConsumer> */}
					<Route path="/" exact component={ParksComponent} />
					<AuthConsumer>
						{x => {
							console.log(x);
							return (
								<Route
									path="/profile"
									render={() => {
										console.log(x);
										if (x.isAuth !== null) {
											if (x.isAuth === true)
												return (
													<Profile
														userName={x.firstName}
													/>
												);
											else
												return (
													<Redirect to="/login.html" />
												);
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
