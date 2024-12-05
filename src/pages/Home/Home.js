import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNotification } from '../../notifcation_provider/NotificationProvider';

const Dashboard = ({ navigation }) => {
  const webviewRef = useRef(null); // Create a reference to the WebView
  const {  hasNewNotification } = useNotification();

  // Function to handle notification icon press
  const handleNotificationPress = () => {
    navigation.navigate('Notification'); // Ensure 'Notifications' matches the name in the navigator
  };

  // Function to go back in WebView
  const handleGoBack = () => {
    if (webviewRef.current) {
      webviewRef.current.goBack();
    }
  };

  // Function to go forward in WebView
  const handleGoForward = () => {
    if (webviewRef.current) {
      webviewRef.current.goForward();
    }
  };

  // Function to refresh the WebView
  const handleRefresh = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#3E5B66" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* App Logo */}
          <Image
            source={require('../../../assets/images/splashLogo.png')}
            style={styles.logo}
          />

          {/* Notification Icon */}
{hasNewNotification ? (

<TouchableOpacity
style={styles.notification}
onPress={handleNotificationPress}>
<Image
  source={require('../../../assets/icons/notif-dot-bell.png')}
  style={styles.notificationImage}
  resizeMode="contain"
/>
</TouchableOpacity>


)  :  (
  <TouchableOpacity
style={styles.notification}
onPress={handleNotificationPress}>
<Image
  source={require('../../../assets/icons/notification.png')}
  style={styles.notificationImage}
  resizeMode="contain"
/>
</TouchableOpacity>

)

}
        



        </View>

        {/* WebView Section */}
        <View style={{ flex: 1 }}>
       

          <WebView
            ref={webviewRef}
            source={{ uri: 'https://mapp.pressmonitor.co.in/' }}
            style={styles.webView}
            scrollEnabled={true} // Enable scrolling by touch
            allowsFullscreenVideo={true} // Optional, if you want fullscreen support for videos
            javaScriptEnabled={true} // Ensure JavaScript is enabled for better interaction
            domStorageEnabled={true} // Ensure DOM storage is enabled
            startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" />}// Trigger when loading finishes
          />
        </View>

        {/* Bottom Navigation Buttons */}
        <View style={styles.bottomNav}>
          {/* Back Button */}
          <TouchableOpacity style={styles.navButton} onPress={handleGoBack}>
            <Image
              source={require('../../../assets/icons/back.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Forward Button */}
          <TouchableOpacity style={styles.navButton} onPress={handleGoForward}>
            <Image
              source={require('../../../assets/icons/forward.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Refresh Button */}
          <TouchableOpacity style={styles.navButton} onPress={handleRefresh}>
            <Image
              source={require('../../../assets/icons/refresh.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#3E5B66',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    paddingHorizontal: 10,
  },
  logo: {
    width: 100,
    height: 60,
    resizeMode: 'cover',
  },
  notification: {
    padding: 10,
    marginLeft: -10,
  },
  notificationImage: {
    width: 24,
    height: 24,
    tintColor:'white'

  },
  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#3E5B66',
    borderTopWidth: 1,
    borderTopColor: '#D1D1D1',
  },
  navButton: {
    padding: 10,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor:'white'
  },
});

export default Dashboard;
