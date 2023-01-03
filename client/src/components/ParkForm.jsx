import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import qs from "qs";
import MuiSlider from "@material-ui/core/Slider";
import styled from "styled-components";
import ee from "eventemitter3";

const emitter = new ee();

export const notifyLoadQuery = (msg) => {
  emitter.emit("parkFormToLoadQuery", msg);
};

class BaseParkForm extends Component {
  state = {
    reqData: {
      lat: "",
      lng: "",
      dist: 25,
      lightpol: 1.75,
      error: "",
      placeName: "",
    },
    isLoadingLocation: false,
    isGeocodingLocation: false,
    isInvalidLocation: false,
    formErrors: {},
    advancedSearch: false,
    placesComplete: false,
  };

  constructor(props) {
    super(props);
    this.sliderLight = this.state.reqData.lightpol;
    this.sliderDist = this.state.reqData.dist;
    this.autoComplete = false;
    emitter.on("parkFormToLoadQuery", () => {
      this.loadQuery();
    });
  }

  componentDidMount() {
    this.loadQuery();
  }

  componentDidUpdate() {
    if (window.google && !this.autoComplete) {
      this.loadAutoComplete();
    }
  }

  //Load query into state
  loadQuery = () => {
    let query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    if (Object.keys(query).length !== 0) {
      if (
        query.lat !== this.state.reqData.lat ||
        query.lng !== this.state.reqData.lng ||
        query.dist !== this.state.reqData.dist ||
        query.lightpol !== this.state.reqData.lightpol
      ) {
        this.setState(
          {
            reqData: {
              ...this.state.reqData,
              lat: query.lat,
              lng: query.lng,
              dist: query.dist,
              lightpol: parseFloat(query.lightpol),
              error: "",
            },
          },
          () => {
            this.onSubmit();
          }
        );
      }
    }
  };

  handlePlaceChange = (changeEvent) => {
    this.setState({
      reqData: {
        ...this.state.reqData,
        placeName: changeEvent.target.value,
      },
      placesComplete: false,
      isInvalidLocation: false,
    });
  };

