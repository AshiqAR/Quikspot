import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useParkingDetails} from "../../context/ParkingContext";
import backendUrls from "../../connections/backendUrls";
const {parkAreaDetailsForBookingURL} = backendUrls;
import axios from "axios";

// Sample user reviews data
const userReviews = [
  {username: "Alex", review: "Great location and affordable prices!"},
  {username: "Jordan", review: "Easy to access and plenty of spaces."},
  {username: "Sam", review: "Secure and well-maintained area."},
];

const BookingScreen = ({navigation, route}) => {
  const {parkAreaId} = route.params;
  const {bookingDetails} = useParkingDetails();
  const [modalVisible, setModalVisible] = useState(false);
  const {vehicle, parkArea} = bookingDetails;
  const [transactionScreen, setTransactionScreen] = useState(false);
  const [parkAreaDetails, setParkAreaDetails] = useState(null);

  const fetchParkAreaDetailsForBooking = async () => {
    try {
      const response = await axios.post(parkAreaDetailsForBookingURL, {
        parkAreaId,
      });
      if (response.data.success) {
        console.log(response.data.parkAreaDetails);
        setParkAreaDetails(response.data.parkAreaDetails);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while fetching park area details. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchParkAreaDetailsForBooking();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      StatusBar.setBackgroundColor("rgba(0, 0, 0, 0.5)");
    } else {
      StatusBar.setBackgroundColor("white");
    }
  }, [modalVisible]);

  const handleBookNowPress = () => {
    setModalVisible(true);
    setTransactionScreen(false);
  };

  const handleGotItPress = () => {
    setTransactionScreen(true);

    // Set a timeout to navigate after 2 seconds
    setTimeout(() => {
      // Ensure to close the modal before navigating
      setModalVisible(false);

      // Navigate to the Activity Screen
      navigation.navigate("Activity");

      // Optionally, reset the transaction screen state if you're going to come back to this screen
      setTransactionScreen(false);
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTransactionScreen(false); // Reset the modal state for future bookings
  };

  const renderFeatures = features => {
    return features.map((feature, index) => (
      <View key={index} style={styles.featureContainer}>
        <Icon
          name="check"
          size={20}
          color="#4CAF50"
          style={styles.featureIcon}
        />
        <Text style={styles.featureText}>{feature}</Text>
      </View>
    ));
  };

  const renderReviews = reviews => {
    return reviews.map((review, index) => (
      <View key={index} style={styles.review}>
        <Text style={styles.username}>{review.userName}</Text>
        <Text style={styles.userReview}>{review.review}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {parkAreaDetails && (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>{parkAreaDetails.parkAreaName}</Text>

          <Text style={styles.subtitle}>
            {parkAreaDetails.address}, {parkAreaDetails.city},{" "}
            {parkAreaDetails.state}, {parkAreaDetails.pincode}
          </Text>

          <Text style={styles.pricePerHour}>
            ₹{parkArea.ratePerHour} / hour
          </Text>

          <View style={styles.ratingContainer}>
            <Icon name="star" size={24} color="#FFD700" />
            <Text style={styles.ratingText}>
              {parkArea.average_rating} ({parkArea.total_reviews} Reviews)
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Your Booking Details</Text>
          <View style={styles.bookingDetailsContainer}>
            <Text style={styles.bookingDetailText}>
              Vehicle: {vehicle.model} ({vehicle.vehicleNumber})
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Facilities Available</Text>
          <View style={styles.featuresWrapper}>
            {renderFeatures(parkAreaDetails.facilitiesAvailable)}
          </View>

          <Text style={styles.sectionTitle}>User Reviews</Text>
          {renderReviews(parkAreaDetails.reviews)}
        </ScrollView>
      )}
      {!modalVisible && !transactionScreen && (
        <Pressable style={styles.button} onPress={handleBookNowPress}>
          <Text style={styles.buttonText}>Book Now</Text>
        </Pressable>
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
              <Pressable style={styles.closeIcon} onPress={handleCloseModal}>
                <Icon name="close" size={24} color="black" />
              </Pressable>

              {!transactionScreen ? (
                <>
                  <Text style={styles.modalHeaderText}>
                    Booking Information
                  </Text>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                      • Valid for 30 minutes.
                    </Text>
                    <Text style={styles.modalText}>
                      • Reach on time to avoid cancellation.
                    </Text>
                    <Text style={styles.modalText}>
                      • An hour's parking fee will be pre-deducted.
                    </Text>
                  </View>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={handleGotItPress}
                  >
                    <Text style={styles.textStyle}>Got it!</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.modalHeaderText}>
                    Transaction Successful
                  </Text>
                  <Text style={styles.modalBodyText}>
                    ₹{parkArea.price_per_hr} has been deducted from your wallet
                    for the booking.
                  </Text>
                  {/* <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.textStyle}>Ok</Text>
                  </Pressable> */}
                </>
              )}
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
    padding: 20,
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#606060",
    marginBottom: 10,
  },
  pricePerHour: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  bookingDetailsContainer: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#f2f2f2", // Light grey background for the booking details section
    borderRadius: 5,
  },
  bookingDetailText: {
    fontSize: 16,
    marginBottom: 5, // Add space between details
  },
  featuresWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
  },
  review: {
    marginBottom: 20,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userReview: {
    fontSize: 16,
    color: "#606060",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  buttonClose: {
    backgroundColor: "#007bff",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBodyText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 5,
    width: "80%", // Consider setting a max width for better layout on tablets
  },
  modalHeaderText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    marginBottom: 15,
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default BookingScreen;
