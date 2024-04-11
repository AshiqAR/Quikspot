import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Legal() {
  return (
    <View>
      <Text style={styles.label}>Legal</Text>
      <Text style={styles.label}>Terms and Conditions</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})