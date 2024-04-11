import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {format, parseISO} from "date-fns";

const ActiveBookingCard = ({item, onCancelBooking, onNavigateToParkArea}) => {
  const formatDate = dateString => {
    return format(parseISO(dateString), "MMM d yyyy, hh:mm:ss a");
  };

  const expirationOrCheckIn =
    item.checkInTime !== null ? (
      <Text style={styles.expirationText}>
        Check-in: {formatDate(item.checkInTime)}
      </Text>
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
      <Text style={styles.amount}>Amount Paid: ₹{item.amountTransferred}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() =>
            onNavigateToParkArea(
              item.parkAreaId.location.latitude,
              item.parkAreaId.location.longitude
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.navigateButtonText}>Navigate to Park Area</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelButton, {display: item.checkInTime && "none"}]}
          onPress={() => {
            onCancelBooking(item);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.navigateButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  navigateButton: {
    backgroundColor: "#4CAF50", // Green
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 2, // Takes twice the space of the cancel button
    marginRight: 5, // Add margin to separate buttons
  },
  cancelButton: {
    backgroundColor: "#D32F2F", // Red
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // Takes half the space of the navigate button
    marginLeft: 5, // Add margin to separate buttons
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

export default ActiveBookingCard;
