import React from 'react';
import { StyleSheet, View, Dimensions, Image} from 'react-native';
import { NativeModules } from 'react-native';
import {FontAwesome, SimpleLineIcons, MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import HomeScreen from './HomeScreen'
import CommunityPage from './CommunityPage'
import NotificationsPage from './NotificationsPage'
import RequestsPage from './RequestsPage'
import { LinearGradient } from 'expo-linear-gradient'; 
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';





const UserHomePage = ({navigation, route})=>{

    const Tab = createMaterialBottomTabNavigator();
    
    
    const Open=()=>{
        navigation.openDrawer()
    }

    return (
       
        <View style={styles.container}>

        <View  style={styles.fixedHeader}>
         <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{ height: '100%', width: '100%', flexDirection:'row', justifyContent: 'space-between'}}>
            
                    <SimpleLineIcons name="menu" size={28} color ='#fff' style={styles.back}
                     onPress={Open}>
                     </SimpleLineIcons>  

                     <Image source={require('../assets/UserLogo2.png')} 
                     style={styles.logo}
                     resizeMode='stretch' />
            </LinearGradient>
         
            </View>

          <Tab.Navigator
      initialRouteName="Home"
      activeColor="#f0edf6"
      inactiveColor="#808000"
      barStyle={{  backgroundColor: '#9E9D24'}}
      
    >
       <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color}) => (
            <FontAwesome name="home" color={color} size={26}/>
          ),
        }}
      />
      <Tab.Screen
        name="RequestsPage"
        component={RequestsPage}
        options={{
          tabBarLabel: 'الطلبات',
          tabBarIcon: ({ color}) => (
            <MaterialCommunityIcons name="truck-fast" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsPage"
        component={NotificationsPage}
        options={{
          tabBarLabel: 'التنبيهات',
          tabBarIcon: ({ color}) => (
            <Ionicons name="ios-notifications" color={color} size={26}/>
          ),
        }}
      />
        
      <Tab.Screen 
        name="CommunityPage"
        component={CommunityPage}
        options={{
          tabBarLabel: 'المجتمع',
          tabBarIcon: ({ color}) => (
            <MaterialCommunityIcons name="account-group" color={color} size={26} textAlign= 'center'/>
          ),
        }}
      />
      

    </Tab.Navigator>
    </View> 
   
        
      );    

}

const theme= {
    colors:{
        primary: "#C0CA33"
    }
}

const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.28;
const width_logo = width * 0.85;


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    container2: {
        flex: 0.17,
      },
    
    textInput: {
        textAlign: 'center', 
        marginTop: 20,  
    },
    fixedHeader: {
        backgroundColor: '#9E9D24',
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        height: '10%'
    },
    back:{
        marginTop: 40,
        marginLeft: 12,
        alignItems: 'baseline',
        shadowColor: '#F1F1EA'
    },
    footer: {
        flex: 1.5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#9E9D24',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center'
    },
    text_footer: {
        color: '#9E9D24',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
        marginTop: 50,
        margin: 10
    },
    text_forgetPass: {
      color: '#757575',
      fontSize: 15,
      textAlign: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
  },
    action: {
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'row' : 'row-reverse',
          marginTop: 5,
          margin: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#f2f2f2',
          paddingBottom: 5,
          fontWeight: 'bold',
    
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
        
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        textAlign: 'right',
        paddingRight: 10
        
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
      textAlign: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
    },
    errorMsg2: {
      color: '#FF0000',
      fontSize: 14,
      textAlign: 'center',
  },
    button: {
        alignItems: 'flex-end',
        marginTop: 10
    },
    signIn: {
        width: '13%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }, 
    logo: {
        width: 90,
        height: 40,
      marginLeft: 65 ,
      marginTop: 36,
      alignItems: 'center',
      justifyContent: 'center',
  },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'  
    },
  });

export default UserHomePage