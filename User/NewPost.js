import React, {useState,useEffect} from 'react';
import {View,NativeModules, StyleSheet,
    TouchableOpacity,TextInput, Text,Alert, Image
} from 'react-native';
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firebase from '../Database/firebase';
import AlertView from "../components/AlertView";
import { LinearGradient } from 'expo-linear-gradient';
import {MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import moment from 'moment-hijri';

const  NewPost= ({navigation}) =>{
    const[Description,setDescription]=useState('');
    const[Subject,setSubject]=useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [UserName,setUserName] = useState('')


    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',  
    });

    const [data,setData]=React.useState({
        isLoading:false ,
        noDescription: true,
        noSubject: true,
        lengthOfSubject:true,
        specialCharacters:true
    });
    
      useEffect(() => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hijriDate = moment()
                      .format('iYYYY/iM/iD');
        var time = moment()
                      .format(' hh:mm a');
        setCurrentDate(date + '/' + month + '/' + year + ' | ' + hijriDate 
        + ' ' + time);
      }, []);
 

    const reSetData=()=>{
        setDescription('');
        setSubject('');
        setData({
            ...data,
            noSubject: true,
            noDescription: true

        });
    }

    var userId = firebase.auth().currentUser.uid;
                var query = firebase.database().ref('User/' + userId);
                query.once("value").then(function(result){
                setUserName(result.val().UserName);
                });  
    
        const Add=()=>{    
          console.log(Subject.length);
                var userId2 = firebase.auth().currentUser.uid;  
                var specialCharacters = /[+=@#$%^~&*/;"““”'’:{}|<>€£¥•‘؛[['٪ـ_]/;  
                console.log(specialCharacters.test(Subject));  
                if(Description == '' && Subject !== ''){
                    setData({
                    ...data,
                    noDescription: false,
                    noSubject: true,
                    specialCharacters:true,
                    lengthOfSubject: true,
                    })
                    }else if(Subject == '' && Description !== '' ){
                        setData({
                        ...data,
                        noDescription: true,
                        noSubject: false,
                        specialCharacters:true,
                        lengthOfSubject: true,
                        })
                        }else if(Subject == '' && Description == '' ){
                            setData({
                            ...data,
                            noDescription: false,
                            noSubject: false,
                            specialCharacters:true,
                            lengthOfSubject: true,
                            })
                            }
                            else if(Subject.length>80 ){
                              setData({
                              ...data,
                              lengthOfSubject: false,
                              noSubject: true,
                              noDescription: true,
                              specialCharacters:true
                              })
                              }
                              else if(specialCharacters.test(Subject)){
                                setData({
                                ...data,
                                lengthOfSubject: true,
                                noSubject: true,
                                noDescription: true,
                                specialCharacters:false
                                })
                                }
                   else {     
                    firebase.database().ref('Posts/').push({
                        AuthorUserName: '@'+UserName,
                        Description: Description,
                        Subject: Subject,
                        Date: currentDate,
                        Id: userId2
                    }).then((data)=>{
                        setTimeout(()=>{
                            setAlert({
                                ...alert,
                                Title:'',
                                Message:'تم نشر منشورك بنجاح',
                                jsonPath:"success",
                                alertVisible:true,
                            });
                            setTimeout(() => {
                                reSetData();
                                navigation.navigate("UserHomePage")
                            }, 1000)
                        },250)
                        console.log('data ' , data);
                    }).catch((error)=>{
                        //error callback
                        setData({
                            ...data,
                            isLoading:false 
                        })
                        Alert.alert(error.message)
                        console.log('error ' , error)
                    }) 
                    
                    }       
    }


    return(
        <View style={styles.container}>
                    

            <View  style={styles.fixedHeader}>
         <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{ height: '100%', width: '100%', flexDirection:'row', justifyContent: 'space-between'}}>
            
                     <Image source={require('../assets/UserLogo2.png')} 
                     style={styles.logo}
                     resizeMode='stretch' />
                     <Text style={styles.text_header}>منشور جديد</Text>
                    {/* <MaterialIcons name="cancel" size={33} color="#ffffff" style={Platform.OS === 'android' && 
                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                    NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                    styles.iconAndroid:styles.iconIOS} 
                    onPress={()=> {navigation.navigate("UserHomePage")}}
                    /> */}
                  
                   <FontAwesome5 name="chevron-right" size={24} color="#fff" style={styles.icon}
                    onPress={()=>navigation.goBack()}
                    />

            </LinearGradient>
        
            </View>
            <View backgroundColor= "#fff" flex= {1} >
            
            <View style={styles.header}> 
            
              </View>
              <KeyboardAwareScrollView style={{flex:1}}>

              <Text style={styles.action}>العنوان:</Text>

              <View style={styles.action1}>
            <TextInput style={styles.textInput} 
            label="Subject"
            placeholder="اكتب هنا ما عنوان المنشور.."
            autoCapitalize="none"
            alignItems= 'flex-start' 
            editable={true} 
            onChangeText={(val)=>setSubject(val)}
            >
            </TextInput> 
            </View>

            {data.noSubject ? null : (
            <Animatable.View animation="fadeInRight" duration={500}>
          <Text style={styles.errorMsg}>
            يجب ملء العنوان حتى يتم النشر
          </Text>
          </Animatable.View>
      ) }

{data.lengthOfSubject ? null : (
            <Animatable.View animation="fadeInRight" duration={500}>
          <Text style={styles.errorMsg}>
            يجب أن لا يتجاوز العنوان ٢٠ حرف
          </Text>
          </Animatable.View>
      ) }
      {data.specialCharacters ? null : (
            <Animatable.View animation="fadeInRight" duration={500}>
          <Text style={styles.errorMsg}>
            يجب أن لا يحتوي العنوان على رموز، عدا -، ؟، "،"، !، .، )، (
          </Text>
          </Animatable.View>
      ) }

            <Text style={styles.action}>الوصف:</Text>

            <View style={styles.action2}>
            <TextInput style={styles.textInput} 
            label="Description"
            placeholder="اكتب هنا ما تريد نشره.."
            autoCapitalize="none"
            multiline={true}
            alignItems= 'flex-start' 
            editable={true} 
            onChangeText={(val)=>setDescription(val)}
            >
            </TextInput> 
            </View>

       
           {data.noDescription ? null : (
            <Animatable.View animation="fadeInRight" duration={500}>
          <Text style={styles.errorMsg2}>
            يجب ملء الوصف حتى يتم النشر
          </Text>
          </Animatable.View>
      ) }
            
            <TouchableOpacity 
            style={styles.PublishButton}
            onPress={Add}>    
            <Text style={styles.okStyle}>نشر</Text>
            </TouchableOpacity>   

            {alert.alertVisible?
            <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
            :null}
             </KeyboardAwareScrollView>
            </View>
           
            
        </View>
    );
};

