import React, { Component } from "react";
import { AuthProvider, AuthConsumer } from "./components/AuthContext";
//import logo from "./logo.svg";

import "./App.css";
import ParksComponent from "./components/ParksComponent";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
//import Reviews from "./components/Reviews";

class App extends Component {
	//RENDER --> ReactDOM.render(<App />, document.getElementById("root"));
	render() {
		//console.log("parks ", parks);
		console.log("App - rendered");
		//render methods NEED A RETURN!
		return (
			<div className="App">
				<NavBar handleLogoutState={this.props.handleLogoutState} />
				<Login />
				<ParksComponent />
			</div>
		);
	}
}
//IMPORTANT TO EXPORT!
export default App;
