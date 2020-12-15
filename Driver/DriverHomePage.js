import React,{useEffect}from 'react';
import { StyleSheet, View,Dimensions,Image,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesome5} from '@expo/vector-icons';
import { NativeModules } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import firebase from '../Database/firebase';
const DriverHomePage = ({navigation})=>{
  const Open=()=>{
    navigation.openDrawer()
}

var DriverID=firebase.auth().currentUser.uid;
//to store the token expo in  our firebase 
 

   const registerForPushNotificationsAsync = async (DriverID) => {
        const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        //post to firebase
        
        var updates = {}
        updates['/expoToken'] = token
        firebase.database().ref("DeliveryDriver").child(DriverID).update(updates)
        
        
      
       
        //call the push notification 
    }

    useEffect(()=>{
      registerForPushNotificationsAsync(DriverID)
      Notifications.addListener(notification => navigation.navigate(notification.data.screen,notification.data.param))
    },[])
    
    return (
        <View style={styles.container}>
          <View style={{flex:1.5}}>
            <Image 
            source={require('../assets/DriverHomePageTop.png')}
            style={styles.imageTop}
            resizeMode="stretch"
            />
            <SafeAreaView style={{flexDirection: Platform.OS === 'android' && 
            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse'}}>
                <TouchableOpacity
                    style={{margin: 16}}
                    onPress={Open}>  

                    <FontAwesome5 name="bars" size={24} color="#212121"/>

                </TouchableOpacity>
            </SafeAreaView>
          </View>
          <View style={{flex:4}}>
            <View style={styles.viewImage}>
              <TouchableOpacity style={styles.TouchableOpacityStyle}
              onPress={()=> navigation.navigate("AssignedRequests")}
              >

                <Image 
                  style={styles.imageCenter}
                  source={require('../assets/ListOfRequests.png')}/>

               </TouchableOpacity>

               <TouchableOpacity style={styles.TouchableOpacityStyle}
                                  onPress={()=> navigation.navigate("DriverFacilities")}>

                <Image
                  style={styles.imageCenter}
                  source={require('../assets/ListOfFacilities.png')}/>

              </TouchableOpacity>

            </View>
          </View>
          <View style={{flex:1.5}}>
            <Image 
              source={require('../assets/DriverHomePageButtom.png')}
              style={styles.imageButtom}
              resizeMode="stretch"/>
          </View>
        </View>
      );
}
const {height} = Dimensions.get("screen");


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff"
  }, 
  imageButtom: {
    width: "100%" ,
    height:"100%" ,
    position: 'absolute', 
    bottom: 0,
  },    
  imageTop: {
    width: "100%" ,
    height:"100%" ,
    position: 'absolute'
  },
  imageCenter: {
    width: 150 ,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewImage:{
    alignItems: 'center',
    justifyContent: 'center',
    flex:3
  },
  TouchableOpacityStyle:{
    alignItems: 'center',
    justifyContent: 'center',
    flex:1
  }
  });

export default DriverHomePage