import React, { Component, useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import "./modal.css";
import MoonDisplay from "./MoonDisplay";
import { useSpring, animated as a } from "react-spring";
import humidityIcon from "./style/Media/cardIcons/humidity.svg";
import cloudBadIcon from "./style/Media/cardIcons/cloudBad.svg";
import cloudGoodIcon from "./style/Media/cardIcons/cloudGood.svg";
import lightPolIcon from "./style/Media/cardIcons/lightPol.svg";
import { withRouter } from "react-router-dom";
import {
  notifyInfoModalIsOpen,
  notifyInfoModalIsClosed,
} from "./MainComponent";
import ee from "eventemitter3";

const emitter = new ee();

export const notifyCloseModal = (msg) => {
  emitter.emit("notifyCloseModal", msg);
};

const modalStyle = {
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
    borderRadius: "4px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    maxHeight: "100vh",
    overflow: "hidden",
  },
};

class ParkMoreInfoModal extends Component {
  state = {
    modalIsOpen: false,
  };

  constructor(props) {
    super(props);
    this.park = { weather: {} };
    this.userLocation = {};
    this.toRemountReviews = false;
    emitter.on("notifyCloseModal", (msg) => {
      this.closeModal();
    });
  }

  //means..
  renderLightMsg(lightPol) {
    if (lightPol < 0.25) {
      return "many constellations are barely noticed among the large number of stars";
    } else if (lightPol < 0.4) {
      return "the M33 is visible to the naked-eye";
    } else if (lightPol < 1) {
      return "the M15, M4, M5, and M22 are naked-eye objects";
    } else if (lightPol < 3) {
      return "the Milky Way lacks detail, and the M33 is only visible when high in sky.";
    } else if (lightPol < 6) {
      return "the Milky Way is very weak and looks washed out.";
    }
  }

  getLightPolSky(lightPol) {
    if (lightPol < 0.25) {
      return "Pure Dark Sky";
    } else if (lightPol < 0.4) {
      return "Dark Sky";
    } else if (lightPol < 1) {
      return "Rural";
    } else if (lightPol < 3) {
      return "Rural/Suburban";
    } else if (lightPol < 6) {
      return "Suburban";
    }
  }

  openModal = (content) => {
    if (content === "") {
      content = "No content.";
    }
    this.modalContent = content;
    this.userLocation = content.userLocation;
    this.park = content.park;
    this.moonPhase = content.moonPhase;
    this.moonType = content.moonType;
    this.setState({ modalIsOpen: true });
    notifyInfoModalIsOpen();
    this.props.history.push(
      `${window.location.pathname}${window.location.search}#modal`
    );
  };

  afterOpenModal = () => {
    document.body.style.overflow = "hidden"; //Prevents background scrolling
  };

  closeModal = () => {
    document.body.style.overflow = "visible";
    notifyInfoModalIsClosed();
    this.props.history.push(
      `${window.location.pathname}${window.location.search}`,
      null
    );
    this.setState({ modalIsOpen: false });
  };

  refreshModal = () => {
    this.toRemountReviews = true;
  };

  remountReviews = () => {
    this.toRemountReviews = false;
  };

  getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      window.open(
        `https://www.google.com/maps?saddr=${position.coords.latitude},${position.coords.longitude}&daddr=${this.park.lat},${this.park.lng}`,
        "_blank"
      );
    });
  };

  render() {
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={modalStyle}
        contentLabel="Example Modal"
      >
        <ModalStyle>
          <div className="modal-header">
            <span className="ParkTitle">
              {this.park.name === "Unknown" && this.park.name_alt
                ? this.park.name_alt
                : this.park.name}
            </span>

            <button
              type="button"
              onClick={this.closeModal}
              className="close"
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="ContentGrid">
            <div className="weatherContainer">
              <div className="visibilityContainer">
                <Card
                  cardName="visibilityCard"
                  front={
                    <React.Fragment>
                      <WeatherWrapper>
                        <div className="Heading">
                          <span>Star Visibility</span>
                        </div>
                        <div className="VisibleIcon">
                          {this.park.score > 0.8 ? (
                            <i className="far fa-eye visibleGoodIcon"></i>
                          ) : this.park.score > 0.6 ? (
                            <i className="far fa-eye visiblePartlyIcon"></i>
                          ) : (
                            <i className="fas fa-eye-slash invisibleIcon"></i>
                          )}
                        </div>
                        <div className="Value">
                          {this.park.score > 0.8
                            ? "Visible"
                            : this.park.score > 0.6
                            ? "Partly Visible"
                            : "Not Visible"}
                        </div>
                      </WeatherWrapper>
                    </React.Fragment>
                  }
                  back={
                    <React.Fragment>
                      <span className="MoreInfoDesc">
                        {this.park.score > 0.8
                          ? "Good naked-eye star visibilty at this score."
                          : this.park.score > 0.6
                          ? "Naked-eye stargazing may not be adequate at this time right now."
                          : "Naked-eye stargazing not possible at this time right now."}
                      </span>
                    </React.Fragment>
                  }
                />
              </div>

              <div className="scoreContainer">
                <Card
                  cardName="scoreCard"
                  front={
                    <React.Fragment>
                      <WeatherWrapper>
                        <div className="Heading">
                          <span>Visibility Score</span>
                        </div>
                        <div className="Score">
                          <React.Fragment>
                            <div className="ScoreNumber">
                              {Math.trunc(this.park.score * 100)}
                            </div>
                            <div className="Percentage">%</div>
                          </React.Fragment>
                        </div>
                        <div className="Value">
                          {this.park.score > 0.8
                            ? "Great"
                            : this.park.score > 0.6
                            ? "Poor"
                            : "Very poor"}
                        </div>
                      </WeatherWrapper>
                    </React.Fragment>
                  }
                  back={
                    <React.Fragment>
                      <span className="MoreInfoDesc">
                        {this.park.score > 0.8
                          ? "We recommend stargazing at score above 80%.  Read how the score is calculated in the FAQs."
                          : this.park.score > 0.6
                          ? "We do not strongly recommend stargazing at this score.  Read how the score is calculated in the FAQs."
                          : "We strongly recommend to not stargaze at a score below 60%.  Read how the score is calculated in the FAQs."}
                      </span>
                    </React.Fragment>
                  }
                />
              </div>

              <div className="cloudContainer">
                <Card
                  cardName="cloudCard"
                  front={
                    <React.Fragment>
                      <WeatherWrapper>
                        <div className="Heading">
                          <span>Cloud Coverage</span>
                        </div>
                        {this.park.weather.clouds < 40 ? (
                          <img src={cloudGoodIcon} />
                        ) : (
                          <img src={cloudBadIcon} />
                        )}
                        <div className="Value">
                          <span>{this.park.weather.clouds}%</span>
                        </div>
                      </WeatherWrapper>
                    </React.Fragment>
                  }
                  back={
                    <React.Fragment>
                      <span className="MoreInfoDesc">
                        Cloud Coverage is the % of the sky that is covered by
                        clouds. Under 25% is considered good.
                      </span>
                    </React.Fragment>
                  }
                />
              </div>

              <div className="lightPolContainer">
                <Card
                  cardName="lightPolCard"
                  front={
                    <React.Fragment>
                      <WeatherWrapper>
                        <div className="Heading">
                          <span>Light Pollution</span>
                        </div>
                        <img src={lightPolIcon} />
                        <div className="Value">
                          <span>
                            {this.getLightPolSky(this.park.light_pol)}
                          </span>
                        </div>
                      </WeatherWrapper>
                    </React.Fragment>
                  }
                  back={
                    <React.Fragment>
                      <span className="MoreInfoDesc">
                        The Bortle class of{" "}
                        {this.getLightPolSky(this.park.light_pol)} means{" "}
                        {this.renderLightMsg(this.park.light_pol)}
                      </span>
                    </React.Fragment>
                  }
                />
              </div>
              <div className="moonContainer">
                <Card
                  cardName="moonCard"
                  front={
                    <React.Fragment>
                      <WeatherWrapper>
                        <div className="Heading">
                          <span>Moon Phase</span>
                        </div>
                        <span className="MoonDisplayContainer">
                          <MoonDisplay phase={this.moonPhase} />
                        </span>
                        <div className="Value">{this.moonType}</div>
                      </WeatherWrapper>
                    </React.Fragment>
                  }
                  back={
                    <React.Fragment>
                      <span className="MoreInfoDesc">
                        Moon phase is the most important factor when viewing the
                        stars. First Quarter and under is considered good.
                      </span>
                    </React.Fragment>
                  }
                />
              </div>
              <div className="humidityContainer">
                <Card
                  cardName="humidityCard"
                  front={
                    <React.Fragment>
                      <WeatherWrapper>
                        <div className="Heading">
                          <span>Humidity</span>
                        </div>
                        <img src={humidityIcon} />
                        <div className="Value">
                          <span>{this.park.weather.humidity}%</span>
                        </div>
                      </WeatherWrapper>
                    </React.Fragment>
                  }
                  back={
                    <React.Fragment>
                      <span className="MoreInfoDesc">
                        Humidity levels above 70% is considered poor for star
                        visibility.
                      </span>
                    </React.Fragment>
                  }
                />
              </div>
            </div>
          </div>
        </ModalStyle>
      </Modal>
    );
  }
}

