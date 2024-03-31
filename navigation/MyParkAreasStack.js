import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import {UserParkSpacesProvider} from "./context/UserParkSpacesContext";
import CustomHeader from "./components/CustomHeader";
import ManageParkSpace from "./screens/ManageParkSpace";
import ParkSpaceDetails from "./screens/ParkSpaceDetails";

const Stack = createStackNavigator();

export default function MyParkAreasStack() {
  return (
    <UserParkSpacesProvider>
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
        <Stack.Screen name="ManageParkSpace" component={ManageParkSpace} />
        <Stack.Screen name="ParkSpaceDetails" component={ParkSpaceDetails} />
      </Stack.Navigator>
    </UserParkSpacesProvider>
  );
}
