import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import { COLORS,FONT_SIZES } from '../../styles/Theme';

const SplashScreen = () => {
 
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/splashLogo.png')} // Replace with your actual image path
        style={styles.logo}
      />
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground, // Add this color to your theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: FONT_SIZES.large, // Define in your theme
    color: COLORS.primary, // Add this color to your theme
    fontWeight: 'bold',
  },
});

export default SplashScreen;