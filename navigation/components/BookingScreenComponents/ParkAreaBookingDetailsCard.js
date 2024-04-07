// ParkAreaBookingDetailsCard.js
import React from "react";
import {View, Text, FlatList, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const getFormattedAverageRating = (totalRating, totalNumberOfRatings) => {
  if (!totalRating || !totalNumberOfRatings || totalNumberOfRatings === 0) {
    return "Rating not available";
  }
  const averageRating = totalRating / totalNumberOfRatings;
  return `${Math.round(averageRating * 100) / 100} (${totalNumberOfRatings})`;
};

const renderFeatures = ({item}) => (
  <View style={styles.facilityContainer}>
    <Icon name="check" size={16} color="#4CAF50" />
    <Text style={styles.facilityText}>{item}</Text>
  </View>
);

const ParkAreaBookingDetailsCard = ({parkAreaDetails}) => {
  return (
    <View style={styles.detailCard}>
      <Text style={styles.parkAreaName}>{parkAreaDetails.parkAreaName}</Text>
      <Text style={styles.detailText}>
        {parkAreaDetails.address}, {parkAreaDetails.city},{" "}
        {parkAreaDetails.state}
      </Text>
      <Text style={styles.detailText}>
        Park Area Type: {parkAreaDetails.parkAreaType}
      </Text>
      <Text style={styles.rateText}>
        Price: {"\u20B9"} {parkAreaDetails.ratePerHour}/hr
      </Text>
      <View style={styles.ratingContainer}>
        <Icon name="star" size={20} color="#FFD700" />
        <Text style={styles.ratingText}>
          {getFormattedAverageRating(
            parkAreaDetails.rating.totalRating,
            parkAreaDetails.rating.totalNumberOfRatings
          )}
        </Text>
      </View>
      <View style={styles.facilitiesContainer}>
        <FlatList
          horizontal
          data={parkAreaDetails.facilitiesAvailable}
          renderItem={renderFeatures}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
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
  parkAreaName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  rateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#444",
  },
  facilitiesContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  facilityContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  facilityText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#4CAF50",
  },
});

export default ParkAreaBookingDetailsCard;
