import React, {useState} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

const OtpValidator = ({verifyOtp}) => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    // Your verification logic here
    verifyOtp(otp);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Booking OTP"
        maxLength={4}
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={handleVerify}
      >
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    width: "70%",
    height: 40,
  },
});

export default OtpValidator;
