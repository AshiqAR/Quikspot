import React, {useState} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useParkingDetails} from "../../context/ParkingContext";

const vehicles = [
  {
    id: "1",
    vehicleNumber: "KL 21 R 4040",
    type: "Car",
    make: "Maruti Suzuki",
    model: "Swift",
  },
  {
    id: "2",
    vehicleNumber: "KL 01 A 1234",
    type: "Car",
    make: "Toyota",
    model: "Corolla",
  },
  {
    id: "3",
    vehicleNumber: "KL 01 A 1",
    type: "Motorcycle",
    make: "Honda",
    model: "CBR500R",
  },
];

export default function MyVehicles({navigation}) {
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const {
    locationSharingEnabled,
    getLocation,
    updateBookingDetails,
    bookingDetails,
  } = useParkingDetails();

  const toggleSelection = id => {
    setSelectedVehicleId(prevId => (prevId === id ? null : id));
  };

  const handleProceedForSearch = () => {
    if (!isProceedButtonDisabled) {
      const selectedVehicle = vehicles.find(
        vehicle => vehicle.id === selectedVehicleId
      );
      if (selectedVehicle) {
        updateBookingDetails({
          vehicle: {
            vehicleId: selectedVehicle.id,
            vehicleNumber: selectedVehicle.vehicleNumber,
            type: selectedVehicle.type,
            make: selectedVehicle.make,
            model: selectedVehicle.model,
          },
        });
        navigation.navigate("MapScreen");
      }
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedVehicleId === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => toggleSelection(item.id)}
      >
        <Icon
          name={item.type === "Car" ? "car" : "motorcycle"}
          size={25}
          color={item.type === "Car" ? "#4CAF50" : "#FFC107"}
          style={styles.icon}
        />
        <View style={styles.details}>
          <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
          <Text style={styles.info}>
            {item.make} {item.model}
          </Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const isProceedButtonDisabled = selectedVehicleId === null;

  return (
    <View style={{flex: 1}}>
      {!locationSharingEnabled && (
        <Pressable
          style={{
            backgroundColor: "lightyellow",
            height: 30,
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
          onPress={getLocation}
        >
          <Text style={{color: "black", fontWeight: 400}}>
            Location Sharing Disabled. Tap here to enable
          </Text>
          <Text style={{color: "orange", fontWeight: "bold"}}>Enable</Text>
        </Pressable>
      )}
      <FlatList
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.container}
        ListEmptyComponent={
          <Text style={styles.emptyList}>No vehicles added!</Text>
        }
      />
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
            style={[
              styles.proceedButton,
              isProceedButtonDisabled && styles.disabledButton,
            ]}
            android_ripple={{color: "gray", borderless: false}}
            onPress={handleProceedForSearch}
            disabled={isProceedButtonDisabled}
          >
            <Text style={{color: "white", fontSize: 20, textAlign: "center"}}>
              Proceed for Search
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  card: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: "#FeFeFe",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedCard: {
    // backgroundColor: '#E0E0E0',
    // backgroundColor: '#FFC107',
    backgroundColor: "tomato",
  },
  icon: {
    marginRight: 10,
    marginLeft: 5,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  type: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
    fontStyle: "italic",
  },
  proceedButton: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 50,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  emptyList: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 16,
  },
  selectedCard: {
    // backgroundColor: '#E0E0E0',
    // backgroundColor: '#abcff0',
    backgroundColor: "lightgray",
  },
  proceedButton: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 50,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});
