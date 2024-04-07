import React, {useState, useEffect} from "react";
import MapView, {Marker} from "react-native-maps";
import {StyleSheet, Dimensions} from "react-native";

const CustomMap = ({
  initialRegion,
  onLocationSelect,
  currentLocation,
  updateLocation,
}) => {
  const [markerPosition, setMarkerPosition] = useState(
    currentLocation || initialRegion
  );
  const mapRef = React.useRef(null);

  useEffect(() => {
    // If currentLocation changes and is not null, update markerPosition to currentLocation
    if (currentLocation) {
      setMarkerPosition(currentLocation);
      updateLocation(currentLocation);
    }
  }, [currentLocation]);

  const handleDragEnd = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setMarkerPosition({latitude, longitude});
    onLocationSelect({latitude, longitude});
    updateLocation({latitude, longitude});
  };

  return (
    <MapView style={styles.map} initialRegion={initialRegion} ref={mapRef}>
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
