import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, {useEffect, useState} from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useAuth} from "../context/AuthContext";
import backendUrls from "../connections/backendUrls";
import axios from "axios";
import LoadingModal from "../components/LoadingModal";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";

const {getMyVehiclesURL, deleteAVehicleURL} = backendUrls;

const titleCase = str => {
  if (!str) return "";
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

export default function MyVehicles({navigation}) {
  // Use vehicles directly from context instead of local state
  const {user, vehicles, setVehicles} = useAuth();
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

  useEffect(() => {
    if (vehicles == null) {
      console.log("Fetching vehicles");
      fetchVehicles();
    }
  }, []);

  const handleDelete = id => {
    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to delete this vehicle?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            startLoading();
            try {
              const response = await axios.post(deleteAVehicleURL, {
                vehicleId: id,
                userId: user._id, // Assuming `user._id` is available in your component's scope
              });
              if (response.data.success) {
                Alert.alert("Success", "Vehicle deleted successfully.");
                await fetchVehicles();
              } else {
                Alert.alert("Error", response.data.message);
              }
            } catch (error) {
              if (error.response) {
                if (error.response.status === 400) {
                  Alert.alert(
                    "Error",
                    "Cannot delete vehicle with active bookings."
                  );
                } else {
                  Alert.alert(
                    "Error",
                    "An error occurred. Please try again later."
                  );
                }
              } else if (error.request) {
                Alert.alert(
                  "Error",
                  "The request was made but no response was received, check your network connection."
                );
              } else {
                Alert.alert(
                  "Error",
                  "An error occurred. Please try again later."
                );
              }
            } finally {
              stopLoading();
            }
          },
        },
      ],
      {cancelable: false}
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
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
        <Text style={styles.type}>{titleCase(item.type)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item._id)}
        style={styles.deleteButton}
      >
        <Icon name="trash" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      {isLoading && (
        <LoadingModal
          isLoading={isLoading}
          activityIndicatorColor="black"
          message="Loading Your Vehicles..."
        />
      )}
      <FlatList
        data={vehicles === null ? [] : vehicles}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        style={styles.container}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.emptyList}>
              You have not added any vehicles yet !
            </Text>
          )
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
            style={{
              backgroundColor: "black",
              borderRadius: 10,
              height: 50,
              width: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
            android_ripple={{color: "gray", borderless: false}}
            onPress={() => {
              navigation.navigate("AddNewVehicle");
            }}
          >
            <Text style={{color: "white", fontSize: 20, textAlign: "center"}}>
              Add New Vehicle
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
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginVertical: 4,
    // backgroundColor: '#F5F5F5',
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
  deleteButton: {
    padding: 10,
    opacity: 0.8,
  },
  emptyList: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 16,
  },
});
