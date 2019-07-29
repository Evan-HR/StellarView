import React, { Component } from "react";
import Ratings from "react-ratings-declarative";

class StarReviews extends Component {
	state = {
		rating: 0
	};

	changeRating = newRating => {
		this.state.rating = newRating;
		this.props.scoreProp(newRating);
	};

	render() {
		return (
			<Ratings
				rating={this.state.rating}
				widgetRatedColors="yellow"
				changeRating={this.changeRating}
			>
				<Ratings.Widget rating={1} />
				<Ratings.Widget rating={2} />
				<Ratings.Widget rating={3} />
				<Ratings.Widget rating={4} />
				<Ratings.Widget rating={5} />
			</Ratings>
		);
	}
}

export default StarReviews;