function Card(props) {
  const [flipped, set] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  return (
    <div onClick={() => set((state) => !state)}>
      <a.div
        className={props.cardName}
        style={{
          opacity: opacity.interpolate((o) => 1 - o),
          transform,
        }}
      >
        {props.front}
      </a.div>
      <a.div
        className={props.cardName}
        style={{
          opacity,
          transform: transform.interpolate((t) => `${t} rotateY(180deg)`),
        }}
      >
        {props.back}
      </a.div>
    </div>
  );
}

const withRouterAndRef = (WrappedComponent) => {
  class InnerComponentWithRef extends React.Component {
    render() {
      const { forwardRef, ...rest } = this.props;
      return <WrappedComponent {...rest} ref={forwardRef} />;
    }
  }
  const ComponentWithRouter = withRouter(InnerComponentWithRef, {
    withRef: true,
  });
  return React.forwardRef((props, ref) => {
    return <ComponentWithRouter {...props} forwardRef={ref} />;
  });
};

export default withRouterAndRef(ParkMoreInfoModal);

const ModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 452px; */
  height: 95vh;
  font-family: "Lato", sans-serif;
  border: none;
  color: ${(props) => props.theme.fontDark};
  background: black;
  max-width: 500px;
  width: 100vw;

  @media screen and (min-width: 320px) {
    height: 95vh;
    grid-template-rows: 0.4fr auto;
  }

  @media screen and (min-width: 600px) {
    height: 95vh;
  }

  .modal-header {
    padding: 0rem 1rem;

    .ParkTitle {
      font-family: "Lato", sans-serif;
      font-style: normal;
      font-weight: 500;
      color: ${(props) => props.theme.prettyDark};

      text-align: left;
      padding: 1.5rem 1rem;
      display: flex;
      grid-area: ParkTitle;

      color: ${(props) => props.theme.prettyDark};

      font-size: 22px;
      text-align: left;
      margin: auto auto;
      line-height: 30px;
    }

    background: ${(props) => props.theme.green};
    border-bottom: 6px solid ${(props) => props.theme.prettyDark};
    border-radius: 0rem;
    .close {
      outline: none;
      border: none;
      background: none;
      text-shadow: none;
      color: ${(props) => props.theme.prettyDark};
      position: absolute;
      top: -1px;
      right: 4px;
      float: right;
      font-size: 2rem;
      font-weight: 600;
      line-height: 1;
    }

    .close:hover {
      color: ${(props) => props.theme.lightDark};
      text-decoration: none;
    }

    .close:active {
      color: ${(props) => props.theme.prettyDark};
    }
  }

  .ContentGrid {
    padding: 0px 20px 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    overflow-y: auto;
    background: ${(props) => props.theme.white};

    .textContainer {
      grid-area: infoText;
      font-weight: 500;
      font-size: 15px;
      padding: 0.5rem 0rem;
    }

    .MoreInfoDesc {
      padding: 6px;
      font-weight: 500;
      font-size: 14px;

      @media screen and (min-width: 320px) {
        font-size: 13px;
      }
      @media screen and (min-width: 600px) {
        font-size: 1rem;
      }
    }

    .weatherContainer {
      img {
        width: 70px;
        margin-left: auto;
        margin-right: auto;
      }

      grid-area: weatherContainer;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-row-gap: 10px;
      grid-column-gap: 10px;
      grid-template-areas:
        "scoreContainer    visibilityContainer"
        "cloudContainer    lightPolContainer"
        "moonContainer     humidityContainer";

      .scoreContainer {
        height: 157px;
        grid-area: scoreContainer;
        position: relative;
        cursor: pointer;
        transition: transform 0.4s ease;
        &:hover {
          transition: transform 0.4s ease;
          transform: translate3d(0px, -3px, 0px) scale(1.03);
        }

        .scoreCard {
          height: 157px;
          position: absolute;
          width: 100%;
          background-color: ${(props) => props.theme.cardDark};
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          .Score {
            display: flex;
            font-size: 50px;
            font-weight: 600;
            align-items: baseline;
            margin: auto auto;
            .Percentage {
              display: inline-block;
              font-size: 25px;
            }
          }
        }
      }

      .visibilityContainer {
        height: 157px;
        grid-area: visibilityContainer;
        position: relative;
        cursor: pointer;
        transition: transform 0.4s ease;
        &:hover {
          transition: transform 0.4s ease;
          transform: translate3d(0px, -3px, 0px) scale(1.03);
        }

        .visibilityCard {
          height: 157px;
          position: absolute;
          width: 100%;
          background-color: ${(props) => props.theme.cardLight};
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            font-size: 45px;
          }
        }
      }

      .cloudContainer {
        height: 157px;
        grid-area: cloudContainer;
        position: relative;
        cursor: pointer;

        transition: transform 0.4s ease;
        &:hover {
          transition: transform 0.4s ease;
          transform: translate3d(0px, -3px, 0px) scale(1.03);
        }

        .cloudCard {
          height: 157px;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background-color: ${(props) => props.theme.cardLight};
          border-radius: 20px;
        }
      }
      .lightPolContainer {
        height: 157px;
        grid-area: lightPolContainer;
        position: relative;
        cursor: pointer;
        transition: transform 0.4s ease;
        &:hover {
          transition: transform 0.4s ease;
          transform: translate3d(0px, -3px, 0px) scale(1.03);
        }

        .lightPolCard {
          height: 157px;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background-color: ${(props) => props.theme.cardDark};
          border-radius: 20px;
        }
      }
      .moonContainer {
        transition: transform 0.4s ease;
        &:hover {
          transition: transform 0.4s ease;
          transform: translate3d(0px, -3px, 0px) scale(1.03);
        }
        height: 157px;
        grid-area: moonContainer;
        position: relative;
        cursor: pointer;

        .moonCard {
          height: 157px;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background-color: ${(props) => props.theme.cardDark};
          border-radius: 20px;
        }

        .MoonDisplayContainer {
          width: 59px;
          margin: auto;
        }
      }
      .humidityContainer {
        transition: transform 0.4s ease;
        &:hover {
          transition: transform 0.4s ease;
          transform: translate3d(0px, -3px, 0px) scale(1.03);
        }
        height: 157px;
        grid-area: humidityContainer;
        position: relative;
        cursor: pointer;

        .humidityCard {
          height: 157px;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background-color: ${(props) => props.theme.cardLight};
          border-radius: 20px;
        }
      }
    }

    .reviewsContainer {
      grid-area: reviewsContainer;
    }
  }
`;

const WeatherWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px 0px 10px 0px;
  justify-content: space-between;
`;
