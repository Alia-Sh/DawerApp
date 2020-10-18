import React, {useEffect} from 'react';
import { StyleSheet, 
  Text,
  View, 
  TouchableOpacity,
  Platform, 
  TextInput,
  StatusBar,
  Dimensions,
  NativeModules} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient'; 
import firebase from '../Database/firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '../components/Loading';
import {FontAwesome5} from '@expo/vector-icons';


const DriverLogin =({navigation}) => {
  
  const [data,setData] = React.useState({
    UserName: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    isValidUserAndPassword: true,
    isLoading:false
  });


  const textInputChange= (val)=>{
    if(val.length != 0){
      setData({
        ... data,
        UserName: val,
        check_textInputChange:true
      });
    }else {
      setData({
        ... data,
        UserName: val,
        check_textInputChange:false
      });
    }
  }

  const handlePasswordChange=(val)=>{
    setData({
      ... data,
      password: val,
    });
  }

  const updateSecureTextEntry=()=>{
    setData({
      ... data,
      secureTextEntry:!data.secureTextEntry
    })
  }

const userLogin = () => { 
  if(data.UserName === '' && data.password === '') {
    setData({
        ...data,
        isValidUser: false,
        isValidPassword: false,
        isValidUserAndPassword:true
    });
  }else if(data.UserName === ''){
    setData({
        ...data,
        isValidUser: false,
        isValidPassword: true,
        isValidUserAndPassword:true
    });
  }else if(data.password === ''){
    setData({
        ...data,
        isValidUser: true,
        isValidPassword: false,
        isValidUserAndPassword:true
    });
  }else {
    setData({
      ...data,
      isValidUser: true,
      isValidPassword: true,
      isLoading:true
    });
    firebase.database().ref("DeliveryDriver").orderByChild("UserName")
      .equalTo(data.UserName.toLowerCase()).once("value", snapshot => {
          const userData = snapshot.val();  
          // Check if the Driver  exist.
        if (userData) {
          console.log("Driver exist!");
          snapshot.forEach(function(snapshot){
            try{
              firebase.auth().signInWithEmailAndPassword(snapshot.val().Email,data.password)
              .then(user => {
                setData({
                  UserName: "",
                  password: "",
                  check_textInputChange: false,
                  secureTextEntry: true,
                  isValidUser: true,
                  isValidPassword: true,
                  isValidUserAndPassword: true,
                  isLoading:false
                });
              navigation.navigate("DriverHomePage")
              }).catch((error) => {
                  setData({
                    ...data,
                    isValidUser: true,
                    isValidPassword: true,
                    isValidUserAndPassword:false,
                    isLoading:false,
                  });
                  console.log(error);
                })
              }catch(error){
                setData({
                  ...data,
                  isValidUser: true,
                  isValidPassword: true,
                  isValidUserAndPassword:true,
                  isLoading:false
                });
                console.log(error);
              }
          });
          // Check if the Driver doesnt exist.
        } else {
            console.log("Driver doesn't exist!");
            setData({
              ...data,
              isValidUser: true,
              isValidPassword: true,
              isValidUserAndPassword:false,
              isLoading:false
          });
          }
      });
    }
}
// to be removed  
const createDriver=()=>{

  firebase.auth().createUserWithEmailAndPassword(data.UserName.concat("@gmail.com"), data.password).then((user)=>{
    if (firebase.auth().currentUser) {
      var userId = firebase.auth().currentUser.uid;
      if (userId) {
          firebase.database().ref('DeliveryDriver/' + userId).set({
            Email:data.UserName.concat("@gmail.com"),
            Name:"Fouz Ali",
            Password:data.password,
            PhoneNumber:"0555555555",
            UserName:data.UserName,
            DeliveryArea:"شرق الرياض"
          });
      }
    }
  }).catch(function(error) {
    // Handle Errors here.
      console.log('Register!');
      console.log(error);
  })
}

// to be removed  
const createUser=()=>{

  firebase.auth().createUserWithEmailAndPassword(data.UserName.concat("@gmail.com"), data.password).then((user)=>{
    if (firebase.auth().currentUser) {
      var userId = firebase.auth().currentUser.uid;
      if (userId) {
          firebase.database().ref('User/' + userId).set({
            Name:"Fouz Ali",
            Password:data.password,
            PhoneNumber:"0555555555",
            UserName:data.UserName,
          });
          firebase.database().ref('User/' + userId+'/Location').set({
            address:"2672 Al Buhturi, Az Zahra, Riyadh 12811 6993, Saudi Arabia",
            latitude:24.688122806487524,
            longitude:46.729763634502895
          });
      }
    }
  }).catch(function(error) {
    // Handle Errors here.
      console.log('Register!');
      console.log(error);
  })
}

  return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>

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
            source={require('../assets/DriverLogo.png')}
            style={styles.logo}
            resizeMode="stretch"/>
        
           <Text style={styles.text_header}>تسجيل الدخول</Text>

        </View>

        {data.isValidUserAndPassword ? 
            null 
            : 
            <Animatable.View animation="fadeInRight" duration={500}>
                <Text style={styles.errorMsg2}>اسم المستخدم أو كلمة المرور غير صحيحة</Text>
            </Animatable.View>
        }

        <Animatable.View animation="fadeInUpBig"style={styles.footer}>
          
            <Text style={styles.text_footer}>اسم المستخدم:</Text>

            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#9E9D24"
                size={20}/> 
          
              <TextInput style={styles.textInput} 
                  value={data.UserName}
                  label="UserName"
                  placeholder="ادخل اسم المستخدم"
                  autoCapitalize="none"
                  onChangeText={(val)=>textInputChange(val)}>
              </TextInput>  

              {data.check_textInputChange?
                <Animatable.View Animation="bounceIn">
                  <Feather
                      name="check-circle"
                      color="green"
                      size={15}/> 
                </Animatable.View> 
                :
                null
              }   
            </View>

            {data.isValidUser ?
              null 
              : 
              <Animatable.View animation="fadeInRight" duration={500}>
                <Text style={styles.errorMsg}>يجب ادخال اسم المستخدم</Text>
              </Animatable.View>
            }
            
            <Text style={[styles.text_footer,{marginTop: 25}]}>كلمة المرور:</Text>

            <View style={styles.action}>
              <Feather
                  name="lock"
                  color="#9E9D24"
                  size={20}/> 

              <TextInput style={styles.textInput} 
                  value={data.password}
                  label="Password"
                  placeholder="ادخل كلمة المرور"
                  autoCapitalize="none"
                  secureTextEntry={data.secureTextEntry?true:false}
                  onChangeText={(val)=>handlePasswordChange(val)}
                  textAlign= 'right'
                  >
                </TextInput>  

              <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry?
                      <Feather
                        name="eye-off"
                        color="grey"
                        size={15}/>  
                    :
                      <Feather
                        name="eye"
                        color="grey"
                        size={15}/> 
                  }
              </TouchableOpacity>   
            </View>

            {data.isValidPassword ?
                null 
              : 
                <Animatable.View animation="fadeInRight" duration={500}>
                    <Text style={styles.errorMsg}>يجب ادخال كلمة المرور</Text>
                </Animatable.View>
            }
            <TouchableOpacity 
            onPress={()=>{navigation.navigate("ResetPassword")}}
            >
            <Text style={[styles.text_forgetPass,{marginTop: 12}]}>هل نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => userLogin()}>
                <View style={styles.button}>

                  {data.isLoading ? 
                      <Loading></Loading>  
                    : 
                      <LinearGradient
                      colors={['#AFB42B','#827717']}
                      style={styles.signIn}> 

                        <Text style={[styles.textSign,{color:'#fff'}]}>تسجيل الدخول </Text>
                      </LinearGradient>
                  }      
                </View>
            </TouchableOpacity> 
        </Animatable.View>
        </KeyboardAwareScrollView>
      </View>
  );
}
const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.28;
const wight_logo = width * 0.85;

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
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
  },
  text_forgetPass: {
    color: '#757575',
    fontSize: 15,
    // marginLeft:15,
    textAlign: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'right':'left',
},
  action: {
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,

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
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
  },
  errorMsg2: {
    color: '#FF0000',
    fontSize: 14,
    textAlign: 'center',
},
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
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

export default DriverLogin