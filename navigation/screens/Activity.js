import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ActiveBookings from './ActiveBookings';
import PastBookings from './PastBookings';

const ActivityTab = createMaterialTopTabNavigator();

export default function Activity() {
  return (
    <ActivityTab.Navigator
      initialRouteName='ActiveBookings'
      backBehavior='initialRoute'
      screenOptions={{
        tabBarActiveTintColor: 'darkgreen',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold'},
        tabBarStyle: { backgroundColor: 'white', elevation: 3, shadowOpacity: 0.5, shadowRadius: 5, shadowColor: 'black', shadowOffset: { height: 5, width: 5 } },
        tabBarIndicatorStyle: { backgroundColor: 'darkgreen' },
      }}
    >
      <ActivityTab.Screen name="ActiveBookings" component={ActiveBookings} 
        options={{ tabBarLabel: 'Active' }}
      />
      <ActivityTab.Screen name="PastBookings" component={PastBookings} 
        options={{ tabBarLabel: 'Past' }}
      />
    </ActivityTab.Navigator>
  )
}