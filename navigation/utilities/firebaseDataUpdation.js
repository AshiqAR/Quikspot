import database from "@react-native-firebase/database";

const updateActiveBookings = async (activeBooking, parkAreaId) => {
  console.log("activeBooking: for rdb", activeBooking);
  try {
    await database()
      .ref(`parkareas/activeBookings/${parkAreaId}/${activeBooking._id}`)
      .set({
        bookedTime: activeBooking.bookedTime,
        expirationTime: activeBooking.bookingExpirationTime,
      });
  } catch (error) {
    console.log("Error in updating active bookings: ", error);
  }
};

export {updateActiveBookings};
