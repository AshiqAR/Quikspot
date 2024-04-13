import React, {useState} from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import {useAuth} from "../context/AuthContext";
import quikSpotLogo from "../../src/assets/images/quikspot.png";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import backendUrls from "../connections/backendUrls";

export default function SignInScreen({navigation, route}) {
  const {signInURL} = backendUrls;
  const {signIn} = useAuth();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumberIsFocused, setMobileNumberIsFocused] = useState(false);
  const [passwordIsFocused, setPasswordIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    startLoading();
    const requestData = {
      phoneNumber: mobileNumber,
      password: password,
    };

    await axios
      .post(signInURL, requestData)
      .then(response => {
        console.log(response.data, "here");
        if (response.data.success) {
          signIn(response.data.user);
        } else {
          Alert.alert("Sign in Failed", "Invalid Mobile Number or Password");
        }
      })
      .catch(error => {
        if (error.response) {
          const {status, data} = error.response;
          console.log(data);
          console.log(status);
          switch (status) {
            case 401:
              Alert.alert(
                "Sign in Failed",
                "Invalid Mobile Number or Password"
              );
              break;
            case 404:
              Alert.alert("Not Registered", "Please sign up.");
              break;
            default:
              Alert.alert(
                "Error",
                "Something went wrong. Please try again later."
              );
              break;
          }
        } else {
          Alert.alert("Error", "An unexpected error occurred");
        }
      })
      .finally(() => {
        stopLoading();
      });
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Image
          source={quikSpotLogo} // Make sure you define quikSpotLogo
          style={styles.logo}
        />
        <TextInput
          style={[styles.input, mobileNumberIsFocused && styles.inputFocused]}
          onChangeText={setMobileNumber}
          value={mobileNumber}
          placeholder="Mobile Number"
          keyboardType="numeric"
          onFocus={() => setMobileNumberIsFocused(true)}
          onBlur={() => setMobileNumberIsFocused(false)}
          placeholderTextColor="#888888"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              passwordIsFocused && styles.inputFocused,
            ]}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={!passwordVisible} // Toggle based on passwordVisible state
            onFocus={() => setPasswordIsFocused(true)}
            onBlur={() => setPasswordIsFocused(false)}
            placeholderTextColor="#888888"
          />
          <Pressable
            onPress={togglePasswordVisibility}
            style={styles.viewPasswordIcon}
          >
            <Icon
              name={passwordVisible ? "eye" : "eye-slash"}
              size={20}
              color={passwordVisible ? "gray" : "gray"}
            />
          </Pressable>
        </View>
        <Pressable style={styles.button} onPress={handleLogin}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>
        <Pressable
          style={styles.signUpContainer}
          disabled={isLoading}
          onPress={navigateToSignUp}
        >
          <Text style={styles.signUpTextDialogue}>Don't have an account? </Text>
          <Text style={styles.signUpText}> Sign Up</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Neutral light gray background
  },
  innerContainer: {
    width: "80%",
    marginBottom: 100,
  },
  logo: {
    marginBottom: 20,
    width: "50%",
    height: 100,
    alignSelf: "center",
    resizeMode: "contain",
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#aaaaaa", // Lighter gray for border to blend in both themes
    fontSize: 18,
    backgroundColor: "#fdfdfd", // White background for inputs to stand out in both themes
    color: "black", // Black text for high contrast in light mode and acceptable in dark mode
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
  },
  viewPasswordIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  inputFocused: {
    borderColor: "#333333", // Darker border on focus to be visible in both themes
  },
  button: {
    backgroundColor: "black", // Dark gray button that works well in both light and dark modes
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
    marginTop: 10,
    height: 55,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpTextDialogue: {
    color: "#333333", // Dark gray text for dialogue, which is neutral
    fontSize: 17,
    textAlign: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white", // White text for contrast on the dark gray button
    fontSize: 17,
  },
  signUpText: {
    color: "#006600", // Deeper green for the link, providing good contrast in both modes
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    marginTop: 15,
  },
});
