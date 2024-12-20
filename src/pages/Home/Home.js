import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = ({ navigation, route }) => {
  const useWebKit = true;

  RNFetchBlob.config({
    trusty: true,
  });

  const { fcmToken } = route.params;
  const webviewRef = useRef(null);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [closeUrl, setcloseUrl] = useState('');
  const [previousUrl, setPreviousUrl] = useState(''); // Track the previous URL
  const [checkStatus, setCheckStatus] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState(`https://mapp2.pressmonitor.co.in/?fcm_token=${fcmToken}`);
  const [webViewUrlTemp, setWebViewUrlTemp] = useState(`https://mapp2.pressmonitor.co.in/?fcm_token=${fcmToken}`);
  const [refreshing, setRefreshing] = useState(false);

  const [pdfDimensions, setPdfDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });


  const handlePress = () => {
    if (Platform.OS === 'android') {
      // Android-specific behavior
      webviewRef.current.goBack();
    } else if (Platform.OS === 'ios') {
      // iOS-specific behavior
      setWebViewUrl(webViewUrlTemp);
    }
  };
  

  const handleGetCookies = async () => {
    try {
      const cookies = await CookieManager.get(webViewUrl, useWebKit);
      if (cookies && Object.keys(cookies).length > 0) {
        Alert.alert('Cookies', JSON.stringify(cookies));
      } else {
        Alert.alert('No Cookies Found', 'The domain did not return any cookies.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve cookies.');
    }
  };
  const handleNavigationRequest = (request) => {
    const { url } = request;
  
    console.log('Navigation request URL:===============================================================================', url);
    

    if (url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('token')) {
      console.log("===============", closeUrl);
  } else {
      console.log("===============--------------------====================", url);
      setcloseUrl(url);
  }
  
  
    console.log('Current webViewUrl:', webViewUrl);
  
    // Handle PDF navigation
    if (url.toLowerCase().includes('.pdf')) {
      console.log('PDF URL detected:', url);
      
      // Update previous URL only if it's not already a PDF
      if (!webViewUrl.toLowerCase().includes('.pdf')) {
        console.log('Setting previous URL:', webViewUrl);
        setPreviousUrl(webViewUrl); // Save the last non-PDF URL
      }
  
      setPdfUrl(url);
      setShowPdf(true);
      return false; // Prevent WebView from navigating to the PDF
    }
  
    return true; // Allow navigation for non-PDF URLs
  };
  
  
  const handleClosePdf = () => {
    console.log('PDF closed');
    console.log('Previous URL when closing PDF:', closeUrl);
  
    setShowPdf(false);
    
    setWebViewUrl(closeUrl); 

  };
  const handleRefresh = () => {
    console.log('Refreshing WebView');
    setRefreshing(true);
    webviewRef.current.reload();
    setRefreshing(false);
  };
  
  
  

  useEffect(() => {
    const updatePdfDimensions = () => {
      setPdfDimensions({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      });
    };

    const subscription = Dimensions.addEventListener('change', updatePdfDimensions);
    return () => subscription?.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3E5B66" />
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Header content can go here */}
        </View>

        <View style={[styles.webViewContainer, showPdf && styles.hidden]}>
          <ScrollView
            contentContainerStyle={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
   <WebView
  ref={webviewRef}
  source={{ uri: webViewUrl }}
  style={styles.webView}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  startInLoadingState={true}
  renderLoading={() => <ActivityIndicator size="large" />}
  onShouldStartLoadWithRequest={handleNavigationRequest}
  onNavigationStateChange={(navState) => {
    console.log('onNavigationStateChange URL:', navState.url);

    if (webViewUrl == "")
    {
      setCheckStatus(false)
    }
    else{
      setCheckStatus(true)
    }

    // Avoid updating webViewUrl with PDF URLs
    if (!navState.url.toLowerCase().includes('.pdf')) {
      console.log('Updating webViewUrl to:', navState.url);
      setWebViewUrl(navState.url); // Update the current URL only if it's not a PDF
    }

    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);

console.log(checkStatus , "===========================================")

  }}
/>
          </ScrollView>
          <View style={styles.navigationContainer}>
          <TouchableOpacity
  disabled={!canGoBack && !checkStatus}
  onPress={handlePress}
  style={[
    styles.navButton,
    (!canGoBack && !checkStatus) && styles.disabledButton, // Apply disabled style when both are false
  ]}
>
              <View>
                <Image
                  source={require('../../../assets/icons/icons8-back-48.png')}
                  style={{ height: 20, width: 20 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!canGoForward}
              onPress={() => webviewRef.current.goForward()}
              style={[styles.navButton, !canGoForward && styles.disabledButton]}
            >
              <View>
                <Image
                  source={require('../../../assets/icons/icons8-back-48-2.png')}
                  style={{ height: 20, width: 20 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.pdfContainer, !showPdf && styles.hidden]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClosePdf}
          >
            <Image
              source={require('../../../assets/icons/cross.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>

          <Pdf
            trustAllCerts={false}
            source={{ uri: pdfUrl, cache: true }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log('Number of pages: ${numberOfPages}');
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log('Current page: ${page} / ${numberOfPages}');
            }}
            onError={(error) => {
              console.error(error);
            }}
            onPressLink={(uri) => {
              console.log('Link pressed: ${uri}');
            }}
            style={[
              styles.pdf,
              { width: pdfDimensions.width, height: pdfDimensions.height },
            ]}
          />
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
    height: Platform.OS === 'ios' ? 80 : undefined,
    paddingBottom: 15,
    backgroundColor: '#3E5B66',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    paddingHorizontal: 10,
  },
  webViewContainer: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  pdfContainer: {
    flex: 1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeIcon: {
    width: 30,
    height: 30,
    tintColor: 'black',
  },
  pdf: {
    flex: 1,
  },
  navigationContainer: {
    height: Platform.OS === 'ios' ? 80 : undefined,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#3E5B66',
  },
  navButton: {
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  navText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Dashboard;