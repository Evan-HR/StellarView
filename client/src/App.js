import React, { Component } from "react";

//import logo from "./logo.svg";

import "./App.css";
import ParksComponent from "./components/ParksComponent";
import NavBar from "./components/NavBar";

class App extends Component {
	//RENDER --> ReactDOM.render(<App />, document.getElementById("root"));
	render() {
		//console.log("parks ", parks);
		console.log("App - rendered");
		//render methods NEED A RETURN!
		return (
			<div className="App">
				<NavBar />
				<ParksComponent />
			</div>
		);
	}
}
//IMPORTANT TO EXPORT!
export default App;
