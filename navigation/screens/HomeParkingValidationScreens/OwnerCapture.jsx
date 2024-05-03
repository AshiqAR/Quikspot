import React, {useState, useRef} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import {RNCamera} from "react-native-camera";
import {uploadImage} from "../../utilities/imageUpload";
import OtpValidator from "../../components/OtpValidator";
import {validateOTPInRDB, resetOTPInRDB} from "../../utilities/OTPcontrollers";
import useLoadingWithinComponent from "../../customHooks/useLoadingWithinComponent";
import LoadingModal from "../../components/LoadingModal";
import backendUrls from "../../connections/backendUrls";
import axios from "axios";
const {checkInVehicleURL} = backendUrls;

export default function OwnerCapture({navigation, route}) {
  const booking = route.params.booking;
  const space = route.params.space;
  const [image, setImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const cameraRef = useRef(null);
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();

  const takePicture = async () => {
    if (cameraRef.current && !image) {
      const options = {quality: 0.5, base64: false};
      try {
        const data = await cameraRef.current.takePictureAsync(options);
        setImage(data.uri);
        setIsCameraActive(false); // Optionally close camera after capture
      } catch (error) {
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  const toggleCamera = () => {
    setImage(null);
    setIsCameraActive(!isCameraActive);
  };

  const handleRecapture = () => {
    setImage(null);
    setIsCameraActive(true);
  };

  const handleCheckInPress = async () => {
    try {
      if (!otpVerified) {
        Alert.alert("OTP Validation Error", "Please verify the OTP first.");
        return;
      }
      if (!image) {
        Alert.alert("Error", "Please capture the image of the vehicle.");
        return;
      }
      startLoading();
      // Perform check-in operation

      await uploadImage(
        image,
        booking.parkAreaId,
        booking.vehicleId.vehicleNumber
      );
      const response = await axios.post(checkInVehicleURL, {
        vehicleNumber: booking.vehicleId.vehicleNumber,
        parkAreaId: booking.parkAreaId,
      });
      if (!response.data.success) {
        throw new Error("Failed to check in vehicle.");
      }
      await resetOTPInRDB(booking._id, booking.parkAreaId);
      stopLoading();
      navigation.navigate("ParkSpaceDetails", {space});
      Alert.alert("Success", "Vehicle checked in successfully.");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Failed to check in vehicle. Please try again later."
      );
    }
  };

  const verifyOtp = async otp => {
    console.log(booking._id, booking.parkAreaId, otp);
    const isOtpValid = await validateOTPInRDB(
      booking._id,
      booking.parkAreaId,
      otp
    );
    if (!isOtpValid) {
      Alert.alert("OTP Validation Error", "Invalid OTP. Please try again.");
      return;
    }
    Alert.alert("Success", "OTP verified successfully.");
    setOtpVerified(true);
  };

  return (
    <View style={{flex: 1}}>
      {isLoading && <LoadingModal visible={isLoading} />}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.vehicleDetailsContainer}>
          <Text style={styles.heading}>Vehicle Details</Text>
          <Text style={styles.detailsText}>
            {booking.vehicleId.vehicleNumber}, {booking.vehicleId.make},{" "}
            {booking.vehicleId.model}
          </Text>
          <Text style={styles.detailsText}>
            Vehicle Type: {booking.vehicleId.type}
          </Text>
        </View>
        {otpVerified ? (
          <View style={styles.captureComponent}>
            <Text style={styles.heading}>Capture the image of the vehicle</Text>
            <View style={styles.mediaContainer}>
              {isCameraActive && (
                <RNCamera
                  ref={cameraRef}
                  style={styles.preview}
                  type={RNCamera.Constants.Type.back}
                  flashMode={RNCamera.Constants.FlashMode.off}
                  androidCameraPermissionOptions={{
                    title: "Permission to use camera",
                    message: "We need your permission to use your camera",
                    buttonPositive: "Ok",
                    buttonNegative: "Cancel",
                  }}
                  captureAudio={false}
                />
              )}
              {image && <Image source={{uri: image}} style={styles.preview} />}
            </View>
            <View style={styles.buttonContainer}>
              {!isCameraActive && !image && (
                <TouchableOpacity
                  style={styles.activateButton}
                  onPress={toggleCamera}
                >
                  <Text style={styles.buttonText}>Activate Camera</Text>
                </TouchableOpacity>
              )}
              {isCameraActive && (
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <Text style={styles.buttonText}>Capture</Text>
                </TouchableOpacity>
              )}
              {image && (
                <TouchableOpacity
                  style={styles.recaptureButton}
                  onPress={handleRecapture}
                >
                  <Text style={styles.buttonText}>Recapture</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.vehicleDetailsContainer}>
            <OtpValidator verifyOtp={verifyOtp} />
          </View>
        )}
      </ScrollView>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 70,
          marginVertical: 10,
        }}
      >
        <View style={{borderRadius: 10, overflow: "hidden"}}>
          <Pressable
            style={{
              backgroundColor: "#4CAF50",
              borderRadius: 10,
              height: 50,
              width: 400,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 30,
            }}
            android_ripple={{color: "green", borderless: false}}
            onPress={handleCheckInPress}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Check In Vehicle
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
  },
  vehicleDetailsContainer: {
    marginBottom: 20,
    backgroundColor: "#ededed",
    padding: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  captureComponent: {
    backgroundColor: "#ededed",
    padding: 20,
    borderRadius: 10,
  },
  mediaContainer: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "center",
  },
  preview: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  recaptureButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 8,
  },
  captureButton: {
    padding: 10,
    backgroundColor: "dodgerblue",
    borderRadius: 8,
  },
  activateButton: {
    padding: 10,
    backgroundColor: "green",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
