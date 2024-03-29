import React, {useState} from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import backendUrls from "../connections/backendUrls";
import axios from "axios";
const {addVehicleURL} = backendUrls;
import {useAuth} from "../context/AuthContext";

export default function AddNewVehicle({navigation}) {
  const {user, setUser} = useAuth();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("- select -");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const vehicleTypes = ["- select -", "car", "motorcycle"];

  const handleAddNewVehicle = async () => {
    if (vehicleNumber === "" || make === "" || model === "") {
      Alert.alert("Unfilled Fields", "Please fill all the fields");
      return;
    }
    if (selectedVehicleType === "- select -") {
      Alert.alert("Vehicle Type", "Please select a valid vehicle type");
      return;
    }
    startLoading();
    await axios
      .post(addVehicleURL, {
        vehicleNumber,
        type: selectedVehicleType,
        make,
        model,
        phoneNumber: user.phoneNumber,
      })
      .then(response => {
        console.log(response.data);
        Alert.alert("Vehicle Added", "Vehicle has been added successfully");
        setVehicleNumber("");
        setSelectedVehicleType("- select -");
        setMake("");
        setModel("");
        setUser(response.data.user);
        navigation.navigate("MyVehicles");
      })
      .catch(error => {
        console.log(error.response?.data || error);
        const errorMessage =
          error.response?.data.message ||
          "An error occurred. Please try again later.";
        Alert.alert("Error", errorMessage);
      })
      .finally(() => {
        stopLoading();
      });
  };

  const iconNames = {
    car: "car",
    motorcycle: "motorcycle",
    select: "refresh",
  };

  const Dropdown = ({items, selectedValue, onValueChange}) => {
    const [visible, setVisible] = useState(false);

    return (
      <View>
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
              <ActivityIndicator size="large" color="black" />
            </View>
          </Modal>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setVisible(!visible)}
          activeOpacity={0.8}
        >
          <Text style={{fontSize: 20, color: "black"}}>{selectedValue}</Text>
        </TouchableOpacity>
        {visible && (
          <View style={styles.dropdown}>
            <FlatList
              data={items}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onValueChange(item);
                    setVisible(false);
                  }}
                >
                  <Text style={{fontSize: 17, fontWeight: "bold"}}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.list}>
          <Text style={styles.label}>Vehicle Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChangeText={text => setVehicleNumber(text.toUpperCase())} // Converts to uppercase
          />
        </View>

        <View style={styles.list}>
          <Text style={styles.label}>Vehicle Type</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Dropdown
              items={vehicleTypes}
              selectedValue={selectedVehicleType}
              onValueChange={value => setSelectedVehicleType(value)}
            />
            {selectedVehicleType !== "- select -" && (
              <Icon
                name={iconNames[selectedVehicleType]}
                size={35}
                color="#000"
              />
            )}
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.label}>Make</Text>
          <TextInput
            style={styles.input}
            placeholder="Make"
            value={make}
            onChangeText={setMake}
          />
        </View>

        <View style={styles.list}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Model"
            value={model}
            onChangeText={setModel}
          />
        </View>
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          paddingBottom: 20,
        }}
      >
        <View style={{borderRadius: 10, overflow: "hidden"}}>
          <Pressable
            style={{
              backgroundColor: "black",
              borderRadius: 10,
              height: 50,
              width: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
            android_ripple={{color: "gray", borderless: false}}
            onPress={handleAddNewVehicle}
          >
            {isLoading ? (
              <Text style={{color: "white", fontSize: 20, textAlign: "center"}}>
                Adding Vehicle...
              </Text>
            ) : (
              <Text style={{color: "white", fontSize: 20, textAlign: "center"}}>
                Add Vehicle
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
  },
  button: {
    height: 45,
    backgroundColor: "#efefef",
    padding: 10,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    width: 300,
  },
  dropdown: {
    position: "absolute",
    elevation: 10,
    zIndex: 10,
    maxHeight: 200,
    backgroundColor: "white",
    borderRadius: 5,
    width: 200,
  },
  item: {
    padding: 10,
  },
});
