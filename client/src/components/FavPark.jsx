

import React, { Component } from "react";
import axios from "axios";
import { AuthConsumer } from "./AuthContext";
class BaseFavPark extends Component {

	state={
buttonPressed :false
	}

	handleFavSpot(){
		console.log(this.props.parkID)
		console.log(this.props.context.userID)
		axios
			.post("/api/postFavSpot", {
				params: {
					park_id: this.props.parkID,
					user_id: this.props.context.userID
				}
			})
			.then(response => {
				console.log({ message: "Fav Spot is: ", response });
				this.setState({ buttonPressed: true });
				
			})
			.catch(error => {
				console.log(error);
			});
		

	}


	favSpotButton= ()=> {
		//console.log("BUTTON CLICKED!!");
	
			if(this.state.buttonPressed == false){
				return(
				<button
				className="btn btn-primary m-2"
				onClick={() => this.handleFavSpot()}
			>
				Add to Favorites
			</button>
				)
			}
				else{
					return(
						<button
						className="btn btn-success"
						onClick={() => this.handleFavSpot()}
					>
						Added to Favorites!
					</button>
						)

				}
			}

		
	


	render() {
		//const { label, score = 0, total = Math.max(1, score) } = this.props;

		return (
			<div>

				{this.favSpotButton()}

				<p>hello {this.props.context.firstName}</p>
			</div>
		);
	}
}

//export default FavPark;

const FavPark = props => (
	<AuthConsumer>
		{x => <BaseFavPark context={x} parkID={props.parkID} />}
	</AuthConsumer>
);

export default FavPark;
