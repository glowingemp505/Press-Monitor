import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

// Third Party

// Icons


const NotificationCard = ({item}) => {
  
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemRowContainer}>
        {/* Render the appropriate icon based on the notification type */}
        <View> 
            <Image
            source={require('../../../assets/icons/notification.png')}
            style={styles.navIcon}
          /></View>
        <View style={{flex: 1}}>
          <View style={styles.rowContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.title}
            </Text>
            <Text style={styles.date}>{item?.date}</Text>
          </View>
          <Text style={styles.message} numberOfLines={1}>
            {item?.message}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000', // Black color for text
  },
  message: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000', // Black color for text
  },
  date: {
    fontSize: 10,
    fontWeight: '400',
    color: '#808080', // Gray color for date
  },
  navIcon: {
    width: 24,
    height: 24,
  },
});
