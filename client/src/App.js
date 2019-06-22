import React, { Component } from "react";

//import logo from "./logo.svg";

import "./App.css";
import ParksComponent from "./components/ParksComponent";

class App extends Component {
	render() {
		//console.log("parks ", parks);
		console.log("App - rendered");
		return (
			<div className="App">
				<ParksComponent />
			</div>
		);
	}
}

export default App;
