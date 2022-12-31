import React, { Component } from "react";
import axios from "axios";
import { AuthConsumer } from "./AuthContext";
import Login from "./Login";
import styled from "styled-components";

class BaseFavPark extends Component {
  state = {
    buttonPressed: false,
    clickedNoAuth: false,
    hasFaved: false,
    hasUnfaved: false,
  };

  handleFavSpotNoAuth = () => {
    this.setState({
      clickedNoAuth: true,
    });
  };
  handleWarningMsg = () => {
    if (this.state.clickedNoAuth === true) {
      return (
        <div className="alert alert-warning" role="alert">
          You must be logged-in to add to favorites!
        </div>
      );
    }
  };

  componentDidMount() {
    this.getHasFaved();
  }

  getHasFaved() {
    if (this.props.context.userFavorites.includes(this.props.parkID)) {
      this.setState({ hasFaved: true });
    }
  }

  handleUnfavSpot() {
    axios
      .post("/api/postUnfavSpot", {
        params: {
          park_id: this.props.parkID,
          user_id: this.props.context.userID,
        },
      })
      .then((response) => {
        this.setState({
          buttonPressed: true,
          hasUnfaved: true,
          hasFaved: false,
        });
        this.props.context.userFavorites.pop(this.props.parkID);
      });
  }

  handleFavSpot() {
    axios
      .post("/api/postFavSpot", {
        params: {
          park_id: this.props.parkID,
          user_id: this.props.context.userID,
        },
      })
      .then((response) => {
        //TODO: send handler to auth about fav spots
        this.setState({
          buttonPressed: true,
          hasFaved: true,
          hasUnfaved: false,
        });
        this.props.context.userFavorites.push(this.props.parkID);
        this.props.context.hasFavSpots = true;
        this.props.context.hasNoSpots = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  favSpotButton = () => {
    if (this.props.context.isAuth === true) {
      if (this.state.buttonPressed === false && this.state.hasFaved === false) {
        return (
          <button onClick={() => this.handleFavSpot()}>
            <i className="fas fa-heart fa-2x UnfavedHeart" />
          </button>
        );
      } else if (
        this.state.buttonPressed === true &&
        this.state.hasUnfaved === true
      ) {
        return (
          <button onClick={() => this.handleFavSpot()}>
            <i className="fas fa-heart fa-2x UnfavedHeart" />
          </button>
        );
      } else {
        return (
          <button onClick={() => this.handleUnfavSpot()}>
            <i className="fas fa-heart fa-2x FavedHeart" />
          </button>
        );
      }
    } else {
      return (
        <Login handleLogin={this.props.handleLogin}>
          <i className="fas fa-heart fa-2x UnfavedHeart" />
        </Login>
      );
    }
  };

  render() {
    return <FavParkButtonStyle>{this.favSpotButton()}</FavParkButtonStyle>;
  }
}

const FavPark = (props) => (
  <AuthConsumer>
    {(x) => <BaseFavPark context={x} parkID={props.parkID} />}
  </AuthConsumer>
);

export default FavPark;

const FavParkButtonStyle = styled.div`
  button {
    all: unset;
    outline: none;
  }

  .FavedHeart {
    color: ${(props) => props.theme.colorGood};
    cursor: pointer;
    transition: 0.25s;
    :focus,
    :hover {
      text-decoration: none;
      color: ${(props) => props.theme.colorBad};
      transition: 0.25s;
    }
  }

  .UnfavedHeart {
    color: ${(props) => props.theme.colorBad};
    cursor: pointer;
    transition: 0.25s;
    :focus,
    :hover {
      text-decoration: none;
      color: ${(props) => props.theme.colorBadHover};
      transition: 0.25s;
    }
  }
`;
