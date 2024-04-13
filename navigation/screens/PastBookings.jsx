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
import {format, parseISO, set} from "date-fns";
import ReviewModal from "../components/ReviewModal";

const {addReviewRatingsURL} = backendUrls;

const {pastBookingsURL} = backendUrls;

export default function PastBookings() {
  const {user} = useAuth();
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const [pastBookings, setPastBookings] = useState([]);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const addReview = pastBookingId => {
    setSelectedBookingId(pastBookingId);
    setIsReviewModalVisible(true);
  };

  const fetchPastBookings = async () => {
    try {
      startLoading();
      const response = await axios.post(pastBookingsURL, {userId: user._id});
      setPastBookings(response.data.pastBookings.reverse());
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

  const submitReview = async (parkAreaId, rating, review) => {
    try {
      console.log("Submitting review", parkAreaId, rating, review, user.name);
      await axios.post(addReviewRatingsURL, {
        pastBookingId: selectedBookingId,
        userName: user.name,
        rating,
        review,
      });
      Alert.alert("Success", "Review submitted successfully.");
      await fetchPastBookings();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Failed to submit the review. Please try again later."
      );
    }
  };

  const renderBookingItem = ({item}) => {
    const formatDate = dateString => {
      return format(parseISO(dateString), "MMM d yyyy, hh:mm a");
    };

    const isExpired = !item.checkInTime && !item.isCancelled;
    let dateTimeDisplay, statusDisplay;
    if (item.isCancelled) {
      dateTimeDisplay = `Booked: ${formatDate(item.bookedTime)}`; // Assuming `updatedAt` is when the cancellation happened
      statusDisplay = <Text style={{color: "red"}}>Cancelled Booking</Text>;
    } else if (isExpired) {
      dateTimeDisplay = `Booked: ${formatDate(
        item.bookedTime
      )}\nExpired: ${formatDate(item.bookingExpirationTime)}`;
      statusDisplay = <Text style={{color: "red"}}>Expired Booking</Text>;
    } else {
      dateTimeDisplay = `Check-in: ${formatDate(
        item.checkInTime
      )}\nCheck-out: ${formatDate(item.checkOutTime)}`;
    }

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: item.isCancelled
              ? // ? "#ffbaba"
                "#a7c7e7"
              : item.checkInTime != null
              ? "white"
              : "#f1f2f3",
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.parkAreaId.parkAreaName}</Text>
          <Text
            style={styles.subTitle}
          >{`${item.parkAreaId.address}, ${item.parkAreaId.city}, ${item.parkAreaId.state}`}</Text>
          <Text style={styles.subTitle}>{dateTimeDisplay}</Text>
          {statusDisplay}
        </View>
        <View style={styles.cardContent}>
          <Icon
            name={item.vehicleId.type === "motorcycle" ? "motorcycle" : "car"}
            size={20}
            style={styles.icon}
            color="#333"
          />
          <View style={styles.vehicleDetails}>
            <Text style={styles.details}>{item.vehicleId.vehicleNumber}</Text>
            <Text
              style={styles.detailsSmall}
            >{`${item.vehicleId.make} ${item.vehicleId.model}`}</Text>
          </View>
          <Text style={styles.amount}>₹{item.amountTransferred}</Text>
          {!item.reviewAdded &&
            item.checkInTime != null &&
            !item.isCancelled && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => addReview(item._id)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Add Review</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalVisible(false);
    setSelectedBookingId(null);
  };

  const handleReviewSubmit = async (parkAreaId, rating, review) => {
    await submitReview(parkAreaId, rating, review);
    handleCloseReviewModal();
  };

  return (
    <View style={styles.container}>
      {
        <ReviewModal
          visible={isReviewModalVisible}
          onClose={handleCloseReviewModal}
          parkAreaId={selectedBookingId}
          onSubmit={handleReviewSubmit}
        />
      }

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
        ListEmptyComponent={
          <View
            style={{flex: 1, justifyContent: "center", alignItems: "center"}}
          >
            <Text style={{fontSize: 17, color: "#666"}}>
              You have no past bookings
            </Text>
          </View>
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
    color: "#333",
  },
  detailsSmall: {
    fontSize: 12,
    color: "#666",
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
