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