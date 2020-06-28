//Displays park table
import React, { Component } from 'react';
import ParkCard from './ParkCard';
import ParkMoreInfoModal from './ParkMoreInfoModal';
import styled from 'styled-components';

class ParkTableProfile extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.parkModalChild = React.createRef();
  }

  renderParkTable = () => {
    if (this.props.parkList.length > 0) {
      return this.props.parkList.map(this.renderPark);
    } else {
      return '';
    }
  };

  renderPark = (park) => {
    return (
      <ParkCard park={park} handleMouseClick={this.handleCardMouseClick} />
    );
  };

  handleCardMouseClick = (parkID) => {
    for (var i = 0; i < this.props.parkList.length; i++) {
      if (this.props.parkList[i].id === parkID) {
        let content = {
          park: this.props.parkList[i],
          moon: this.props.moonPhase,
          moonType: this.props.moonType,
        };
        this.parkModalChild.current.openModal(content);
      }
    }
  };

  render() {
    return (
      <ProfileParksStyle>
        {this.renderParkTable()}

        <ParkMoreInfoModal ref={this.parkModalChild} />
      </ProfileParksStyle>
    );
  }
}

export default ParkTableProfile;

const ProfileParksStyle = styled.div`
  max-width: 550px;
  margin: auto auto;
`;