const styles = StyleSheet.create({
     container: {
        flex: 1,
      },
      fixedHeader: {
        backgroundColor: '#9E9D24',
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        height: '10%'
    },
    text_header: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
        marginRight: 125 , // was 130
        marginTop: 32, //was 40
        alignItems: 'center',
    },
    logo: {
      width: 85, // was 90
      height: 35, // was 40
      //marginRight: 50 , // was left 65
      marginTop: 30, // was top 36-35
      alignItems: 'center',
      justifyContent: 'center',
  },
  action: {
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
    margin:15,
    fontSize: 20,
    color: '#9E9D24',
    fontWeight: 'bold',
    textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
    
    
},
  action1: {
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
    borderWidth:2,
    fontSize: 10,
    borderColor:'#f2f2f2',
    paddingBottom: 20 ,
    borderRadius:5,
    width: '90%',
    marginRight: 20,
    textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
},
      action2: {
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        borderWidth:2,
        borderColor:'#f2f2f2',
        width: '90%',
        height: '60%',
        marginRight: 20,
        borderRadius:5,
        textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
    },
    text: {
        color: '#9E9D24',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        marginRight:'5%',
        marginLeft:'5%',
        marginTop:10
    },
    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : 0,
        color: '#05375a',
    },
      fabIOS: {
        position: 'absolute',
        margin: 16,
        left: 0,
        bottom: 0,
      },
     fabAndroid: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      },
      icon:{
        position: 'absolute',
        right: 14,
        marginTop: 35,
    },
      iconIOS:{
        position:'absolute',
        right:6,
        marginTop: 39, 
        alignItems: 'center',
      justifyContent: 'center',
    },
    iconAndroid:{
        position:'absolute',
        left:15,
        marginRight: 65 , // was left 65 --> must be tested
        marginTop: 28, // was top 36
        alignItems: 'center',
        justifyContent: 'center',
    },
    PublishButton:{
        borderRadius:5,
        elevation:2,
        width:'20%',
        height: '15%',
        marginLeft: 145 ,
        marginTop:10,
        backgroundColor: '#9E9D24',
        alignItems: 'center',
        justifyContent: 'center',
      
    }
    ,okStyle:{
    color:"#ffff",
    textAlign:'center',
    fontSize:20,

},
theItem:{
    backgroundColor: '#F3F3F3',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius :8,
    shadowColor :'#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 5,
    padding :12,
  },
errorMsg: {
    color: '#FF0000',
    fontSize: 14,
    marginRight: 20,
  textAlign: Platform.OS === 'android' && 
  NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
  NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
  NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
},
errorMsg2: {
    color: '#FF0000',
    fontSize: 14,
    marginRight: 20,
    marginBottom: 12,
  textAlign: Platform.OS === 'android' && 
  NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
  NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
  NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
},
flexDirectionStyle:{
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' ,
    textAlign :'center',
    color: '#9E9D24',
    marginTop: 5,
  },
});

export default NewPost;