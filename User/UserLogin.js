import React, {useState, useRef, useEffect, Component} from 'react';
import {Text, TextInput, TouchableOpacity, View, Dimensions, StyleSheet, Platform, ActivityIndicator, StatusBar,Alert, KeyboardAvoidingView, Modal} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient'; 
import { NativeModules } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from '../Database/firebase';
import { Ionicons, FontAwesome, Feather, Octicons, AntDesign} from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {FontAwesome5} from '@expo/vector-icons';
import Loading from '../components/Loading';





const  UserLogin =({navigation}) => {

  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const [message, showMessage] = React.useState((!recaptchaVerifier || Platform.OS === 'web')
  ? { text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device."}
  : undefined);
  const [data, setdata] = React.useState({
    ValidPhoneNumber: true,
    ValidInput: true,
    complet: true,
    sendver: false,
    Validcode: true,
    SendtoCreate: false,
    Valid: true,
    isLoading:false
  })

 

  
  

  const sendVerification = () => {
    if(phoneNumber === '') {
      setdata({
          ... data,
           ValidPhoneNumber: false,
           ValidInput: true,
        }); 
    }else if(phoneNumber.length  < 9 ){
      setdata({
        ... data,
        ValidInput: false,
        ValidPhoneNumber: true,
      })
    }
    else  {
      try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
       phoneProvider
        .verifyPhoneNumber('+966'+ phoneNumber, recaptchaVerifier.current)
        .then(setVerificationId);
      } catch (err) {
        showMessage({ text: `Error: ${err.message}`, color: "blue" });
      } 
      setdata({
        ... data,
        sendver: true,
        complet: false,
      });}
  }

  const confirmCode = () =>  {
    if(code === '') {
      setdata({
        ... data,
        Validcode: false,
        Valid: true
      })
      }
    else {
      setdata({
        ... data,
        isLoading:true
      })
    try {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code,
    ); 
    firebase.auth().signInWithCredential(credential).then((user) => {
      // Do something with the results here
        var userId = firebase.auth().currentUser.uid;
        var query = firebase.database().ref('User/' + userId);
        query.once("value").then(function(result){
          const userData = result.val();
          setdata({
            ... data,
            isLoading:false
          })
          if (userData){
            navigation.navigate("UserHomePage")
           }
           else{      
            firebase.database().ref('User/' + userId).set({
              PhoneNumber:'0'+phoneNumber,
            });
            navigation.navigate("CreateAccount");
          } 
            });  
          
       }).catch((error) => {
        setdata({
          ... data,
          Valid: false,
          Validcode: true,
          isLoading:false
        });
      })

        }
          catch(error){ 
            Alert.alert(error)}
           
  } }

 
  

  

  
    


  
  
  return (  

    

    <View style={styles.container}>
      <KeyboardAwareScrollView >
        <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebase.app().options}/>
        <View style={styles.header}>
       {/* <StatusBar backgroundColor='#009387' barStyle="light=content"/> */}

        <Animatable.Image 
         animation="bounceIn"
         duraton="1500"
         source={require('../assets/UserLogo.png')}
         style={styles.logo}
         resizeMode="stretch"/>
       <Text style={styles.text_header}>تسجيل الدخول</Text>
       </View>

      <Modal visible={data.complet} transparent={true}>
          <View backgroundColor= "#fff" flex= {1} >
          <StatusBar backgroundColor='#009387' barStyle="light=content"/>
          
          <View style={styles.header}>
          <FontAwesome5 name="chevron-right" size={24} color="#161924" style={Platform.OS === 'android' && 
              NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
              NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
              NativeModules.I18nManager.localeIdentifier === 'ar_AE'?styles.iconAndroid:styles.iconIos}
              onPress={()=>navigation.goBack()}
              />
        <Animatable.Image 
         animation="bounceIn"
         duraton="1500"
         source={require('../assets/UserLogo.png')}
         style={styles.logo}
         resizeMode="stretch"/>
       <Text style={styles.text_header}>تسجيل الدخول</Text>
       </View>

       <Animatable.View animation="fadeInUpBig"style={styles.footer}>
       <Text style={styles.text_footer}>رقم الجوال:</Text>
       <View style={styles.action}>
       <Feather
        name="phone-call"
        color="#9E9D24"
        size={20}/> 

        <TextInput style={styles.textInput} 
        placeholder="ادخل رقم الجوال"
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength = {9}
        /> 
        <Text fontWeight="bold">+966</Text>
        </View>

        {data.ValidPhoneNumber ? null : (
            <Animatable.View animation="fadeInRight" duration={500}>
          <Text style={styles.errorMsg}>
            يجب إدخال رقم الجوال
          </Text>
          </Animatable.View>
      ) }

         {data.ValidInput ? null: (
            <Animatable.View animation="fadeInRight" duration={500}>
          <Text style={styles.errorMsg}>
            يجب إدخال جميع الأرقام
          </Text>
          </Animatable.View>
      ) }
        
             <TouchableOpacity onPress={() => sendVerification()}>
              <View style={styles.button}>
             <LinearGradient
              colors={['#AFB42B','#827717']}
              style={styles.signIn}> 
              <FontAwesome 
             name="send-o"
             color="#fff"
              size={20}/> 
              </LinearGradient>
              </View>
              </TouchableOpacity> 
              </Animatable.View>

              {
                data.sendver ?
                true:
                <TouchableOpacity onPress={() => setPhoneNumber(data.complet)}>
                </TouchableOpacity>
              }
 </View>
      </Modal>

       <Animatable.View animation="fadeInUpBig"style={styles.footer}>
              
           <Text style={styles.text_footer}>رقم التحقق:</Text>
           <View style={styles.action}>
           <AntDesign
           name="checkcircleo"
           color="#9E9D24"
           size={20}/> 
           <TextInput style={styles.textInput} 
           placeholder="ادخل رقم التحقق"
            onChangeText={setCode}
           keyboardType="number-pad"
           />
           </View>

         
      {data.Validcode ? null : (
            <Animatable.View animation="fadeInRight" duration={500}>
          <Text style={styles.errorMsg}>
            يجب إدخال رمز التحقق
          </Text>
          </Animatable.View>
      ) }
       {data.Valid ? null : (
            <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>
              رمز التحقق المدخل غير صحيح
            </Text>
            </Animatable.View>
      ) }

    
           

           <TouchableOpacity onPress={() => confirmCode()}>
           <View style={styles.button2}>
           {data.isLoading ?
                            <Loading></Loading>: 
           <LinearGradient 
              colors={['#AFB42B','#827717']}
              style={styles.signIn2}> 
              <Text style={[styles.textSign,{color:'#fff'}]}>إرسال</Text>
             

            </LinearGradient>
            }
            </View>
            </TouchableOpacity>  
      
      </Animatable.View>
      {message ? (
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, { backgroundColor: 0xffffffee, justifyContent: "center" }]}
          onPress={() => showMessage(undefined)}>
          <Text style={{color: message.color || "blue", fontSize: 17, textAlign: "center", margin: 20, }}>
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : undefined}
      </KeyboardAwareScrollView>
      </View>

      
    );

}

const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.20;
const wight_logo = width * 0.95;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff'
        
      },
      header: {
          flex: 1.3,
          justifyContent: 'flex-end',
          paddingHorizontal: 35,
          paddingBottom: 10,
          flexDirection: 'column',
          alignItems: 'center'
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
          marginTop: 10,
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
          paddingBottom: 5
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
      button2: {
        alignItems: 'center',
        marginTop: 15
    },
      signIn: {
          width: '13%',
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10
      }, 
      signIn2: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
      logo: {
        width: wight_logo ,
        height: height_logo,
        marginTop: 50 ,
        alignItems: 'center',
        justifyContent: 'center',
    },
      textSign: {
          fontSize: 18,
          fontWeight: 'bold'  
      },
  prefix: {
    paddingHorizontal: 100,
    fontWeight: 'bold',
    color: 'black'
  },
  iconIos:{
    position: 'absolute',
    right: 16,
    top:25
},
iconAndroid:{
  position: 'absolute',
  left: 16,
  top:20
}
});

export default UserLogin
