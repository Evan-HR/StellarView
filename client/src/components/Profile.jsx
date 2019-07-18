import React, { Component } from "react";

class Profile extends Component {
	state = {};
	render() {
		console.log(this.props)
		return (
			<div>
				<h1>Welcome to your PROFILE, {this.props.firstName}!!!</h1>
				<img src="http://textfiles.com/underconstruction/AtAthensCrete7872translationimagesunderconstruction_0045.gif" />
			</div>
		);
	}
}

export default Profile;
