import {createStackNavigator} from "@react-navigation/stack";
import {View, Image} from "react-native";
import React from "react";
import Home from "./screens/Home";
import SelectVehicle from "./screens/HomeScreens/SelectVehicle";
import MapScreen from "./screens/HomeScreens/MapScreen";
import CustomHeader from "./components/CustomHeader";
import BookingScreen from "./screens/HomeScreens/BookingScreen";
import {ParkingDataProvider} from "./context/ParkingContext";

const Stack = createStackNavigator();

export default function HomeNavigatorStack() {
  return (
    <ParkingDataProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: "white"},
          // cardStyleInterpolator: ({ current, next, layouts }) => {
          //     return {
          //         cardStyle: {
          //             transform: [
          //                 {
          //                     translateX: current.progress.interpolate({
          //                         inputRange: [0, 1],
          //                         outputRange: [layouts.screen.width, 0],
          //                     }),
          //                 },
          //             ],
          //         },
          //         overlayStyle: {
          //             opacity: current.progress.interpolate({
          //                 inputRange: [0, 1],
          //                 outputRange: [0, 0.7],
          //             }),

          //         },
          //     };
          // },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: true,
            title: "Home",
            header: ({navigation, route, options, layout}) => {
              return (
                <View>
                  <View style={{padding: 10, backgroundColor: "white"}}>
                    <Image
                      style={{width: 100, height: 40, marginLeft: 10}}
                      source={require("../src/assets/images/quikspot.png")}
                    />
                  </View>
                </View>
              );
            },
          }}
        />
        <Stack.Screen
          name="SelectVehicle"
          component={SelectVehicle}
          options={{
            headerShown: true,
            title: "Select Vehicle",
            header: ({navigation, route, options, layout}) => {
              return (
                <CustomHeader title="Select Vehicle" navigation={navigation} />
              );
            },
          }}
        />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen
          name="BookingScreen"
          component={BookingScreen}
          options={{
            headerShown: true,
            title: "Booking Details",
            header: ({navigation, route, options, layout}) => {
              return (
                <CustomHeader title="Booking Details" navigation={navigation} />
              );
            },
          }}
        />
      </Stack.Navigator>
    </ParkingDataProvider>
  );
}
