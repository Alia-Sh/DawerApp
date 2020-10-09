import React, {useEffect} from 'react';
import { StyleSheet, Text,View, TouchableOpacity, Alert ,Dimensions, Platform, ImageBackground} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient'; 
import { NativeModules } from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { color } from 'react-native-reanimated';



const ChooseBetweenUsers =({navigation}) => {

    return (
       
      <ImageBackground source={require('../assets/Background.jpg')} 
      style={{width: '100%', height: '100%'}}>
        <View style={styles.header2}>
                 
                 <Animatable.Image 
              animation="bounceIn"
              duraton="400000"
              source={require('../assets/UserLogo.png')}
              style={{width: 240, height:110}}
              resizeMode="stretch"
         
              />
              <LinearGradient
              colors={['#fff','#fff']}
              style={{width: '100%', height: '0.5%'}} /> 

              </View>

      <View style={styles.header}>
    
       
        
               
               

              <Animatable.Image 
              animation="fadeInRight"
              duraton="80000"
              source={require('../assets/User.png')}
              style={{width: 150, height:125}}
              resizeMode="stretch"
              />
                  
              <Animatable.View animation="fadeInRight" duration={2000}>
              <TouchableOpacity onPress={()=> navigation.navigate('UserLogin')}>
                  <LinearGradient
                      colors={['#AFB42B','#827717']}
                      style={styles.signIn}> 
                      <Text style={styles.textSign}>مستخدم</Text>
                  </LinearGradient>
              </TouchableOpacity>
              </Animatable.View>
              
              <Animatable.Image 
              animation="fadeInLeft"
              duraton="80000"
              source={require('../assets/Driver.png')}
              style={{width: 150, height:137}}
              resizeMode="stretch"
              marginTop= {30}
              />
              
              <Animatable.View animation="fadeInLeft" duration={2000}>
              <TouchableOpacity onPress={()=> navigation.navigate('DriverLogin')}>
                  <LinearGradient
                colors={['#AFB42B','#827717']}
                style={styles.signIn}> 

                      <Text style={styles.textSign}>سائق</Text>
                  </LinearGradient>
              </TouchableOpacity>
              </Animatable.View>
             
               
              

  <View style={styles.action}>
    <Text></Text>
  <Animatable.View animation="bounceIn" duration={7000}  colors={['#AFB42B','#827717']}>
    <FontAwesome onPress={() => navigation.navigate('AdminLogin')}
         name="gear"
         color= '#9E9D24'
         size={28}
         />
         </Animatable.View>
         <Text>    </Text>
         <Animatable.View animation="bounceIn" duration={7000} >
         <FontAwesome onPress={()=> navigation.navigate('UserLogin')}
         name="exclamation-circle"
         color= '#9E9D24'
         size={28}
         />
         </Animatable.View>
        <Text>    </Text>
        <Animatable.View animation="bounceIn" duration={7000} >
         <FontAwesome onPress={()=> navigation.navigate('UserLogin')}
         name="phone"
         color= '#9E9D24'
         size={28}
        />
        </Animatable.View>
   
    
    </View>
        

          </View>
         
          </ImageBackground>

       

    )
  }


const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.150;
const wight_logo = width * 0.280
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
   // marginBottom: 10
},header2: {
 flex: 0.25,
  justifyContent: 'center',
  alignItems: 'center',
marginTop: 30,
 // marginBottom: 10
},
footer: {
    flex: 1,
   // borderTopLeftRadius: 30,
  //  borderTopRightRadius: 30,
    //paddingVertical: 80,
   // paddingHorizontal: 0,
    justifyContent: 'center',
  //  marginLeft: 320,
   marginTop: 30,
  marginTop: 80
  
},
logo: {
    width: wight_logo ,
    height: height_logo,
   // marginTop: 50 ,
    // alignItems: 'center',
  //  justifyContent: 'center',
},
text: {
  color: 'grey',
  marginTop:5
},
button: {
  alignItems: 'flex-end',
  marginTop: 30
}, 
signIn: {
  width: 150,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 50,
  flexDirection: 'row',

},
image: {
  flex: 1,

},
textSign: {
  color: 'white',
  fontWeight: 'bold',
},
action: {
  flexDirection: Platform.OS === 'android' && 
  NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
  NativeModules.I18nManager.localeIdentifier === 'ar_SA' ||
  NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'row' : 'row-reverse',
  marginTop: 130,
  borderBottomWidth: 1,
  borderBottomColor: '#f2f2f2',
  paddingBottom: 80,
  fontWeight: 'bold',
  

},
text_footer: {
  fontSize: 18,
  textAlign: Platform.OS === 'android' && 
  NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
  NativeModules.I18nManager.localeIdentifier === 'ar_SA'||
  NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
},
textInput: {
  flex: 1,
  marginTop: Platform.OS === 'ios' ? 0 : -12,
  //paddingLeft: 50,
  textAlign: 'center',
  //paddingRight: 50,

}
});

export default ChooseBetweenUsers