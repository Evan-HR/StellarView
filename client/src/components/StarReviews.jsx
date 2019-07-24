import React, { Component } from "react";
import Ratings from "react-ratings-declarative";

class StarReviews extends Component {
	state = {
		rating: this.props.scoreProp
	};

	changeRating = newRating => {
		this.props.scoreProp = newRating;
	};

	render() {
		return (
			<Ratings
				rating={this.state.rating}
				widgetRatedColors="yellow"
				changeRating={this.changeRating}
			>
				<Ratings.Widget />
				<Ratings.Widget />
				<Ratings.Widget />
				<Ratings.Widget />
				<Ratings.Widget />
			</Ratings>
		);
	}
}

export default StarReviews;
