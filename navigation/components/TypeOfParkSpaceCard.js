import {View, Text, Pressable, StyleSheet} from "react-native";
import React from "react";

export default function TypeOfParkSpaceCard() {
  return (
    <View
      style={{borderRadius: 15, margin: 20, marginTop: 20, overflow: "hidden"}}
    >
      <View
        style={{
          padding: 20,
          justifyContent: "space-between",
          backgroundColor: "#EEEEEE",
          borderRadius: 15,
          height: 400,
          elevation: 5,
          shadowColor: "gray",
          shadowOffset: {width: 1, height: 5},
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
        }}
      >
        <Text style={{color: "black", fontSize: 20, fontWeight: "bold"}}>
          Rent Your Space Title
        </Text>
        <View>
          <Text style={styles.text}>
            Which types of parkspaces can be added
          </Text>
          <Text style={styles.text}>Carousal display</Text>
          <Text style={styles.text}>Moving between the images and data</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#444",
    fontSize: 15,
  },
});
