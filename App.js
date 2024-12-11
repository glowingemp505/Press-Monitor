import { LogBox, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Splash from './src/pages/splash/Splash'
import Route from './src/route/Route'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";
import { NotificationProvider, useNotification } from './src/notifcation_provider/NotificationProvider';



const handleNotification = (notification) => {
  console.log("Received notification:", notification);
};

const App = () => {
  LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();
  const [loader, setLoader] = useState(true);
  const { addNotification } = useNotification();

  const [fcmToken, setFcmToken] = useState('');
 

  useEffect(() => {
   
    setTimeout(() => {
      setLoader(false);
    }, 3000);
  }, []);


    useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
        } catch (error) {
          console.error(error);
        }
      }
    };

    requestPermission();

    const requestPermissionForToken = async () => {
      try {
        if (Platform.OS === "android") {
          await messaging().requestPermission();
        } else if (Platform.OS === "ios") {
          PushNotificationIOS.requestPermissions();
          PushNotificationIOS.addEventListener(
            "notification",
            handleNotification
          );
        }
        const token = await messaging().getToken();
        // dispatch(setfcmToken(token));
        
        setFcmToken(token);

        console.log("fcm token", token);

      } catch (error) {
        console.log("Error generating FCM token:", error);
      }
    };

    requestPermissionForToken();

    const unsubscribeForeground = messaging().onMessage(

      async (remoteMessage) => {
        console.log('remote notification',remoteMessage?.notification?.title)

        const notificationData = {
          id: Date.now(),
          title: remoteMessage?.notification?.title,
          message: remoteMessage?.notification?.body,
          time: new Date().toLocaleTimeString()
        };

        addNotification(notificationData);
      
          PushNotification.localNotification({
            channelId: "default-channel-id",
            title: remoteMessage?.notification?.title,
            message: remoteMessage?.notification?.message,
            soundName: "default",
            vibrate: true,
            playSound: true,
          });
          // dispatch(setNewNotification(true));
        
      }
    );

    const unsubscribeBackground = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log('remote notification',remoteMessage)

        const notificationData = {
          id: Date.now(),
          title: remoteMessage.notification?.title,
          message: remoteMessage.notification?.body,
          time: new Date().toLocaleTimeString()
        };

        addNotification(notificationData);
    
          PushNotification.localNotification({
            channelId: "default-channel-id",
            title: remoteMessage?.notification?.title,
            message: remoteMessage?.notification?.message,
            soundName: "default",
            vibrate: true,
            playSound: true,
          });
          // dispatch(setNewNotification(true));
      }
    );

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      async (token) => {
        // dispatch(setfcmToken(token));
        console.log("fcm token", token);
      }
    );

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeTokenRefresh();
      if (Platform.OS === "ios") {
        PushNotificationIOS.removeEventListener(
          "notification",
          handleNotification()
        );
      }
    };
  }, []);


  useEffect(() => {
    if (fcmToken) {
        console.log("Insane FCM Token:", fcmToken); // Log token when it changes
    }
}, [fcmToken]);

  return (
    
  
 
  <View style={{ flex: 1 }}>
        {loader ? <Splash /> : <Route fcmToken={fcmToken} />}
  
   
    
    </View>
  )
}

export default App

const styles = StyleSheet.create({})