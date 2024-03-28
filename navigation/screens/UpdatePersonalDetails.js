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
  KeyboardAvoidingView,
} from "react-native";
import {useAuth} from "../context/AuthContext";

export default function UpdatePersonalDetails() {
  const {user} = useAuth();
  const [userDetails, setUserDetails] = useState(user);

  const handleUpdateDetails = () => {
    console.log("Updated Details:", userDetails);
    Alert.alert("Updated", "Details Updated Successfully!");
  };

  return (
    <View style={{flex: 1}}>
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
        <Text style={styles.buttonText}>Update</Text>
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
    marginVertical: 5,
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
