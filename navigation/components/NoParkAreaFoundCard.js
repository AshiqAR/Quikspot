import React from "react";
import {View, Text, StyleSheet, Dimensions} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const {width} = Dimensions.get("window");

export default function NoParkingAreaFoundCard() {
  return (
    <View style={styles.card}>
      <Icon name="parking" size={40} color="#f8d7da" />
      <Text style={styles.headerText}>No Nearby Parking Yet!</Text>
      <Text style={styles.bodyText}>
        We're on the move, expanding quickly. Parking spots coming soon to your
        area.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    marginHorizontal: 20,
    backgroundColor: "white", // Light red for alert
    borderRadius: 8,
    padding: 20,
    alignItems: "center", // Center the content
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  headerText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#721c24", // Darker shade for contrast
  },
  bodyText: {
    marginTop: 10,
    fontSize: 14,
    color: "#721c24",
    textAlign: "center",
    paddingHorizontal: 10, // Ensure it doesn't touch the edges
  },
});
