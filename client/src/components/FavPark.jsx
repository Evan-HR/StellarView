import React, { Component } from "react";
import axios from "axios";
import { AuthConsumer } from "./AuthContext";
import Login from "./Login";
import styled from "styled-components";


class BaseFavPark extends Component {
	state = {
		buttonPressed: false,
		clickedNoAuth: false,
		hasFaved: false,
		hasUnfaved: false
	};

	handleFavSpotNoAuth = () => {
		this.setState({
			clickedNoAuth: true
		});
	};
	handleWarningMsg = () => {
		if (this.state.clickedNoAuth === true) {
			return (
				<div className="alert alert-warning" role="alert">
					You must be logged-in to add to favorites!
				</div>
			);
		}
	};

	componentDidMount() {
		// console.log("get has faved gets called!");
		this.getHasFaved();
	}

	getHasFaved() {
		// console.log("reached getHasFaved()");
		if (this.props.context.userFavorites.includes(this.props.parkID)) {
			this.setState({ hasFaved: true });
		}
	}

	handleUnfavSpot() {
		// console.log(this.props.parkID);
		// console.log(this.props.context.userID);
		axios
			.post("/api/postUnfavSpot", {
				params: {
					park_id: this.props.parkID,
					user_id: this.props.context.userID
				}
			})
			.then(response => {
				//TODO: send handler to auth about fav spots
				// console.log({ message: "Fav Spot is: ", response });
				this.setState({ buttonPressed: true, hasUnfaved: true, hasFaved:false });
				this.props.context.userFavorites.pop(this.props.parkID);
				// this.props.context.hasFavSpots = true;
				// this.props.context.hasNoSpots = false;
			})
			.catch(error => {
				console.log(error);
			});
	}

	handleFavSpot() {
		// console.log(this.props.parkID);
		// console.log(this.props.context.userID);
		axios
			.post("/api/postFavSpot", {
				params: {
					park_id: this.props.parkID,
					user_id: this.props.context.userID
				}
			})
			.then(response => {
				//TODO: send handler to auth about fav spots
				// console.log({ message: "Fav Spot is: ", response });
				this.setState({ buttonPressed: true,hasFaved: true,hasUnfaved:false });
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
				
					<button onClick={() => this.handleFavSpot()}>
						<i className="fas fa-heart fa-2x UnfavedHeart" />
					</button>
				
				);
			} else if (
				this.state.buttonPressed === true &&
				this.state.hasUnfaved === true
			) {
				return (
				
					<button onClick={() => this.handleFavSpot()}>
						<i className="fas fa-heart fa-2x UnfavedHeart" />
					</button>
			
				);
			} else {
				return (
					
					<button onClick={() => this.handleUnfavSpot()}>
						<i className="fas fa-heart fa-2x FavedHeart" />
					</button>
				
				);
			}
		} else {
			// console.log("NOT LOGGED IN FAVPARK GOT HERE!");

			return (
				<Login handleLogin={this.props.handleLogin}>
					<i className="fas fa-heart fa-2x UnfavedHeart" />
				</Login>
			);
		}
	};

	render() {
		//const { label, score = 0, total = Math.max(1, score) } = this.props;

		return <FavParkButtonStyle>{this.favSpotButton()}</FavParkButtonStyle>;
	}
}

//export default FavPark;

const FavPark = props => (
	<AuthConsumer>
		{x => <BaseFavPark context={x} parkID={props.parkID} />}
	</AuthConsumer>
);

export default FavPark;

const FavParkButtonStyle = styled.div`
	button {
		all: unset;
		outline: none;
	}

	.FavedHeart {
		color: ${props => props.theme.colorGood};
		cursor: pointer;
		transition: 0.25s;
		:focus,
	:hover {
		text-decoration: none;
		color: ${props => props.theme.colorBad};
		transition: 0.25s;
	}
	}

	.UnfavedHeart {
		color: ${props => props.theme.colorBad};
		cursor: pointer;
			transition: 0.25s;
			:focus,
	:hover {
		text-decoration: none;
		color: ${props => props.theme.colorBadHover};
		transition: 0.25s;
	}
	}
`;
