import React from 'react';
import { StyleSheet, View, Image,NativeModules}from 'react-native';
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import {Drawer}from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '../Database/firebase';


export function DrawerContent(props){

  const SignOut = async () => {
    try {
      var UserID=firebase.auth().currentUser.uid;
      await firebase.database().ref("DeliveryDriver").child(UserID).update({
        expoToken:""
      })
     await firebase.auth().signOut()
     props.navigation.navigate("ChooseBetweenUsers")
    }catch (e){
      console.log(e)
    }
  }
    return(
       <View style={{flex:1}}>
           <DrawerContentScrollView {... props}>
               <View style={styles.drawerContent}>
                   <View style={styles.userInfoSection}>
                     <View style={styles.LogoToCenter}>
                       <Image
                          source={require('../assets/DawerLogo.png')}
                          style={styles.logo}
                       />
                     </View>
                   </View>
               </View>
               <Drawer.Section style={styles.drawerSection}>
               <DrawerItem
                        style={styles.drawerItemStyle}
                        icon={({color,size})=> (
                          <Icon
                          style={Platform.OS === 'android' && 
                          NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                          NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                          NativeModules.I18nManager.localeIdentifier === 'ar_SA'? styles.IconStyleAndroid:styles.IconStyleIOS}
                          name="account-outline"
                          color={color}
                          size={size}/>
                        )}
                        label="الملف الشخصي "
                        onPress={() =>{props.navigation.navigate("DriverViewProfile")}}/>

                    <DrawerItem
                        style={styles.drawerItemStyle}
                        icon={({color,size})=> (
                          <Icon
                          style={Platform.OS === 'android' && 
                          NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                          NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                          NativeModules.I18nManager.localeIdentifier === 'ar_SA'? styles.IconStyleAndroid:styles.IconStyleIOS}
                          name="exit-to-app"
                          color={color}
                          size={size}/>
                        )}
                        label="تسجيل الخروج"
                        onPress={() =>{SignOut()}}/> 
           </Drawer.Section>
           </DrawerContentScrollView>
       </View> 
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    drawerSection: {
      marginTop: 30,
    },
    logo: {
      width: 200,
      height: 90,
    },
    LogoToCenter:{
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:30
    },
    drawerItemStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
      borderTopColor: '#f4f4f4',
      borderTopWidth: 1
    },
    IconStyleIOS:{
      position:'absolute',right:5
    },
    IconStyleAndroid:{
      position:'absolute',left:5
    }
  });

export default DrawerContent