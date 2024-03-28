import {
  View,
  Text,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import React, {useEffect} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Wallet from "../components/Wallet";
import useCloseWithIndicator from "../customHooks/useCloseWithIndicator";
import ActivitySection from "../components/ActivitySection";
import {useState} from "react";
import {useAuth} from "../context/AuthContext";

function waitForRandomTime(maxTime = 1500) {
  const randomTime = Math.floor(Math.random() * maxTime);

  return new Promise(resolve => {
    setTimeout(resolve, randomTime);
  });
}

export default function Account({navigation}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const {user} = useAuth();

  const handlePress = action => {
    if (!isScrolling) {
      switch (action) {
        case "ManageMyAccount":
          navigation.navigate("ManageAccount");
          break;
        case "MyVehicles":
          navigation.navigate("MyVehicles");
          break;
        case "TransactionsScreen":
          navigation.navigate("TransactionsScreen");
          break;
        case "Messages":
          navigation.navigate("Messages");
          break;
        case "ManageMyParkSpaces":
          navigation.navigate("ManageParkSpace");
          break;
        case "RentSpaceAndEarn":
          navigation.navigate("RentParkSpace");
          break;
        case "Legal":
          navigation.navigate("Legal");
          break;
        default:
        // console.log('No action');
      }
    }
  };

  const [handleClose, isLoading] = useCloseWithIndicator(async () => {
    await waitForRandomTime(2000);
    navigation.navigate("Home");
  });
  useEffect(() => {
    if (isLoading) {
      StatusBar.setBackgroundColor("rgba(0, 0, 0, 0.1)");
    } else {
      StatusBar.setBackgroundColor("white");
    }
  }, [isLoading]);

  return (
    <View style={{flex: 1, backgroundColor: "white"}}>
      {isLoading && (
        <Modal transparent={true} visible={isLoading}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="black" />
          </View>
        </Modal>
      )}
      <View
        style={{height: 40, width: 40, marginTop: 20, marginHorizontal: 20}}
      >
        <Pressable
          style={{}}
          onPress={handleClose}
          android_ripple={{color: "lightgray", borderless: true, radius: 25}}
        >
          <Icon name="close" size={40} color="black" />
        </Pressable>
      </View>

      <Pressable
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          paddingVertical: 10,
          alignItems: "center",
        }}
        onPress={() => handlePress("ManageMyAccount")}
      >
        <Text style={{fontSize: 30, fontWeight: "bold", color: "black"}}>
          {user.name}
        </Text>
        <Icon name="person-outline" size={30} color={"gray"}></Icon>
      </Pressable>
      <ScrollView
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
      >
        <Wallet user={user} isScrolling={isScrolling}></Wallet>
        <ActivitySection
          navigation={navigation}
          isScrolling={isScrolling}
        ></ActivitySection>

        <View style={{paddingHorizontal: 20}}>
          <Pressable
            style={styles.settingsList}
            onPress={() => handlePress("ManageMyAccount")}
          >
            <Icon name="person" size={20} color={"black"}></Icon>
            <Text style={styles.listText}>Manage my account</Text>
          </Pressable>
          <Pressable
            style={styles.settingsList}
            onPress={() => handlePress("MyVehicles")}
          >
            <Icon name="car-sport-sharp" size={20} color={"black"}></Icon>
            <Text style={styles.listText}>My vehicles</Text>
          </Pressable>
          <Pressable
            style={styles.settingsList}
            onPress={() => handlePress("TransactionsScreen")}
          >
            <Icon name="card" size={20} color={"black"}></Icon>
            <Text style={styles.listText}>Transactions</Text>
          </Pressable>
          <Pressable
            style={styles.settingsList}
            onPress={() => handlePress("Messages")}
          >
            <Icon name="mail" size={20} color={"black"}></Icon>
            <Text style={styles.listText}>Messages</Text>
          </Pressable>
          <Pressable
            style={styles.settingsList}
            onPress={() => handlePress("ManageMyParkSpaces")}
          >
            <Icon name="settings" size={20} color={"black"}></Icon>
            <Text style={styles.listText}>Manage my park spaces</Text>
          </Pressable>
          <Pressable
            style={styles.settingsList}
            onPress={() => handlePress("RentSpaceAndEarn")}
          >
            <Icon name="cash" size={20} color={"black"}></Icon>
            <Text style={styles.listText}>Rent your space and earn</Text>
          </Pressable>
          <Pressable
            style={styles.settingsList}
            onPress={() => handlePress("Legal")}
          >
            <Icon name="alert-circle" size={20} color={"black"}></Icon>
            <Text style={styles.listText}>Legal</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsList: {
    flexDirection: "row",
    alignItems: "center",
  },
  listText: {
    fontSize: 20,
    fontWeight: "normal",
    color: "black",
    marginLeft: 20,
    paddingVertical: 20,
  },
});
