import React from 'react';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
const CustomUserLocationMarker = ({ latitude, longitude }) => {
    return (
        <Marker
            coordinate={{ latitude, longitude }}
            title="Your Location"
            pinColor='red'
            opacity={0.9}
        >
        </Marker>
    );
};

export default CustomUserLocationMarker;
