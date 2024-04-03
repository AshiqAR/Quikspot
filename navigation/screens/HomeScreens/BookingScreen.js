import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useParkingDetails} from "../../context/ParkingContext";
import backendUrls from "../../connections/backendUrls";
const {parkAreaDetailsForBookingURL} = backendUrls;
import axios from "axios";
import useLoadingWithinComponent from "../../customHooks/useLoadingWithinComponent";
import LoadingModal from "../../components/LoadingModal";

const getFormattedAverageRating = (totalRating, totalNumberOfRatings) => {
  if (!totalRating || !totalNumberOfRatings || totalNumberOfRatings === 0) {
    return "Rating not available";
  }
  const averageRating = totalRating / totalNumberOfRatings;
  return `${Math.round(averageRating * 100) / 100} (${totalNumberOfRatings})`;
};

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_MARGIN = 15;

const BookingScreen = ({navigation, route}) => {
  const {parkAreaId} = route.params;
  const {bookingDetails} = useParkingDetails();
  const [modalVisible, setModalVisible] = useState(false);
  const [parkAreaDetails, setParkAreaDetails] = useState(null);
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();

  const fetchParkAreaDetailsForBooking = async () => {
    startLoading();
    try {
      const response = await axios.post(parkAreaDetailsForBookingURL, {
        parkAreaId,
      });
      if (response.data.success) {
        setParkAreaDetails(response.data.parkAreaDetails);
        stopLoading();
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while fetching park area details. Please try again later."
      );
      stopLoading();
    }
    stopLoading();
  };

  useEffect(() => {
    fetchParkAreaDetailsForBooking();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0.5)");
    } else {
      StatusBar.setBackgroundColor("#FFF");
    }
  }, [modalVisible]);

  const handleBookNowPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderFeatures = ({item}) => (
    <View style={styles.facilityContainer}>
      <Icon name="check" size={16} color="#4CAF50" />
      <Text style={styles.facilityText}>{item}</Text>
    </View>
  );

  const renderReview = ({item}) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewText}>{item.review}</Text>
      <Text style={styles.reviewerName}>- {item.userName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && (
        <LoadingModal
          isLoading={isLoading}
          message="Fetching the booking details..."
          activityIndicatorColor="#4CAF50"
        />
      )}
      {parkAreaDetails && (
        <View style={{flex: 1, justifyContent: "space-between"}}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.detailCard}>
              <Text style={styles.parkAreaName}>
                {parkAreaDetails.parkAreaName}
              </Text>
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
            <View style={styles.detailCard}>
              <Text style={styles.parkAreaName}>Vehicle Details</Text>
              <Text>
                Vehicle Number: {bookingDetails.vehicle.vehicleNumber}
              </Text>
              <Text>
                Make and Model: {bookingDetails.vehicle.make}{" "}
                {bookingDetails.vehicle.model}
              </Text>
              <Text>Vehicle Type: {bookingDetails.vehicle.type}</Text>
            </View>
            <Text style={styles.userReviewsTitle}>User Reviews</Text>
            <FlatList
              data={parkAreaDetails.reviews}
              renderItem={renderReview}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
              decelerationRate="fast"
              contentContainerStyle={styles.reviewsContainer}
              ListEmptyComponent={
                <Text style={{marginLeft: 15, color: "#666"}}>
                  No reviews available
                </Text>
              }
            />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleBookNowPress}>
              <Text style={styles.buttonText}>Book Now</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                <Icon name="close" size={24} color="#000" />
              </Pressable>
              <Text style={styles.modalTitle}>Booking Information</Text>
              <Text style={styles.modalText}>• Valid for 30 minutes.</Text>
              <Text style={styles.modalText}>
                • Reach on time to avoid cancellation.
              </Text>
              <Text style={styles.modalText}>
                • An hour's parking fee will be pre-deducted.
              </Text>

              <View style={styles.buttonRow}>
                {/* Confirm Booking Button */}
                <Pressable
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleBookNowPress}
                >
                  <Text style={styles.modalButtonText}>Confirm Booking</Text>
                </Pressable>

                {/* Cancel Button */}
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  parkAreaName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  detailCard: {
    marginHorizontal: 15,
    marginTop: 15,
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
  facilitiesContainer: {},
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
  rateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  userReviewsTitle: {
    fontSize: 18,
    marginVertical: 15,
    color: "#333",
    fontWeight: "bold",
    marginLeft: 15,
  },
  reviewsContainer: {
    paddingLeft: 15,
    marginBottom: 20,
  },
  reviewCard: {
    width: CARD_WIDTH,
    backgroundColor: "#F0F0F0",
    padding: 15,
    marginRight: CARD_MARGIN,
    borderRadius: 8,
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
  buttonContainer: {
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    elevation: 2,
    minWidth: 100,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BookingScreen;
