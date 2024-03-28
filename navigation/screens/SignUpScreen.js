import React, {useState} from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {BACKEND_URL} from "@env";
import CustomHeader from "../components/CustomHeader";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";

const LabelInput = ({label, ...props}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

export default function SignUpScreen({navigation}) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    address: "",
    email: "",
    pincode: "",
    city: "",
    state: "",
  });
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();

  const handleInputChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const signUp = async () => {
    startLoading();
    if (
      !formData.name ||
      !formData.password ||
      !formData.phonenumber ||
      !formData.email ||
      !formData.confirmPassword ||
      !formData.city ||
      !formData.state
    ) {
      Alert.alert(
        "Required Fields are empty",
        "Please fill all the required * fields"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Please enter the same password in both fields"
      );
      return;
    }

    const requestData = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phonenumber,
      address: formData.address,
      pincode: formData.pincode,
      password: formData.password,
      city: formData.city,
      state: formData.state,
    };

    await axios
      .post(`${BACKEND_URL}/api/user/signup`, requestData)
      .then(response => {
        // Handle the success response
        const {data} = response;
        if (data.success) {
          Alert.alert("Success", "Account Created Successfully");
          navigation.navigate("SignIn");
          navigation.reset({
            index: 0,
            routes: [{name: "SignIn"}],
          });
        } else {
          Alert.alert(
            "Sign up Failed",
            data.message || data.error || "Unexpected error"
          );
        }
      })
      .catch(error => {
        if (error.response) {
          const {status, data} = error.response;
          switch (status) {
            case 422:
              Alert.alert(
                "Validation Failed",
                data.error || "Invalid input data"
              );
              break;
            case 400:
              Alert.alert(
                "Failed",
                data.message || "Mobile number already exists"
              );
              break;
            case 500:
              Alert.alert("Server Error", "An internal error occurred");
              break;
            default:
              Alert.alert("Error", "An unexpected error occurred");
          }
        } else if (error.request) {
          Alert.alert("Error", "No response from server");
        } else {
          Alert.alert("Error", error.message);
        }
      })
      .finally(() => {
        stopLoading();
      });
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        title="Sign Up"
        // Assuming CustomHeader supports an onBackPress prop
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollSection}>
        <LabelInput
          label="Name*"
          value={formData.name}
          onChangeText={value => handleInputChange("name", value)}
        />
        <LabelInput
          label="Phone Number*"
          value={formData.phonenumber}
          onChangeText={value => handleInputChange("phonenumber", value)}
          keyboardType="phone-pad"
        />
        <LabelInput
          label="Email Address*"
          value={formData.email}
          onChangeText={value => handleInputChange("email", value)}
          keyboardType="email-address"
        />
        <LabelInput
          label="Password*"
          value={formData.password}
          onChangeText={value => handleInputChange("password", value)}
          secureTextEntry={true}
        />
        <LabelInput
          label="Confirm Password*"
          value={formData.confirmPassword}
          onChangeText={value => handleInputChange("confirmPassword", value)}
          secureTextEntry={true}
        />
        <LabelInput
          label="Address*"
          value={formData.address}
          onChangeText={value => handleInputChange("address", value)}
        />
        <LabelInput
          label="Pincode*"
          value={formData.pincode}
          onChangeText={value => handleInputChange("pincode", value)}
          keyboardType="numeric"
        />
        <LabelInput
          label="City*"
          value={formData.city}
          onChangeText={value => handleInputChange("city", value)}
        />
        <LabelInput
          label="State*"
          value={formData.state}
          onChangeText={value => handleInputChange("state", value)}
        />
      </ScrollView>

      <View style={styles.nextButtonContainer}>
        <Pressable
          style={styles.nextButton}
          onPress={signUp}
          android_ripple={{color: "gray", borderless: false}}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>Sign Up</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Icon
              name="arrow-forward-circle-outline"
              size={30}
              color={"white"}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

// Re-use the styles from your provided code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  scrollSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 20,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderColor: "gray",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nextButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 50,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
  },
  nextButtonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
