import React, { Component } from "react";
import styled from "styled-components";
import ee from "eventemitter3";

const emitter = new ee();

export const notify = msg => {
	emitter.emit("notification", msg);
};

export default class Notification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			msg: ""
		};
		emitter.on("notification", msg => {
			this.showNotification(msg);
		});
	}

	showNotification = msg => {
		console.log(msg);
		this.setState(
			{
				show: true,
				msg: msg
			},
			() => {
				setTimeout(() => {
					this.setState({ show: false });
				}, 4000);
			}
		);
	};

	render() {
		return (
			<React.Fragment>
				<Container show={this.state.show}>{this.state.msg}
				</Container>
			</React.Fragment>
		);
	}
}

const Container = styled.div`
	background-color: ${props=>props.theme.cardDark};
	color: ${props=>props.theme.prettyDark};
	font-family: "Lato", sans-serif;
	font-size: 18px;
	font-weight: 500px;
	border-radius: 2px;
	position: absolute;
	/* display: ${props => (props.show ? "initial" : "none")}; */
	top: ${props => (props.show ? "20vh" : "-100px")};
	left: 20px;
	padding: 16px;
	z-index: 999;
	/* transition: left 1.0s ease; */
`;
