import React, { Component } from "react";
import axios from "axios";
import { AuthConsumer } from "./AuthContext";
class BaseReviews extends Component {
	state = {
		name: "",
		score: "",
		review: "",
		hasReviewed: false,
		switchCase: "",
		dbReviewList: []
	};

	getHasReviewed() {
		if (this.props.context.userReviews.includes(this.props.parkID)) {
			this.setState({ hasReviewed: true });
		}
	}

	componentDidMount() {
		console.log("parkID is: " + this.props.parkID);

		//get review status from user and db

		if (
			this.props.context.isAuth === true &&
			this.props.context.userReviews.includes(this.props.parkID)
		) {
			console.log("siwtch case 1");
			this.setState({
				switchCase: "loggedInHasReviewed",
				hasReviewed: true
			});
		} else if (
			this.props.context.isAuth === true &&
			this.state.hasReviewed === false
		) {
			console.log("siwtch case 2");
			this.setState({ switchCase: "loggedInNotReviewed" });
		} else if (this.props.context.isAuth === false) {
			console.log("siwtch case 3");
			this.setState({ switchCase: "notLoggedIn" });
		}

		axios
			.get("/api/getReviews", {
				params: {
					parkID: this.props.parkID
				}
			})
			.then(response => {
				console.log({ message: "Reviews Gathered!", response });

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
			name: this.props.context.firstName,
			score: this.state.score,
			review: this.state.review,
			parkID: this.props.parkID
		};

		axios
			.post("/api/storeReview", newReview)
			.then(res => console.log(res.data))
			.catch(err => console.log(err.response.data));
		this.setState({
			dbReviewList: [newReview, ...this.state.dbReviewList],
			hasReviewed: true,
			switchCase: "loggedInHasReviewed"
		});

		//push parkID to userReviews in Auth context provider
		//this.props.context.userReviews
		this.props.context.userReviews.push(this.props.parkID);
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

	renderReviewsSwitch(param) {
		switch (param) {
			case "loggedInHasReviewed":
				console.log("loggedinhasreviewed got here");
				return "Thank you for your review!";
			case "loggedInNotReviewed":
				console.log("loggedinNotreviewed got here");
				return this.renderUserNoReview();
			case "notLoggedIn":
				console.log("notLoggedI  got here");
				return "You must be logged-in to submit a review";
			default:
				return null;
		}
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

	render() {
		return (
			<div>
				{this.renderReviewsSwitch(this.state.switchCase)}
				{this.renderReviewsDiv()}
			</div>
		);
	}
}

const Reviews = props => (
	<AuthConsumer>
		{x => <BaseReviews context={x} parkID={props.parkID} />}
	</AuthConsumer>
);

export default Reviews;
