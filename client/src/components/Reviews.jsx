import React, { Component } from "react";
import axios from "axios";
import StarReviews from "./StarReviews";
import { AuthConsumer } from "./AuthContext";
import StarReviewsStatic from "./StarReviewsStatic";
class BaseReviews extends Component {
	constructor(props) {
		super(props);
		this.state = {
			score: 0,
			review: "",
			hasReviewed: false,
			switchCase: "",
			noStarError: false,
			avgScore: 0,
			numReviews: 0,
			dbReviewList: []
		};
		this.handleStarScore = this.handleStarScore.bind(this);
	}

	getHasReviewed() {
		if (this.props.context.userReviews.includes(this.props.parkID)) {
			this.setState({ hasReviewed: true });
		}
	}

	handleStarScore(scoreProp) {
		this.setState({
			score: scoreProp
		});
	}

	componentDidMount() {
		console.log("reviews comp did mount got here!");
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
			console.log("switch case 2");
			this.setState({ switchCase: "loggedInNotReviewed" });
		} else if (
			this.props.context.isAuth === false ||
			this.props.context.isAuth === null
		) {
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
				if (response.status == 204) {
					this.setState({
						dbReviewList: [],
						avgScore: 0
					});
				} else {
					var tempReviewsArr;

					console.log("BLAH!?");
					tempReviewsArr = response.data.reviews.map(x => {
						return {
							name: x.name,
							score: x.score,
							review: x.review
						};
					});
					this.setState({
						dbReviewList: tempReviewsArr,
						avgScore: response.data.averageScore,
						numReviews: response.data.numReviews
						//avgReceived: true
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
			user_id: this.props.context.userID,
			score: this.state.score,
			review: this.state.review,
			parkID: this.props.parkID
		};

		if (this.state.score < 1) {
			this.setState({
				noStarError: true
			});
		} else {
			axios
				.post("/api/storeReview", newReview)
				.then(res => console.log(res.data))
				.catch(err => console.log(err.response.data));
			this.setState({
				dbReviewList: [newReview, ...this.state.dbReviewList],
				avgScore:
					this.state.avgScore +
					newReview.score / (this.state.numReviews + 1),
				hasReviewed: true,
				numReviews: this.state.numReviews + 1,
				switchCase: "loggedInHasReviewed",
				noStarError: false
			});

			//push parkID to userReviews in Auth context provider
			//this.props.context.userReviews
			this.props.context.userReviews.push(this.props.parkID);
		}
	};

	renderErrorMsg() {
		if (this.state.noStarError === true) {
			return (
				<div class="alert alert-danger" role="alert">
					You must click a star (1-5) before submission.
				</div>
			);
		}
	}

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
				{/* <label>
					Name: <br />
					<input
						type="text"
						placeholder={this.name}
						name="name"
						onChange={this.handleNameChange}
						value={this.state.name}
					/>
				</label> */}
				<br />
				<StarReviews scoreProp={this.handleStarScore} />
				<br />
				Share your thoughts!
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

	renderScore() {
		if (this.state.avgScore == 0) {
			return "";
		} else {
			return this.state.avgScore + "/5";
		}
	}

	renderNumReviews() {
		if (this.state.numReviews == 1) {
			return <div>{this.state.numReviews} review</div>;
		} else {
			return <div>{this.state.numReviews} reviews</div>;
		}
	}

	renderStarAvg() {
		return (
			<div>
				<StarReviewsStatic avgScore={this.state.avgScore} />
			</div>
		);
	}

	//TODO: makerenderScore(), renderNumReviews() and renderStarAvg() on 1 line in css
	renderReviewsDiv() {
		return (
			<div className="border border-primary">
				{this.renderScore()}
				{this.renderNumReviews()}
				{this.renderStarAvg()}

				{this.renderErrorMsg()}
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

	renderUserNotLoggedIn() {
		return (
			<div class="alert alert-warning" role="alert">
				You must be logged in to submit a review!
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
				console.log("notLoggedIn  got here");
				return this.renderUserNotLoggedIn();
			//return "You must be logged-in to submit a review";
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
