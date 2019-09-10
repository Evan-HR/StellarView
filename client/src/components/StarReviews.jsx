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
				widgetRatedColors="#2F3334"
				widgetEmptyColors="#989898"
				changeRating={this.changeRating}
			>
				<Ratings.Widget widgetHoverColor="#2F3334" rating={1} />
				<Ratings.Widget widgetHoverColor="#2F3334" rating={2} />
				<Ratings.Widget widgetHoverColor="#2F3334" rating={3} />
				<Ratings.Widget widgetHoverColor="#2F3334" rating={4} />
				<Ratings.Widget widgetHoverColor="#2F3334" rating={5} />
			</Ratings>
		);
	}
}

export default StarReviews;
