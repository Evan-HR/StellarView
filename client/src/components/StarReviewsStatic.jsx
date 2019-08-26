import React, { Component } from "react";
import Ratings from "react-ratings-declarative";
// import theme from "../theme";

class StarReviewsStatic extends Component {
	render() {
		return (
			<Ratings
				rating={this.props.avgScore}
				widgetDimensions="20px"
				// widgetSpacings="15px"
				widgetRatedColors="#FAE6BF"
				widgetEmptyColors="#2F3334"
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
