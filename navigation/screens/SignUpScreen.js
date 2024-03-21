import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Alert } from 'react-native';
import { BACKEND_URL } from "@env";
import CustomHeader from '../components/CustomHeader'; // Adjust the import path according to your project structure
import Icon from 'react-native-vector-icons/Ionicons';

const LabelInput = ({ label, ...props }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input} {...props} />
    </View>
);

export default function SignUpScreen({ navigation }) {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        confirmPassword: "",
        phonenumber: "",
        address: "",
        email: "",
        pincode: "",
    });

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const signUp = () => {
        if (formData.name === "" || formData.password === "" || formData.phonenumber === "" || formData.email === "" || formData.confirmPassword === "") {
            Alert.alert("Required Fields are empty", "Please fill all the required * fields");
        }
        else if (formData.password !== formData.confirmPassword) {
            Alert.alert("Password Mismatch", "Please enter the same password in both fields");
        }
        else {
            const requestData = {
                name: formData.name,
                email: formData.email,
                phonenumber: formData.phonenumber,
                address: formData.address,
                pincode: formData.pincode,
                password: formData.password,
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
                    onChangeText={(value) => handleInputChange('name', value)}
                />
                <LabelInput
                    label="Phone Number*"
                    value={formData.phonenumber}
                    onChangeText={(value) => handleInputChange('phonenumber', value)}
                    keyboardType="phone-pad"
                />
                <LabelInput
                    label="Email Address*"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                />
                <LabelInput
                    label="Password*"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={true}
                />
                <LabelInput
                    label="Confirm Password*"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={true}
                />
                <LabelInput
                    label="Address"
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                />
                <LabelInput
                    label="Pincode"
                    value={formData.pincode}
                    onChangeText={(value) => handleInputChange('pincode', value)}
                    keyboardType="numeric"
                />
            </ScrollView>

            <View style={styles.nextButtonContainer}>
                <Pressable
                    style={styles.nextButton}
                    onPress={signUp}
                    android_ripple={{ color: 'gray', borderless: false }}
                >
                    <Text style={styles.nextButtonText}>Sign Up</Text>
                    <Icon name='arrow-forward-circle-outline' size={30} color={'white'} />
                </Pressable>
            </View>
        </View>
    );
}

// Re-use the styles from your provided code
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
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
        backgroundColor: '#f9f9f9',
        borderColor: 'gray',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    nextButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    nextButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        height: 50,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 30,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
});
