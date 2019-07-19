import React from "react";
import axios from "axios";
import { AuthConsumer } from "./AuthContext";
class BaseFavPark extends React.PureComponent {
	handleFavSpot() {
		console.log("BUTTON CLICKED!!");
	}

	render() {
		//const { label, score = 0, total = Math.max(1, score) } = this.props;

		return (
			<div>
				<button
					className="btn btn-primary m-2"
					onClick={() => this.handleFavSpot()}
				>
					Add to Favorites
				</button>

				<p>hello {this.props.context.firstName}</p>
			</div>
		);
	}
}
//export default FavPark;

const FavPark = props => (
	<AuthConsumer>
		{x => <BaseFavPark context={x} parkID={props.parkID} />}
	</AuthConsumer>
);

export default FavPark;