  getPlaceCoordinates = () => {
    this.setState({ isGeocodingLocation: true });
    axios
      .get(
        `${"https://cors-anywhere.herokuapp.com/"}http://nominatim.openstreetmap.org/search?format=json&q=${
          this.state.reqData.placeName
        }`
      )
      .then(({ data }) => {
        if (window.google) {
          var latLng = new window.google.maps.LatLng(
            parseFloat(data[0].lat),
            parseFloat(data[0].lon)
          ); //Makes a latlng
          this.props.googleMap.panTo(latLng); //Make map global
        }
        this.setState(
          {
            isGeocodingLocation: false,
            reqData: {
              ...this.state.reqData,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            },
          },
          () => this.onSubmit()
        );
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          ...this.state,
          isGeocodingLocation: false,
          isInvalidLocation: true,
        });
      });
  };

  renderInvalidLocation = () => {
    this.setState({
      ...this.state,
      isInvalidLocation: true,
    });
  };

  getMyLocation = (e) => {
    this.setState({ isLoadingLocation: true, isInvalidLocation: false });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let address = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        address = address["data"]["address"]["city"];

        this.setState(
          {
            ...this.state,
            reqData: {
              ...this.state.reqData,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              placeName: address,
              error: null,
            },
            isLoadingLocation: false,
          },
          () => this.onSubmit()
        );
        if (window.google) {
          this.props.googleMap.panTo(
            new window.google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            )
          );
        }
      },
      (error) => {
        this.setState({
          ...this.state,
          reqData: {
            ...this.state.reqData,
            error: error.message,
          },
          isLoadingLocation: false,
        });
      },
      { enableHighAccuracy: true }
    );
  };

  handleDistanceChange = (changeEvent, value) => {
    this.setState({
      reqData: { ...this.state.reqData, dist: value },
    });
  };

  handleLatChange = (changeEvent) => {
    this.setState({
      reqData: { ...this.state.reqData, lat: changeEvent.target.value },
    });
  };

  handleLngChange = (changeEvent) => {
    this.setState({
      reqData: { ...this.state.reqData, lng: changeEvent.target.value },
    });
  };

  handleLightPolChange = (e, value) => {
    this.setState({
      reqData: {
        ...this.state.reqData,
        lightpol: value,
      },
    });
  };

  onSubmit = (e) => {
    if (e) e.preventDefault();
    const errors = this.validate(this.state.reqData);
    if (errors.length === 0) {
      var d = new Date();
      this.setState({
        formErrors: [],
        reqData: { ...this.state.reqData, utime: d.getTime() },
      });
      this.updateHistoryQuery(this.state.reqData);
      this.props.fetchParks(
        this.convertReqToFloat({
          ...this.state.reqData,
          utime: d.getTime(),
        })
      );
    } else {
      this.setState({ formErrors: errors });
    }
  };

  convertReqToFloat = (reqData) => {
    return {
      lat: parseFloat(reqData.lat),
      lng: parseFloat(reqData.lng),
      dist: parseFloat(reqData.dist),
      lightpol: parseFloat(reqData.lightpol),
      utime: reqData.utime,
    };
  };

  updateHistoryQuery = (reqData) => {
    let query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    if (
      query.lat !== parseFloat(reqData.lat).toFixed(4) ||
      query.lng !== parseFloat(reqData.lng).toFixed(4) ||
      query.dist !== reqData.dist.toString() ||
      query.lightpol !== parseFloat(reqData.lightpol).toFixed(2)
    ) {
      this.props.history.push(
        `/search?lat=${parseFloat(reqData.lat).toFixed(4)}&lng=${parseFloat(
          reqData.lng
        ).toFixed(4)}&dist=${reqData.dist}&lightpol=${parseFloat(
          reqData.lightpol
        ).toFixed(2)}`
      );
    } else {
    }
  };

  validate = (reqData) => {
    const errors = [];
    if (
      !reqData.lat ||
      reqData.lat === "" ||
      reqData.lat < -90 ||
      reqData.lat > 90 ||
      !reqData.lng ||
      reqData.lng === "" ||
      reqData.lng < -180 ||
      reqData.lng > 180
    )
      errors.push("Invalid location");
    if (
      !reqData.dist ||
      reqData.dist === "" ||
      reqData.dist < 0 ||
      reqData.dist > 300
    )
      errors.push("Invalid distance");
    if (
      !reqData.lightpol ||
      reqData.lightpol === "" ||
      reqData.lightpol < 0 ||
      reqData.lightpol > 40
    )
      errors.push("Invalid light pollution");
    return errors;
  };

  renderLocationSpinner = () => {
    if (this.state.isLoadingLocation) {
      return (
        <React.Fragment>
          <span className="spinner-border spinner-border-sm" />
        </React.Fragment>
      );
    } else {
      return "Near Me";
    }
  };

  renderFormErrors = () => {
    if (Object.keys(this.state.formErrors).length > 0) {
      return (
        <ErrorStyle>
          <b className="text-danger">{this.state.formErrors.join(", ")}</b>
        </ErrorStyle>
      );
    }
  };

  loadAutoComplete = () => {
    const field = document.getElementById("address-field");
    this.autoComplete = new window.google.maps.places.Autocomplete(field);
    this.autoComplete.addListener("place_changed", this.onPlaceChanged);
  };

  onPlaceChanged = () => {
    let place = this.autoComplete.getPlace();

    if (place && place.geometry && place.geometry.location) {
      let location = place.geometry.location.toJSON();
      if (window.google) {
        this.props.googleMap.panTo(place.geometry.location);
      }
      this.setState({
        reqData: {
          ...this.state.reqData,
          placeName: place.formatted_address,
          lat: location.lat,
          lng: location.lng,
        },
        placesComplete: true,
      });
    }
  };

  render() {
    return (
      <SearchFormStyle
        advancedSearch={this.state.advancedSearch}
        isInvalidLocation={this.state.isInvalidLocation}
      >
        <div className="citySearch">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              id="address-field"
              className="searchTerm"
              type="text"
              name="placeName"
              placeholder="Enter your location"
              value={this.state.reqData.placeName || ""}
              onChange={this.handlePlaceChange}
            />

            <div
              className={"searchButton"}
              disabled={
                this.state.reqData.placeName === "" ||
                this.state.isGeocodingLocation
              }
              onClick={(e) => {
                if (this.state.placesComplete) {
                  this.onSubmit();
                } else {
                  this.renderInvalidLocation();
                }
              }}
            >
              <i className="fa fa-search" />
            </div>
          </form>
        </div>

        <div className="myLocation">
          <button
            className="nearMe"
            type="button"
            disabled={this.state.isLoadingLocation}
            onClick={this.getMyLocation}
          >
            <strong>{this.renderLocationSpinner()}</strong>
          </button>
        </div>

        <div className="advancedSearchToggle">
          <button
            className="ToggleAdvancedSearch"
            onClick={() =>
              this.setState({
                advancedSearch: !this.state.advancedSearch,
              })
            }
          >
            <span>Advanced Search</span>
            <i className="fas fa-caret-down" />
          </button>
        </div>

        <div className="AdvancedSearch">
          <form>
            <span className="FormTitle">Max Distance (km)</span>

            <br />
            <SliderStyle>
              <MuiSlider
                aria-labelledby="discrete-slider-custom"
                min={5}
                max={140}
                step={5}
                valueLabelDisplay="auto"
                marks={marksDist}
                value={parseFloat(this.state.reqData.dist)}
                onChange={this.handleDistanceChange}
              />
            </SliderStyle>
            <br />
            <span className="FormTitle">Max Light Pollution Zone</span>
            <br />
            <SliderStyle>
              <MuiSlider
                aria-labelledby="discrete-slider-custom"
                min={0.4}
                max={4.0}
                step={0.1}
                valueLabelDisplay="auto"
                marks={marksLight}
                value={parseFloat(this.state.reqData.lightpol)}
                onChange={this.handleLightPolChange}
              />
            </SliderStyle>
          </form>
        </div>

        {this.renderFormErrors()}

        {this.state.isInvalidLocation ? (
          <span className="messageAboveForm">
            <span className=" invalidLocation">
              Invalid location - please try again.
            </span>
          </span>
        ) : (
          <span className="messageAboveForm">
            <span className="generic">Let's stargaze:</span>
          </span>
        )}
      </SearchFormStyle>
    );
  }
}

