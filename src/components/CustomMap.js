import React, { useRef } from 'react';
import { Dimensions } from 'react-native';
import MapView from 'react-native-open-street-map';

const CustomMap = () => {
  const mapRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const region = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0922 * (width / height),
  };
  const latitudes = [-15.806553, -15.8202434];
  const longitudes = [-47.8891454, -47.9045093];

  return (
    <MapView
      ref={mapRef}
      zoom={5}
      style={{
        flex: 1,
      }}
      region={region}
      showsUserLocation
      router={{
        titleA: 'The point A',
        titleB: 'The point B',
        descriptionA: 'Bank',
        descriptionB: 'Scholl',
        coordinates: [
          {
            latitude: latitudes[0],
            longitude: longitudes[0],
          },
          {
            latitude: latitudes[1],
            longitude: longitudes[1],
          },
        ],
      }}
    />
  );
};

export default CustomMap;
