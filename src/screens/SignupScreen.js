import React, { useState } from "react";
import MyButton from "../components/MyButton";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { styles } from '../styles/loginStyles'
import { BACKEND_URL } from "@env";
const quikSpotLogo = require("../assets/images/quikspot.png");

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [nameIsFocused, setNameIsFocused] = useState(false);
  const [passwordIsFocused, setPasswordIsFocused] = useState(false);
  const [phonenumberIsFocused, setPhoneNumberIsFocused] = useState(false);
  const [confirmPasswordIsFocused, setConfirmPasswordIsFocused] = useState(false);
  const [address, setAddress] = useState("");
  const [addressIsFocused, setAddressIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [emailIsFocused, setEmailIsFocused] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeIsFocused, setPincodeIsFocused] = useState(false);

  const signUp = () => {
    if (name === "" || password === "" || phonenumber === "" || email === "" || confirmPassword === "") {
      Alert.alert("Required Fields are empty", "Please fill all the required * fields");
    }
    else if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Please enter the same password in both fields");
    }
    else {
      const requestData = {
        name: name,
        email: email,
        phonenumber: phonenumber,
        address: address,
        pincode: pincode,
        password: password,
      };

      fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
          else if (response.status == 401) {
            Alert.alert("Mobile Number already registered");
          }
          else {
            Alert.alert("Sign up Failed", "Internal error");
          }
        })
        .then((data) => {
          if (data.success == "true") {
            Alert.alert("Success", "Account Created Successfully");
            navigation.navigate("Login");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        })
        .catch((error) => {
          Alert.alert("Error", "An error occurred while signing up.");
        });


    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Image
              source={quikSpotLogo}
              style={{ width: 150, height: 50, marginVertical: 30 }}
            />
            <TextInput
              placeholder="Name *"
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              onFocus={() => setNameIsFocused(true)}
              onBlur={() => setNameIsFocused(false)}
            />

            <TextInput
              style={[styles.input, emailIsFocused && styles.inputIsFocused]}
              placeholder="Email *"
              onChangeText={(text) => setEmail(text)}
              onFocus={() => setEmailIsFocused(true)}
              onBlur={() => setEmailIsFocused(false)}
              value={email}
            />
            <TextInput
              style={[styles.input, phonenumberIsFocused && styles.inputIsFocused]}
              placeholder="Mobile Number *"
              onChangeText={(text) => setPhoneNumber(text)}
              onFocus={() => setPhoneNumberIsFocused(true)}
              onBlur={() => setPhoneNumberIsFocused(false)}
              value={phonenumber}
            />
            <TextInput
              style={[styles.input, addressIsFocused && styles.inputIsFocused]}
              placeholder="Address"
              onChangeText={(text) => setAddress(text)}
              onFocus={() => setAddressIsFocused(true)}
              onBlur={() => setAddressIsFocused(false)}
              value={address}
            />
            <TextInput
              style={[styles.input, pincodeIsFocused && styles.inputIsFocused]}
              placeholder="Pincode"
              onChangeText={(text) => setPincode(text)}
              onFocus={() => setPincodeIsFocused(true)}
              onBlur={() => setPincodeIsFocused(false)}
              value={pincode}
            />
            <TextInput
              style={[styles.input, passwordIsFocused && styles.inputIsFocused]}
              placeholder="Password *"
              onFocus={() => setPasswordIsFocused(true)}
              onBlur={() => setPasswordIsFocused(false)}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <TextInput
              style={[styles.input, confirmPasswordIsFocused && styles.inputIsFocused]}
              placeholder="Confirm Password *"
              onFocus={() => setConfirmPasswordIsFocused(true)}
              onBlur={() => setConfirmPasswordIsFocused(false)}
              secureTextEntry={true}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
            />
            {/* <View style={styles.signUpPart}>
              <Text>Verify your phone number: </Text>
              <Pressable onPress={()=>console.log("Verify phone number")}>
              <Text style={styles.signUp}>Send OTP</Text>
              </Pressable>
            </View> */}

            <View>
              <MyButton
                title="Sign Up"
                onPress={() => signUp()}
                buttonStyle={styles.button}
              />
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
