import React, { Component } from "react";
class Reviews extends Component {
	state = {
		name: "",
		score: "",
		review: "",
		reviewList: [
			{ name: "dustin", score: 5, review: "dece" },
			{ name: "vlad", score: 3, review: "ye" }
		]
	};

	renderReviewsTable = () => {
		if (this.state.reviewList.length > 0) {
			return this.state.reviewList.map(this.populateReviewTable);
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

	onSubmit = e => {
		e.preventDefault();
		//console.log(this.state.reqData);i
		//const errors = this.validate(this.state.reqData);
		//if (errors.length === 0) {
		//this.setState({ ...this.state, formErrors: [] });
		this.setState(prevState => ({
			reviewList: [...prevState.reviewList, this.state]
		}));
		//this.props.fetchParks(this.state.reqData);
		// } else {
		// 	this.setState({ ...this.state, formErrors: errors });
		// }
		//getparks(reqdata) of parent
	};

	populateReviewTable = review => (
		<tr>
			<td>{review.name}</td>
			<td>{review.score}</td>
			<td>{review.review}</td>
		</tr>
	);

	//handle any form input change at once
	//onChange={this.handleChange.bind(this)} for each input
	// handleChange = e => {
	// 	// If you are using babel, you can use ES 6 dictionary syntax
	// 	// let change = { [e.target.name] = e.target.value }
	// 	let change = {};
	// 	change[e.target.name] = e.target.value;
	// 	this.setState(change);
	// };

	handleNameChange = e => {
		this.setState(e.target.value);
	};
	handleScoreChange = e => {
		this.setState(e.target.value);
	};
	handleReviewChange = e => {
		this.setState(e.target.value);
	};

	render() {
		return (
			<div>
				<form id="reviewForm">
					<label>
						Name: <br />
						<input
							type="text"
							placeholder="Name"
							name="name"
							onChange={this.handleNameChange}
							value={this.state.name}
						/>
					</label>
					<br />
					<label>
						Score (1-5):
						<br />
						<input
							type="number"
							min="1"
							max="5"
							name="score"
							onChange={this.handleScoreChange}
							value={this.state.score}
						/>
					</label>
					<br />
					Review
					<br />
					<label>
						<textarea
							rows="4"
							cols="30"
							name="review"
							placeholder="Enter text here..."
							onChange={this.handleReviewChange}
							value={this.state.review}
						/>
					</label>
					<br />
					<button
						className="btn btn-primary m-2"
						onClick={e => this.onSubmit(e)}
					>
						Submit
					</button>
				</form>

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
			</div>
		);
	}
}

export default Reviews;
