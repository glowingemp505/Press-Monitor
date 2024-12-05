/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { NotificationProvider } from './src/notifcation_provider/NotificationProvider';

const RootApp = () => (
  <NotificationProvider>
    <App />
  </NotificationProvider>
);

AppRegistry.registerComponent(appName, () => RootApp);

PushNotification.configure({
  onRegister: function (token) {
    console.log("token", token);
  },

  onNotification: function (notification) {
    console.log("Notification received:", notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: Platform.OS === "ios",
});

// Handle the initial notification when the app is launched
PushNotification.popInitialNotification((notification) => {
  console.log("Initial Notification", notification);
});
