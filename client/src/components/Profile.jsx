import React, { Component } from 'react';
import axios from 'axios';
import { AuthConsumer } from './AuthContext';
import ParkTableProfile from './ParkTableProfile';
import { parkScore } from './MainComponent';
import styled from 'styled-components';

class BaseProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userFavorites: this.props.context.userFavorites,
      lat: this.props.context.userLocation.lat,
      lng: this.props.context.userLocation.lng,

      profileInfoLoaded: false,
      parkDataLoaded: false,
      parkDataForTable: {},
      isLoadingParks: false,
    };
  }

  getParkData = () => {
    if (this.props.context.hasFavSpots === true) {
      var now = new Date();
      var isoDate = now.toISOString();
      isoDate = new Date(isoDate);
      var parkProfileData = {
        userTime: isoDate,

        userFavs: this.props.context.userFavorites,
        lat: this.state.lat,
        lng: this.state.lng,
      };

      axios
        .post('/api/getProfileParks', parkProfileData)
        .then((response) => {
          var d = new Date();
          var userTime = d.getTime();
          return axios.post('/api/getProfileParksWeather', {
            userTime: userTime,
            parkData: response.data,
          });
        })
        .then((response) => {
          for (var i = 0; i < response.data.parks.length; i++) {
            let tempScore = parkScore(
              response.data.moonFraction,
              response.data.parks[i].weather.humidity / 100,
              response.data.parks[i].weather.clouds / 100,
              response.data.parks[i].light_pol / 100
            );
            response.data.parks[i].score = tempScore.finalScore;
            response.data.parks[i].scoreBreakdown = tempScore;
          }

          this.setState({
            parkDataForTable: response.data.parks,
            parkDataLoaded: true,
            moonFraction: response.data.moonFraction,
            moonPhase: response.data.moonPhase,
            moonType: response.data.moonType,
            isLoadingParks: false,
          });
        });
    } else {
    }
  };

  sendToParkTable = () => {
    if (
      this.state.parkDataLoaded === true &&
      this.props.context.hasNoSpots === false
    ) {
      return (
        <ParkTableProfile
          parkList={this.state.parkDataForTable}
          moonPhase={this.state.moonPhase}
          moonType={this.state.moonType}
        />
      );
    } else {
      this.getParkData();
    }
  };

  renderNoSpotsMsg = () => {
    if (this.props.context.hasNoSpots === true) {
      return (
        <tr>
          <td colSpan={3}>
            <strong style={{ color: 'red' }}>
              You have not added any parks to your favorites!
            </strong>
          </td>
        </tr>
      );
    }
  };

  render() {
    return (
      <ProfileStyle>
        <div>
          <span className="firstName">
            Hello, {this.props.context.firstName}!
          </span>
          {this.renderNoSpotsMsg()}
          {this.sendToParkTable()}
        </div>
      </ProfileStyle>
    );
  }
}

const Profile = (props) => (
  <AuthConsumer>{(x) => <BaseProfile {...props} context={x} />}</AuthConsumer>
);

export default Profile;

const ProfileStyle = styled.div`
  .firstName {
    font-size: 20px;
    margin: 20px auto;
    display: block;
    color: ${(props) => props.theme.white};
  }
`;
