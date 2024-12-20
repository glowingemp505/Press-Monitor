import { LogBox, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Splash from './src/pages/splash/Splash'
import Route from './src/route/Route'
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
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
          console.error("Permission request error:", error);
        }
      }
    };
  
    const requestPermissionForToken = async () => {
      try {
        // Register for remote messages before requesting token
        await messaging().registerDeviceForRemoteMessages();
  
        if (Platform.OS === "android") {
          await messaging().requestPermission();
        } else if (Platform.OS === "ios") {
          await PushNotificationIOS.requestPermissions();
          PushNotificationIOS.addEventListener("notification", handleNotification);
        }
  
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        setFcmToken(token);
  
      } catch (error) {
        console.error("Error generating FCM token:", error);
      }
    };
  
    requestPermission();
    requestPermissionForToken();
  
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground notification:", remoteMessage?.notification?.title);
  
      const notificationData = {
        id: Date.now(),
        title: remoteMessage?.notification?.title,
        message: remoteMessage?.notification?.body,
        time: new Date().toLocaleTimeString(),
      };
  
      addNotification(notificationData);
  
      PushNotification.localNotification({
        channelId: "default-channel-id",
        title: remoteMessage?.notification?.title,
        message: remoteMessage?.notification?.body,
        soundName: "default",
        vibrate: true,
        playSound: true,
      });
    });
  
    const unsubscribeBackground = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log("Background notification:", remoteMessage);
  
        const notificationData = {
          id: Date.now(),
          title: remoteMessage?.notification?.title,
          message: remoteMessage?.notification?.body,
          time: new Date().toLocaleTimeString(),
        };
  
        addNotification(notificationData);
  
        PushNotification.localNotification({
          channelId: "default-channel-id",
          title: remoteMessage?.notification?.title,
          message: remoteMessage?.notification?.body,
          soundName: "default",
          vibrate: true,
          playSound: true,
        });
      }
    );
  
    const unsubscribeTokenRefresh = messaging().onTokenRefresh((token) => {
      console.log("FCM Token refreshed:", token);
      setFcmToken(token);
    });
  
    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeTokenRefresh();
      if (Platform.OS === "ios") {
        PushNotificationIOS.removeEventListener("notification", handleNotification);
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