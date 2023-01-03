import React, { Component } from 'react';
import Ratings from 'react-ratings-declarative';

class StarReviewsStatic extends Component {
  render() {
    return (
      <Ratings
        rating={this.props.avgScore ? this.props.avgScore : 0}
        widgetDimensions={this.props.starSize}
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
