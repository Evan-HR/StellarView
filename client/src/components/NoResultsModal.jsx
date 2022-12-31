import React, { Component } from "react";
import Modal from "react-modal";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import ee from "eventemitter3";
import {
  notifyResultsModalIsOpen,
  notifyResultsModalIsClosed,
} from "./MainComponent";

const emitter = new ee();

export const notifyCloseResultsModal = (msg) => {
  emitter.emit("notifyCloseResultsModal", msg);
};

Modal.setAppElement("#root");
class NoResultsModal extends Component {
  constructor(props) {
    super(props);
    emitter.on("notifyCloseResultsModal", (msg) => {
      this.closeModal();
    });
    this.state = {
      modalIsOpen: false,
    };
  }

  openModal = () => {
    notifyResultsModalIsOpen();
    this.props.history.push(
      `${window.location.pathname}${window.location.search}#no-results`
    );
    this.setState({ ...this.state, modalIsOpen: true });
  };

  afterOpenModal = () => {
    document.body.style.overflow = "hidden"; //Prevents background scrolling
  };

  closeModal = () => {
    notifyResultsModalIsClosed();
    this.props.history.push(
      `${window.location.pathname}${window.location.search}`,
      null
    );
    this.setState({ ...this.state, modalIsOpen: false });
    document.body.style.overflow = "visible";
  };

  renderMessage = (moonPhaseNum, scoreBreakdown) => {
    function inRange(x, min, max) {
      return (x - min) * (x - max) <= 0;
    }

    //moon
    var daysUntilGoodMoon;
    var goodMoonCondition = false;
    var nextGoodMoonType = "";
    if (inRange(moonPhaseNum, 0.9375, 1) || inRange(moonPhaseNum, 0, 0.0625)) {
      //new moon
      goodMoonCondition = true;
    } else if (inRange(moonPhaseNum, 0.0625, 0.1875)) {
      goodMoonCondition = true;
      //Waxing Crescent
    } else if (inRange(moonPhaseNum, 0.1875, 0.3125)) {
      goodMoonCondition = true;
    } else if (inRange(moonPhaseNum, 0.3125, 0.4375)) {
      //"Waxing Gibbous";
      daysUntilGoodMoon = 11;
      nextGoodMoonType += "Last Quarter";
    } else if (inRange(moonPhaseNum, 0.4375, 0.5625)) {
      //"full moon";
      daysUntilGoodMoon = 7;
      nextGoodMoonType += "Last Quarter";
    } else if (inRange(moonPhaseNum, 0.5625, 0.6875)) {
      //Waning Gibbous
      daysUntilGoodMoon = 4;
      nextGoodMoonType += "Last Quarter";
    } else if (inRange(moonPhaseNum, 0.6875, 0.8125)) {
      //Last Quarter

      goodMoonCondition = true;
    } else if (inRange(moonPhaseNum, 0.8125, 0.9375)) {
      //Waning Crescent"
      goodMoonCondition = true;
    } else {
      //New Moon
      goodMoonCondition = true;
    }

    if (goodMoonCondition) {
      return (
        <span>
          Moon brightness isn't a problem tonight, but it's forecasted to be a
          bit too humid and/or cloudy right now. Try again tomorrow, and close
          to see nearby parks with adequate light pollution.
        </span>
      );
    } else {
      return (
        <span>
          The moon is shining too bright right now, hiding the stars. <br></br>
          Try again in <span className="daysUntil">
            {daysUntilGoodMoon}
          </span>{" "}
          days, when the moon is a <br></br>
          <span className="nextMoon">{nextGoodMoonType}</span>
        </span>
      );
    }
  };