const marksDist = [
  {
    value: 5,
    label: "5",
  },
  {
    value: 25,
  },
  {
    value: 50,
    label: "50",
  },
  {
    value: 75,
    label: "75",
  },
  {
    value: 100,
    label: "100",
  },
  {
    value: 140,
    label: "140",
  },
];

const marksLight = [
  {
    value: 0.4,
    label: "Dark",
  },
  {
    value: 1.0,
  },
  {
    value: 1.75,
    label: "Rural",
  },
  {
    value: 3.0,
    label: "Rural/Suburban",
  },
  {
    value: 3.5,
  },
  {
    value: 4.0,
  },
];

export default withRouter(BaseParkForm);

const SearchFormStyle = styled.div`
  background: none;

  font-family: "Lato", sans-serif;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: ${(props) =>
    props.advancedSearch ? `auto auto auto` : `auto auto`};
  grid-gap: 10px;
  grid-template-areas:
    "messageAboveForm messageAboveForm messageAboveForm"
    "searchBar searchBar searchBar"
    "advancedSearchToggle advancedSearchToggle myLocation"
    ${(props) =>
      props.advancedSearch
        ? `"advancedSearch advancedSearch advancedSearch"`
        : ``};

  @media screen and (min-width: 320) {
    grid-template-areas:
      "messageAboveForm messageAboveForm messageAboveForm"
      "searchBar searchBar myLocation"
      "advancedSearchToggle advancedSearchToggle advancedSearchToggle"
      ${(props) =>
        props.advancedSearch
          ? `"advancedSearch advancedSearch advancedSearch"`
          : ``};
  }

  @media screen and (min-width: 480px) {
    grid-template-areas:
      "messageAboveForm messageAboveForm messageAboveForm"
      "searchBar searchBar myLocation"
      "advancedSearchToggle advancedSearchToggle advancedSearchToggle"
      ${(props) =>
        props.advancedSearch
          ? `"advancedSearch advancedSearch advancedSearch"`
          : ``};
  }

  .messageAboveForm {
    grid-area: messageAboveForm;
    text-align: left;
    font-weight: 600;
    animation: fadein 3s;
    @keyframes fadein {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .invalidLocation {
      color: ${(props) => props.theme.colorBad};
    }
    .generic {
      color: ${(props) => props.theme.yellow};
    }
  }

  .AdvancedSearch {
    width: 90%;
    margin: auto auto;
    ${(props) => (props.advancedSearch ? `` : `display: none`)}
    grid-area:advancedSearch;

    .FormTitle {
      color: ${(props) => props.theme.white};
      font-weight: 600;
    }
  }

  .myLocation {
    color: ${(props) => props.theme.white};
    font-size: 13px;

    .nearMe {
      all: unset;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      appearance: none !important;
      cursor: pointer;

      background: ${(props) => props.theme.yellow};
      border-radius: 20px;
      height: 36px;
      width: 100%;
      -webkit-text-fill-color: rgba(0, 0, 0, 1);
      opacity: 1;
      color: ${(props) => props.theme.prettyDark};
      transition: color 0.1s ease;
      font-size: 15px;
      font-weight: 600;

      :disabled {
        background: gray;
      }
      :hover:enabled {
        background-color: ${(props) => props.theme.colorMedium};
        /* color: ${(props) => props.theme.highlightPink}; */
      }
      :active:enabled {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
      }
    }
    grid-area: myLocation;
  }

  .advancedSearchToggle {
    grid-area: advancedSearchToggle;
    margin: auto 0;
    span {
      font-weight: 500;
    }

    button {
      float: left;
      i {
        margin-left: 5px;
        transform: rotate(
          ${(props) => (props.advancedSearch ? `0deg` : `-90deg`)}
        );
      }
    }
  }

  .citySearch {
    grid-area: searchBar;
  }

  .searchButton {
    width: 40px;
    height: 36px;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;

    svg {
      margin: auto auto;

      display: block;
    }

    background: ${(props, isInvalidLocation) =>
      isInvalidLocation ? props.theme.highlightPink : props.theme.prettyDark};
    text-align: center;

    color: ${(props) => props.theme.white};

    cursor: pointer;
    font-size: 20px;
    border: 2px solid #2a2c2d;
    float: left;
    background-position: center;
    transition: background 0.2s, color 0.1s ease;

    :focus {
      outline: 0;
    }

    :hover {
      background: ${(props) => props.theme.prettyDark}
        radial-gradient(circle, transparent 1%, rgba(0, 0, 0, 0.3) 1%)
        center/15000%;
      color: ${(props) => props.theme.colorMedium};
    }

    :active {
      background-color: rgba(0, 0, 0, 0.3);
      background-size: 100%;
      transition: background 0s;
    }
  }

  .searchTerm {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    border-radius: 0;

    width: calc(100% - 40px);
    background-color: ${(props) => props.theme.darkAccent};
    transition: background-color 0.1s ease;

    padding: 5px;
    height: 36px;

    outline: none;
    color: ${(props) => props.theme.white};
    border: none;
    float: left;

    :focus {
      color: ${(props) => props.theme.white};
    }

    :hover,
    :active {
      background-color: ${(props) => props.theme.moonBackground};
      transition: background-color 0.1s ease;
    }

    ::placeholder {
      font-weight: 300;
      opacity: 0.5;
    }
  }

  .ToggleAdvancedSearch {
    all: unset;
    -webkit-text-fill-color: #bdbdbd;
    opacity: 1;

    cursor: pointer;
    color: #bdbdbd;
    :hover,
    :active {
      color: ${(props) => props.theme.colorMedium};
      transition: color 0.2s ease;
    }
  }
`;

const SliderStyle = styled.div`
  .MuiSlider-root {
    color: ${(props) => props.theme.cardLight};
  }
  .MuiSlider-markLabel {
    color: #bdbdbd;
    font-family: "Lato", sans-serif;
  }
  .MuiSlider-markLabelActive {
    color: ${(props) => props.theme.colorMedium};
  }
`;

const ErrorStyle = styled.div`
  color: ${(props) => props.theme.colorMedium};
`;
