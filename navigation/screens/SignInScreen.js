import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    Pressable,
    TextInput,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
} from "react-native";
import { BACKEND_URL } from '@env';
import { useAuth } from "../context/AuthContext";
import quikSpotLogo from "../../src/assets/images/quikspot.png";
import Icon from 'react-native-vector-icons/FontAwesome5';


export default function SignInScreen({ navigation, route }) {
    const { signIn } = useAuth();
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [mobileNumberIsFocused, setMobileNumberIsFocused] = useState(false);
    const [passwordIsFocused, setPasswordIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = () => {
        const requestData = {
            mobileNumber: mobileNumber,
            password: password,
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
                    Alert.alert("Sign in Failed", "Invalid Mobile Number or Password");
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
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, styles.passwordInput, passwordIsFocused && styles.inputFocused]}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Password"
                        secureTextEntry={!passwordVisible} // Toggle based on passwordVisible state
                        onFocus={() => setPasswordIsFocused(true)}
                        onBlur={() => setPasswordIsFocused(false)}
                    />
                    <Pressable onPress={togglePasswordVisibility} style={styles.viewPasswordIcon}>
                        <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color={passwordVisible ? 'gray' :'gray' } />
                    </Pressable>
                </View>
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
                <Pressable style={styles.signUpContainer} onPress={navigateToSignUp}>
                    <Text style={styles.signUpTextDialogue}>Don't have an account? </Text>
                    <Text style={styles.signUpText}> Sign Up</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    innerContainer: {
        width: "80%",
        marginBottom: 100,
    },
    logo: {
        marginBottom: 20,
        width: "50%",
        height: 100,
        alignSelf: 'center',
        resizeMode: "contain",
    },
    input: {
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#cccccc",
        fontSize: 18,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordInput: {
        flex: 1,
    },
    viewPasswordIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    inputFocused: {
        borderColor: "black",
    },
    button: {
        backgroundColor: "black",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 5,
        marginTop: 10,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signUpTextDialogue: {
        color: "gray",
        fontSize: 17,
        textAlign: "center",
        marginTop: 15,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 17,
    },
    signUpText: {
        // color: "#007bff",
        color: "darkgreen",
        fontWeight: "bold",
        fontSize: 17,
        textAlign: "center",
        marginTop: 15,
    },
});