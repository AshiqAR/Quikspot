import React, {useState, useEffect, useRef, useCallback} from "react";
import {debounce} from "lodash";
import randomLocation from "random-location";
import {View, Pressable, StyleSheet, Text, Alert} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useAuth} from "../context/AuthContext";
import MapView from "react-native-maps";
import {mapStyle} from "../utilities/mapStyles";
import parkAreas from "../utilities/parkAreas";
import {useParkingDetails} from "../context/ParkingContext";
import ImageMarker from "../components/ImageMarker";

//
const INTIAL_REGION = {
  latitude: 37.7768006,
  longitude: -122.4187928,
};
//

export default function Home({navigation}) {
  const {user} = useAuth();
  const {locationSharingEnabled, getLocation, location} = useParkingDetails();

  const mapViewRef = useRef(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: 8.545785,
    longitude: 76.904143,
    latitudeDelta: 0.01,
    longitudeDelta: 0.005,
  });

  //

  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState(INTIAL_REGION);

  const onChangeLocation = useCallback(
    debounce(
      region => {
        console.log("debounced region", region);
        const locations = new Array(100).fill(undefined).map(() => {
          const R = 4000; // meters

          const randomPoint = randomLocation.randomCirclePoint(region, R);
          return randomPoint;
        });

        setMarkers(locations);
      },
      1000,
      {trailing: true, leading: false}
    ),
    []
  );

  useEffect(() => {
    onChangeLocation(region);
  }, [region]);

  // extra code to demonstrate what we will do
  const onRegionChange = newRegion => {
    setRegion(newRegion);
  };

  //

  useEffect(() => {
    if (locationSharingEnabled && location && mapViewRef.current) {
      mapViewRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.0025,
        },
        1500
      );
    }
  }, [locationSharingEnabled, location]);

  const handleSearchForParkingSpace = () => {
    if (!locationSharingEnabled || !location) {
      Alert.alert(
        "Location Sharing Disabled",
        "Please enable location sharing to search for parking spaces."
      );
      return;
    }
    if (user.walletBalance < 100) {
      Alert.alert(
        "Insufficient balance",
        `You need at least ₹100 in your wallet to search for a parking space.`
      );
      return;
    }
    navigation.navigate("SelectVehicle");
  };

  return (
    <View style={styles.container}>
      {!locationSharingEnabled && (
        <Pressable
          style={{
            backgroundColor: "lightyellow",
            height: 30,
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
          onPress={getLocation}
        >
          <Text style={{color: "black", fontWeight: 400}}>
            Location Sharing Disabled. Tap here to enable
          </Text>
          <Text style={{color: "orange", fontWeight: "bold"}}>Enable</Text>
        </Pressable>
      )}
      <MapView
        ref={mapViewRef}
        style={styles.map}
        customMapStyle={mapStyle}
        onRegionChange={onRegionChange}
        initialRegion={mapRegion}
        showsUserLocation={true}
        toolbarEnabled={false}
        loadingEnabled={true}
      >
        {/* {locationSharingEnabled && location != null && (
          <CustomUserLocationMarker
            latitude={location.latitude}
            longitude={location.longitude}
          />
        )} */}
        {parkAreas.map((parkArea, index) => (
          <ImageMarker
            key={index}
            point={parkArea.coords}
            title={parkArea.name}
            index={index}
            color="FF0000"
          />
        ))}
      </MapView>
      <View style={styles.searchContainer}>
        <Pressable
          style={styles.searchPressable}
          onPress={handleSearchForParkingSpace}
        >
          <Text style={styles.searchText}>Search For Parking Space</Text>
          <Icon name="parking" size={30} color="#000" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  searchPressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "white",
  },
  searchText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  placeName: {
    fontSize: 18,
  },
  map: {
    flex: 1,
    marginBottom: -70,
  },
});
