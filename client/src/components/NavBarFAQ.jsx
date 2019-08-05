import React, { Component } from "react";
import Modal from "react-modal";
import "./modal.css";
import { withRouter, Link } from "react-router-dom";

const modalStyle = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: "rgba(0,0,0,0.75)"
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		borderRadius: "25px",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		width: "95%",
		maxWidth: "600px",
		height: "95%",
		overflowY: "auto"
	}
};

class NavBarFAQ extends Component {
	state = { modalIsOpen: false };

	openModal = () => {
		this.setState({ ...this.state, modalIsOpen: true });
	};

	afterOpenModal = () => {
		document.body.style.overflow = "hidden"; //Prevents background scrolling
	};

	closeModal = () => {
		this.setState({ ...this.state, modalIsOpen: false });
		document.body.style.overflow = "visible";
	};

	render() {
		return (
			<React.Fragment>
				<a onClick={() => this.openModal()}>
					<Link>FAQ</Link>
				</a>
				<Modal
					className="modal-dialog"
					closeTimeoutMS={150}
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={modalStyle}
					contentLabel="FAQ Modal"
				>
					<div className="modal-content">
						<div className="modal-header">
							<h1>StarGazer</h1>
						</div>

						<div className="modal-body">
							<p>
								Throughout history there have been many stars.{" "}
							</p>
							<img
								src="https://apod.nasa.gov/apod/image/1705/Arp273Main_HubblePestana_3079.jpg"
								alt="galaxy"
								width="40%"
								maxWidth="500px"
								//height="20%"
							/>
							<p>
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Integer nec odio. Praesent
								libero. Sed cursus ante dapibus diam. Sed nisi.
								Nulla quis sem at nibh elementum imperdiet. Duis
								sagittis ipsum. Praesent mauris. Fusce nec
								tellus sed augue semper porta. Mauris massa.
								Vestibulum lacinia arcu eget nulla. Class aptent
								taciti sociosqu ad litora torquent per conubia
								nostra, per inceptos himenaeos.{" "}
							</p>

							<p>
								Curabitur sodales ligula in libero. Sed
								dignissim lacinia nunc. Curabitur tortor.
								Pellentesque nibh. Aenean quam. In scelerisque
								sem at dolor. Maecenas mattis. Sed convallis
								tristique sem. Proin ut ligula vel nunc egestas
								porttitor. Morbi lectus risus, iaculis vel,
								suscipit quis, luctus non, massa. Fusce ac
								turpis quis ligula lacinia aliquet. Mauris
								ipsum.{" "}
							</p>

							<p>
								Nulla metus metus, ullamcorper vel, tincidunt
								sed, euismod in, nibh. Quisque volutpat
								condimentum velit. Class aptent taciti sociosqu
								ad litora torquent per conubia nostra, per
								inceptos himenaeos. Nam nec ante. Sed lacinia,
								urna non tincidunt mattis, tortor neque
								adipiscing diam, a cursus ipsum ante quis
								turpis. Nulla facilisi. Ut fringilla.
								Suspendisse potenti. Nunc feugiat mi a tellus
								consequat imperdiet. Vestibulum sapien. Proin
								quam.{" "}
							</p>

							<p>
								Etiam ultrices. Suspendisse in justo eu magna
								luctus suscipit. Sed lectus. Integer euismod
								lacus luctus magna. Quisque cursus, metus vitae
								pharetra auctor, sem massa mattis sem, at
								interdum magna augue eget diam. Vestibulum ante
								ipsum primis in faucibus orci luctus et ultrices
								posuere cubilia Curae; Morbi lacinia molestie
								dui. Praesent blandit dolor. Sed non quam. In
								vel mi sit amet augue congue elementum. Morbi in
								ipsum sit amet pede facilisis laoreet. Donec
								lacus nunc, viverra nec, blandit vel, egestas
								et, augue. Vestibulum tincidunt malesuada
								tellus.{" "}
							</p>

							<p>
								Ut ultrices ultrices enim. Curabitur sit amet
								mauris. Morbi in dui quis est pulvinar
								ullamcorper. Nulla facilisi. Integer lacinia
								sollicitudin massa. Cras metus. Sed aliquet
								risus a tortor. Integer id quam. Morbi mi.
								Quisque nisl felis, venenatis tristique,
								dignissim in, ultrices sit amet, augue. Proin
								sodales libero eget ante. Nulla quam. Aenean
								laoreet. Vestibulum nisi lectus, commodo ac,
								facilisis ac, ultricies eu, pede.{" "}
							</p>
						</div>
						<div className="modal-footer">
							<button
								className="btn btn-primary float-right"
								onClick={this.closeModal}
							>
								Okay
							</button>
						</div>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default NavBarFAQ;
