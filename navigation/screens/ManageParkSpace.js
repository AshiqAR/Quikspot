import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import {useUserParkSpaces} from "../context/UserParkSpacesContext";

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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderParkSpace = ({item: space}) => (
    <Pressable
      style={styles.spaceContainer}
      onPress={() => navigation.navigate("ParkSpaceDetails", {space})}
    >
      <Text style={styles.spaceName}>{space.parkAreaName}</Text>
      <Text style={styles.text}>
        Address: {space.address}, {space.city}, {space.state} - {space.pincode}
      </Text>
      <Text style={styles.text}>Type: {space.parkAreaType}</Text>
      <Text style={styles.text}>
        Owner: {space.ownerName} - {space.ownerPhoneNumber}
      </Text>
      <Text style={styles.text}>
        Slots: {space.availableSlots} / {space.totalSlots} available
      </Text>
      <Text style={styles.text}>Rate: ₹{space.ratePerHour} per hour</Text>
    </Pressable>
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
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 25,
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
