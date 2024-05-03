import database from "@react-native-firebase/database";

const generateOTPInRDB = async (activeBookingId, parkAreaId) => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const path = `parkareas/activeBookings/${parkAreaId}/${activeBookingId}`;
  try {
    await database().ref(path).update({
      OTP,
    });
  } catch (error) {
    console.log("Error in generating OTP: ", error);
  }
};

const validateOTPInRDB = async (activeBookingId, parkAreaId, OTP) => {
  const path = `parkareas/activeBookings/${parkAreaId}/${activeBookingId}`;
  try {
    const snapshot = await database().ref(path).once("value");
    if (snapshot.val().OTP == OTP) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error in validating OTP: ", error);
    return false;
  }
};

const resetOTPInRDB = async (activeBookingId, parkAreaId) => {
  const path = `parkareas/activeBookings/${parkAreaId}/${activeBookingId}`;
  try {
    await database().ref(path).update({
      OTP: null,
    });
  } catch (error) {
    console.log("Error in resetting OTP: ", error);
  }
};

export {generateOTPInRDB, validateOTPInRDB, resetOTPInRDB};
