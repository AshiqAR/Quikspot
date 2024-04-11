import {View, Text, StyleSheet, Pressable} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {useAuth} from "../context/AuthContext";

export default function ManageAccount({navigation, route}) {
  const {signOut, user} = useAuth();
  const MoveTo = screen => () => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageSection}>
        <View style={styles.detailsCard}>
          <Icon name="person" size={50} color={"black"} />
          <View style={styles.detailsContent}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.details}>Phone: {user.phoneNumber}</Text>
            <Text style={styles.details}>Email: {user.email}</Text>
            <View style={[styles.addressBlock, {overflow: "hidden"}]}>
              <Text style={styles.addressTitle}>Address:</Text>
              <Text style={styles.address}>{user.address}</Text>
              <Text
                style={styles.address}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {user.pincode}, {user.city}, {user.state}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Pressable
            style={({pressed}) => [
              styles.optionButton,
              {
                opacity: pressed ? 0.95 : 1,
              },
            ]}
            onPress={MoveTo("UpdatePersonalDetails")}
          >
            <Text style={styles.buttonText}>Update Personal Details</Text>
          </Pressable>

          <Pressable
            style={({pressed}) => [
              styles.optionButton,
              {
                opacity: pressed ? 0.95 : 1,
              },
            ]}
            onPress={MoveTo("ChangePassword")}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </Pressable>
        </View>
      </View>

      <View>
        <View
          style={{
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Pressable
            style={({pressed}) => [
              styles.logoutButton,
              {
                opacity: pressed ? 0.8 : 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 50,
              },
            ]}
            android_ripple={{color: "gray", borderless: false}}
            onPress={signOut}
          >
            <Icon name="power-outline" size={20} color={"tomato"} />
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageSection: {
    flex: 1,
  },
  detailsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#efefef",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
  },
  detailsContent: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#404040",
  },
  details: {
    fontSize: 16,
    color: "#404040",
    paddingTop: 5,
  },
  addressBlock: {
    paddingTop: 10,
  },
  addressTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  address: {
    fontSize: 16,
    color: "#404040",
  },
  optionButton: {
    // backgroundColor: '#007bff',
    backgroundColor: "#004F7C",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  logoutButton: {
    backgroundColor: "black",
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
