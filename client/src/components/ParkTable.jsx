//Displays park table
import React, { Component } from "react";
import ParkCard from "./ParkCard";
import { useSpring, animated as a } from "react-spring";
import NoResultsModal from "./NoResultsModal";

class ParkTable extends Component {
  state = {};
  /* Note [OUT OF DATE] - park object is:
        {
       { id: 6817,
[0]     osm_id: 217500775,
[0]     name: 'Unknown',
[0]     name_alt: 'Maple Avenue',
[0]     light_pol: 1.84691197,
[0]     lat: 43.19786151,
[0]     lng: -80.10863081,
[0]     distance: 20.26280157312762,
[0]     clouds: 90,
[0]     humidity: 72,
[0]     city: 'St. George' } ]
        }
    */

  constructor(props) {
    super(props);
    this.isAnimating = {};
  }

  springStyle = () => {
    useSpring({
      opacity: this.props.parkList[0].score ? 1 : 0,
    });
  };

  renderBadParks = () => {
    return (
      <NoResultsModal
        noVis={true}
        moonPhase={this.props.moon}
        scoreBreakdown={this.props.parkList[0].scoreBreakdown}
      />
    );
  };

  renderParkCardList = () => {
    if (this.props.parkList.length > 0) {
      return (
        <React.Fragment>
          {Math.max(...this.props.parkList.map((park) => park.score)) < 0.7
            ? this.renderBadParks()
            : ""}

          <a.div style={this.springStyle}>
            {this.props.parkList.map((park) => this.renderParkCard(park))}
          </a.div>
          {/* <Transition
						native
						items={this.props.parkList}
						keys={item => item.id}
						from={{
							// transform: "translate3d(0,-40px,0)",
							opacity: 0
						}}
						enter={{
							// transform: "translate3d(0,0px,0)",
							opacity: 1
						}}
						leave={{
							// transform: "translate3d(0,-40px,0)",
							opacity: 0
						}}
						//update={[{ opacity: 0.5 }, { opacity: 1 }]}
					>
						{item => props => (
							<animated.div
								className="cardAnimationContainer"
								style={props}
							>
								{this.renderParkCard(item)}
							</animated.div>
						)}
					</Transition> */}
        </React.Fragment>
      );
      // return <div>{this.props.parkList.map(this.renderParkCard)}</div>;
    } else {
      return <NoResultsModal />;
    }
  };

  renderParkCard = (park) => {
    return (
      <ParkCard
        key={park.id}
        park={park}
        moon={this.props.moon}
        handleMouseOver={this.handleCardMouseOver}
        handleMouseClick={this.handleCardMouseClick}
      />
    );
  };

  handleCardMouseOver = (parkID) => {
    if (this.props.markers[parkID] && !this.isAnimating[parkID]) {
      this.isAnimating[parkID] = true;
      this.props.markers[parkID].setAnimation(
        window.google.maps.Animation.BOUNCE
      );
      setTimeout(() => {
        this.props.markers[parkID].setAnimation(null);
        delete this.isAnimating[parkID];
      }, 675);
    }
  };

  handleCardMouseClick = (parkID) => {
    this.props.googleMap.panTo(this.props.markers[parkID].position);
    this.props.googleMap.setZoom(10);
    window.google.maps.event.trigger(this.props.markers[parkID], "click");
  };

  renderParkTable = () => {
    if (this.props.parkList.length > 0) {
      return this.props.parkList.map(this.renderPark);
    } else {
      return <NoResultsModal moonPhase={this.props.moon} />;
    }
  };

  renderLoading = () => {
    return (
      <div
        className="spinner-grow text-secondary"
        style={{
          marginBottom: "20px",
          width: "3rem",
          height: "3rem",
        }}
      />
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.props.isLoadingParks ? (
          this.renderLoading()
        ) : (
          <React.Fragment>{this.renderParkCardList()}</React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default ParkTable;
