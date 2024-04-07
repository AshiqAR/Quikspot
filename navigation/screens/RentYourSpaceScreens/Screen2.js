import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useRentASpaceContext} from "../../context/RentASpaceContext";
import Geolocation from "react-native-geolocation-service";
import useLoadingWithinComponent from "../../customHooks/useLoadingWithinComponent";
import LoadingModal from "../../components/LoadingModal";
import CustomMap from "../../components/CustomMap";

export default function Screen2({navigation}) {
  const {parkAreaDetails, updateParkAreaDetails} = useRentASpaceContext();
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const [locationFetched, setLocationFetched] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: currentLocation?.latitude || 8.543056,
    longitude: currentLocation?.longitude || 76.905515,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showMap, setShowMap] = useState(true);
  useEffect(() => {
    if (currentLocation) {
      setMapRegion({
        latitude: currentLocation?.latitude || 8.543056,
        longitude: currentLocation?.longitude || 76.905515,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLocationFetched(true);
    }
  }, [currentLocation]);

  const toggleMapVisibility = () => {
    setShowMap(!showMap);
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocation Permission",
          message: "Can we access your location?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === "granted") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = () => {
    startLoading();
    requestLocationPermission()
      .then(res => {
        if (res) {
          Geolocation.getCurrentPosition(
            position => {
              const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              setCurrentLocation(locationData);
              setLocationFetched(true);
              updateParkAreaDetails.updateLocation(locationData);
              stopLoading();
            },
            error => {
              Alert.alert("Error", "Failed to fetch location");
              stopLoading();
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
          );
        } else {
          stopLoading();
        }
      })
      .catch(error => {
        Alert.alert("Error", "Failed to fetch location");
        stopLoading();
      });
  };

  const parkSpaceOptions = ["Home", "Land", "Dedicated"];
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleNextPress = () => {
    // Convert input values to numbers for validation
    const estimatedCarsParked = parseInt(parkAreaDetails.estimatedCapacity);
    const pricePerHour = parseInt(parkAreaDetails.expectedPricePerHour);

    if (
      isNaN(estimatedCarsParked) ||
      estimatedCarsParked <= 0 ||
      isNaN(pricePerHour) ||
      pricePerHour <= 0 ||
      parkAreaDetails.parkSpaceType == ""
    ) {
      Alert.alert(
        "Fill in all required fields",
        "Please fill in all required fields with valid numbers where applicable."
      );
      return;
    }
    if (Object.keys(parkAreaDetails.location).length === 0) {
      Alert.alert(
        "Location not selected",
        "Please select a location for the parking area"
      );
      return;
    }
    console.log(parkAreaDetails);
    navigation.navigate("Screen3");
  };

  const handleInputChange = (name, value) => {
    updateParkAreaDetails.updateDetails(name, value);
  };

  const handleLocationFetch = () => {
    getLocation();
  };

  const handleToggleFacility = index => {
    const updatedFacilities = parkAreaDetails.facilitiesAvailable.map(
      (facility, i) => {
        if (i === index) {
          return {...facility, value: !facility.value};
        }
        return facility;
      }
    );
    updateParkAreaDetails.updateDetails(
      "facilitiesAvailable",
      updatedFacilities
    );
  };

  const renderFacilityToggles = () => {
    return parkAreaDetails.facilitiesAvailable.map((facility, index) => (
      <LabelToggle
        key={index}
        label={facility.name}
        value={facility.value}
        onToggle={() => handleToggleFacility(index)}
      />
    ));
  };

  const renderParkSpaceOptions = () => {
    return parkSpaceOptions.map((option, index) => (
      <Pressable
        key={index}
        style={styles.radioContainer}
        onPress={() => handleInputChange("parkSpaceType", option)}
      >
        <Icon
          name={
            parkAreaDetails.parkSpaceType === option
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={20}
          color={"black"}
        />
        <Text style={styles.radioLabel}>{option}</Text>
      </Pressable>
    ));
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <LoadingModal
          isLoading={isLoading}
          message="Fetching your location..."
        />
      )}
      <ScrollView style={styles.scrollSection}>
        <LabelInput
          label="Estimated Parking Capacity (No. of Cars)*"
          value={parkAreaDetails.estimatedCapacity}
          onChangeText={value => handleInputChange("estimatedCapacity", value)}
          keyboardType="numeric"
        />
        <LabelInput
          label="Expected Price Per Hour*"
          value={parkAreaDetails.expectedPricePerHour}
          onChangeText={value =>
            handleInputChange("expectedPricePerHour", value)
          }
          keyboardType="numeric"
        />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type of Park Space*</Text>
          <View style={styles.radioGroup}>{renderParkSpaceOptions()}</View>
        </View>
        <View style={[{alignItems: "center", paddingVertical: 10}]}>
          <Text style={styles.label}>Park Space Facilities Available</Text>
        </View>

        {renderFacilityToggles()}

        <View
          style={[styles.label, {alignItems: "center", paddingVertical: 10}]}
        >
          <Text style={styles.label}>Locate the parking area</Text>
        </View>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            backgroundColor: "#dfdfdf",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={handleLocationFetch}
        >
          <Icon name="location-outline" size={24} color="gray" />
          <Text style={{marginLeft: 8, color: "gray"}}>
            Use Current Location
          </Text>
        </Pressable>
        {locationFetched && currentLocation && (
          <Text style={{marginLeft: 8, color: "green", fontStyle: "italic"}}>
            Location fetched: Latitude: {currentLocation.latitude}, Longitude:{" "}
            {currentLocation.longitude}
          </Text>
        )}

        <Pressable
          onPress={toggleMapVisibility}
          style={{
            marginTop: 10,
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            paddingVertical: 10,
            borderRadius: 5,
            alignItems: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 15,
              paddingHorizontal: 20,
              fontWeight: "bold",
            }}
          >
            {showMap ? "Hide Map" : "Show Map"}
          </Text>
          <Icon
            name={showMap ? "chevron-down" : "chevron-forward"}
            size={20}
            color="black"
          />
        </Pressable>

        {showMap && (
          <View style={{height: 300, marginTop: 20, marginBottom: 30}}>
            <CustomMap
              initialRegion={mapRegion}
              currentLocation={currentLocation}
              onLocationSelect={location => setCurrentLocation(location)}
              updateLocation={updateParkAreaDetails.updateLocation}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.nextButtonContainer}>
        <Pressable
          style={styles.nextButton}
          onPress={handleNextPress}
          android_ripple={{color: "gray", borderless: false}}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon name="arrow-forward-circle-outline" size={30} color={"white"} />
        </Pressable>
      </View>
    </View>
  );
}

const LabelInput = ({label, ...props}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const LabelToggle = ({label, value, onToggle}) => (
  <Pressable onPress={onToggle} style={styles.toggleContainer}>
    <Text style={styles.label}>{label}</Text>
    <Icon
      name={value ? "checkbox-outline" : "square-outline"}
      size={24}
      color={"black"}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 20,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderColor: "gray",

    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 2,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    marginLeft: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  nextButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    paddingHorizontal: 15,
  },
  nextButton: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 50,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
  },
  nextButtonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
