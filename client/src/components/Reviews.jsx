import React, { Component } from "react";
import axios from "axios";
import StarReviews from "./StarReviews";
import { AuthConsumer } from "./AuthContext";
import StarReviewsStatic from "./StarReviewsStatic";
import Login from "./Login";
import styled from "styled-components";
import formError from "./style/Media/formError.svg";

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

	dateFormatter(date) {
		return date.slice(0, 10);
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

	handleJustLoggedIn = () => {
		console.log("JUST LOGGED IN! IN REVIEWS");
		console.log(
			"this.props.context.loggedfromReviews " +
				this.props.context.loggedFromReviews
		);
		this.setState({ state: this.state });
	};

	componentDidMount() {
		console.log("reviews comp did mount got here!");
		console.log("parkID is: " + this.props.parkID);
		console.log(
			"are you logged in? isAuth is = ",
			this.props.context.isAuth
		);

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
							review: x.review,
							date: this.dateFormatter(x.date)
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
					<img className="formError" src={formError} />
					<div className="AlertText">
						You must click a star (1-5) before submission.
					</div>
				</AlertStyle>
			);
		}
	}

	formatReviewCards = review => {
		//if there is no review, show the static Stars in the main placeholder
		return review.review === "" ? (
			<ReviewStyle>
				<div className="ReviewName">{review.name}</div>
				<div className="ReviewScore">{review.score}/5 Stars</div>
				<div className="ReviewDate">{review.date}</div>
				<div className="ReviewReview">
					<StarReviewsStatic avgScore={review.score} />
				</div>
			</ReviewStyle>
		) : (
			<ReviewStyle>
				<div className="ReviewName">{review.name}</div>
				<div className="ReviewScore">{review.score}/5 Stars</div>
				<div className="ReviewReview">{review.review}</div>
				<div className="ReviewDate">{review.date}</div>
			</ReviewStyle>
		);
	};

	// formatReviews = review => (
	// 	<tr>
	// 		<td>{review.name}</td>
	// 		<td>{review.score}</td>
	// 		<td>{review.review}</td>
	// 	</tr>
	// );

	renderUserNoReview() {
		return (
			<ReviewFormStyle>
				<form id="reviewForm">
					<label>
						<textarea
							rows="4"
							cols="30"
							name="review"
							placeholder="Share your thoughts... "
							onChange={this.handleReviewChange}
							value={this.state.review}
						/>
					</label>

					<StarReviews scoreProp={this.handleStarScore} />
					<div className="submitButton">
						<button onClick={e => this.onSubmit(e)}>
							Submit Review
						</button>
					</div>
				</form>
				{this.renderErrorMsg()}
			</ReviewFormStyle>
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

	renderUserNotLoggedIn() {
		return (
			<AlertStyle>
				<div className="AlertText">
					You must be{" "}
					<Login refreshInfoModal={this.props.refreshInfoModal}>
						<span>
							{/* <span onClick={() => this.props.closeInfoModal()}> */}
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
				return (
					<div className="success">Thank you for your review!</div>
				);
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
	<AuthConsumer>{x => <BaseReviews {...props} context={x} />}</AuthConsumer>
);

// BaseReviews.defaultProps = {
// 	closeInfoModal: () => {
// 		console.log("Shite");
// 	}
// };

export default Reviews;

const ReviewsStyle = styled.div`
	.NumReviews {
		padding-top: 0.5rem;
		font-weight: normal;
	}
	.success {
		font-size: 20px;
	}
`;

const ReviewFormStyle = styled.div`
	textarea::placeholder {
		color: ${props => props.theme.mapBlue};
	}

	.submitButton {
		button {
			margin-top: 15px;
			margin-bottom: 15px;
			font-size: 13px;
			color: rgb(100, 100, 100);

			border: none;
			outline: none;
			height: 40px;
			text-transform: uppercase;
			background: ${props => props.theme.starDark};
			transition: 0.25s;
			width: 100%;
			color: ${props => props.theme.white};
			cursor: pointer;
			background-position: center;
			transition: background 0.6s;

			:hover {
				background: ${props => props.theme.starDark}
					radial-gradient(
						circle,
						transparent 1%,
						rgba(0, 0, 0, 0.6) 1%
					)
					center/15000%;
				color: ${props => props.theme.colorBad};
			}
			:active {
				background-color: rgba(0, 0, 0, 0.6);
				background-size: 100%;
				transition: background 0s;
				transition: color 0.25s;
			}
		}
	}
	label {
		display: block;
		textarea {
			background-color: #9898981c;
			border: none;
			width: 100%;
			padding: 5px 15px;
		}
	}

	span {
		display: block;
		/* text-align: left; */
		text-align: left;
		font-size: 15px;
		padding-bottom: 10px;
	}
`;

const ReviewStyle = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: auto auto;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	margin: 25px 0px 25px 0px;
	font-family: monospace;

	grid-template-areas:
		"ReviewReview ReviewReview ReviewReview"
		"ReviewName   ReviewDate   ReviewScore";

	.ReviewName {
		grid-area: ReviewName;
		padding-top: 2px;
		text-align: start;
	}
	.ReviewScore {
		grid-area: ReviewScore;
		padding-top: 2px;
		text-align: end;
	}

	.ReviewDate {
		grid-area: ReviewDate;
		padding-top: 2px;
		
	}
	.ReviewReview {
		background: #c2ccd4b0;
		border-radius: 20px;
		font-weight: 500;
		font-size: 16px;
		padding: 20px 10px 20px 10px;
		grid-area: ReviewReview;
		text-align: center;
	}
`;

const AlertStyle = styled.div`
	position: relative;

	margin-bottom: 1rem;
	margin-top: 1.5rem;
	img {
		padding-bottom: 10px;
		width: 42px;
	}

	.AlertText {
		/* background-color: #daa97961; */
		font-size: 20px;

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
