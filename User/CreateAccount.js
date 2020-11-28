import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View, Dimensions, StyleSheet, Platform, ActivityIndicator, StatusBar,Alert, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient'; 
import { NativeModules } from 'react-native';
import firebase from '../Database/firebase';
import {FontAwesome, Feather, Octicons, AntDesign} from '@expo/vector-icons';
import { YellowBox } from 'react-native';
import GoogleMap from '../components/GoogleMap';
YellowBox.ignoreWarnings(["Warning:"]);
console.disableYellowBox = true;

const CreateAccount = ({navigation})=>{



const [data, setdata]= React.useState({
    ValidName: true,
    ValidUserName: true,
    LocationExisting: true,
    Valid: true,
    // visible: true
    })

   var userId = firebase.auth().currentUser.uid;
   var query = firebase.database().ref('User/' + userId);
      query.once("value").then(function(result){
     const userData = result.val();
       setPhone(userData.PhoneNumber)
     });
     var query2 = firebase.database().ref('User/' + userId+'/Location');
     
     query2.once("value").then(function(result) {
         const userData = result.val();
         setLocation({
          ...Location,
          address:userData.address,
          latitude:userData.latitude,
          longitude:userData.longitude
      })
     });
 
//if (Location){
//  setdata({
 //   ...data,
  //  visible: true
 // })
//}


const [Name,setName] = useState('')
const [Phone,setPhone] = useState('')
const [UserName,setUserName] = useState('')
const [Location,setLocation] = useState({
  address:'',
  latitude:0,
  longitude:0
})
const [LocationModal,setLocationModal]=useState(false)

const pickLocation=(address,latitude,longitude)=>{
  setLocation({
      ...Location,
      address:address,
      latitude:latitude,
      longitude:longitude
  })
  setLocationModal(false)
}

const closeLocationModal=()=>{
  setLocationModal(false)
}

 const remove = () => {
  firebase.database().ref('User/' + userId).remove()
  navigation.navigate("ChooseBetweenUsers")
}

const checkValidName=()=>{
  if(Name==''){
    setdata({
      ... data,
      ValidName: false,
      });  
      return false;
  }else{
    setdata({
      ... data,
      ValidName: true,
      });  
      return true;  
  }
}

const checkValidUserName=()=>{
  if(UserName==''){
    setdata({
      ... data,
      ValidUserName: false,
      });  
      return false;
  }else{
    setdata({
      ... data,
      ValidUserName: true,
      }); 
      return true;  
  }
}

const checkValidLocation=()=>{
  if(Location.address==''){
    setdata({
      ... data,
      LocationExisting: false
      }); 
      return false;
  }else{
    setdata({
      ... data,
      LocationExisting: true
      }); 
      return true;  
  }
}

//  const Send = () => {
//     var query = firebase.database().ref('User/' + userId);
//     query.once("value").then(function(result){
//     const userData = result.val();
//     if (Name == '' && UserName != '' && Location.address != '' ){
//         setdata({
//         ... data,
//         ValidName: false,
//         ValidUserName: true,
//         LocationExisting: true
//         });  
//     }
    
//     else if (Location.address == '' && UserName == '' && Name != ''){
//       setdata({
//         ... data,
//         LocationExisting: false,
//         ValidUserName: false,
//         ValidName: true,
//         });
//     }
//     else if (UserName != ''  && Location.address == ''  && Name == ''){
//       setdata({
//         ... data,
//         ValidUserName: true,
//         LocationExisting: false,
//         ValidName: false,
//         });
//     }
//     else if (UserName != ''  && Name != ''&& Location == ''  ){
//       setdata({
//         ... data,
//         ValidUserName: true,
//         ValidName: true,
//         LocationExisting: false,
//         });
//     }
//     else if (UserName == ''  && Name == ''&& Location.address != ''  ){
//       setdata({
//         ... data,
//         LocationExisting: true,
//         ValidUserName: false,
//         ValidName: false,
//         });
//     }
//     else if(UserName == '' && Name == '' && Location.address == ''){
//       setdata({
//       ... data,
//       ValidUserName: false,
//       ValidName: false,
//       LocationExisting: false
//       });
//   } 
//     else if (Location.address != '' && UserName != '' && Name != ''){
//         firebase.database().ref('User/').orderByChild("UserName").equalTo(UserName.toLocaleLowerCase()).once("value", snapshot => {
//           const userData = snapshot.val();
//           if (userData){
//           setdata({
//             ...data,
//           Valid: false
//           });
//         }
//          else {
//             firebase.database().ref('User/' + userId).set({
//                 Name: Name,
//                 UserName: UserName,
//                 PhoneNumber: Phone,
//                 Location:Location,
//           });
//          navigation.navigate("UserHomePage");
//               }
//             });
//           }
//             });
          
// } 

const Send = () => {
  if (checkValidName() && checkValidUserName() && checkValidLocation()){
    var query = firebase.database().ref('User/' + userId);
    query.once("value").then(function(result){
    const userData = result.val(); 
     
        firebase.database().ref('User/').orderByChild("UserName").equalTo(UserName.toLocaleLowerCase()).once("value", snapshot => {
          const userData = snapshot.val();
          if (userData){
          setdata({
            ...data,
          Valid: false
          });
        }
         else {
            firebase.database().ref('User/' + userId).set({
                Name: Name,
                UserName: UserName,
                PhoneNumber: Phone,
                Location:Location,
          });
         navigation.navigate("UserHomePage");
              }
            });
        });
  }        
}



const navigate= () => {
  navigation.navigate("GoogleMapCreateAccount")
 // setdata({
   // ...data,
   // visible: false
 // })
}

return(
    
   <KeyboardAvoidingView 
   style={styles.container}
   behavior="padding">
<View style={styles.container}>

<View style={styles.header}>

       <StatusBar backgroundColor='#009387' barStyle="light=content"/>
        <Animatable.Image 
         animation="bounceIn"
         duraton="1500"
         source={require('../assets/UserLogo.png')}
         style={styles.logo}
         resizeMode="stretch"/>
       <Text style={styles.text_header}>إنشاء حساب</Text>
       </View>

             <Animatable.View animation="fadeInUpBig"style={styles.footer}>
              
              <Text style={styles.text_footer}>الاسم:</Text>
              <View style={styles.action}>
              <FontAwesome
              name="user-o"
              color="#9E9D24"
              size={20}/> 
              <TextInput style={styles.textInput} 
              placeholder="ادخل الاسم"
               onChangeText={setName}
              />
              </View>
   
            
             {data.ValidName ? null : (
               <Animatable.View animation="fadeInRight" duration={500}>
             <Text style={styles.errorMsg}>
               يجب إدخال الاسم
             </Text>
             </Animatable.View>
             ) }
             <Text style={styles.text_footer}>اسم المستخدم:</Text>
              <View style={styles.action}>
              <AntDesign
              name="idcard"
              color="#9E9D24"
              size={23}/> 
              <TextInput style={styles.textInput} 
              placeholder="ادخل اسم المستخدم"
              onChangeText={setUserName}
              />
              </View>
              
             {data.ValidUserName ? null : (
               <Animatable.View animation="fadeInRight" duration={500}>
             <Text style={styles.errorMsg}>
               يجب إدخال اسم المستخدم
             </Text>
             </Animatable.View>
              ) }
              {data.Valid ? null : (
               <Animatable.View animation="fadeInRight" duration={500}>
             <Text style={styles.errorMsg}>
               اسم المستخدم قيد الاستخدام بالفعل من قبل حساب اخر
             </Text>
             </Animatable.View>
             ) }
            
             <Text style={styles.text_footer}>رقم الجوال:</Text>
              <View style={styles.action}>
              <Feather
              name="phone"
              color="#9E9D24"
              size={20}/> 
              <Text style={styles.textInput}>{Phone}</Text>
              </View>
              <Text style={styles.text_footer}>الموقع:</Text>
              <View style={styles.action}>
              <Octicons
              name="location"
              color="#9E9D24"
              size={20}/> 
              <Text style={{flex: 1,flexWrap: 'wrap',textAlign:"right",marginRight:10}}>{Location.address}</Text>
             <Feather style={styles.feather} 
                      onPress={()=>        
                      setLocationModal(
                      true )}
             name="chevron-left"
             size={23}/>  
             </View>
   
            
         {data.LocationExisting ? null : (
               <Animatable.View animation="fadeInRight" duration={500}>
             <Text style={styles.errorMsg}>
               يجب إدخال الموقع
             </Text>
             </Animatable.View>
         ) }


   
   {/* <TouchableOpacity onPress={() => Send()}>
           <View style={styles.button2}>
           <LinearGradient 
              colors={['#AFB42B','#827717']}
              style={styles.signIn2}> 
              <Text style={[styles.textSign,{color:'#fff'}]}>تسجيل</Text>
            </LinearGradient>
            </View>
            </TouchableOpacity> 

            <TouchableOpacity onPress={() => remove()}>
           <View style={styles.button2}>
           <LinearGradient 
             colors={['#800000','#cd5c5c']}
              style={styles.signIn2}> 
              <Text style={[styles.textSign,{color:'#fff'}]}>إلغاء</Text>
            </LinearGradient>
            </View>
            </TouchableOpacity>  */}

<View style={[styles.flexDirectionStyle,styles.button,{marginTop:15}]}>
              <TouchableOpacity style={[styles.button,]}
                onPress={() => Send()}>
                <LinearGradient
                    colors={['#AFB42B','#827717']}
                    style={styles.signIn}>   
                  <Text style={[styles.textSign,{color:'#fff'}]}>تسجيل</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button]}
                     onPress={() => remove()}>
                <LinearGradient
                  colors={["#B71C1C","#D32F2F"]}
                  style={styles.signIn}>   
                   <Text style={[styles.textSign,{color:'#fff'}]}>إلغاء</Text>
                </LinearGradient>  
                </TouchableOpacity> 
            </View>
  
</Animatable.View>
{LocationModal?<GoogleMap pickLocation={pickLocation} closeLocationModal={closeLocationModal}></GoogleMap>:null}
</View>
</KeyboardAvoidingView>

   
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
      container2: {
        flex: 1 , 
        backgroundColor: '#fff'
        
      },
      header: {
          flex: 1,
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
      feather: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        color: '#9E9D24',
        textAlign: 'left',
   
        
    },
    Location: {
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      color: '#05375a',
      flex: 5,
      paddingLeft: 50
      
      
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
  flexDirectionStyle:{
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:10,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft:50,
    marginRight:50
  },
});


export default CreateAccount



