import React, { Component } from "react";
import axios from "axios";
import { AuthConsumer } from "./AuthContext";
class BaseFavPark extends Component {
	state = {
		buttonPressed: false,
		clickedNoAuth: false,
		hasFaved: false
	};

	handleFavSpotNoAuth = () => {
		this.setState({
			clickedNoAuth: true
		});
	};
	handleWarningMsg = () => {
		if (this.state.clickedNoAuth === true) {
			return (
				<div class="alert alert-warning" role="alert">
					You must be logged-in to add to favorites!
				</div>
			);
		}
	};

	componentDidMount() {
		console.log("get has faved gets called!");
		this.getHasFaved();
	}

	getHasFaved() {
		console.log("reached getHasFaved()");
		if (this.props.context.userFavorites.includes(this.props.parkID)) {
			this.setState({ hasFaved: true });
		}
	}

	handleFavSpot() {
		console.log(this.props.parkID);
		console.log(this.props.context.userID);
		axios
			.post("/api/postFavSpot", {
				params: {
					park_id: this.props.parkID,
					user_id: this.props.context.userID
				}
			})
			.then(response => {
				//TODO: send handler to auth about fav spots
				console.log({ message: "Fav Spot is: ", response });
				this.setState({ buttonPressed: true });
				this.props.context.userFavorites.push(this.props.parkID);
				this.props.context.hasFavSpots = true;
				this.props.context.hasNoSpots = false;
			})
			.catch(error => {
				console.log(error);
			});
	}

	favSpotButton = () => {
		//console.log("BUTTON CLICKED!!");
		if (this.props.context.isAuth === true) {
			if (
				this.state.buttonPressed === false &&
				this.state.hasFaved === false
			) {
				return (
					<button
						className="btn btn-primary m-2"
						onClick={() => this.handleFavSpot()}
					>
						Add to Favorites
					</button>
				);
			} else {
				return (
					<button
						className="btn btn-success"
						//onClick={() => this.handleFavSpot()}
					>
						Added to Favorites!
					</button>
				);
			}
		} else {
			console.log("NOT LOGGED IN FAVPARK GOT HERE!");

			return (
				<button
					className="btn btn-primary m-2"
					onClick={() => this.handleFavSpotNoAuth()}
				>
					Add to Favorites
				</button>
			);
		}
	};

	render() {
		//const { label, score = 0, total = Math.max(1, score) } = this.props;

		return (
			<div>
				{this.favSpotButton()}

				{this.handleWarningMsg()}

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
