import React, {useState, useCallback} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useParkingDetails} from "../../context/ParkingContext";
import {useAuth} from "../../context/AuthContext";
import axios from "axios";
import backendUrls from "../../connections/backendUrls";
const {getMyVehiclesURL} = backendUrls;
import useLoadingWithinComponent from "../../customHooks/useLoadingWithinComponent";
import LoadingModal from "../../components/LoadingModal";

export default function MyVehicles({navigation}) {
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const {vehicles, user, setVehicles} = useAuth();
  const {locationSharingEnabled, getLocation, updateBookingDetails} =
    useParkingDetails();
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();

  const fetchVehicles = async () => {
    if (!user || !user._id) return;
    startLoading();
    try {
      const response = await axios.post(getMyVehiclesURL, {userId: user._id});
      if (response.data.success) {
        setVehicles(response.data.vehicles);
      } else {
        Alert.alert("Error", response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      stopLoading();
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVehicles();
    }, [])
  );

  const toggleSelection = id => {
    setSelectedVehicleId(prevId => (prevId === id ? null : id));
  };

  const handleProceedForSearch = () => {
    if (!isProceedButtonDisabled) {
      const selectedVehicle = vehicles.find(
        vehicle => vehicle._id === selectedVehicleId
      );
      if (selectedVehicle) {
        updateBookingDetails({
          vehicle: selectedVehicle,
        });
        navigation.navigate("MapScreen");
      }
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedVehicleId === item._id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => {
          item.booked
            ? Alert.alert(
                "Booking Conflict",
                "A booking for this vehicle already exist !\nYou cannot select this vehicle now."
              )
            : toggleSelection(item._id);
        }}
      >
        <Icon
          name={item.type === "car" ? "car" : "motorcycle"}
          size={25}
          color={item.type === "car" ? "#4CAF50" : "#FFC107"}
          style={styles.icon}
        />
        <View style={styles.details}>
          <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
          <Text style={styles.info}>
            {item.make} {item.model}
          </Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const isProceedButtonDisabled = selectedVehicleId === null;

  return (
    <View style={{flex: 1}}>
      {isLoading && (
        <LoadingModal
          message="Fething your vehicles..."
          isLoading={isLoading}
        />
      )}
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
      <FlatList
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        style={styles.container}
        ListEmptyComponent={
          !isLoading && <Text style={styles.emptyList}>No vehicles added!</Text>
        }
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          paddingBottom: 20,
        }}
      >
        <View style={{borderRadius: 10, overflow: "hidden"}}>
          <Pressable
            style={[
              styles.proceedButton,
              isProceedButtonDisabled && styles.disabledButton,
            ]}
            android_ripple={{color: "gray", borderless: false}}
            onPress={handleProceedForSearch}
            disabled={isProceedButtonDisabled}
          >
            <Text style={{color: "white", fontSize: 20, textAlign: "center"}}>
              Proceed for Search
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  card: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: "#FeFeFe",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedCard: {
    // backgroundColor: '#E0E0E0',
    // backgroundColor: '#FFC107',
    backgroundColor: "tomato",
  },
  icon: {
    marginRight: 10,
    marginLeft: 5,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  type: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
    fontStyle: "italic",
  },
  proceedButton: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 50,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  emptyList: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 16,
  },
  selectedCard: {
    // backgroundColor: '#E0E0E0',
    // backgroundColor: '#abcff0',
    backgroundColor: "lightgray",
  },
  proceedButton: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 50,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});
