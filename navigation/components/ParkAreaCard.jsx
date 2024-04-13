import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Dimensions, Pressable} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {getAvailableSlots} from "../utilities/FreeSlotsCompute";

const {width} = Dimensions.get("window");

const getFormattedDistance = distance_in_m => {
  if (distance_in_m < 1000) {
    return `${Math.round(distance_in_m)} m`;
  }
  return `${(distance_in_m / 1000).toFixed(1)} km`;
};

const getRating = (totalRating, totalNumberOfRatings) => {
  if (totalRating === 0) {
    return 0;
  }
  return totalRating / totalNumberOfRatings;
};

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

const ParkAreaCard = ({
  parkArea,
  activeBookingsData,
  iotData,
  vehicleType,
  onPress,
}) => {
  const [freeSlots, setFreeSlots] = useState(0);
  useEffect(() => {
    setFreeSlots(
      getAvailableSlots(
        vehicleType,
        iotData,
        activeBookingsData,
        parkArea.totalSlots
      )
    );
  }, [iotData, activeBookingsData]);

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(parkArea, iotData, activeBookingsData)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{parkArea.parkAreaName}</Text>
        <View style={styles.rateAndDistanceContainer}>
          <View style={styles.rateContainer}>
            <Text style={styles.rupeeSymbol}>{"\u20B9"}</Text>
            <Text style={styles.rateText}>{parkArea.ratePerHour}/hr</Text>
          </View>
          {parkArea.distance && (
            <Text style={styles.distanceText}>
              {getFormattedDistance(parkArea.distance)}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.subtitle}>
        {parkArea.address}, {parkArea.city}, {parkArea.state}
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.rateAndSlots}>
          <View style={styles.slotsContainer}>
            <Icon
              style={styles.slotsIcon}
              name={vehicleType === "car" ? "car" : "motorcycle"}
              size={17}
            ></Icon>
            <Text style={styles.slotsText}>Free slots: {freeSlots}</Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Icon
            name="star"
            color={getRatingColor(
              getRating(
                parkArea.rating.totalRating,
                parkArea.rating.totalNumberOfRatings
              )
            )}
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
    padding: 15,
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
  rateAndDistanceContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 3, // Slight space between distance and rate
  },
  title: {
    // Ensure the title style accommodates the new layout
    color: "#333",
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
    flexDirection: "row",
    alignItems: "center",
  },
  slotsIcon: {
    marginLeft: 5,
    color: "#a25656",
  },
  slotsText: {
    color: "#d9534f", // Attractive color for urgency
    fontWeight: "bold",
    marginLeft: 10,
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
    color: "#333",
  },
});

export default ParkAreaCard;
