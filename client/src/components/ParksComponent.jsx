//Store parks state and handle display
import React, { Component } from "react";
import ParkForm from "./ParkForm";
import ParkTable from "./ParkTable";
import ParkMap from "./ParkMap";

class ParksComponent extends Component {
	state = {
		parks: [],
		fetchReq: []
	};
	/* Note - park object is:
        {
            distance: number,
            id: number,
            lat: number,
            lng: number,
            light_pol: number,
            name: string,
            osmid: number,
        }
    */

	//Request parks from server
	//getParks is a function, weird react notation perhaps?
	//note, reqData could be X, just a variable name! int x=

	//YOU NEED THE / in the ADDRESS!!
	//don't put "getParks", must be "/name"
	//getParks gets called, and does a fetch to
	//app.post("/api/getParks")
	getParks = reqData => {
		console.log(reqData);
		// let fetchingState = this.state;
		// fetchingState.isFetching = true;
		// this.setState(fetchingState);
		fetch("/api/getParks", {
			method: "POST", //Important
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(reqData)
		})
			//RESPONSE IS "x", any OUTPUT from previous
			//function CALL (FETCH POST REQ to server.js getParks)
			//.then WAITS for the response from fetch/server.js
			//data is "response" lol! can call either x/y
			//update STATE as a JSON array
			//react says "oh shit something changed"
			// note, everytime setState is called, it
			//automatically goes to RENDER() function!
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({
					parks: data,
					fetchReq: reqData
				});
			})
			.catch(err => console.error(err));
	};

	//Clear button handler
	clearParks = () => {
		this.setState({ parks: [], fetchReq: [] });
	};

	//Clear button style
	clearButtonClass() {
		let classes = "btn btn-danger btn-sm m-2";
		if (this.state.parks.length > 0) {
			console.log("Clear button enabled");
			classes += " active";
		} else {
			console.log("Clear button disabled");
			classes += " disabled";
		}
		return classes;
	}

	//recursively calls render on it's children
	render() {
		console.log("ParksComponent - rendered");

		//"copies" into temp array parks
		const parks = this.state.parks;

		//let clearButtonClass = this.clearButtonClass();
		//bind(this,reqData) passes reqData to getParks
		//bind seems to be needed for onClick buttons /w args

		return (
			<div className="ParksDiv">
				{/* <div className="container"> */}
				<div className="row">
					<div className="col">
						<ParkMap parkList={this.state.parks} location={this.state.fetchReq} />
					</div>
					<div className="col">
						<ParkForm fetchParks={this.getParks} clearParks={this.clearParks} />
						<br />
						<div
							style={{
								"max-height": "300px",
								"overflow-y": "scroll"
							}}
						>
							<ParkTable parkList={this.state.parks} />
						</div>
					</div>
				</div>
				{/* </div> */}
			</div>
		);
	}
}

export default ParksComponent;
