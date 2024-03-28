import React, {useState, useRef, useEffect} from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Animated,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import useCloseWithIndicator from "../customHooks/useCloseWithIndicator";
import LinearGradient from "react-native-linear-gradient";

function waitForRandomTime(maxTime = 1500) {
  const randomTime = Math.floor(Math.random() * maxTime);

  return new Promise(resolve => {
    setTimeout(resolve, randomTime);
  });
}

export default function Wallet({user}) {
  const [isAdding, setIsAdding] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
  const [amount, setAmount] = useState("");
  const animation = useRef(new Animated.Value(0)).current;
  const [handleTopUp, isLoading] = useCloseWithIndicator(async () => {
    console.log("wallet topup");
    if (isNaN(parseInt(amount)) || parseInt(amount) < 0) {
      await waitForRandomTime(2000);
      Alert.alert("Error", "Please enter a valid amount");
      setAmount("");
    } else {
      await waitForRandomTime(7000);
      user.walletBalance += parseInt(amount);
      Alert.alert(
        "Success",
        `Successfully added \u20B9${amount} to your wallet`
      );
      setAmount("");
      setIsAdding(false);
    }
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isAdding ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isAdding, fadeAnim]);

  const toggleAddMoney = () => {
    setIsAdding(!isAdding);
    Animated.timing(animation, {
      toValue: isAdding ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCancel = () => {
    console.log("Cancel add money");
    setAmount("");
    setIsAdding(false);
  };

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]} // Updated gradient colors
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{
        padding: 20,
        justifyContent: "space-between",
        //   backgroundColor: "darkgreen",
        margin: 20,
        borderRadius: 15,
        height: 250,
        elevation: 5,
        shadowColor: "black",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
    >
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
        style={{
          borderBottomWidth: 2,
          borderColor: "gray",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 25,
            color: "white",
            paddingBottom: 10,
          }}
        >
          quikSpot Wallet
        </Text>
        <Icon name="wallet" color={"gold"} size={30}></Icon>
      </View>
      <View style={{flex: 1, flexDirection: "row", paddingVertical: 10}}>
        <Text style={{color: "#ffeded", fontSize: 20}}>Balance: </Text>
        <Text style={{color: "#ffabab", fontSize: 20}}>
          {" "}
          {"\u20B9"} {user.walletBalance}
        </Text>
      </View>

      <View style={{height: 100}}>
        {!isAdding && (
          <View style={{borderRadius: 10, overflow: "hidden", elevation: 5}}>
            <LinearGradient
              //   colors={["#56ab2f", "#a8e063"]}
              //   colors={["#2E3192", "#1BFFFF"]}
              //   colors={["#DAA520", "#FFD700"]}
              //   colors={["#007C7A", "#00d2ff"]}
              colors={["#3a7bd5", "#3a6073"]}
              style={{
                borderRadius: 10,
              }}
            >
              <Pressable
                onPress={toggleAddMoney}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                android_ripple={{color: "lightgray", borderless: false}}
              >
                <Text style={{color: "white", fontSize: 20}}>Add Money</Text>
                <Icon
                  name="add-circle-outline"
                  size={25}
                  color={"white"}
                ></Icon>
              </Pressable>
            </LinearGradient>
          </View>
        )}

        {isAdding && (
          <Animated.View
            style={[
              {
                opacity: fadeAnim, // Bind opacity to animated value
              },
            ]}
          >
            <LinearGradient
              colors={["#3a7bd5", "#3a6073"]}
              style={styles.inputGradient}
            >
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                placeholderTextColor="#ffffff90" // Adjust placeholder text color for better visibility
                keyboardType="numeric"
              />
            </LinearGradient>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <LinearGradient
                colors={["#56ab2f", "#a8e063"]}
                style={styles.buttonGradient}
              >
                <Pressable
                  onPress={handleTopUp}
                  style={[styles.button, styles.topUpButton]}
                >
                  <Text style={styles.buttonText}>Top Up</Text>
                </Pressable>
              </LinearGradient>
              {/* <Pressable
                onPress={handleTopUp}
                style={[styles.button, styles.topUpButton]}
                android_ripple={{color: "lightgray", borderless: false}}
              >
                <Text style={styles.buttonText}>Top Up</Text>
              </Pressable> */}
              <LinearGradient
                colors={["#D64550", "#831A2B"]} // A softer, more subtle gradient
                style={styles.buttonGradient}
              >
                <Pressable
                  onPress={handleCancel}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </LinearGradient>
              {/* <Pressable
                onPress={handleCancel}
                style={[styles.button, styles.cancelButton]}
                android_ripple={{color: "lightgray", borderless: false}}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable> */}
            </View>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 15,
    overflow: "hidden",
  },
  container: {
    borderRadius: 15, // Match your View's borderRadius to maintain the shape
    overflow: "hidden", // Ensure the gradient does not bleed outside the border radius
    margin: 20,
    padding: 20,
    backgroundColor: "darkgreen",
    margin: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  walletTitle: {
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: "gray",
  },
  balanceRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  balanceText: {
    color: "#ffeded",
    fontSize: 20,
  },
  balanceAmount: {
    color: "#ffabab",
    fontSize: 20,
  },
  button: {
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    // elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  buttonGradient: {
    borderRadius: 5,
    overflow: "hidden",
    // backgroundColor: "red",
    height: 45,
    marginTop: 10,
    // elevation: 5,
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    width: "45%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  inputRow: {
    alignItems: "center",
  },
  inputGradient: {
    borderRadius: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    fontSize: 18,
    color: "white",
    padding: 10,
    fontWeight: "bold",
  },
});
