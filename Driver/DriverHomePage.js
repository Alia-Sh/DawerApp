import React from 'react';
import { StyleSheet, View,Dimensions,Image,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesome5} from '@expo/vector-icons';
import { NativeModules } from 'react-native';

const DriverHomePage = ({navigation})=>{
  const Open=()=>{
    navigation.openDrawer()
}
    return (
        <View style={styles.container}>
          <View style={{flex:1.5}}>
            <Image 
            source={require('../assets/DriverHomePageTop.png')}
            style={styles.imageTop}
            resizeMode="stretch"
            />
            <SafeAreaView style={{flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row' : 'row-reverse'}}>
                <TouchableOpacity
                    style={{margin: 16}}
                    onPress={Open}>  

                    <FontAwesome5 name="bars" size={24} color="#212121"/>

                </TouchableOpacity>
            </SafeAreaView>
          </View>
          <View style={{flex:4}}>
            <View style={styles.viewImage}>
              <TouchableOpacity style={styles.TouchableOpacityStyle}>

                <Image 
                  style={styles.imageCenter}
                  source={require('../assets/ListOfRequests.png')}/>

               </TouchableOpacity>

               <TouchableOpacity style={styles.TouchableOpacityStyle}>

                <Image
                  style={styles.imageCenter}
                  source={require('../assets/ListOfFacilities.png')}/>

              </TouchableOpacity>

            </View>
          </View>
          <View style={{flex:2}}>
            <Image 
              source={require('../assets/DriverHomePageButtom.png')}
              style={styles.imageButtom}
              resizeMode="stretch"/>
          </View>
        </View>
      );
}
const {height} = Dimensions.get("screen");
const height_logo = height * 0.35;
const height_logo2 = height * 0.25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff"
  }, 
  textInput: {
      textAlign: 'center', 
      marginTop: 20,  
      flexDirection: 'column'
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
    // marginTop: 15 ,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewImage:{
    // marginTop: 33,
    alignItems: 'center',
    justifyContent: 'center',
    flex:3
  },
  profileImage:{
    width: 50,
    height: 50,
  },
  profileView:{
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 40,
    marginRight: 20,
  },
  TouchableOpacityStyle:{
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 30,
    flex:1
  }
  });

export default DriverHomePage