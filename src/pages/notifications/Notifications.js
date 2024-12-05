import React, { useEffect } from 'react';
import {StyleSheet, SafeAreaView, FlatList, Text, View, Image, TouchableOpacity} from 'react-native';

// Components
// Data
import NotificationCard from '../../components/notifications/NotificationCard';
import { useNotification } from '../../notifcation_provider/NotificationProvider';

const Notifications = ({navigation}) => {

  const { notifications, hasNewNotification, markNotificationsAsRead } = useNotification();


  useEffect(() => {
    markNotificationsAsRead()
  }, [])
  

 
      
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
          {/* App Logo */}
          <TouchableOpacity onPress={()=> navigation.goBack()}>  
          <Image
            source={require('../../../assets/icons/back.png')}
            style={styles.navIcon}
          />
          </TouchableOpacity >
         <View style={styles.heading_container}>
         <Text style={styles.heading}>Notifications</Text>

         </View>
        </View>
        {notifications?.length > 0 ?
        
          <FlatList
          data={notifications}
          renderItem={({item, index}) => (
            <NotificationCard index={index} item={item} />
          )}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
        :

        <View style={{flex:1,justifyContent:"center",alignItems:"center",}}>
          <Text style={styles.text}>No Notification</Text>
        </View>
       
        }
     
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set to white background
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  marginVertical:15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  heading:{
textAlign:"center",
fontSize:20,
fontWeight:"bold"
  },
  heading_container:{
flex:1,
alignSelf:"center"
  },

  navIcon: {
    width: 24,
    height: 24,
  },
  text:{
    textAlign:"center",
    fontSize:16,
    fontWeight:'500'
  },
});
