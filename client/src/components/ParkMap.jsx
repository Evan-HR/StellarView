import React, { Component, createRef } from 'react';
import ParkMoreInfoModal from './ParkMoreInfoModal';
import markerGood from './style/MapMarkers/resultsGood.svg';
import markerAverage from './style/MapMarkers/resultsMedium.svg';
import markerBad from './style/MapMarkers/resultsBad.svg';

class ParkMap extends Component {
  state = {
    mapLoaded: false,
  };

  //Initialize google map here
  googleMapRef = createRef();

  constructor(props) {
    super(props);
    this.parkModalChild = React.createRef();
    this.modalContent = 'No content';
    this.markers = [];
  }

  componentDidMount() {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_DUSTINMAPKEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener('load', () => {
      this.googleMap = this.createGoogleMap();
      this.googleMapBounds = new window.google.maps.LatLngBounds();
      this.googleMap.setOptions({ styles: styleSelector.goodCopy });
      this.setState({ mapLoaded: true });
      this.props.onMapLoaded(this.googleMap);
    });
  }

  createGoogleMap = () => {
    return new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 10,
      center: {
        lat: 43.64,
        lng: -79.38,
      },
    });
  };

  /**
   * Add marker to initial location, passed in through prop
   */
  addCurrentLocationMarker = () => {
    let location = {
      lat: this.props.location.lat,
      lng: this.props.location.lng,
    };
    this.props.markers.currentLocation = new window.google.maps.Marker({
      position: location,
      icon: {
        url: 'https://maps.google.com/mapfiles/kml/shapes/placemark_circle.png',
        anchor: new window.google.maps.Point(15, 17),
      },
      map: this.googleMap,
    });
  };

  //Unfortunately, due to the way markers are, opening modal needs to be done from here
  openModal = (content) => {
    this.parkModalChild.current.openModal(content);
  };

  closeModal = () => {
    this.parkModalChild.current.closeModal();
  };

  /**
   * Create a marker for the park on this.googleMap object.
   * Additionally, creates infobox listener, adds park coordinate to map bounds,
   * and pushes the marker object into this.parks array
   */
  addParkMarker = (park) => {
    let location = { lat: parseFloat(park.lat), lng: parseFloat(park.lng) };

    if (this.props.markers[park.id]) {
    } else {
      let markerIcon = markerBad;
      let tempScore = park.score * 100;
      if (tempScore > 80) {
        markerIcon = markerGood;
      } else if (tempScore > 60) {
        markerIcon = markerAverage;
      } else if (tempScore > 50) {
        markerIcon = markerBad;
      } else {
        markerIcon = markerBad;
      }
      var marker = new window.google.maps.Marker({
        position: location,
        map: this.googleMap,
        title: park.name,
        icon: {
          url: markerIcon,
          anchor: new window.google.maps.Point(16, 35),
        },
      });

      marker.addListener('click', () => {
        let modalContent = {
          park: park,
          moonPhase: this.props.moonPhase,
          moonType: this.props.moonType,
          userLocation: this.props.location,
        };
        this.openModal(modalContent);
      });
      this.props.markers[park.id] = marker;
    }
  };

  /**
   * Center map on initial location passed in through prop
   */
  centerMap = () => {
    if (
      Object.keys(this.props.markers).length > 1 &&
      this.props.markers.currentLocation
    ) {
      this.googleMap.panToBounds(this.googleMapBounds);
      this.googleMap.fitBounds(this.googleMapBounds);
    } else {
      this.googleMap.setCenter(this.props.markers.currentLocation.position);
      this.googleMap.setZoom(10);
    }
  };

  loadMarkers = () => {
    if (this.props.markers.currentLocation) {
      this.props.markers.currentLocation.setMap(null);
      delete this.props.markers.currentLocation;
    }
    for (let markerKey in this.props.markers) {
      if (
        !this.props.parkList
          .map((park) => park.id.toString())
          .includes(markerKey)
      ) {
        this.props.markers[markerKey].setMap(null);
        delete this.props.markers[markerKey];
      }
    }

    //Add new markers if possible
    if (this.props.location.length !== 0) {
      this.addCurrentLocationMarker();

      this.props.parkList.map(this.addParkMarker);
      if (
        Object.keys(this.props.markers).length > 1 &&
        this.props.markers.currentLocation
      ) {
        this.googleMapBounds = new window.google.maps.LatLngBounds();
        for (let marker in this.props.markers) {
          this.googleMapBounds.extend(this.props.markers[marker].position);
        }
        this.googleMap.panToBounds(this.googleMapBounds);
        this.googleMap.fitBounds(this.googleMapBounds);
      } else {
        this.googleMap.setCenter(this.props.markers.currentLocation.position);
        this.googleMap.setZoom(10);
      }
    }
  };

  render() {
    const mapStyles = {
      width: '100%',
      height: '100%',
    };
    //IMPORTANT: Have to wait until the map finished loading before accessing it
    if (this.state.mapLoaded) {
      this.loadMarkers();
    }
    return (
      <React.Fragment>
        <div
          ref={this.googleMapRef}
          style={{ width: '100%', height: '100%' }}
        />

        <ParkMoreInfoModal ref={this.parkModalChild} />
      </React.Fragment>
    );
  }
}

const styleSelector = {
  lunar: [
    {
      stylers: [
        {
          hue: '#ff1a00',
        },
        {
          invert_lightness: true,
        },
        {
          saturation: -100,
        },
        {
          lightness: 33,
        },
        {
          gamma: 0.5,
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#9298a0',
        },
      ],
    },
  ],
  goodCopy: [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#212121',
        },
      ],
    },
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#212121',
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [
        {
          color: '#1f1e1e',
        },
      ],
    },
    {
      featureType: 'administrative.country',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#bdbdbd',
        },
      ],
    },
    {
      featureType: 'landscape',
      stylers: [
        {
          color: '#151617',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [
        {
          color: '#1b1c1d',
        },
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#1f1e1e',
        },
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#222222',
        },
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'landscape.natural.terrain',
      elementType: 'geometry',
      stylers: [
        {
          color: '#3a877d',
        },
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      featureType: 'poi.park',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#1b2722',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#1b1b1b',
        },
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#1b1b1b',
        },
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#111414',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#8a8a8a',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'on',
          color: '#191a1c',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '##353535',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [
        {
          color: '#4e4e4e',
        },
      ],
    },
    {
      featureType: 'road.local',
      stylers: [
        {
          visibility: 'simplified',
          color: '#1b2121',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161',
        },
      ],
    },
    {
      featureType: 'transit',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2d333c',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#3d3d3d',
        },
      ],
    },
  ],
  retro: [
    { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#c9b2a6' }],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#dcd2be' }],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ae9e90' }],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#93817c' }],
    },
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },

    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#a5b076' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#447530' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#f5f1e6' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#fdfcf8' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#e9bc62' }],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{ color: '#e98d58' }],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#db8555' }],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#806b63' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8f7d77' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ebe3cd' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b9d3c2' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#92998d' }],
    },
  ],
};

export default ParkMap;
