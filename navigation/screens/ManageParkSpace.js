import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  RefreshControl,
  Switch,
  Alert,
} from "react-native";
import axios from "axios";
import {useUserParkSpaces} from "../context/UserParkSpacesContext";
import backendUrls from "../connections/backendUrls";
const {openParkAreaURL, closeParkAreaURL} = backendUrls;

export default function ManageParkSpace({navigation}) {
  const {userParkSpaces, fetchParkSpaces} = useUserParkSpaces();
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchParkSpaces = async () => {
    setIsLoading(true);
    await fetchParkSpaces();
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchParkSpaces();
  }, []);

  const toggleParkSpace = async (spaceId, isOpen) => {
    const url = isOpen ? closeParkAreaURL : openParkAreaURL;
    setIsLoading(true);

    try {
      const response = await axios.post(url, {parkAreaId: spaceId});
      Alert.alert(response.data.message);
      await fetchParkSpaces();
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", error.response.data.message);
      } else if (error.request) {
        Alert.alert("Error", "No response from the server.");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderParkSpace = ({item: space}) => (
    <View style={styles.spaceContainer}>
      <Pressable
        style={styles.spaceDetailsPressable}
        onPress={() => navigation.navigate("ParkSpaceDetails", {space})}
      >
        <View style={styles.spaceDetails}>
          <Text style={styles.spaceName}>{space.parkAreaName}</Text>
          <Text style={styles.text}>
            {space.address}, {space.city}, {space.state}
          </Text>
          <Text style={styles.text}>Park Area Type: {space.parkAreaType}</Text>
        </View>
      </Pressable>
      <View style={styles.divider} />
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{false: "#d3d3d3", true: "#81c784"}}
          thumbColor={space.isOpen ? "#ffffff" : "#ffffff"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleParkSpace(space._id, space.isOpen)}
          value={space.isOpen}
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={userParkSpaces}
      keyExtractor={item => item._id.toString()}
      renderItem={renderParkSpace}
      ListEmptyComponent={
        <Text style={styles.noSpacesText}>No park spaces available.</Text>
      }
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleFetchParkSpaces}
        />
      }
    />
  );
}

// Add your StyleSheet here

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spaceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 12,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spaceDetailsPressable: {
    flex: 1, // Allows the pressable area to take up the majority of the space
  },
  spaceDetails: {
    paddingVertical: 20,
    paddingHorizontal: 25, // Ensures content doesn't touch the sides
  },
  spaceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  noSpacesText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  divider: {
    height: "80%", // Adjusts the height of the divider to not touch the top and bottom of the card
    width: 1,
    backgroundColor: "#ddd",
  },
  switchContainer: {
    paddingHorizontal: 20, // Provides some space between the switch and the edge of the card
  },
});

const sampleResponse = [
  {
    __v: 0,
    _id: "66085bc19464be0ddec1424e",
    activeBookings: [],
    address: "V V House Kallara",
    availableSlots: 5,
    city: "Kallara",
    facilitiesAvailable: ["CCTV", "Security", "E V Charging"],
    location: {
      _id: "66085bc19464be0ddec1424f",
      latitude: 8.750259,
      longitude: 76.936142,
    },
    ownerId: "66084f16a7bab9e9601e8d96",
    ownerName: "A R Ashiq",
    ownerPhoneNumber: "9074873430",
    parkAreaName: "Parkzee",
    parkAreaType: "Home",
    pastBookings: ["6608d02b4db8b256b1813633"],
    pincode: "695608",
    ratePerHour: 15,
    rating: {
      _id: "66085bc19464be0ddec1424d",
      totalNumberOfRatings: 0,
      totalRating: 0,
    },
    revenue: {monthly: [Array], todays: 0},
    reviews: [],
    state: "Kerala",
    totalSlots: 5,
  },
];
