import React, { Component } from "react";
class Reviews extends Component {
	state = {
		reviewList: [
			{ name: "dustin", score: 5, review: "dece" },
			{ name: "vlad", score: 3, review: "ye" }
		]
	};

	renderReviewsTable = () => {
		if (this.state.reviewList.length > 0) {
			return this.state.reviewList.map(this.renderReviewFormat);
		} else {
			return (
				<tr>
					<td colSpan={3}>
						<strong style={{ color: "red" }}>
							There are no reviews for this location yet - be the
							first!
						</strong>
					</td>
				</tr>
			);
		}
	};

	renderReviewFormat = review => (
		<tr>
			<td>{review.name}</td>
			<td>{review.score}</td>
			<td>{review.review}</td>
		</tr>
	);

	render() {
		return (
			<div className="border border-primary">
				<table className="table table-hover">
					<tr>
						<th>Name</th>
						<th>Score</th>
						<th>Review</th>
					</tr>
					<tbody>{this.renderReviewsTable()}</tbody>
				</table>
			</div>
		);
	}
}

export default Reviews;
