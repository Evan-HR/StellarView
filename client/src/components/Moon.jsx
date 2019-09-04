import React, { Component } from "react";
import styled from "styled-components";
import MoonDisplay from "./MoonDisplay";

class Moon extends Component {
	state = {};

	render() {
		return (
			<MoonStyle>
				<div className="moonDisplay">
					<span>{this.props.moonType.split(" ")[0]}</span>
					<span className="MoonDisplayContainer">
						<MoonDisplay phase={this.props.moon} />
					</span>
					<span>{this.props.moonType.split(" ")[1]}</span>
				</div>
			</MoonStyle>
		);
	}
}

export default Moon;
///////////////////////////////////////////////////////////////
const MoonStyle = styled.div`
	color: whitesmoke;
	/* font-family: IBM Plex Sans; */
	font-family: "Lato", sans-serif;
	font-weight: 600;
	font-style: normal;
	font-size: 30px;
	text-align: center;
	text-transform: uppercase;

	.moonDisplay {
		height: 140px;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		align-content: space-between;

		.MoonDisplayContainer {
			border-radius: 100px;
			box-shadow: 0 0 20px #485261;
			width: 90px;
		}
	}
`;
