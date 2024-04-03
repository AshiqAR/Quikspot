import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {View, Text, Pressable, StatusBar, Image} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import Home from "./screens/Home";
import Activity from "./screens/Activity";
import AccountNavigatorStack from "./AccountNavigatorStack";
import HomeNavigatorStack from "./HomeNavigatorStack";

const homeName = "HomeNavigatorStack";
const activityName = "Activity";
const accountName = "AccountNavigatorStack";

const Tab = createBottomTabNavigator();

export default function TabNavigationContainer() {
  return (
    <Tab.Navigator
      initialRouteName="HomeNavigatorStack"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let routeName = route.name;
          if (routeName === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (routeName === activityName) {
            iconName = focused ? "hourglass" : "hourglass-outline";
          } else if (routeName === accountName) {
            iconName = focused ? "person" : "person-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {fontSize: 12, fontWeight: "bold", paddingBottom: 5},
        tabBarHideOnKeyboard: true,
        tabBarStyle: {height: 60},
        tabBarButton: props => (
          <Pressable
            {...props}
            android_ripple={{color: "lightgray", borderless: true, radius: 80}}
          />
        ),
      })}
      backBehavior="firstRoute"
    >
      <Tab.Screen
        name={homeName}
        component={HomeNavigatorStack}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name={activityName}
        component={Activity}
        options={{headerShown: false, tabBarLabel: "Activity"}}
      />

      <Tab.Screen
        name={accountName}
        component={AccountNavigatorStack}
        options={{
          header: ({navigation, route, options, layout}) => {
            return (
              <View>
                <StatusBar translucent={false} />
              </View>
            );
          },
          tabBarLabel: "Account",
        }}
      />
    </Tab.Navigator>
  );
}
