import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import RentParkSpace from "./screens/RentParkSpace";
import Screen1 from "./screens/RentYourSpaceScreens/Screen1";
import Screen2 from "./screens/RentYourSpaceScreens/Screen2";
import Screen3 from "./screens/RentYourSpaceScreens/Screen3";
import {RentASpaceProvider} from "./context/RentASpaceContext";

import CustomHeader from "./components/CustomHeader";

const Stack = createStackNavigator();

export default function RentYourSpaceStack() {
  return (
    <RentASpaceProvider>
      <Stack.Navigator
        screenOptions={{
          cardStyle: {backgroundColor: "white"},
          presentation: "modal",
          cardStyleInterpolator: ({current, next, layouts}) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.7],
                }),
              },
            };
          },
          header: props => {
            const title = props.options.title || props.route.name;
            return <CustomHeader title={title} navigation={props.navigation} />;
          },
        }}
      >
        <Stack.Screen
          name="RentParkSpace"
          component={RentParkSpace}
          options={{
            title: "Rent Park Space",
          }}
        />
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{
            title: "Rent Park Space",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{
            title: "Rent your Park Space",
          }}
        />
        <Stack.Screen
          name="Screen3"
          component={Screen3}
          options={{
            title: "Rent your Park Space",
          }}
        />
      </Stack.Navigator>
    </RentASpaceProvider>
  );
}
