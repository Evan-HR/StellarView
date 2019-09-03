import React, { Component } from "react";
import axios from "axios";
import StarReviews from "./StarReviews";
import { AuthConsumer } from "./AuthContext";
import StarReviewsStatic from "./StarReviewsStatic";
import Login from "./Login";
import styled from "styled-components";

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

	handleJustLoggedIn = () =>{
		console.log("JUST LOGGED IN! IN REVIEWS");
		console.log("this.props.context.loggedfromReviews "+this.props.context.loggedFromReviews);
 		this.setState({ state: this.state });
	}


	componentDidMount() {
		console.log("reviews comp did mount got here!");
		console.log("parkID is: " + this.props.parkID);
		console.log("are you logged in? isAuth is = ",	this.props.context.isAuth);

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
				if (response.status === 204) {
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

		console.log("review array to be posted: ", newReview);

		if (this.state.score < 1) {
			this.setState({
				noStarError: true
			});
		} else {
			axios
				.post("/api/storeReview", newReview)
				.then(res => {
					console.log("POST REVIEW GOT HERE?!?!?!?!?");

					//push parkID to userReviews in Auth context provider
					//this.props.context.userReviews

					this.setState({
						dbReviewList: [newReview, ...this.state.dbReviewList],
						avgScore:
							(this.state.avgScore + newReview.score) /
							(this.state.numReviews + 1),
						hasReviewed: true,
						numReviews: this.state.numReviews + 1,
						switchCase: "loggedInHasReviewed",
						noStarError: false
					});
					this.props.context.userReviews.push(this.props.parkID);
				})

				.catch(error => {
					console.log(error);
				});
		}
	};



	renderErrorMsg() {
		if (this.state.noStarError === true) {
			return (
				<AlertStyle>
					<div className="alertText">
						You must click a star (1-5) before submission.
					</div>
				</AlertStyle>
			);
		}
	}

	formatReviewCards = review => (
		<ReviewStyle>
			<div className="ReviewName">{review.name}</div>
			<div className="ReviewScore">{review.score}/5 Stars</div>
			<div className="ReviewReview">{review.review}</div>
		</ReviewStyle>
	);

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
		if (this.state.avgScore === 0) {
			return "";
		} else {
			return this.state.avgScore + "/5";
		}
	}

	renderNumReviews() {
		if (this.state.numReviews === 1) {
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

	renderReviewCards = () => {
		if (this.state.dbReviewList.length > 0) {
			return this.state.dbReviewList.map(this.formatReviewCards);
		} else {
			return (
				<AlertStyle>
					<div className="AlertText">
						No reviews yet - be the first.
					</div>
				</AlertStyle>
			);
		}
	};

	//TODO: makerenderScore(), renderNumReviews() and renderStarAvg() on 1 line in css
	renderReviewsDiv() {
		return (
			<div className="border border-primary">
				{/* {this.renderScore()}
				{this.renderNumReviews()}
				{this.renderStarAvg()} */}
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
			<AlertStyle>
				<div className="AlertText">
					You must be{" "}
					<Login onClick={this.props.closeInfoModal}>
						<span>
							<b>logged-in</b>
						</span>
					</Login>{" "}
					to submit a review!
				</div>
			</AlertStyle>
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
				<ReviewsStyle>
					{this.renderStarAvg()}
					<div className="NumReviews">{this.renderNumReviews()}</div>
					<hr />
					{this.renderReviewsSwitch(this.state.switchCase)}
					{this.renderReviewCards()}
				</ReviewsStyle>
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

const ReviewsStyle = styled.div`
	.NumReviews {
		padding-top: 0.5rem;
		font-weight: normal;
	}
`;

const ReviewStyle = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto auto;
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
	margin: 25px 0px 25px 0px;

	grid-template-areas:
		"ReviewReview    ReviewReview"
		"ReviewName    	 ReviewScore";

	border-bottom: 1px solid ${props => props.theme.cardDark};

	.ReviewName {
		grid-area: ReviewName;
		/* padding-bottom: 20px; */
		padding-top: 20px;
		padding-bottom: 10px;
		/* text-align: end;
		padding-right: 25px; */
	}
	.ReviewScore {
		/* padding-bottom: 20px; */
		/* text-align: start;
		padding-left: 25px; */
		grid-area: ReviewScore;
		padding-top: 20px;
		padding-bottom: 10px;
	}

	.ReviewReview {
		font-weight: 500;
		font-size: 20px;
		padding: 20px 0px 20px 0px;
		background: #d5dae6;
		border-radius: 14px;
		grid-area: ReviewReview;
		text-align: center;
		box-shadow: 4px 9px #888888;
	}
`;

const AlertStyle = styled.div`
	position: relative;

	margin-bottom: 1rem;
	margin-top: 1rem;

	.AlertText {
		background-color: #daa97961;
		font-weight: 500;
		padding: 10px;
		span {
			color: ${props => props.theme.colorBad};
			cursor: pointer;
			:hover {
				color: ${props => props.theme.franNavy};
				transition: 0.25s;
			}
		}
	}
`;
