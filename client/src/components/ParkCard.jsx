import React, { Component } from "react";
import styled from "styled-components";
import humidityIcon from "./style/Media/cardIcons/humidity.svg";
import cloudBadIcon from "./style/Media/cardIcons/cloudBad.svg";
import cloudGoodIcon from "./style/Media/cardIcons/cloudGood.svg";
import lightPolIcon from "./style/Media/cardIcons/lightPol.svg";
import tempIcon from "./style/Media/cardIcons/temperature.svg";

class ParkCard extends Component {
  state = {};

  prettyDate(time) {
    var date = new Date(time);
    var localeSpecificTime = date.toLocaleTimeString();
    return localeSpecificTime.replace(/:\d+ /, " ");
  }

  inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }

  render() {
    return (
      <ParkCardWrapper
        onMouseEnter={() => {
          this.props.handleMouseOver(this.props.park.id);
        }}
        onMouseLeave={() => {
          this.props.handleMouseLeave(this.props.park.id);
        }}
        onClick={() => {
          this.props.handleMouseClick(this.props.park.id);
        }}
      >
        <CardStyle>
          <div className="ParkHeader">
            <span className="ParkTitle">
              {this.props.park.name_alt
                ? this.props.park.name_alt
                : this.props.park.name}
            </span>

            <div className="CarIcon">
              <i className="fas fa-car"></i>
              <div className="CarIconDesc">
                {this.props.park.distance < 9000 ? (
                  <React.Fragment>
                    {Math.trunc(parseFloat(this.props.park.distance))}
                    {" km"}
                  </React.Fragment>
                ) : (
                  <React.Fragment>n/a</React.Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="cardContent">
            <div className="HumidityIcon">
              <img src={humidityIcon} alt="Humidity" title="Humidity Level" />
            </div>
            <span className="HumidityIconDesc">
              {this.props.park.weather.humidity < 40
                ? "Great"
                : this.props.park.weather.humidity < 70
                ? "Okay"
                : "Poor"}
            </span>

            <div className="CloudIcon">
              {this.props.park.weather.clouds < 35 ? (
                <img
                  src={cloudGoodIcon}
                  alt="Cloud Coverage"
                  title="Low Cloud Coverage"
                />
              ) : (
                <img
                  src={cloudBadIcon}
                  alt="Cloud Coverage"
                  title="High Cloud Coverage"
                />
              )}
            </div>

            <span className="CloudIconDesc">
              {this.props.park.weather.clouds < 20
                ? "Great"
                : this.props.park.weather.clouds < 35
                ? "Okay"
                : "Poor"}
            </span>

            <div className="LightPolIcon">
              <img
                src={lightPolIcon}
                alt="Light Pollution"
                title="Light Pollution"
              />
            </div>
            <span className="LightPolIconDesc">
              {this.props.park.light_pol < 1
                ? "Great"
                : this.props.park.light_pol < 3
                ? "Okay"
                : "Poor"}
            </span>

            <div className="TempIcon">
              <img src={tempIcon} alt="Temperature" title="Temperature" />
            </div>
            <span className="TempIconDesc">
              {Math.round(this.props.park.weather.temp)}° C
            </span>

            <div className="WeatherInfo">
              <span>
                <b>{this.props.park.weather.city}</b> forecast for{" "}
                {this.prettyDate(this.props.park.weather.time)}
              </span>
            </div>

            <span className="ScoreDesc">Visibility Score</span>

            <div className="Score">
              <React.Fragment>
                <div className="ScoreNumber">
                  {Math.trunc(this.props.park.score * 100)}
                </div>

                <div className="Percentage">%</div>
              </React.Fragment>
            </div>
          </div>
        </CardStyle>
      </ParkCardWrapper>
    );
  }
}

ParkCard.defaultProps = {
  handleMouseOver: () => {},
  handleMouseLeave: () => {},
  handleMouseClick: () => {},
};

export default ParkCard;

const ParkCardWrapper = styled.div`
  background: #0d0e0f;
  padding-bottom: 10px;
  margin-bottom: 1rem;
  position: relative;

  cursor: pointer;

  @media screen and (min-width: 320px) {
    padding-bottom: 10px;
  }

  @media screen and (min-width: 355px) {
    margin: 0 10px 25px 10px;
  }

  @media screen and (min-width: 480px) {
    padding-bottom: 0px;
  }
`;

const CardStyle = styled.div`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 23px;
  color: ${(props) => props.theme.fontDark};
  min-height: 220px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.3fr auto;

  grid-template-areas:
    "ParkHeader   ParkHeader   ParkHeader    ParkHeader 	ParkHeader 	  ParkHeader"
    "cardContent  cardContent cardContent 	 cardContent  	cardContent   cardContent";

  @media screen and (min-width: 320px) {
    grid-template-rows: 0.4fr auto;
  }
  @media screen and (min-width: 480px) {
  }

  .ParkHeader {
    display: grid;
    grid-area: ParkHeader;
    grid-template-columns: 1fr 0.2fr;
    grid-template-areas: "ParkTitle CarIcon";
    background: #1f2125;

    border-bottom: 5px solid #111414;
    padding: 13px 10px;
    :hover,
    :active {
      background: #282d34;
    }
    @media screen and (min-width: 320px) {
      padding: 13px 10px;
    }

    @media screen and (min-width: 430px) {
      padding: 13px 30px;
    }
    @media screen and (min-width: 480px) {
      padding: 10px 30px;
    }
    @media screen and (min-width: 525px) {
      padding: 10px 30px;
    }

    .ParkTitle {
      display: flex;
      grid-area: ParkTitle;

      color: ${(props) => props.theme.white};
      font-weight: 500;
      font-size: 22px;
      text-align: left;
      margin: auto auto auto 0px;
      line-height: 30px;

      @media screen and (min-width: 320px) {
        margin: auto auto auto 0px;
      }
      @media screen and (min-width: 480px) {
        margin: auto auto auto 0px;
        font-size: 25px;
      }
    }

    .CarIcon {
      grid-area: CarIcon;
      margin: auto 0 auto auto;
      font-size: 22px;
      i {
        color: ${(props) => props.theme.white};
      }
      .CarIconDesc {
        margin: auto auto;
        font-size: 14px;
        color: ${(props) => props.theme.white};
      }
    }
  }

  .cardContent {
    display: grid;
    grid-area: cardContent;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 1fr 1fr 1fr;
    background: #0d0e0f;
    border: 1px solid #363636;

    color: ${(props) => props.theme.white};
    img {
      filter: invert(1);
    }

    grid-template-areas:
      "ScoreDesc   ScoreDesc    WeatherInfo  	  WeatherInfo 	WeatherInfo 	  WeatherInfo"
      "Score 		 Score 		 HumidityIcon 	  CloudIcon 	LightPolIcon 	  TempIcon "
      "Score 		 Score 		 HumidityIconDesc CloudIconDesc LightPolIconDesc  TempIconDesc ";

    @media screen and (min-width: 320px) {
      padding: 10px 10px;
      grid-template-rows: 1fr 1fr 1fr;
    }

    @media screen and (min-width: 430px) {
      padding: 10px 30px;
    }

    @media screen and (min-width: 480px) {
      padding: 10px 30px;
      .WeatherInfo {
        padding-bottom: 10px;
      }
    }

    .WeatherInfo {
      display: flex;

      grid-area: WeatherInfo;
      font-weight: 400;
      font-size: 13px;
      margin: auto auto 0 auto;
    }
    .HumidityIcon {
      display: flex;

      grid-area: HumidityIcon;
      margin: auto auto 0 auto;
    }
    .HumidityIconDesc {
      display: flex;

      grid-area: HumidityIconDesc;
      font-size: 14px;
      margin: 0 auto;
    }
    .CloudIcon {
      display: flex;

      grid-area: CloudIcon;
      margin: auto auto 0 auto;
    }
    .CloudIconDesc {
      display: flex;

      grid-area: CloudIconDesc;
      font-size: 14px;
      margin: 0 auto;
    }
    .LightPolIcon {
      display: flex;

      grid-area: LightPolIcon;
      margin: auto auto 0 auto;
    }
    .LightPolIconDesc {
      display: flex;

      grid-area: LightPolIconDesc;
      font-size: 14px;
      margin: 0 auto;
    }

    .TempIcon {
      display: flex;
      grid-area: TempIcon;

      margin: auto auto 0 auto;
    }
    .TempIconDesc {
      display: flex;
      grid-area: TempIconDesc;
      font-size: 14px;
      margin: 0 auto;
    }

    .MoreInfoDesc {
      display: flex;
      grid-area: MoreInfoDesc;
      font-size: 12px;
      padding-top: 0px;
      margin: 14px 0px auto auto;

      @media screen and (min-width: 480px) {
        font-size: 13px;
      }
    }

    .ScoreDesc {
      display: flex;
      grid-area: ScoreDesc;
      font-size: 13px;

      margin: auto auto 0 0px;
      font-weight: 400;
      @media screen and (min-width: 320px) {
        padding-bottom: 0px;
      }

      @media screen and (min-width: 480px) {
        font-size: 14px;
        padding-bottom: 10px;
      }
    }

    .Score {
      display: flex;
      grid-area: Score;
      font-size: 60px;
      font-weight: 600;
      align-items: baseline;
      margin: auto 0;
      .Percentage {
        display: inline-block;
        font-size: 25px;
        padding-left: 5px;
      }

      @media screen and (min-width: 320px) {
        font-size: 60px;
      }
    }
  }
`;
