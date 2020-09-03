import React, {useEffect} from 'react';
import { StyleSheet, Text,View, TouchableOpacity,Platform, TextInput,Alert,StatusBar,Dimensions,KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient'; 
import { NativeModules } from 'react-native';
import firebase from '../Database/firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
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


//   const userLogin = () => { 
//     if(data.UserName === '' && data.password === '') {
//     //   Alert.alert('ادخل اسم المستخدم وكلمة المرور لتسجيل الدخول');
//     setData({
//         ...data,
//         isValidUser: false,
//         isValidPassword: false,
//         isValidUserAndPassword:true
//     });
//     }else if(data.UserName === ''){
//     //   Alert.alert('ادخل اسم المتخدم');
//     setData({
//         ...data,
//         isValidUser: false,
//         isValidPassword: true,
//         isValidUserAndPassword:true
//     });
//     }else if(data.password === ''){
//     //   Alert.alert('ادخل كلمة المرور');
//     setData({
//         ...data,
//         isValidUser: true,
//         isValidPassword: false,
//         isValidUserAndPassword:true
//     });
//     }else {
//         setData({
//             ...data,
//             // UserName:data.UserName.toLowerCase(),
//             isValidUser: true,
//             isValidPassword: true,
//             isLoading:true
//         });
//         data.UserName=data.UserName.toLowerCase()
//         firebase.database().ref('DeliveryDriver/').once('value', function (snapshot) {
//         snapshot.forEach(function(snapshot) { 
//           if(snapshot.val().UserName=== data.UserName && snapshot.val().Password === data.password){
//             console.log(snapshot.val())
//             setData({
//               ...data,
//               isLoading:false
//           });
//             navigation.navigate("DriverHomePage")
//           }else{
//             // Alert.alert('اسم المستخدم أو كلمة المرور غير صحيحة')
//             setData({
//                 ...data,
//                 isValidUser: true,
//                 isValidPassword: true,
//                 isValidUserAndPassword:false,
//                 isLoading:false
//             });
//           }
//         });
//       });
//   }
// }


const userLogin = () => { 
  if(data.UserName === '' && data.password === '') {
  //   Alert.alert('ادخل اسم المستخدم وكلمة المرور لتسجيل الدخول');
  setData({
      ...data,
      isValidUser: false,
      isValidPassword: false,
      isValidUserAndPassword:true
  });
  }else if(data.UserName === ''){
  //   Alert.alert('ادخل اسم المستخدم');
  setData({
      ...data,
      isValidUser: false,
      isValidPassword: true,
      isValidUserAndPassword:true
  });
  }else if(data.password === ''){
  //   Alert.alert('ادخل كلمة المرور');
  setData({
      ...data,
      isValidUser: true,
      isValidPassword: false,
      isValidUserAndPassword:true
  });
  }else {
      setData({
          ...data,
          // UserName:data.UserName.toLowerCase(),
          isValidUser: true,
          isValidPassword: true,
          isLoading:true
      });
      data.UserName=data.UserName.toLowerCase()
      data.UserName=data.UserName.concat("@gmail.com")
      // Alert.alert(data.UserName)
      try{
        firebase.auth().signInWithEmailAndPassword(data.UserName,data.password)
        .then(user => {
           setData({
            ...data,
            isLoading:false
        });
        navigation.navigate("DriverHomePage")
        }).catch((error) => {
            setData({
              ...data,
              isValidUser: true,
              isValidPassword: true,
              isValidUserAndPassword:false,
              isLoading:false
          });
        })
      }
      catch(error){
        setData({
          ...data,
          isValidUser: true,
          isValidPassword: true,
          isValidUserAndPassword:true,
          isLoading:false
      });
      Alert.alert(error)
      }

    //   firebase.database().ref('DeliveryDriver/').once('value', function (snapshot) {
    //   snapshot.forEach(function(snapshot) { 
    //     if(snapshot.val().UserName=== data.UserName && snapshot.val().Password === data.password){
    //       console.log(snapshot.val())
    //       setData({
    //         ...data,
    //         isLoading:false
    //     });
    //       navigation.navigate("DriverHomePage")
    //     }else{
    //       // Alert.alert('اسم المستخدم أو كلمة المرور غير صحيحة')
    //       setData({
    //           ...data,
    //           isValidUser: true,
    //           isValidPassword: true,
    //           isValidUserAndPassword:false,
    //           isLoading:false
    //       });
    //     }
    //   });
    // });
}
}


const readUserData= () => {
  firebase.database().ref('DeliveryDriver/').once('value', function (snapshot) {
    snapshot.forEach(function(snapshot) { 
      if(snapshot.val().UserName=== data.UserName && snapshot.val().Password === data.password){
        Alert.alert('User logged-in successfully!')
        console.log(snapshot.val())
      }else{
        Alert.alert('unsuccessfully')
      }
    });
  });
}
  

 const writeUserData =() => {
    firebase.database().ref('User/').push({
        Name: 'Fouz',
        UserName:'FouzAlrabai',
        PhoneNumber: '0508106364',
        Password: 'Fouz11223344',
        Email: 'Fouzalrabaye@gmail.com',
        location: 'Almalqa,Riyadh'
    }).then((data)=>{
        //success callback
        Alert.alert('User register successfully!')
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        Alert.alert(error.message)
        console.log('error ' , error)
    })
}


// const readUserData = ()=> {
//   var query = firebase.database().ref('DeliveryDriver/').orderByChild("UserName").equalTo("Fouz_39");
//   query.once("value").then(function(result) {
//     result.forEach(function(snapshot) { // loop over result snapshots, since there may be multiple
//       const userData = snapshot.val();
//       if(userData.Password==='fouz1234'){
//       Alert.alert(userData.Email)
//       console.log(snapshot.val())
//     }
//     });
//   });
// }
  return (

    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
    <View style={styles.container}>
        <StatusBar backgroundColor='#009387' barStyle="light=content"/>
      <View style={styles.header}>
            <Animatable.Image 
            animation="bounceIn"
            duraton="1500"
            source={require('../assets/DriverLogo.jpg')}
            style={styles.logo}
            resizeMode="stretch"            
            />
      
        <Text style={styles.text_header}>تسجيل الدخول</Text>
      </View>
      { data.isValidUserAndPassword ? null : 
            <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg2}>اسم المستخدم أو كلمة المرور غير صحيحة</Text>
            </Animatable.View>
            }
      <Animatable.View
        animation="fadeInUpBig"
        style={styles.footer}>
        <Text style={styles.text_footer}>اسم المستخدم:</Text>
        <View style={styles.action}>
          <FontAwesome
              name="user-o"
              color="#9E9D24"
              size={20}
                
          /> 
          
          <TextInput style={styles.textInput} 
                    label="UserName"
                    placeholder="ادخل اسم المستخدم"
                    autoCapitalize="none"
                    onChangeText={(val)=>textInputChange(val)}
                    >
          </TextInput>  
          {data.check_textInputChange?
          <Animatable.View
              Animation="bounceIn">
          <Feather
              name="check-circle"
              color="green"
              size={15}
              
          /> 
           </Animatable.View> 
          :null}   
        </View>
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>يجب ادخال اسم المستخدم</Text>
            </Animatable.View>
            }
            
        <Text style={[styles.text_footer,{marginTop: 25}]}>كلمة المرور:</Text>

        <View style={styles.action}>
          <Feather
              name="lock"
              color="#9E9D24"
              size={20}
          /> 
          <TextInput style={styles.textInput} 
                    label="Password"
                    placeholder="ادخل كلمة المرور"
                    autoCapitalize="none"
                    secureTextEntry={data.secureTextEntry?true:false}
                    onChangeText={(val)=>handlePasswordChange(val)}
                    textAlign= 'right'
                      >
          </TextInput>  
          <TouchableOpacity
            onPress={updateSecureTextEntry}
          >
            {data.secureTextEntry?
          <Feather
              name="eye-off"
              color="grey"
              size={15}
          />  
          :
          <Feather
          name="eye"
          color="grey"
          size={15}
            /> }
          </TouchableOpacity>   
        </View>

        { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>يجب ادخال كلمة المرور</Text>
            </Animatable.View>
            }
            
            <Text style={[styles.text_forgetPass,{marginTop: 12}]}>هل نسيت كلمة المرور؟</Text>
          
            
        <TouchableOpacity
            onPress={() => writeUserData()}
          >
        <View style={styles.button}>

        { data.isLoading ? <ActivityIndicator size="large" color="#9E9D24" /> : 
              <LinearGradient
              // colors={['#CDDC39','#9E9D24']}
              colors={['#AFB42B','#827717']}
              style={styles.signIn}
              >               
                  <Text style={[styles.textSign,{color:'#fff'}]}>تسجيل الدخول </Text>
                  
              </LinearGradient>

            }      

{/* <Button
          color="#3740FE"
          title="Logout"
          onPress={() => userLogin()}
        /> */}

              {/* <TouchableOpacity
                  onPress={()=>navigator.navigate('SignSpScreen')}
                  style={[styles.signIn,{
                    borderColor: '#009387',
                    borderWidth: 1,
                    marginTop: 15
                  }]}
              >
                <Text style={[styles.textSign,{color:'#009387'}
                ]}>Sign Up</Text>
              </TouchableOpacity> */}
        </View>
        </TouchableOpacity> 
      </Animatable.View>
    </View>
    </KeyboardAvoidingView>
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
      textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'left' : 'right',
  },
  text_forgetPass: {
    color: '#757575',
    fontSize: 15,
    textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'left' : 'right',
},
  action: {
      flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse',
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
    //   textAlign: 'right',
    textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'left' : 'right',

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
      
  }
});

export default DriverLogin