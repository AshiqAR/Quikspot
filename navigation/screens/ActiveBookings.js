import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Using FontAwesome for consistency
import axios from "axios";
import backendUrls from "../connections/backendUrls";
import {useAuth} from "../context/AuthContext";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import LoadingModal from "../components/LoadingModal";
import {format, parseISO} from "date-fns";

const {activeBookingsURL} = backendUrls;

const NavigateToParkArea = (latitude, longitude) => {
  Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate`
  );
};

export default function ActiveBookings() {
  const {user} = useAuth();
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const [activeBookings, setActiveBookings] = useState([]);

  const fetchActiveBookings = async () => {
    try {
      startLoading();
      const response = await axios.post(activeBookingsURL, {userId: user._id});
      setActiveBookings(response.data.activeBookings);
      console.log("Active bookings:", response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch active bookings. Please try again later."
      );
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchActiveBookings();
  }, []);

  const renderBookingItem = ({item}) => {
    const formatDate = dateString => {
      return format(parseISO(dateString), "MMM d yyyy, hh:mm:ss a");
    };

    const expirationOrCheckIn = item.checkInTime ? (
      `Check-in: ${formatDate(item.checkInTime)}`
    ) : (
      <Text style={styles.expirationText}>
        Expiration: {formatDate(item.bookingExpirationTime)}
      </Text>
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.parkAreaId.parkAreaName}</Text>
          <Text
            style={styles.subTitle}
          >{`${item.parkAreaId.address}, ${item.parkAreaId.city}, ${item.parkAreaId.state}`}</Text>
          <Text style={styles.bookedTime}>
            Booked Time: {formatDate(item.bookedTime)}
          </Text>
          {expirationOrCheckIn}
        </View>
        <View style={styles.vehicleContainer}>
          <Icon
            name={item.vehicleId.type === "motorcycle" ? "motorcycle" : "car"}
            size={20}
            style={styles.icon}
          />
          <View style={styles.vehicleInfo}>
            <Text
              style={styles.vehicleDetails}
            >{`${item.vehicleId.make} ${item.vehicleId.model}`}</Text>
            <Text style={styles.vehicleNumber}>
              {item.vehicleId.vehicleNumber}
            </Text>
          </View>
        </View>
        <Text style={styles.amount}>
          Amount Transferred: ₹{item.amountTransferred}
        </Text>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() =>
            NavigateToParkArea(
              item.parkAreaId.location.latitude,
              item.parkAreaId.location.longitude
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.navigateButtonText}>Navigate to Park Area</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && <LoadingModal visible={isLoading} />}
      <FlatList
        data={activeBookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchActiveBookings}
          />
        }
      />
    </View>
  );
}

// Styles adapted from your PastBookings screen for consistency
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flex: 1,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
  },
  text: {
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
  },
  bookedTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  expirationText: {
    fontSize: 14,
    color: "#d20",
    fontWeight: "bold",
    marginTop: 5,
  },
  vehicleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  vehicleInfo: {
    marginHorizontal: 10,
  },
  vehicleDetails: {
    fontSize: 14,
    color: "#666",
  },
  vehicleNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  amount: {
    fontSize: 16,
    color: "#4CAF50",
    marginTop: 10,
  },
  navigateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  navigateButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