  renderNoParks = () => {
    return (
      <NoResultsStyle noVis={this.props.noVis}>
        {this.props.noVis ? (
          <div className="messageBox">
            <div className="openingMsg">
              <h1>We're sorry.</h1>
              <span>
                No parks in your area scored above 70%. <br></br>We do not
                recommend stargazing tonight.
              </span>
            </div>
            <div className="Symbol">
              <i className="far fa-question-circle fa-2x"></i>
            </div>
            <div className="whyExplanation">
              {this.renderMessage(
                this.props.moonPhase,
                JSON.parse(JSON.stringify(this.props.scoreBreakdown))
              )}
            </div>
          </div>
        ) : (
          <div className="messageBox">
            <div className="Symbol">
              <i className="reportIcon fas fa-exclamation-triangle fa-2x"></i>
            </div>

            <span>
              Sorry, we couldn't find any suitable parks in this area! Try
              increasing your max distance and/or light pollution value using{" "}
              <i>Advanced Search</i>.
            </span>
          </div>
        )}

        <div className="OKClose" onClick={this.closeModal}>
          Close
        </div>
      </NoResultsStyle>
    );
  };

  componentDidMount() {
    this.openModal();
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          closeTimeoutMS={400}
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Login Modal"
          style={customStyles}
        >
          <ModalStyle>{this.renderNoParks()}</ModalStyle>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(NoResultsModal);

NoResultsModal.defaultProps = {
  handleCloseNoParksModal: () => {},
};

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    transition: "opacity 400ms ease-in-out",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    padding: "0px",
    border: "none",
    borderRadius: "2.5px",
    backgroundColor: "rgba(0,0,0,0.9)",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    maxHeight: "100vh",
    overflow: "hidden",
  },
};

const NoResultsStyle = styled.div`
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 60vw;
  border: none;
  max-width: 530px;
  position: relative;
  background: ${(props) => props.theme.prettyDark};
  font-family: "Lato", sans-serif;
  color: ${(props) => props.theme.white};

  @media screen and (min-width: 320px) {
  }

  .OKClose {
    all: unset;
    padding-bottom: 50px;
    font-weight: 600;
    cursor: pointer;
    color: ${(props) => props.theme.yellow};
  }

  .Symbol {
    padding: 15px 0px;
    i {
      color: ${(props) => props.theme.colorMedium};
    }
  }

  .whyExplanation {
    display: block;
    margin: auto auto;
    background: ${(props) => props.theme.moonBackground};

    border-radius: 20px;

    padding: 20px 10px;
    max-width: 450px;
    span {
      .daysUntil {
        color: ${(props) => props.theme.colorMedium};
        font-size: 25px;
      }
      .nextMoon {
        color: ${(props) => props.theme.colorMedium};
        font-size: 25px;
      }
    }

    @media screen and (min-width: 320px) {
      padding: 20px 10px;
    }

    @media screen and (min-width: 480px) {
      padding: 20px;
    }
  }

  @media screen and (min-width: 320px) {
    width: 100vw;
    width: ${(props) => (props.noVis ? "100vw" : "block")};
  }

  @media screen and (min-width: 600px) {
    width: 60vw;
  }

  @media screen and (min-width: 801px) {
    width: ${(props) => (props.noVis ? "70vw" : "45vw")};
    height: ${(props) => (props.noVis ? "70vh" : "30vh")};
  }

  .messageBox {
    width: 95%;
    margin: auto auto;

    @media screen and (min-width: 320px) {
      padding: 40px 0;
      width: 95%;
    }

    @media screen and (min-width: 600px) {
      padding: 40px 0;
      width: 85%;
    }
  }

  .close {
    outline: none;
    text-shadow: none;
    color: ${(props) => props.theme.white};
    position: absolute;
    top: -1px;
    right: 4px;
    float: right;
    font-size: 2rem;
    font-weight: 600;
    line-height: 1;
    :hover {
      color: ${(props) => props.theme.colorMedium};
      text-decoration: none;
    }
    :active {
      color: ${(props) => props.theme.white};
    }
  }
`;

const ModalStyle = styled.div`
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-clip: padding-box;
  border-radius: 0.3rem;
  outline: 0;
`;
