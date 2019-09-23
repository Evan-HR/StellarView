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
            msg: ''
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
				}, 6000);
			}
		);
	};

	render() {
		return (
			<React.Fragment>
				<Container show={this.state.show}>{this.state.msg}</Container>
			</React.Fragment>
		);
	}
}

const Container = styled.div`
	background-color: red;
	position: absolute;
	top: ${props => (props.show ? "16px" : "-100px")};
	right: 16px;
	padding: 16px;
	z-index: 999;
	transition: top 0.5s ease;
`;
