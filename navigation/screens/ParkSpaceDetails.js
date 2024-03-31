import React, {useEffect, useLayoutEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import axios from "axios";
import backendUrls from "../connections/backendUrls";
import LoadingModal from "../components/LoadingModal";
import Icon from "react-native-vector-icons/FontAwesome";

import {Dimensions} from "react-native";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_MARGIN = 10;

const {getParkAreaDetailsURL} = backendUrls;

export default function ParkSpaceDetails({navigation, route}) {
  const {space} = route.params;
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const [parkAreaDetails, setParkAreaDetails] = useState(null);

  useEffect(() => {
    const fetchParkAreaDetails = async () => {
      startLoading();
      try {
        const response = await axios.post(getParkAreaDetailsURL, {
          parkAreaId: space._id,
        });
        if (response.data?.success && response.data?.parkAreaDetails) {
          setParkAreaDetails(response.data.parkAreaDetails);
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to fetch park area details"
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Cannot fetch park area details due to a network or server issue"
        );
      } finally {
        stopLoading();
      }
    };
    fetchParkAreaDetails();
  }, [space._id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: space.parkAreaName || "Park Details",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation, space.parkAreaName]);

  const renderFacility = ({item}) => (
    <View style={styles.facilityContainer}>
      <Icon name="check" size={16} color="#4CAF50" />
      <Text style={styles.facilityText}>{item}</Text>
    </View>
  );

  const renderBookingInfo = (bookings, title) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {bookings.length > 0 ? (
        bookings.map(booking => (
          <View key={booking._id} style={styles.bookingInfo}>
            <Text style={styles.bookingText}>
              Vehicle: {booking.vehicleId.vehicleNumber}
            </Text>
            <Text style={styles.bookingText}>Owner: {booking.userId.name}</Text>
            {title === "Past Bookings" && (
              <Text style={styles.bookingText}>
                Checked Out: {booking.checkOutTime}
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noBookings}>No {title.toLowerCase()}.</Text>
      )}
    </>
  );

  const averageRating = parkAreaDetails
    ? (
        parkAreaDetails.rating.totalRating /
        parkAreaDetails.rating.totalNumberOfRatings
      ).toFixed(1)
    : 0;

  return (
    <ScrollView style={styles.container}>
      <LoadingModal isLoading={isLoading} />
      {parkAreaDetails && (
        <>
          <View style={styles.detailCard}>
            <Text style={styles.headerText}>
              {parkAreaDetails.parkAreaName}
            </Text>
            <Text style={styles.detailText}>
              {parkAreaDetails.address}, {parkAreaDetails.city},{" "}
              {parkAreaDetails.state}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{`${(
                parkAreaDetails.rating.totalRating /
                Math.max(parkAreaDetails.rating.totalNumberOfRatings, 1)
              ).toFixed(1)} (${
                parkAreaDetails.rating.totalNumberOfRatings
              } reviews)`}</Text>
            </View>
            <View style={styles.facilitiesContainer}>
              <FlatList
                horizontal
                data={parkAreaDetails.facilitiesAvailable}
                renderItem={renderFacility}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Text style={styles.rateAndRevenueText}>
              Rate: ₹{parkAreaDetails.ratePerHour}/hr
            </Text>
            <Text style={styles.rateAndRevenueText}>
              Today's Revenue: ₹{parkAreaDetails.revenue.todays}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={styles.reviewsContainer}
          >
            {parkAreaDetails.reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <Text style={styles.reviewText}>{review.review}</Text>
                <Text style={styles.reviewerName}>- {review.userName}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.bookingsSection}>
            {renderBookingInfo(
              parkAreaDetails.activeBookings || [],
              "Active Bookings"
            )}
            {renderBookingInfo(
              parkAreaDetails.pastBookings || [],
              "Past Bookings"
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Setting the background to white
  },
  detailCard: {
    margin: 20,
    padding: 20,
    backgroundColor: "#F7F7F7", // Light gray card
    borderRadius: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
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
    marginBottom: 20, // Increased spacing for visual separation
  },
  rateAndRevenueText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  reviewsContainer: {
    paddingLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  reviewCard: {
    width: CARD_WIDTH,
    backgroundColor: "#F0F0F0", // Slightly different shade for contrast
    padding: 15,
    marginRight: CARD_MARGIN * 2, // Assuming you're using the same margin for right
    borderRadius: 8,
    justifyContent: "center", // Center content vertically if needed
  },
  reviewText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  bookingsSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  bookingInfo: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#F7F7F7", // Consistent with detailCard
    borderRadius: 8,
  },
  bookingText: {
    fontSize: 16,
    color: "#555",
  },
  noBookings: {
    fontSize: 16,
    color: "#666",
  },
  // Assuming other styles for icons, buttons, etc., are here
});
