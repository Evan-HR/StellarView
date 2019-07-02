import React, { Component } from "react";
import axios from "axios";
class Reviews extends Component {
	state = {
		name: "",
		score: "",
		review: "",
		dbReviewList: []
	};

	// getReviewsAxios(){
	// 	return axios
	// 		.get("/api/getReviews")

	// 		.then(response => {
	// 			// returning the data here allows the caller to get it through another .then(...)
	// 			return response.data;
	// 		});
	// };



	componentDidMount(){
		axios
			.get("/api/getReviews")
			.then(response => {
				console.log({ message: "Request received!", response });

				//prints dustin
				//START HERE!!!!!!!!!!!!!!!!!!!!!!!!
				//append to STATE!
				console.log(response.data[0].name);

				if (response.data.length > 110) {
					console.log("BLAH!?");
					response.data.map(x =>
						this.state.dbReviewList.push([
							x.name,
							x.score,
							x.review
						])
					);
				} else {
					console.log("BLU?!!!");
					this.state.dbReviewList.push(
					"pardon?"
					);
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	onSubmit = e => {
		e.preventDefault();
		//console.log(this.state.reqData);i
		//const errors = this.validate(this.state.reqData);
		//if (errors.length === 0) {
		//this.setState({ ...this.state, formErrors: [] });
		this.setState(prevState => ({
			dbReviewList: [...prevState.dbReviewList, this.state]
		}));

		const newReview = {
			name: this.state.name,
			score: this.state.score,
			review: this.state.review
		};

		axios
			.post("/api/storeReview", newReview)
			.then(res => console.log(res.data))
			.catch(err => console.log(err.response.data));
	};

	// populateReviewTable = review => (
	// 	<tr>
	// 		<td>{review.name}</td>
	// 		<td>{review.score}</td>
	// 		<td>{review.review}</td>
	// 	</tr>
	// );

	renderReviews = () => {

			return (
				<tr>
					<td colSpan={3}>
						<strong style={{ color: "red" }}>
							{this.state.dbReviewList[0]}
						</strong>
					</td>
				</tr>
			)

	};


//format for state results
	renderPark = park => (
		<tr>
			<td>{park.name}</td>
			<td>{park.light_pol}</td>
			<td>{park.distance}</td>
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

	// this.setState({
	// 	date: new Date()
	//   });
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
						<tbody>
							<tr>
								<th>Name</th>
								<th>Score</th>
								<th>Review</th>
							</tr>
						</tbody>
						<tbody>{
							this.renderReviews()
							}</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default Reviews;
