import React, {useState, useEffect, useRef} from "react";
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
  Animated,
  Easing,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useParkingDetails} from "../../context/ParkingContext";
import backendUrls from "../../connections/backendUrls";
const {parkAreaDetailsForBookingURL} = backendUrls;
import axios from "axios";
import useLoadingWithinComponent from "../../customHooks/useLoadingWithinComponent";
import LoadingModal from "../../components/LoadingModal";
import {useAuth} from "../../context/AuthContext";
import TransactionAnimation from "../../components/TransactionAnimation";
import VehicleDetails from "../../components/BookingScreenComponents/VehicleDetails";
import ParkAreaBookingDetailsCard from "../../components/BookingScreenComponents/ParkAreaBookingDetailsCard";
import UserReviews from "../../components/BookingScreenComponents/UserReviews";

const BookingScreen = ({navigation, route}) => {
  const {user, setUser} = useAuth();
  const {parkAreaId} = route.params;
  const {bookingDetails, bookParkSpace} = useParkingDetails();
  const [parkAreaDetails, setParkAreaDetails] = useState(null);
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const [transactionVisible, setTransactionVisible] = useState(false);

  const coolOffTime = 15; // In minutes
  const [animation] = useState(
    new Animated.Value(Dimensions.get("window").height)
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationOpacity] = useState(new Animated.Value(0));
  const [message, setMessage] = useState("");

  useEffect(() => {
    let toValue = 0;
    let opacityToValue = 1;

    if (showConfirmation) {
      toValue = 0;
      opacityToValue = 1; // Fade in
    } else {
      toValue = Dimensions.get("window").height;
      opacityToValue = 0; // Fade out
    }

    Animated.parallel([
      Animated.timing(animation, {
        toValue: toValue,
        duration: 400,
        easing: showConfirmation
          ? Easing.out(Easing.cubic)
          : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(confirmationOpacity, {
        toValue: opacityToValue,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showConfirmation, animation, confirmationOpacity]);

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
    console.log(bookingDetails);
    fetchParkAreaDetailsForBooking();
  }, []);

  const handleBookNowPress = () => {
    setShowConfirmation(true);
  };

  const handleCancelPress = () => {
    setShowConfirmation(false);
  };

  const handleConfirmBooking = async () => {
    try {
      setMessage("Confirming your booking...");
      setTransactionVisible(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage("Initiating Payment from Wallet...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await bookParkSpace(900000);
      if (response.success) {
        setUser(response.user);
        Alert.alert("Booking Confirmed", "Your booking has been confirmed.");
        navigation.navigate("Home");
        navigation.navigate("Activity");
      } else {
        Alert.alert("Error", response.error);
        navigation.navigate("Home");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionVisible(false);
    }
  };

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
            <ParkAreaBookingDetailsCard parkAreaDetails={parkAreaDetails} />
            <VehicleDetails vehicle={bookingDetails.vehicle} />
            <UserReviews reviews={parkAreaDetails.reviews} />
          </ScrollView>
          {showConfirmation ? (
            transactionVisible ? (
              <View
                style={[
                  styles.confirmationContainer,
                  styles.transactionAnimationContainer,
                ]}
              >
                <TransactionAnimation message={message} />
              </View>
            ) : (
              <Animated.View
                style={[
                  styles.confirmationContainer,
                  {
                    transform: [{translateY: animation}],
                    opacity: confirmationOpacity,
                  },
                ]}
              >
                <Text style={styles.confirmationTitle}>
                  Confirm Your Booking
                </Text>
                <Text style={styles.confirmationDetails}>
                  Park Space Name: {bookingDetails.parkArea.parkAreaName}
                </Text>
                <Text style={styles.confirmationDetails}>
                  Parking Fee per Hour: {"\u20B9"}{" "}
                  {bookingDetails.parkArea.ratePerHour}
                </Text>
                <Text style={styles.confirmationPrompt}>
                  • Your booking will be valid for {coolOffTime} minutes. Please
                  reach on time to avoid cancellation.
                </Text>
                <Text style={styles.confirmationPrompt}>
                  • Please confirm to proceed with booking. {"\u20B9"}
                  {bookingDetails.parkArea.ratePerHour} will be pre-deducted
                  from your wallet.
                </Text>
                <View style={styles.buttonRow}>
                  <Pressable
                    style={[styles.button, styles.confirmButton]}
                    onPress={handleConfirmBooking}
                  >
                    <Text style={styles.buttonText}>Confirm Booking</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancelPress}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                </View>
              </Animated.View>
            )
          ) : (
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={handleBookNowPress}>
                <Text style={styles.buttonText}>Book Now</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  transactionAnimationContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  confirmationContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: "#dddddd",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -2, // Shadow to the top
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10, // For Android elevation
    // marginTop: 20, // Ensure it visually "pops" over other content
  },
  // Add to your StyleSheet object
  confirmationTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    alignSelf: "center",
    marginBottom: 10,
  },
  confirmationDetails: {
    fontSize: 16,
    color: "#333333", // Darker text for better readability
    marginBottom: 10, // Space between details
  },
  confirmationPrompt: {
    fontSize: 14,
    marginBottom: 10,
    color: "#aa5353",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    flex: 1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default BookingScreen;