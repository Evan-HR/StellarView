import React, { Component } from "react";
import Modal from "react-modal";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import {
  notifyTutorialModalIsOpen,
  notifyTutorialModalIsClosed,
} from "./MainComponent";
import ee from "eventemitter3";
import searchIcon from "./style/Media/search-solid.svg";
import SVG from "react-inlinesvg";
import markerGood from "./style/MapMarkers/resultsGood.svg";
import markerAverage from "./style/MapMarkers/resultsMedium.svg";
import markerBad from "./style/MapMarkers/resultsBad.svg";

const emitter = new ee();

export const notifyCloseTutorialModal = (msg) => {
  emitter.emit("notifyCloseTutorialModal", msg);
};

Modal.setAppElement("#root");
class Tutorial extends Component {
  constructor(props) {
    super(props);
    emitter.on("notifyCloseTutorialModal", (msg) => {
      this.closeModal();
    });
    this.state = {
      modalIsOpen: false,
      nextCounter: 0,
      globalStepMsgCounter: 0,
    };
  }

  openModal = () => {
    notifyTutorialModalIsOpen();
    this.props.history.push(
      `${window.location.pathname}${window.location.search}#tutorial`
    );
    this.setState({ ...this.state, modalIsOpen: true });
  };

  afterOpenModal = () => {
    document.body.style.overflow = "hidden"; //Prevents background scrolling
  };

  closeModal = () => {
    this.setState({ nextCounter: (this.state.nextCounter = 0) });
    notifyTutorialModalIsClosed();
    this.props.history.push(
      `${window.location.pathname}${window.location.search}`,
      null
    );
    this.setState({ modalIsOpen: false, errorDB: false });
    document.body.style.overflow = "visible";
  };

