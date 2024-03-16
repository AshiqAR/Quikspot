import React, { useState } from "react";
import MyButton from '../components/MyButton';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
const quikSpotLogo = require("../assets/images/quikspot.png");
import { styles } from '../styles/loginStyles'
import { BACKEND_URL } from '@env';
import { useAuth } from "../context/AuthContext";
import useLoading from '../customHooks/useLoading';


const LoginScreen = ({ navigation, route }) => {
  const { signIn } = useAuth();
  const [mobileNumber, setmobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumberIsFocused, setmobileNumberIsFocused] = useState(false);
  const [passwordIsFocused, setPasswordIsFocused] = useState(false);

  const handleLogin = () => {
    const requestData = {
      mobileNumber: "9074873430",
      password: "ashiq",
    };

    fetch(`${BACKEND_URL}/signin`, {
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
        else {
          Alert.alert("Sign in Failed", "Invalid Mobile Number or password");
          return { success: "false" };
        }
      })
      .then((data) => {
        console.log(data);
        if (data.success == "true") {
          signIn(data.userDetails);
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Something went wrong. Please try again later");
      });
  };
  handleLogin();

  const navigateToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={quikSpotLogo}
            style={{ width: 150, height: 50, marginVertical: 30 }}
          />
          <TextInput
            style={[styles.input, mobileNumberIsFocused && styles.inputIsFocused]}
            mainColor="green"
            animatedplaceHolderTextColor="blue"
            placeholder="Mobile Number"
            onChangeText={(text) => setmobileNumber(text)}
            onFocus={() => setmobileNumberIsFocused(true)}
            onBlur={() => setmobileNumberIsFocused(false)}
            value={mobileNumber}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, passwordIsFocused && styles.inputIsFocused]}
            placeholder="Password"
            onFocus={() => setPasswordIsFocused(true)}
            onBlur={() => setPasswordIsFocused(false)}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          {/* <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => console.log("Forgot Password pressed")}>
              <Text>Forgot Password?</Text>
            </TouchableOpacity>
          </View> */}

          <View>

            <MyButton
              title="Sign In"
              onPress={() => handleLogin()}
              buttonStyle={styles.button}
            />
          </View>
        </View>
      </View>
      <View style={styles.signUpPart}>
        <Text>Don't have an account? </Text>
        <Pressable onPress={() => navigateToSignUp()}>
          <Text style={styles.signUp}>Sign Up</Text>
        </Pressable>
      </View>
    </>

  );
};

export default LoginScreen;
