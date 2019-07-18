import React, { Component } from "react";

class Profile extends Component {
	state = {};
	render() {
		return (
			<div>
				<h1>Welcome to your PROFILE, {this.props.userName}!!!</h1>
				<img src="http://textfiles.com/underconstruction/AtAthensCrete7872translationimagesunderconstruction_0045.gif" />
			</div>
		);
	}
}

export default Profile;
