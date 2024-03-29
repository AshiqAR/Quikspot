import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useAuth} from "../context/AuthContext";

const titleCase = str => str.replace(/\b\w/g, char => char.toUpperCase());

export default function MyVehicles({navigation}) {
  const {user} = useAuth();
  const vehicles = user.vehicles;
  const handleDelete = id => {
    console.log("Deleting vehicle with ID:", id);
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Icon
        name={item.type === "car" ? "car" : "motorcycle"}
        size={25}
        color={item.type === "car" ? "#4CAF50" : "#FFC107"}
        style={styles.icon}
      />
      <View style={styles.details}>
        <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
        <Text style={styles.info}>
          {item.make} {item.model}
        </Text>
        <Text style={styles.type}>{titleCase(item.type)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Icon name="trash" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        style={styles.container}
        ListEmptyComponent={
          <Text style={styles.emptyList}>
            You have not added any vehicles yet !
          </Text>
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
            style={{
              backgroundColor: "black",
              borderRadius: 10,
              height: 50,
              width: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
            android_ripple={{color: "gray", borderless: false}}
            onPress={() => {
              navigation.navigate("AddNewVehicle");
            }}
          >
            <Text style={{color: "white", fontSize: 20, textAlign: "center"}}>
              Add New Vehicle
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
    // backgroundColor: '#F5F5F5',
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
  deleteButton: {
    padding: 10,
    opacity: 0.8,
  },
  emptyList: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 16,
  },
});
