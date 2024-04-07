import React, {useEffect, useState, useRef} from "react";
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";

import MapView, {Marker, PROVIDER_GOOGLE, Callout} from "react-native-maps";
import {mapStyle} from "../../utilities/mapStyles";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {MAP_API_KEY} from "@env";
import Icon from "react-native-vector-icons/MaterialIcons";
import ImageMarker from "../../components/ImageMarker";
import {useParkingDetails} from "../../context/ParkingContext";
import ParkAreaCard from "../../components/ParkAreaCard";
import NoParkAreaFoundCard from "../../components/NoParkAreaFoundCard";

navigator.geolocation = require("react-native-geolocation-service");
const {width, height} = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 1 / 111; // Roughly 10 kilometers
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapScreen({navigation}) {
  const [searchBarIsFocused, setSearchBarIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchKey, setSearchKey] = useState(0);
  const [visibleParks, setVisibleParks] = useState([]);
  const [locationIconColor, setLocationIconColor] = useState("gray");
  const [showParkAreas, setShowParkAreas] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showMarker, setShowMarker] = useState(false);
  const [tappedParkArea, setTappedParkArea] = useState(null);

  const {
    parkAreas,
    setSearchLocation,
    location,
    getLocation,
    suggestedParkAreas,
    resetSuggestedParkAreas,
    updateBookingDetails,
    isLoading,
    fetchAllParkAreas,
  } = useParkingDetails();

  // for fetching and updating parkAreas
  const fetchIntervalRef = useRef(null);
  useEffect(() => {
    const startFetchingParkAreas = () => {
      fetchAllParkAreas();
      fetchIntervalRef.current = setInterval(fetchAllParkAreas, 1000000);
    };

    startFetchingParkAreas();
    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, []);

  const [mapRegion, setMapRegion] = useState({
    latitude: 8.545785,
    longitude: 76.904143,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [camera, setCamera] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        1000
      );
    }
    resetSuggestedParkAreas();
    setShowParkAreas(false);
  }, []);

  useEffect(() => {
    if (suggestedParkAreas.length > 0) {
      setCurrentIndex(0);
    }
  }, [suggestedParkAreas]);

  useEffect(() => {
    // Ensure suggestedParkAreas is truthy and has items, and that currentIndex is within bounds
    if (
      suggestedParkAreas &&
      suggestedParkAreas.length > 0 &&
      currentIndex >= 0 &&
      currentIndex < suggestedParkAreas.length
    ) {
      const selectedParkArea = suggestedParkAreas[currentIndex];
      if (selectedParkArea && selectedParkArea.location) {
        setCamera({
          center: {
            latitude: selectedParkArea.location.latitude,
            longitude: selectedParkArea.location.longitude,
          },
          pitch: 2,
          heading: 20,
          zoom: 17.5,
        });
      }
    }
  }, [currentIndex]); // Ensure useEffect listens for changes to suggestedParkAreas too

  useEffect(() => {
    if (camera) {
      mapRef.current.animateCamera(camera, {duration: 1000});
    }
  }, [camera]);

  useEffect(() => {
    if (mapRegion && mapRef) {
      mapRef.current.animateToRegion(mapRegion, 1000);
    }
  }, [mapRegion]);

  const mapRef = useRef(null);

  const resetSearchInput = async () => {
    setSearchQuery("");
    Keyboard.dismiss();
    setSearchBarIsFocused(false);
    setSearchKey(prevKey => prevKey + 1);
  };

  const getCurrentLocation = async () => {
    setLocationIconColor("#4285F4");
    resetSearchInput();
    await getLocation();
    if (location) {
      setSearchLocation({location: location});
    } else {
      Alert.alert("Location not found", "Please enable location services.");
    }
    setShowParkAreas(true);
  };

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

    const parksInView = parkAreas
      .map((park, index) => ({...park, originalIndex: index}))
      .filter(park => {
        return (
          park.location.latitude < north &&
          park.location.latitude > south &&
          park.location.longitude < east &&
          park.location.longitude > west
        );
      });

    setVisibleParks(parksInView);
  };

  const handleCurrentLocationButtonClick = async () => {
    await getCurrentLocation();
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
    setShowMarker(false);
    setShowParkAreas(true);
  };

  const handleIconPress = () => {
    if (searchBarIsFocused) {
      setSearchQuery("");
      Keyboard.dismiss();
      setSearchBarIsFocused(false);
      setShowMarker(false);
      setSearchKey(prevKey => prevKey + 1);
    }
    if (showParkAreas && searchQuery != "") {
      resetSuggestedParkAreas();
      setTappedParkArea(null);
      setShowParkAreas(false);
    }
  };

  const handleMarkerPress = index => {
    setTappedParkArea(parkAreas[index]);
    setShowParkAreas(true);
  };

  const loadScrollView = index => {
    setCurrentIndex(index);
    scrollViewRef.current.scrollTo({
      x: index * width,
      y: 0,
      animated: true,
    });
  };

  const renderRightButton = () => (
    <Icon
      name={searchBarIsFocused ? "close" : "search"}
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

  const renderParkAreas = () => {
    const initiateBooking = parkArea => {
      if (parkArea.availableSlots === 0) {
        Alert.alert(
          "No slots available",
          "Please look for another parking area."
        );
      } else {
        updateBookingDetails({parkArea});
        navigation.navigate("BookingScreen", {parkAreaId: parkArea._id});
      }
    };

    return (
      <View style={styles.parkAreasContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setShowParkAreas(false);
            resetSuggestedParkAreas();
            setTappedParkArea(null);
            setShowMarker(false);
          }}
        >
          <Icon name="close" size={25} color="gray" />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          ref={scrollViewRef}
          onMomentumScrollEnd={e => {
            const contentOffset = e.nativeEvent.contentOffset.x;
            const viewSize = e.nativeEvent.layoutMeasurement.width;
            let currentIndex = Math.floor(contentOffset / viewSize);
            setCurrentIndex(currentIndex);
          }}
        >
          {suggestedParkAreas.length > 0
            ? suggestedParkAreas.map((park, index) => (
                <ParkAreaCard
                  key={index}
                  parkArea={park}
                  onPress={() => {
                    console.log(suggestedParkAreas[index]);
                    initiateBooking(suggestedParkAreas[index]);
                  }}
                />
              ))
            : !tappedParkArea && <NoParkAreaFoundCard />}
          {tappedParkArea && (
            <ParkAreaCard
              parkArea={tappedParkArea}
              onPress={() => {
                initiateBooking(tappedParkArea);
              }}
            />
          )}
        </ScrollView>
      </View>
    );
  };

  const RenderModal = () => (
    <Modal transparent={true} visible={isLoading}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="green" />
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {isLoading && <RenderModal />}
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          key={searchKey}
          placeholder="Search Place and Find Space"
          onFail={error => console.log(error)}
          onPress={async (data, details = null) => {
            setSearchLocation({
              location: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
            });
            setMapRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            });
            setShowMarker(true);
            Keyboard.dismiss();
            setLocationIconColor("gray");
            setShowParkAreas(true);
          }}
          query={{
            key: MAP_API_KEY,
            language: "en",
            location: "10.446049,76.160702",
            country: "IN",
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
            onFocus: () => setSearchBarIsFocused(true),
            onBlur: () => setSearchBarIsFocused(false),
            onChangeText: text => setSearchQuery(text),
            value: searchQuery,
          }}
          renderRightButton={renderRightButton}
        />
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyle}
        region={mapRegion}
        onRegionChangeComplete={
          showParkAreas
            ? tappedParkArea != null && handleRegionChangeComplete
            : handleRegionChangeComplete
        }
        showsTraffic={true}
        showsUserLocation={true}
        userLocationUpdateInterval={5000}
        showsMyLocationButton={true}
        toolbarEnabled={false}
        loadingEnabled={true}
      >
        {showMarker && (
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
            title={"Selected Place"}
            description={"This is the place you've selected."}
          />
        )}
        {suggestedParkAreas.length > 0
          ? suggestedParkAreas.map((park, index) => (
              <ImageMarker
                key={index}
                point={{
                  latitude: park.location.latitude,
                  longitude: park.location.longitude,
                }}
                title={park.parkAreaName}
                description={`free slots: ${park.availableSlots}`}
                index={index}
                color={getColorForMarker(index, suggestedParkAreas.length)}
                onPress={() => {
                  loadScrollView(index);
                }}
              />
            ))
          : visibleParks.map((park, index) => (
              <ImageMarker
                key={index}
                point={{
                  latitude: park.location.latitude,
                  longitude: park.location.longitude,
                }}
                title={park.parkAreaName}
                description={`free slots: ${park.availableSlots}`}
                index={park.originalIndex}
                color={getColorForMarker(index, visibleParks.length)}
                onPress={() => handleMarkerPress(park.originalIndex)}
              />
            ))}
      </MapView>
      {showParkAreas && renderParkAreas()}
      {!showParkAreas && (
        <TouchableOpacity
          style={styles.locationIcon}
          onPress={handleCurrentLocationButtonClick}
          activeOpacity={0.7}
        >
          <Icon name="my-location" size={25} color={locationIconColor} />
        </TouchableOpacity>
      )}
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
    marginBottom: -30,
  },

  locationIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: "white",
  },
  parkAreasContainer: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "red",
    left: 0,
    right: 0,
  },
  parkAreasContainer: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 50,
    marginRight: 20,
    marginBottom: 5,
    padding: 2,
  },
});
