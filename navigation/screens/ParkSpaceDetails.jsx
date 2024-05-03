import React, {useEffect, useLayoutEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TextInput,
  Keyboard,
  Pressable,
} from "react-native";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import axios from "axios";
import LoadingModal from "../components/LoadingModal";
import Icon from "react-native-vector-icons/FontAwesome";
import UserReviews from "../components/BookingScreenComponents/UserReviews";
import backendUrls from "../connections/backendUrls";

const {getParkAreaDetailsURL, checkOutVehicleURL} = backendUrls;
import {validateOTPInRDB} from "../utilities/OTPcontrollers";

const getFormattedAverageRating = (totalRating, totalNumberOfRatings) => {
  if (!totalRating || !totalNumberOfRatings || totalNumberOfRatings === 0) {
    return "Rating not available";
  }
  const averageRating = totalRating / totalNumberOfRatings;
  return `${Math.round(averageRating * 100) / 100} (${totalNumberOfRatings})`;
};

const formatDate = timestamp => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${hours}:${minutesStr} ${ampm}, ${day}/${month}/${year}`;
};

export default function ParkSpaceDetails({navigation, route}) {
  const {space} = route.params;
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const [parkAreaDetails, setParkAreaDetails] = useState(null);
  const [checkOutOtp, setCheckOutOtp] = useState("");

  useEffect(() => {
    const fetchParkAreaDetails = async () => {
      startLoading();
      try {
        const response = await axios.post(getParkAreaDetailsURL, {
          parkAreaId: space._id,
        });
        if (response.data?.success && response.data?.parkAreaDetails) {
          setParkAreaDetails(response.data.parkAreaDetails);
          console.log(response.data.parkAreaDetails);
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

  const checkOutVehicle = async booking => {
    Keyboard.dismiss();
    try {
      startLoading();
      const isValidOtp = await validateOTPInRDB(
        booking._id,
        booking.parkAreaId,
        checkOutOtp
      );
      if (!isValidOtp) {
        Alert.alert(
          "Invalid OTP",
          "Please enter the correct OTP from the driver."
        );
        stopLoading();
        return;
      }
      const response = await axios.post(checkOutVehicleURL, {
        vehicleNumber: booking.vehicleId.vehicleNumber,
        parkAreaId: booking.parkAreaId,
      });
      if (!response.data.success) {
        throw new Error("Failed to check out vehicle.");
      }
      Alert.alert("Success", "Vehicle checked out successfully.");
      navigation.navigate("ParkSpaceDetails", {space});
      stopLoading();
    } catch (error) {
      Alert.alert(
        "Check out failed",
        error.message || "Vehicle Check Out Failed. Please try again later."
      );
      stopLoading();
    }
  };

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
              Check-In Time: {formatDate(booking.checkInTime)}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.bookingText}>
              Booking Time: {formatDate(booking.bookedTime)}
            </Text>
            <Text style={styles.bookingText}>
              Expiration Time: {formatDate(booking.bookingExpirationTime)}
            </Text>
          </>
        )}
        <Text style={styles.bookingText}>
          Amount Transferred: ₹ {booking.amountTransferred}
        </Text>
        {parkAreaDetails.parkAreaType === "Home" && !booking.checkInTime && (
          <Pressable
            style={{
              width: "100%",
              alignItems: "center",
              marginTop: 10,
              padding: 10,
              backgroundColor: "#4CAF50",
              borderRadius: 5,
            }}
            onPress={() =>
              navigation.navigate("OwnerCapture", {
                booking,
                space,
              })
            }
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Check In Vehicle
            </Text>
          </Pressable>
        )}
        {parkAreaDetails.parkAreaType == "Home" && booking.checkInTime && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              marginVertical: 5,
            }}
          >
            <TextInput
              style={{
                flex: 2,
                borderWidth: 1,
                borderColor: "#4CAF50",
                borderRadius: 5,
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginVertical: 4,
                fontSize: 16,
                marginRight: 10,
              }}
              placeholder="Enter OTP from Driver"
              value={checkOutOtp}
              onChangeText={setCheckOutOtp}
            />
            <Pressable
              style={{
                alignItems: "center",
                padding: 10,
                backgroundColor: "#4CAF50",
                borderRadius: 30,
              }}
              onPress={() => {
                checkOutVehicle(booking);
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Check Out Vehicle
              </Text>
            </Pressable>
          </View>
        )}
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
              Check-In Time: {formatDate(booking.checkInTime)}
            </Text>
            <Text style={styles.bookingText}>
              Check-Out Time: {formatDate(booking.checkOutTime)}
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
    marginBottom: 10,
    fontSize: 16,
    // light color to represent no bookings
    color: "#999",
  },
});
