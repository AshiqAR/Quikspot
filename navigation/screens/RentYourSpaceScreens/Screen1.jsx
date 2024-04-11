import React, {useState} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useRentASpaceContext} from "../../context/RentASpaceContext";
import {useFocusEffect} from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";

export default function Screen1({navigation}) {
  const {parkAreaDetails, updateParkAreaDetails} = useRentASpaceContext();
  const [isModified, setIsModified] = useState(false);

  const handleBackPress = () => {
    if (!isModified) {
      navigation.goBack();
    } else {
      Alert.alert(
        "Confirm",
        "If you go back, entered data will get discarded.",
        [
          {
            text: "Discard",
            onPress: () => {
              updateParkAreaDetails.resetUserDetails();
              navigation.goBack();
            },
            style: "destructive",
          },
          {
            text: "Continue",
            style: "cancel",
          },
        ],
        {cancelable: false}
      );
      return true;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
      return () => backHandler.remove();
    }, [handleBackPress])
  );

  const handleNextPress = () => {
    if (
      !parkAreaDetails.name ||
      !parkAreaDetails.phoneNumber ||
      !parkAreaDetails.email ||
      !parkAreaDetails.address ||
      !parkAreaDetails.city ||
      !parkAreaDetails.district ||
      !parkAreaDetails.state ||
      !parkAreaDetails.pincode ||
      !parkAreaDetails.parkSpaceName
    ) {
      Alert.alert(
        "Required Fields are Empty",
        "Please fill in all required fields."
      );
      return;
    }
    if (parkAreaDetails.pincode.length !== 6) {
      Alert.alert("Invalid Pincode", "Please enter a valid pincode.");
      return;
    }
    // check the email using regular expression
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parkAreaDetails.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    navigation.navigate("Screen2");
  };

  const handleInputChange = (name, value) => {
    setIsModified(true);
    updateParkAreaDetails.updateDetails(name, value);
  };

  return (
    <View style={styles.container}>
      <View>
        <CustomHeader
          navigation={navigation}
          title="Rent your Park Space"
          onBackPress={handleBackPress}
        />
      </View>
      <ScrollView style={styles.scrollSection}>
        <LabelInput
          label="Name*"
          value={parkAreaDetails.name}
          onChangeText={value => handleInputChange("name", value)}
        />
        <LabelInput
          label="Phone Number*"
          value={parkAreaDetails.phoneNumber}
          onChangeText={value => handleInputChange("phoneNumber", value)}
          keyboardType="phone-pad"
          editable={false}
        />
        <LabelInput
          label="Alternate Phone Number"
          value={parkAreaDetails.alternatePhoneNumber}
          onChangeText={value =>
            handleInputChange("alternatePhoneNumber", value)
          }
          keyboardType="phone-pad"
        />
        <LabelInput
          label="Email Address*"
          value={parkAreaDetails.email}
          onChangeText={value => handleInputChange("email", value)}
          keyboardType="email-address"
        />
        <LabelInput
          label="Park Space Name*"
          value={parkAreaDetails.parkSpaceName}
          onChangeText={value => handleInputChange("parkSpaceName", value)}
        />
        <LabelInput
          label="Address*"
          value={parkAreaDetails.address}
          onChangeText={value => handleInputChange("address", value)}
        />
        <LabelInput
          label="Street"
          value={parkAreaDetails.street}
          onChangeText={value => handleInputChange("street", value)}
        />
        <LabelInput
          label="City*"
          value={parkAreaDetails.city}
          onChangeText={value => handleInputChange("city", value)}
        />
        <LabelInput
          label="District*"
          value={parkAreaDetails.district}
          onChangeText={value => handleInputChange("district", value)}
        />
        <LabelInput
          label="State*"
          value={parkAreaDetails.state}
          onChangeText={value => handleInputChange("state", value)}
        />
        <LabelInput
          label="Pincode*"
          value={parkAreaDetails.pincode}
          onChangeText={value => handleInputChange("pincode", value)}
          keyboardType="numeric"
        />
      </ScrollView>

      <View style={styles.nextButtonContainer}>
        <Pressable
          style={styles.nextButton}
          onPress={handleNextPress}
          android_ripple={{color: "gray", borderless: false}}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon name="arrow-forward-circle-outline" size={30} color={"white"} />
        </Pressable>
      </View>
    </View>
  );
}

const LabelInput = ({label, ...props}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

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
