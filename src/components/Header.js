import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Header (){
  return (
    <View style={styles.container}>
      <View style={styles.ourLogo}>
        <Image
          style={styles.img}
          source={require('../assets/images/quikspot.png')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    // flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ourLogo: {
    alignItems: 'center',
    padding: 10,
  },
  img: { width: 100, height: 40 },
})