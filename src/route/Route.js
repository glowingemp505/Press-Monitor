import * as React from "react";

import Notifications from "../pages/notifications/Notifications";
import Dashboard from "../pages/Home/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Sample Screens


// Stack Navigator
const Stack = createNativeStackNavigator();

function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Home" component={Dashboard} />
        <Stack.Screen name="Notification" component={Notifications} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Route;
