import React from 'react';
import { Marker } from 'react-native-maps';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ParkAreaMarker = ({ coordinate, title, index }) => {
    return (
        <Marker
            coordinate={coordinate}
            key={index}
            title={title}
        >
            <Icon name="parking" size={30} color={'tomato'}/>
        </Marker>
    );
};

export default React.memo(ParkAreaMarker);

