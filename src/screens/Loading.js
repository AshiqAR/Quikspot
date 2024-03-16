import React, { useEffect } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { useLocation } from '../context/LocationContext';

export default function Loading({ navigation }) {
  const { fetchingLocation, updateCurrentLocation } = useLocation();

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Fetching Location Details...</Text>
        <ActivityIndicator size="large" color="green" />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    paddingVertical: 20,
  },
})
