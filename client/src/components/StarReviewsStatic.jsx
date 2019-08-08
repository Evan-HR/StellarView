import React, { Component } from "react";
import Ratings from "react-ratings-declarative";

class StarReviewsStatic extends Component {
	render() {
		return (
			<Ratings
				rating={this.props.avgScore}
				widgetDimensions="40px"
				widgetSpacings="15px"
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
export default StarReviewsStatic;
