import React, {useEffect, useLayoutEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import axios from "axios";
import backendUrls from "../connections/backendUrls";
import LoadingModal from "../components/LoadingModal";
import Icon from "react-native-vector-icons/FontAwesome";
import UserReviews from "../components/BookingScreenComponents/UserReviews";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_MARGIN = 15; // Margin for the cards

const {getParkAreaDetailsURL} = backendUrls;

const getFormattedAverageRating = (totalRating, totalNumberOfRatings) => {
  if (!totalRating || !totalNumberOfRatings || totalNumberOfRatings === 0) {
    return "Rating not available";
  }
  const averageRating = totalRating / totalNumberOfRatings;
  return `${Math.round(averageRating * 100) / 100} (${totalNumberOfRatings})`;
};

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

  const renderActiveBooking = booking => {
    return (
      <View key={booking._id} style={styles.bookingInfo}>
        <Text style={styles.bookingText}>
          Vehicle: {booking.vehicleId.vehicleNumber}
        </Text>
        <Text style={styles.bookingText}>Owner: {booking.userId.name}</Text>
        {booking.checkInTime ? (
          <>
            <Text style={styles.bookingText}>
              Check-In Time: {new Date(booking.checkInTime).toLocaleString()}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.bookingText}>
              Booking Time: {new Date(booking.bookedTime).toLocaleString()}
            </Text>
            <Text style={styles.bookingText}>
              Expiration Time:{" "}
              {new Date(booking.bookingExpirationTime).toLocaleString()}
            </Text>
          </>
        )}
        <Text style={styles.bookingText}>
          Amount Transferred: ₹ {booking.amountTransferred}
        </Text>
      </View>
    );
  };

  const renderPastBooking = booking => {
    return (
      <View key={booking._id} style={styles.bookingInfo}>
        <Text style={styles.bookingText}>
          Vehicle: {booking.vehicleId.vehicleNumber}
        </Text>
        <Text style={styles.bookingText}>Owner: {booking.userId.name}</Text>
        {booking.checkInTime ? (
          <>
            <Text style={styles.bookingText}>
              Check-In Time: {new Date(booking.checkInTime).toLocaleString()}
            </Text>
            <Text style={styles.bookingText}>
              Check-Out Time: {new Date(booking.checkOutTime).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.bookingText}>Expired Booking</Text>
        )}
        <Text style={styles.bookingText}>
          Amount Transferred: ₹ {booking.amountTransferred}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingModal isLoading={isLoading} />
      {parkAreaDetails && (
        <>
          <View style={styles.detailCard}>
            <Text style={styles.detailText}>
              {parkAreaDetails.address}, {parkAreaDetails.city},{" "}
              {parkAreaDetails.state}
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
                renderItem={renderFacility}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Text style={styles.rateAndRevenueText}>
              Today's Rate Per Hour: ₹ {parkAreaDetails.ratePerHour}/hr
            </Text>
            <Text style={styles.rateAndRevenueText}>
              Total Earnings: ₹ {parkAreaDetails.totalEarnings}
            </Text>
          </View>
          <UserReviews reviews={parkAreaDetails.reviews} />
          <View style={styles.bookingsSection}>
            <Text style={styles.sectionTitle}>Active Bookings</Text>
            {parkAreaDetails.activeBookings.length > 0 ? (
              parkAreaDetails.activeBookings.map(renderActiveBooking)
            ) : (
              <Text style={styles.noBookings}>No active bookings.</Text>
            )}

            <Text style={styles.sectionTitle}>Past Bookings</Text>
            {parkAreaDetails.pastBookings.length > 0 ? (
              parkAreaDetails.pastBookings.map(renderPastBooking)
            ) : (
              <Text style={styles.noBookings}>No past bookings.</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// Styles updated for consistency and proper margins
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  detailCard: {
    margin: 15,
    padding: 15,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
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
    marginBottom: 20,
  },
  facilityContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 5,
    padding: 5,
  },
  facilityText: {
    marginLeft: 5,
    color: "#4CAF50",
  },
  rateAndRevenueText: {
    fontSize: 16,
    color: "#444",
  },
  bookingsSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookingInfo: {
    backgroundColor: "#F7F7F7",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  bookingText: {
    fontSize: 16,
    color: "#444",
  },
  noBookings: {
    fontSize: 16,
    color: "#666",
  },
});
