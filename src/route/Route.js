import * as React from "react";
import Notifications from "../pages/notifications/Notifications";
import Dashboard from "../pages/Home/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Stack Navigator
const Stack = createNativeStackNavigator();

function Route({ fcmToken }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Dashboard} initialParams={{ fcmToken }} />
        <Stack.Screen name="Notification" component={Notifications} initialParams={{ fcmToken }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Route;
