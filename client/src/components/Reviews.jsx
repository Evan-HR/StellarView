import React, { Component } from "react";
import axios from "axios";
import { AuthProvider, AuthConsumer } from "./AuthContext";
class Reviews extends Component {
	state = {
		name: "",
		score: "",
		review: "",
		hasReviewed: false,
		switchCase: "",
		dbReviewList: []
	};

	componentDidMount() {
		axios
			.get("/api/getReviews", {
				params: {
					parkID: this.props.parkID
				}
			})
			.then(response => {
				console.log({ message: "Request received!", response });

				if (response.data.length > 0) {
					var tempReviewsArr;

					console.log("BLAH!?");
					tempReviewsArr = response.data.map(x => {
						return {
							name: x.name,
							score: x.score,
							review: x.review
						};
					});
					this.setState({
						dbReviewList: tempReviewsArr
					});
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	onSubmit = e => {
		e.preventDefault();

		const newReview = {
			name: this.state.name,
			score: this.state.score,
			review: this.state.review,
			parkID: this.props.parkID
		};

		axios
			.post("/api/storeReview", newReview)
			.then(res => console.log(res.data))
			.catch(err => console.log(err.response.data));
		this.setState({
			dbReviewList: [newReview, ...this.state.dbReviewList]
		});
	};

	formatReviews = review => (
		<tr>
			<td>{review.name}</td>
			<td>{review.score}</td>
			<td>{review.review}</td>
		</tr>
	);

	renderUserNoReview() {
		return (
			<form id="reviewForm">
				<label>
					Name: <br />
					<input
						type="text"
						placeholder={this.name}
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
		);
	}

	renderReviewsDiv() {
		return (
			<div className="border border-primary">
				<table className="table table-hover">
					<tbody>
						<tr>
							<th>Name</th>
							<th>Score</th>
							<th>Review</th>
						</tr>
					</tbody>
					<tbody>{this.renderReviewTable()}</tbody>
				</table>
			</div>
		);
	}

	renderReviewTable = () => {
		if (this.state.dbReviewList.length > 0) {
			return this.state.dbReviewList.map(this.formatReviews);
		} else {
			return (
				<tr>
					<td colSpan={3}>
						<strong style={{ color: "red" }}>
							No reviews available. Be the first!
						</strong>
					</td>
				</tr>
			);
		}
	};

	handleNameChange = e => {
		this.setState({ name: e.target.value });
	};
	handleScoreChange = e => {
		this.setState({ score: e.target.value });
	};

	handleReviewChange = e => {
		this.setState({ review: e.target.value });
	};

	getSwitchCase() {
		return (
			<AuthConsumer>
				{x => {
					console.log("get here? auth is: " + x.isAuth);
					if (x.isAuth == true && this.state.hasReviewed == true) {
						this.setState(
							(this.state.switchCase = "loggedInHasReviewed")
						);
					} else if (
						x.isAuth == true &&
						this.state.hasReview == false
					) {
						this.setState(
							(this.state.switchCase = "loggedInNotReviewed")
						);
					} else if (x.isAuth == false) {
						this.setState((this.state.switchCase = "notLoggedIn"));
					}
				}}
			</AuthConsumer>
		);
	}

	render() {
		//this.getSwitchCase();
		return (
			<div>
				{this.state.hasReviewed === false
					? this.renderUserNoReview()
					: "Review Submitted.  Thank you!"}

				{this.renderReviewsDiv()}
			</div>
		);
	}
}

export default Reviews;