  renderStepOneSearch = () => {
    return (
      <React.Fragment>
        {this.state.nextCounter === 0 ? (
          <div className="secondary">
            <div className="searchIcon">
              <SVG src={searchIcon}></SVG>
            </div>
          </div>
        ) : this.state.nextCounter === 1 ? (
          <div className="secondary">
            <div className="myLocation">
              <button className="nearMe" type="button">
                <strong>Near me</strong>
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  };

  renderMessage = () => {
    if (this.state.nextCounter === 0) {
      return (
        <React.Fragment>
          <h3>SEARCH</h3>
          <span>
            Start by entering any location in North America (minus some parts of
            PEI), Australia, or New Zealand. Tap the magnifying glass.
          </span>
          {this.renderStepOneSearch()}
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 1) {
      return (
        <React.Fragment>
          <h3>SEARCH</h3>
          <span>
            You can also search near you by pressing "Near Me". Please allow
            your browser to have access to your location.
          </span>
          {this.renderStepOneSearch()}
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 2) {
      return (
        <React.Fragment>
          <h3>SEARCH</h3>
          <span>
            By default, we search up to 25km away from your location. Tap{" "}
            <i>Advanced Search</i> if you wish to customize your search.
          </span>
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 3) {
      return (
        <React.Fragment>
          <h3>SEARCH</h3>
          <span>
            The Max Light Pollution zone is the maximum light pollution you want
            the parks to be in. <i>Dark</i> means the M33 is easily seen with
            naked eye. <i>Rural</i> means M15, M4, M5, and M22 are naked-eye
            objects.
          </span>
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 4) {
      return (
        <React.Fragment>
          <h3>RESULTS</h3>
          <span>
            If successful, parks will be returned in the form of a map, or in
            card form. The red, yellow, and green map markers mean poor,
            mediocre, and great star visibility respectively.
          </span>
          <div className="secondary">
            <img src={markerBad} />
            <img src={markerAverage} />
            <img src={markerGood} />
          </div>
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 5) {
      return (
        <React.Fragment>
          <h3>RESULTS</h3>
          <span>
            You can click a map marker or a card to bring up more information
          </span>
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 6) {
      return (
        <React.Fragment>
          <h3>RESULTS</h3>
          <span>
            If none of the parks returned score above 70%, we advise that you do
            not make the journey to stargaze that night. We will provide you
            with an estimate return date if the poor score was due to the moon
            illumination.
          </span>
          <div className="secondary">
            <i className="fas fa-eye-slash fa-2x"></i>
          </div>
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 7) {
      return (
        <React.Fragment>
          <h3>STARGAZE</h3>
          <span>
            A score above 70% means the conditions for stargazing are adequate.
            Of course, a score of 80% or greater is better! Please note the
            forecast information on the cards and cross-check with your local
            weather service before deciding.
          </span>
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 8) {
      return (
        <React.Fragment>
          <h3>STARGAZE</h3>
          <span>
            Please see FAQ for a breakdown on how the score is formulated.
            Essentially, the moon phase plays the biggest role, followed by
            light pollution, cloud coverage, and humidity.
          </span>
        </React.Fragment>
      );
    } else if (this.state.nextCounter === 9) {
      return (
        <React.Fragment>
          <h3>STARGAZE</h3>
          <span>
            Go to the park and enjoy your evening! If the park has heavy
            streetlights, find a darker area nearby
          </span>
          <div className="secondary">
            <i className="far fa-laugh-wink fa-3x"></i>
          </div>
        </React.Fragment>
      );
    }
  };

  incrementButton = () => {
    if (this.state.nextCounter < 9) {
      this.setState({ nextCounter: this.state.nextCounter + 1 });
    } else if (this.state.nextCounter === 9) {
      this.closeModal();
    }
  };

  resetIncrementButton = () => {
    this.setState({ nextCounter: (this.state.nextCounter = 0) });
  };

  renderStepOne = () => {
    return (
      <TutorialStyle>
        <div className="containerTutorial">{this.renderMessage()}</div>
        <div className="Icon">
          <i
            className="far fa-arrow-alt-circle-right fa-3x"
            onClick={this.incrementButton}
          ></i>
        </div>
      </TutorialStyle>
    );
  };

  render() {
    return (
      <React.Fragment>
        <a
          onClick={() => {
            this.openModal();
          }}
        >
          {this.props.children ? (
            <React.Fragment>{this.props.children}</React.Fragment>
          ) : (
            "Tutorial"
          )}
        </a>

        <Modal
          closeTimeoutMS={600}
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Tutorial Modal"
          style={customStyles}
        >
          <ModalStyle>{this.renderStepOne()}</ModalStyle>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(Tutorial);

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
    background: "black",
    borderRadius: "2.5px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    maxHeight: "100vh",
    overflow: "hidden",
  },
};

const TutorialStyle = styled.div`
  max-width: 600px;
  background: ${(props) => props.theme.moonBackground};
  border-radius: 8px;
  text-align: left;
  font-size: 15px;
  font-family: "Lato", sans-serif;
  color: ${(props) => props.theme.white};
  font-weight: 400;

  .containerTutorial {
    padding: 30px;
    height: 350px;

    @media screen and (min-width: 320px) {
      padding: 30px;
    }
    @media screen and (min-width: 470px) {
      padding: 60px;
    }
  }
  h3 {
    color: ${(props) => props.theme.yellow};
    border-bottom: 2px solid ${(props) => props.theme.yellow};
    margin: 20px 0px;
    font-weight: 600;
  }

  .Icon {
    color: ${(props) => props.theme.colorMedium};
    cursor: pointer;
    padding: 0 30px 30px 0px;
    text-align: right;
    animation: nextGlow 2s;
    -moz-animation: nextGlow 2s infinite;
    -webkit-animation: nextGlow 2s infinite;

    @keyframes nextGlow {
      0% {
        color: ${(props) => props.theme.colorMedium};
      }
      50% {
        color: ${(props) => props.theme.colorBad};
      }
      100% {
        color: ${(props) => props.theme.colorMedium};
      }
    }

    @-moz-keyframes nextGlow {
      0% {
        color: ${(props) => props.theme.colorMedium};
      }
      50% {
        color: ${(props) => props.theme.colorBad};
      }
      100% {
        color: ${(props) => props.theme.colorMedium};
      }
    }

    @-webkit-keyframes nextGlow {
      0% {
        color: ${(props) => props.theme.colorMedium};
      }
      50% {
        color: ${(props) => props.theme.yellow};
      }
      100% {
        color: ${(props) => props.theme.colorMedium};
      }
    }
  }

  .secondary {
    margin: 30px auto 30px auto;
    justify-content: center;

    display: flex;
    .myLocation {
      color: ${(props) => props.theme.white};
      font-size: 13px;
      width: 90px;
      text-align: center;

      .nearMe {
        all: unset;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

        background: ${(props) => props.theme.yellow};
        border-radius: 20px;
        height: 36px;
        width: 100%;
        color: ${(props) => props.theme.prettyDark};
        transition: color 0.1s ease;
        font-size: 15px;
        font-weight: 600;
      }
    }

    .searchIcon {
      width: 40px;
      display: block;
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
  }

  .close:hover {
    color: ${(props) => props.theme.pink};
    text-decoration: none;
  }

  .close:active {
    color: ${(props) => props.theme.colorMedium};
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
