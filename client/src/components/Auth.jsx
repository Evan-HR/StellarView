import React from 'react';

import { AuthProvider, AuthConsumer } from './AuthContext';
import App from '../App';
import axios from 'axios';
import Reviews from './Reviews';

export class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      userID: null,
      isAuth: null,
      loggedFromReviews: false,
      isLoggingIn: false,
      userLocation: { lat: '', lng: '' },
      hasFavSpots: false,
      hasNoSpots: false,
      userFavorites: [],
      userReviews: [],
      setUserLocation: this.setUserLocation,
      handleLogin: this.handleLogin,
    };

    this.getUserAuth();

    this.handleLogoutState = this.handleLogoutState.bind(this);
  }

  setUserLocation = (latArg, lngArg) => {
    this.setState({
      ...this.state,
      userLocation: { lat: latArg, lng: lngArg },
    });
  };

  componentDidMount() {
    // navigator.geolocation.getCurrentPosition(position => {
    // 	this.setState({
    // 		userLocation: {
    // 			lat: position.coords.latitude,
    // 			lng: position.coords.longitude
    // 		}
    // 	});
    // });
  }

  handleLogoutState() {
    this.setState({
      firstName: null,
      userID: null,
      isAuth: false,
      hasFavSpots: false,
      loggedFromReviews: false,
      hasNoSpots: false,
      userReviews: [],
      userFavorites: [],
    });
  }

  handleReviewModalLoggedIn = () => {
    this.setState({ ...this.state, loggedFromReviews: true });
  };

  //for register function
  handleLogin = () => {
    this.getUserInfo();
  };

  getUserAuth() {
    var self = this;
    axios
      .get('/api/getUserAuth')
      .then(function (response) {
        if (response.data === true) {
          self.getUserInfo();
        }
      })

      .catch((error) => {
        console.log(error);
      });
  }

  getWeatherInfo() {
    axios.get('/api/getWeatherInfo').catch((error) => {
      console.log(error);
    });
  }

  getUserInfo() {
    var self = this;
    axios
      .get('/api/getUserInfo')

      .then(({ data }) => {
        this.setState({
          ...this.state,
          firstName: data.firstName,
          isAuth: data.isAuth,
          userID: data.userID,
        });
        self.getUserFavSpots();
        self.getUserReviews();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUserFavSpots() {
    axios
      .get('/api/getUserFavSpots')

      .then((favSpots) => {
        if (favSpots.status === 204) {
          this.setState({ ...this.state, hasNoSpots: true });
        } else {
          this.setState({
            ...this.state,
            userFavorites: favSpots.data,
            hasFavSpots: true,
            hasNoSpots: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUserReviews() {
    axios
      .get('/api/getUserReviews')

      .then((reviews) => {
        if (!(reviews.status === 204)) {
          this.setState({
            ...this.state,
            userReviews: reviews.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <AuthProvider value={this.state}>
        <App
          handleLogoutState={this.handleLogoutState}
          handleLogin={this.handleLogin}
        />
      </AuthProvider>
    );
  }
}

export default Auth;
