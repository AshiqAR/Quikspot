import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from './screens/Home';
import Legal from './screens/Legal'

const ActivityTab = createMaterialTopTabNavigator();

export default function Activity() {
  return (
    <ActivityTab.Navigator>
      <ActivityTab.Screen name="Home" component={Home} />
      <ActivityTab.Screen name="Legal" component={Legal} />
    </ActivityTab.Navigator>
  )
}
