// VehicleDetails.js
import React from "react";
import {View, Text, StyleSheet} from "react-native";

const VehicleDetails = ({vehicle}) => {
  if (!vehicle) {
    return null; // or some placeholder indicating no vehicle details are available
  }

  return (
    <View style={styles.detailCard}>
      <Text style={styles.title}>Vehicle Details</Text>
      <Text style={styles.detailText}>
        Vehicle Number: {vehicle.vehicleNumber}
      </Text>
      <Text style={styles.detailText}>
        Make and Model: {vehicle.make} {vehicle.model}
      </Text>
      <Text style={styles.detailText}>Vehicle Type: {vehicle.type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailCard: {
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
});

export default VehicleDetails;
