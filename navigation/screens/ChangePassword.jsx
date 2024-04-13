import React, {useState} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import {useAuth} from "../context/AuthContext";
import backendUrls from "../connections/backendUrls";
import axios from "axios";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";

const {changePasswordURL} = backendUrls;

export default function ChangePassword() {
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const {user} = useAuth();
  const [phoneNumber] = useState(user.phoneNumber.toString());
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const passwordsMatch =
    newPassword === confirmNewPassword && newPassword !== "";

  const handlePasswordChange = async () => {
    try {
      startLoading();
      await axios
        .post(changePasswordURL, {
          phoneNumber,
          oldPassword: currentPassword,
          newPassword: newPassword,
        })
        .then(response => {
          Alert.alert("Success", "Password changed successfully");
        })
        .catch(error => {
          if (error.response) {
            const {status, data} = error.response;
            if (status === 404) {
              Alert.alert("Error", "User not found");
            } else if (status === 401) {
              Alert.alert("Error", `${data.message}`);
            } else if (status === 500) {
              Alert.alert("Error", "Internal Server Error");
            } else {
              Alert.alert("Error", "Password Change is unsuccessful");
            }
          } else if (error.request) {
            console.log(error.request);
            Alert.alert("Error", "No response from server");
          } else {
            console.log("Error", error.message);
            Alert.alert("Error", "Error setting up password change request");
          }
        });
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Error setting up password change request");
    } finally {
      stopLoading();
    }
  };

  return (
    <View style={{flex: 1}}>
      {isLoading && (
        <Modal transparent={true} visible={isLoading}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#004F7C" />
          </View>
        </Modal>
      )}
      <View style={styles.container}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={phoneNumber} editable={false} />

        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />

        {!passwordsMatch &&
          newPassword.length > 0 &&
          confirmNewPassword.length > 0 && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
      </View>
      <Pressable
        style={({pressed}) => [
          styles.button,
          {backgroundColor: passwordsMatch ? "#004F7C" : "grey"},
        ]}
        onPress={handlePasswordChange}
        disabled={!passwordsMatch}
      >
        {isLoading ? (
          <Text style={styles.buttonText}>Changing Password...</Text>
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color: "#333",

    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 2,
  },
  button: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 20, // Ensure there's some space before the button
  },
});
