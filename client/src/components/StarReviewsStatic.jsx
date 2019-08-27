import React, { Component } from "react";
import Ratings from "react-ratings-declarative";
// import theme from "../theme";

class StarReviewsStatic extends Component {
	render() {
		return (
			<Ratings
				rating={this.props.avgScore}
				widgetDimensions={this.props.starSize}
				// widgetSpacings="15px"
				widgetRatedColors="#2B3757"
				widgetEmptyColors="#989898"
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
