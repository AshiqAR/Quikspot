import React from "react";
import {View, Text, StyleSheet, Dimensions, Pressable} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const {width} = Dimensions.get("window");

const getFormattedAverageRating = (totalRating, totalNumberOfRatings) => {
  if (!totalRating || !totalNumberOfRatings || totalNumberOfRatings === 0) {
    return "Rating not available";
  }
  const averageRating = totalRating / totalNumberOfRatings;
  return `${Math.round(averageRating * 100) / 100} (${totalNumberOfRatings})`;
};

const getRatingColor = rating => {
  const highColor = {r: 255, g: 215, b: 0}; // Gold
  const lowColor = {r: 184, g: 134, b: 11}; // Darker gold/brown

  // Normalize rating from 0 to 1
  const normalizedRating = rating / 5;

  // Linear interpolation between the highColor and lowColor based on rating
  const interpolatedColor = {
    r: lowColor.r + (highColor.r - lowColor.r) * normalizedRating,
    g: lowColor.g + (highColor.g - lowColor.g) * normalizedRating,
    b: lowColor.b + (highColor.b - lowColor.b) * normalizedRating,
  };

  return `rgb(${interpolatedColor.r}, ${interpolatedColor.g}, ${interpolatedColor.b})`;
};

const ParkAreaCard = ({parkArea, onPress}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{parkArea.parkAreaName}</Text>
        <View style={styles.rateContainer}>
          <Text style={styles.rupeeSymbol}>{"\u20B9"}</Text>
          <Text style={styles.rateText}>{parkArea.ratePerHour}/hr</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {parkArea.address} - {parkArea.distance}dist km
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.rateAndSlots}>
          <View style={styles.slotsContainer}>
            <Text style={styles.slotsText}>
              Free slots: {parkArea.availableSlots}
            </Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Icon
            name="star"
            // color={getRatingColor(parseFloat(parkArea.rating))}
            color="gold"
            size={18}
          />
          <Text style={styles.ratingText}>
            {parkArea.rating.totalRating === 0
              ? "No ratings yet"
              : getFormattedAverageRating(
                  parkArea.rating.totalRating,
                  parkArea.rating.totalNumberOfRatings
                )}
          </Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        {parkArea.facilitiesAvailable.map((feature, index) => (
          <View key={index} style={styles.feature}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15, // Reduced padding for a sleeker look
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    // Ensure the title style accommodates the new layout
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
    flex: 1, // Allow the title to flex
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rateAndSlots: {
    flexDirection: "row",
    alignItems: "center",
  },
  rupeeSymbol: {
    fontSize: 20,
    color: "black",
  },
  slotsContainer: {
    marginLeft: 15,
  },
  slotsText: {
    color: "#d9534f", // Attractive color for urgency
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
  featuresContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  feature: {
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 5,
    margin: 2,
  },
  featureText: {
    fontSize: 12,
    color: "#555",
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rateText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ParkAreaCard;
