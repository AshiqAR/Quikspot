import React, {useState, useEffect, useCallback} from 'react';
import randomLocation from 'random-location';
import {debounce} from 'lodash';
import {View, StyleSheet, Dimensions} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const INTIAL_REGION = {
  latitude: 37.7768006,
  longitude: -122.4187928,
};

const LocationView = () => {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState(INTIAL_REGION);

  const onChangeLocation = useCallback(
    debounce(
      region => {
        console.log('debounced region', region);
        const locations = new Array(100).fill(undefined).map(() => {
          const R = 4000; // meters

          const randomPoint = randomLocation.randomCirclePoint(region, R);
          return randomPoint;
        });

        setMarkers(locations);
      },
      1000,
      {trailing: true, leading: false},
    ),
    [],
  );

  useEffect(() => {
    onChangeLocation(region);
  }, [region]);

  // extra code to demonstrate what we will do
  const onRegionChange = newRegion => {
    setRegion(newRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        onRegionChange={onRegionChange}
        initialRegion={{
          ...INTIAL_REGION,
          latitudeDelta: 0.1922,
          longitudeDelta: 0.0421,
        }}>
        {markers.map((point, index) => (
          <ImageMarker key={index} point={point} />
        ))}
      </MapView>
    </View>
  );
};

const ImageMarker = ({point}) => {
  const [shouldTrack, setTrack] = useState(false);
  const [image, setImage] = useState('https://via.placeholder.com/50/0000FF');

  useEffect(() => {
    setTrack(true);
    setImage('https://via.placeholder.com/50/0000FF');
    // Could be a network call to fetch some data or animation which update the state
    const timeout = setTimeout(() => {
      setImage('https://via.placeholder.com/50');
      setTrack(false);
    }, 600);
    return () => clearInterval(timeout);
  }, [point]);

  return (
    <Marker
      tracksViewChanges={shouldTrack}
      coordinate={point}
      image={{uri: image}}
    />
  );
};
