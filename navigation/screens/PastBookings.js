import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import backendUrls from "../connections/backendUrls";
import {useAuth} from "../context/AuthContext";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import LoadingModal from "../components/LoadingModal";
import {format, parseISO} from "date-fns";

const {pastBookingsURL} = backendUrls;

export default function PastBookings() {
  const {user} = useAuth();
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const [pastBookings, setPastBookings] = useState([]);

  const fetchPastBookings = async () => {
    try {
      startLoading();
      const response = await axios.post(pastBookingsURL, {userId: user._id});
      setPastBookings(response.data.pastBookings);
      console.log("Past bookings:", response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch past bookings. Please try again later."
      );
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchPastBookings();
  }, []);

  const addReview = bookingId => {
    console.log("Adding review for bookingId:", bookingId);
  };

  const renderBookingItem = ({item}) => {
    const toISTAndFormat = (dateString, onlyTime = false) => {
      if (!dateString) return "N/A";

      const date = new Date(dateString);
      const istOffset = 5.5;
      const utc = date.getTime() + date.getTimezoneOffset() * 60000;
      const istDate = new Date(utc + 3600000 * istOffset);

      if (onlyTime) {
        return istDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        const options = {day: "2-digit", month: "short", year: "numeric"};
        return istDate.toLocaleDateString("en-IN", options);
      }
    };

    const isExpired = !item.checkInTime && !item.checkOutTime;
    let dateTimeDisplay;
    if (isExpired) {
      dateTimeDisplay = `Booked: ${toISTAndFormat(
        item.bookedTime,
        true
      )} on ${toISTAndFormat(item.bookedTime)}\nExpired: ${toISTAndFormat(
        item.bookingExpirationTime,
        true
      )} on ${toISTAndFormat(item.bookingExpirationTime)}`;
    } else {
      dateTimeDisplay = `Check-in: ${toISTAndFormat(
        item.checkInTime,
        true
      )} on ${toISTAndFormat(item.checkInTime)} \nCheck-out: ${toISTAndFormat(
        item.checkOutTime,
        true
      )} on ${toISTAndFormat(item.checkInTime)}`;
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.parkAreaId.parkAreaName}</Text>
          <Text
            style={styles.subTitle}
          >{`${item.parkAreaId.address}, ${item.parkAreaId.city}, ${item.parkAreaId.state}`}</Text>
          <Text style={styles.subTitle}>{dateTimeDisplay}</Text>
        </View>
        <View style={styles.cardContent}>
          <Icon
            name={item.vehicleId.type === "motorcycle" ? "motorcycle" : "car"}
            size={20}
            style={styles.icon}
          />
          <View style={styles.vehicleDetails}>
            <Text style={styles.details}>{item.vehicleId.vehicleNumber}</Text>
            <Text
              style={styles.detailsSmall}
            >{`${item.vehicleId.make} ${item.vehicleId.model}`}</Text>
          </View>
          <Text style={styles.amount}>₹{item.amountTransferred}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => addReview(item._id)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && <LoadingModal visible={isLoading} />}
      <FlatList
        data={pastBookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchPastBookings}
          />
        }
      />
    </View>
  );
}

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
  vehicleDetails: {
    flex: 1,
    marginHorizontal: 10,
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
  details: {
    fontSize: 14,
  },
  detailsSmall: {
    fontSize: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    marginRight: 10,
  },
});
