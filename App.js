import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import {AuthProvider, useAuth} from "./navigation/context/AuthContext";
import {StatusBar, View, Text} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import TabNavigationContainer from "./navigation/TabNavigationContainer";
import AuthStackScreen from "./navigation/AuthStackScreen";

import OwnerCapture from "./navigation/screens/HomeParkingValidationScreens/OwnerCapture";

function Account() {
  const {user} = useAuth();
  if (user) {
    return <TabNavigationContainer />;
  } else {
    return <AuthStackScreen />;
  }
}

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        translucent={false}
        backgroundColor="white"
        barStyle="dark-content"
      />
      <AuthProvider>
        <NavigationContainer>
          <Account />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// function App() {
//   return <OwnerCapture />;
// }
export default App;
