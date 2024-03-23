import React, {useState} from "react";
import {View, StyleSheet, Text, Keyboard, Linking} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, Callout} from "react-native-maps";
import {mapStyle} from "../../utilities/mapStyles";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {MAP_API_KEY} from "@env";
import Icon from "react-native-vector-icons/Ionicons";
import ImageMarker from "../../components/ImageMarker";
import {useParkingDetails} from "../../context/ParkingContext";

navigator.geolocation = require("react-native-geolocation-service");

export default function MapScreen() {
  const {parkAreas, NavigateToParkArea} = useParkingDetails();
  const [mapRegion, setMapRegion] = useState({
    latitude: 8.545785,
    longitude: 76.904143,
    latitudeDelta: 0.0005,
    longitudeDelta: 0.006,
  });
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchKey, setSearchKey] = useState(0);
  const [visibleParks, setVisibleParks] = useState([]);

  const getColorForMarker = (index, total) => {
    const intensity = 255 - (index / total) * 220;
    const hexIntensity = Math.round(intensity).toString(16).padStart(2, "0");
    return `${hexIntensity}0000`; // Darker red for lower indexes
  };

  const handleRegionChangeComplete = region => {
    const north = region.latitude + region.latitudeDelta / 2;
    const south = region.latitude - region.latitudeDelta / 2;
    const east = region.longitude + region.longitudeDelta / 2;
    const west = region.longitude - region.longitudeDelta / 2;

    const parksInView = parkAreas.filter(park => {
      return (
        park.coords.latitude < north &&
        park.coords.latitude > south &&
        park.coords.longitude < east &&
        park.coords.longitude > west
      );
    });
    setVisibleParks(parksInView);
  };

  // Handler for the close/search icon press action
  const handleIconPress = () => {
    if (isFocused) {
      setSearchQuery("");
      Keyboard.dismiss();
      setIsFocused(false);
      setSearchKey(prevKey => prevKey + 1); // Increment the key to force re-mount
    }
  };

  // Update to renderRightButton to incorporate handleIconPress
  const renderRightButton = () => (
    <Icon
      name={isFocused ? "close" : "search"}
      size={25}
      color="gray"
      style={{
        position: "absolute",
        zIndex: 1,
        right: 15,
        alignSelf: "center",
      }}
      onPress={handleIconPress}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          key={searchKey}
          placeholder="Search Place and Find Space"
          onFail={error => console.error(error)}
          onPress={(data, details = null) => {
            console.log("here");
            console.log(data, details);
            setMapRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
            Keyboard.dismiss();
          }}
          query={{
            key: MAP_API_KEY,
            language: "en",
            location: "10.446049,76.160702",
            country: "IN",
            type: "geocode",
            radius: 200000,
          }}
          styles={{
            textInput: styles.searchInput,
            textInputContainer: styles.textInputContainer,
            listView: {
              backgroundColor: "#454545",
            },
            description: {
              fontWeight: "bold",
            },
            separator: {
              height: 0.5,
              backgroundColor: "#454545",
            },
            row: {
              backgroundColor: "#FFFFFF",
              padding: 13,
              height: 44,
              flexDirection: "row",
            },
            poweredContainer: {
              display: "none",
            },
          }}
          fetchDetails={true}
          nearbyPlacesAPI="GoogleReverseGeocoding"
          debounce={500}
          textInputProps={{
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
            onChangeText: text => setSearchQuery(text),
            value: searchQuery,
          }}
          renderRightButton={renderRightButton}
          currentLocation={true}
          currentLocationLabel="Current Location"
        />
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
        region={mapRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        <Marker
          coordinate={{
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
          }}
          title={"Selected Location"}
          description={"This is the place you've selected."}
        />

        {visibleParks.map((park, index) => (
          <ImageMarker
            key={index}
            point={{
              latitude: park.coords.latitude,
              longitude: park.coords.longitude,
            }}
            title={park.name}
            description={`free slots: ${park.no_free_slots}`}
            index={index}
            color={getColorForMarker(index, visibleParks.length)}
          ></ImageMarker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "white",
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 3,
    marginHorizontal: 10,
    marginRight: 50,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {x: 0, y: 0},
    shadowRadius: 15,
    fontSize: 18,
  },
  map: {
    flex: 1,
    marginBottom: -55,
  },

  calloutView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  calloutDescription: {
    fontSize: 12,
  },
});
