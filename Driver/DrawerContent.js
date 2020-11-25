import React from 'react';
import { StyleSheet, View, Image,NativeModules}from 'react-native';
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import {Drawer,Avatar,Caption,Paragraph,Text,TouchableRipple,Switch}from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '../Database/firebase';


export function DrawerContent(props){

    const logout=()=>{
        firebase.auth().signOut().then(function() {
            props.navigation.navigate("ChooseBetweenUsers")
          }).catch(function(error) {
              console.log(error)
          });
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
                        onPress={logout}/> 
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
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 30,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
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