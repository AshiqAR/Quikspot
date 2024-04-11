import React, {useState} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Keyboard,
  Modal,
  ActivityIndicator,
} from "react-native";
import {useAuth} from "../context/AuthContext";
import backendUrls from "../connections/backendUrls";
import axios from "axios";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";

export default function UpdatePersonalDetails() {
  const {user, setUser} = useAuth();
  const [userDetails, setUserDetails] = useState(user);
  const {updateDetailsURL} = backendUrls;
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();

  const handleUpdateDetails = async () => {
    startLoading();
    try {
      Keyboard.dismiss();
      const {name, phoneNumber, email, address, city, state, pincode} =
        userDetails;
      if (
        name === "" ||
        phoneNumber === "" ||
        email === "" ||
        address === "" ||
        city === "" ||
        state === "" ||
        pincode === ""
      ) {
        Alert.alert("Empty Fields Exist", "Fields cannot be empty.");
        return;
      }
      if (pincode.length !== 6) {
        Alert.alert("Invalid Pincode", "Pincode should be 6 digits long.");
        return;
      }

      const response = await axios.post(updateDetailsURL, {
        name,
        phoneNumber,
        email,
        address,
        city,
        state,
        pincode,
      });

      if (response.status === 200) {
        console.log("User details updated successfully!");
        setUser(response.data.user);
        Alert.alert("Success", "User details updated successfully!");
      } else {
        console.log("An unexpected response was received.");
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        const errorMessage =
          error.response.data.message || "An error occurred. Please try again.";
        Alert.alert("Error", errorMessage);
      } else if (error.request) {
        console.log(error.request);
        Alert.alert(
          "Error",
          "No response from the server. Please check your internet connection."
        );
      } else {
        console.log("Error", error.message);
        Alert.alert("Error", "An error occurred. Please try again.");
      }
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
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={userDetails.name}
          onChangeText={text => setUserDetails({...userDetails, name: text})}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          editable={false}
          value={userDetails.phoneNumber.toString()}
          keyboardType="phone-pad"
          onChangeText={text =>
            setUserDetails({...userDetails, phoneNumber: text})
          }
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          editable={false}
          style={styles.input}
          value={userDetails.email}
          keyboardType="email-address"
          onChangeText={text => setUserDetails({...userDetails, email: text})}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={userDetails.address}
          onChangeText={text => setUserDetails({...userDetails, address: text})}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={userDetails.city}
          onChangeText={text => setUserDetails({...userDetails, city: text})}
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          value={userDetails.state}
          onChangeText={text => setUserDetails({...userDetails, state: text})}
        />

        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          value={userDetails.pincode.toString()}
          keyboardType="number-pad"
          onChangeText={text => setUserDetails({...userDetails, pincode: text})}
        />
      </ScrollView>
      <Pressable
        style={({pressed}) => [
          styles.updateButton,
          {
            opacity: pressed ? 0.95 : 1,
          },
        ]}
        onPress={handleUpdateDetails}
      >
        {isLoading ? (
          <Text style={styles.buttonText}>Updating...</Text>
        ) : (
          <Text style={styles.buttonText}>Update</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 20,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",

    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 2,
  },
  updateButton: {
    backgroundColor: "#004F7C",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
