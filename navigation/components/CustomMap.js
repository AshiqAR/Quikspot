import React from "react";
import MapView, {Marker} from "react-native-maps";
import {StyleSheet, Dimensions} from "react-native";

const CustomMap = ({initialRegion, onLocationSelect}) => {
  const [markerPosition, setMarkerPosition] = React.useState(initialRegion);

  const handleDragEnd = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setMarkerPosition({latitude, longitude});
    onLocationSelect({latitude, longitude});
  };

  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      <Marker coordinate={markerPosition} draggable onDragEnd={handleDragEnd} />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});

export default CustomMap;
