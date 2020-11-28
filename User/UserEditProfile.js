import React, {useEffect,useState,useRef}from 'react';
import { StyleSheet, Text, View,Image,KeyboardAvoidingView,TextInput, Alert,ActivityIndicator,Modal,TouchableOpacity} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Title,Card,Button,FAB}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '../Database/firebase';
import * as ImagePicker from 'expo-image-picker';
import { NativeModules } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import Loading from '../components/Loading';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { AntDesign} from '@expo/vector-icons';
import AlertView from "../components/AlertView";
import {MaterialIcons} from '@expo/vector-icons';
import GoogleMap from '../components/GoogleMap';

const UserEditProfile  = ({navigation,route})=>{
    const recaptchaVerifier = useRef(null);
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const [message, showMessage] = React.useState((!recaptchaVerifier || Platform.OS === 'web')
    ? { text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device."}
    : undefined);
    const [alertVisible,setAlertVisible]= useState(false)
    var userId = firebase.auth().currentUser.uid;
    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',   
    })

    const getDetails=(type)=>{
        if(route.params){
            switch(type){
                case "UserName":
                    return route.params.UserName
                
                case "Name":
                    return route.params.Name

                case "Phone":
                        return route.params.Phone

                case "Location":
                    return route.params.Location

                case "Picture":
                    return route.params.Picture
            }
        }
        return ""
    }

    const [Name,setName] = useState(getDetails("Name"))
    const [Phone,setPhone] = useState(getDetails("Phone"))
    const [NewPhone,setNewPhone] = useState(Phone)
    const [UserName,setUserName] = useState(getDetails("UserName"))
    const [Location,setLocation] = useState({
        address:getDetails("Location").address,
        latitude:getDetails("Location").latitude,
        longitude:getDetails("Location").longitude
    })
    const [Picture,setPicture] = useState(getDetails("Picture"))
    const [CurrentPicture,setCurrentPicture] = useState(Picture)
    const [data,setData] = React.useState({
        isLoading:false,
        isValidPhone:true,
        PhoneErrorMessage:'',
        Validcode:true,
        CodeErrorMessage:'',
        LocationModal:false
      });

    const checkValidPhone=()=>{
        const reg = /^[0]?[789]\d{9}$/;
        if(NewPhone==""){
            setData({
                ...data,
                isValidPhone:false,
                PhoneErrorMessage:'يجب ادخال رقم الهاتف'
            });
            return false; 
        }else if(NewPhone.length<10){
            setData({
                ...data,
                isValidPhone:false,
                PhoneErrorMessage:'يجب ان يتكون رقم الهاتف من ١٠ ارقام'
            });
            return false;    
        }else{
            if(!data.isValidPhone){   
                setData({
                    ...data,
                    isValidPhone:true,
                    PhoneErrorMessage:''
                });                 
            }
            if(NewPhone!=Phone){
                updateProfilePhoneNumber()
            }
            return true;         
        }
    }

    const pickLocation=(address,latitude,longitude)=>{
        setLocation({
            ...Location,
            address:address,
            latitude:latitude,
            longitude:longitude
        })
        setData({
            ...data,
            LocationModal:false
        })
      }
      
    const updateUserInfo=()=>{
        var user = firebase.auth().currentUser;
        if(NewPhone!="" &&  NewPhone.length==10){
            setData({
                ... data,
                isLoading: true,
              });
              if(code!='' && verificationId!=null){
                var phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
                user.updatePhoneNumber(phoneCredential).then(()=>{
                    firebase.database().ref('User/' + userId).update({
                        PhoneNumber: NewPhone, 
                        Name: Name,
                        Location:Location  
                    }).then(function (){
                        if(Picture!="" && Picture!=CurrentPicture){
                        uploadImage(Picture,userId)
                        .then(()=> {
                            setData({
                                ...data,
                                isLoading:false
                            });
                            setCode('')
                            setVerificationId(null)
                            setNewPhone(Phone)
                            // navigation.navigate("UserViewProfile",{UserName,Name,Phone,Location,Picture})
                            navigation.goBack();
                            // retriveImage();
                        }).catch((error)=> {
                            setData({
                                ...data,
                                isLoading:false
                            });
                            Alert.alert(error.message);
                        });
                    }else{
                        setData({
                            ...data,
                            isLoading:false
                        });
                        setNewPhone(Phone)
                        setCode('')
                        setVerificationId(null)
                        // navigation.navigate("UserViewProfile",{UserName,Name,Phone,Location,Picture})
                        navigation.goBack();
                    }
                    })
                }).catch((error)=>{
                    if (error.message=="This credential is already associated with a different user account."){
                        setData({
                            ...data,
                            isLoading:false
                        }); 
                        setCode('')
                        setTimeout(()=>{
                            setAlert({
                                ...alert,
                                Title:'',
                                Message:'رقم الهاتف مرتبط بحساب اخر.',
                                jsonPath:"Error",
                                alertVisible:true,
                            });
                            setTimeout(() => {
                                setAlert({
                                    ...alert,
                                    alertVisible:false,
                                });
                            }, 4000)
                        },400)
                       }
                       else if (error.message=="The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user."){
                        setData({
                            ...data,
                            isLoading:false
                        }); 
                        setCode('')
                        setTimeout(()=>{
                            setAlert({
                                ...alert,
                                Title:'',
                                Message:'رمز التحقق SMS المستخدم غير صحيح.',
                                jsonPath:"Error",
                                alertVisible:true,
                            });
                            setTimeout(() => {
                                setAlert({
                                    ...alert,
                                    alertVisible:false,
                                });
                            }, 5000)
                            setTimeout(() => {
                                setAlertVisible(true)
                            }, 5000)
                            
                        },400)
                       }
                       else if (error.message=="The SMS code has expired. Please re-send the verification code to try again."){
                        setData({
                            ...data,
                            isLoading:false
                        }); 
                        setCode('')
                        setTimeout(()=>{
                            setAlert({
                                ...alert,
                                Title:'',
                                Message:'رمز التحقق SMS المستخدم منتهي الصلاحية، الرجاء المحاولة مرة اخرى.',
                                jsonPath:"Error",
                                alertVisible:true,
                            });
                            setTimeout(() => {
                                setAlert({
                                    ...alert,
                                    alertVisible:false,
                                });
                            }, 5000)
                            // setAlertVisible(true)
                        },400)
                       }
                       else{
                            setData({
                                ...data,
                                isLoading:false
                            }); 
                            setCode('')
                            console.log(error.message);
                            Alert.alert(error.message);
                        }
                })
              }else{
                firebase.database().ref('User/' + userId).update({
                    Name: Name,
                    Location:Location       
                }).then(function (){
                    if(Picture!="" && Picture!=CurrentPicture){
                    uploadImage(Picture,userId)
                    .then(()=> {
                        setData({
                            ...data,
                            isLoading:false
                        });
                        setNewPhone(Phone)
                        setCode('')
                        setVerificationId(null)
                        // navigation.navigate("UserViewProfile",{UserName,Name,Phone,Location,Picture})
                        navigation.goBack();
                        // retriveImage();
                    }).catch((error)=> {
                        setData({
                            ...data,
                            isLoading:false
                        });
                        Alert.alert(error.message);
                    });
                }else{
                    setData({
                        ...data,
                        isLoading:false
                    });
                    setNewPhone(Phone)
                    setCode('')
                    setVerificationId(null)
                    // navigation.navigate("UserViewProfile",{UserName,Name,Phone,Location,Picture})
                    navigation.goBack();
                }
                })
            }
        }
    }

    const selectImage = async () => {
        try {
          let response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
          })
          if (!response.cancelled) {
            setPicture(response.uri);
          }
        } catch (error) {
          console.log(error);
          Alert.alert(error.message);
        }
      }

    const uploadImage= async (uri,imageName)=>{
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("images/"+imageName);
        return ref.put(blob);
    }

    const resetData=()=>{
        setName(getDetails("Name"));
        setPhone(getDetails("Phone"));
        setNewPhone(Phone)
        setPicture(getDetails("Picture"))
        setLocation({
            ...Location,
            address:getDetails("Location").address,
            latitude:getDetails("Location").latitude,
            longitude:getDetails("Location").longitude
        })
        setData({
            ...data,
            isLoading:false,
            isValidPhone:true,
            PhoneErrorMessage:'',
            Validcode:true,
            CodeErrorMessage:'',
            LocationModal:false      
        })
        setCode('')
        setVerificationId(null)
        setAlert({
            ...alert,
            alertVisible:false,
            Title:'',
            Message:'',
            jsonPath:'',  
        })
        navigation.goBack();
    }

    const closeLocationModal=()=>{
        setData({
            ...data,
            LocationModal:false
        })
    }

    function updateProfilePhoneNumber() {

        var phoneNumber ="+966".concat(NewPhone.substring(1)); 
    
        var provider = new firebase.auth.PhoneAuthProvider();
        provider.verifyPhoneNumber(phoneNumber,  recaptchaVerifier.current)
            .then(setVerificationId)
            .then((result) => {
                setAlertVisible(true)
            })
            .catch((error) => {
                // Error occurred.
                if (error.message=="We have blocked all requests from this device due to unusual activity. Try again later."){
                        setAlert({
                            ...alert,
                            Title:'',
                            Message:'تم حظر جميع الطلبات الواردة من هذا الجهاز بسبب نشاط غير عادي. حاول مرة أخرى في وقت لاحق.',
                            jsonPath:"Error",
                            alertVisible:true,
                        });
                        setTimeout(() => {
                            setAlert({
                                ...alert,
                                alertVisible:false,
                            });
                        }, 4000)
                   }

                console.log(error);
            });
    }
    const checkValidCode=()=>{
        if(code==''){
           setData({
               ...data,        
               Validcode:false,
               CodeErrorMessage:'يجب ادخال رمز التحقق'
           }) 
            return false
        }else if(code.length<6){
            setData({
                ...data,        
                Validcode:false,
                CodeErrorMessage:'يجب ادخال رمز التحقق بشكل صحيح'
            }) 
            return false   
        }else{
            setData({
                ...data,        
                Validcode:true,
                CodeErrorMessage:''
            })
            return true   
        }
    }

    const closeModal=()=>{
        if(checkValidCode()){
            setAlertVisible(false) 
        }
    }

    
    return(
        <KeyboardAwareScrollView style={styles.root}>
            <View style={styles.root}>
                <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebase.app().options}/>
                <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:200}}>
                    <View style={styles.header}>
                    <FontAwesome5 name="chevron-right" size={24} color="#161924" style={styles.icon}
                        onPress={resetData}/>
                        <View>
                            <Text style={styles.headerText}>تحديث الملف الشخصي</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.footer}>
                    <View style={{alignItems:"center"}}>
                            <Image style={styles.profile_image} 
                            source={Picture==""?require('../assets/DefaultImage.png'):{uri:Picture}}
                            />
                        <FAB  
                            onPress={() =>selectImage ()}
                            small
                            icon="plus"
                            theme={{colors:{accent:"#C0CA33"}}}
                            style={Platform.OS === 'android'?styles.FABStyleAndroid:styles.FABStyleIOS}/>
                    </View>

                    <View style={{alignItems:"center",margin:10}}>
                        <Title>{UserName}</Title>
                    </View>

                    <Card style={styles.action}>
                        <View style={styles.cardContent}>
                            <Text style={styles.textStyle}>  الاسم</Text>
                            <TextInput style={styles.textInput} 
                                label="Name"
                                value={Name}
                                autoCapitalize="none"
                                textAlign= 'right'
                                onChangeText={text => setName(text)}>
                            </TextInput>  
                        </View>  
                    </Card> 

                    <Card style={styles.action}>
                        <View style={styles.cardContent}>
                            <Text style={styles.textStyle}>  رقم الهاتف</Text>
                            <TextInput style={styles.textInput} 
                            value={NewPhone}
                            autoCapitalize="none"
                            textAlign= 'right'
                            keyboardType="number-pad" //number Input
                            onChangeText={text => setNewPhone(text)}
                            onEndEditing={(val) => checkValidPhone(val)}
                            maxLength={10}>
                            </TextInput>  
                        </View>  
                    </Card> 

                    {data.isValidPhone ?
                        null 
                        : 
                        <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>{data.PhoneErrorMessage}</Text>
                        </Animatable.View>
                    }  
  
                    <Card style={styles.action} 
                        onPress={()=>        
                            setData({
                            ...data,
                            LocationModal:true
                        })}
                     >
                        <View style={styles.cardContent}>
                        <Text style={styles.textStyle}> الموقع</Text>
                            <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>{Location.address}</Text>
                            <Feather
                                    name="chevron-left"
                                    color="grey"
                                    size={23}/>  
                        </View>  
                    </Card>  

                    <View style={styles.button}> 
                         {data.isLoading ? 
                            <Loading></Loading>  
                        :
                        <Button icon="content-save" mode="contained" theme={theme }
                            onPress={() => updateUserInfo()}>
                                حفظ
                        </Button>
                        }
                    </View>
                     
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={alertVisible}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>

                                <Animatable.View animation="fadeInUpBig">
                                <MaterialIcons style={Platform.OS === 'android' && 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ? styles.iconAndroid:styles.iconIOS} name="clear" size={25} color="#424242" 
                                     onPress={()=>{ setAlertVisible(false) }}/>
              
                                    <Text style={styles.text_footer}>رقم التحقق:</Text>
                                    <View style={styles.action}>

                                        <AntDesign
                                            name="checkcircleo"
                                            color="#9E9D24"
                                            size={20}
                                            style={{paddingTop:10}}/> 
                                            <TextInput style={[styles.textInput,{padding:10}]} 
                                                placeholder="ادخل رقم التحقق"
                                                onChangeText={setCode}
                                                keyboardType="number-pad"
                                                onEndEditing={(val) => checkValidCode(val)}
                                                maxLength={6}
                                            />
                                    </View>
   
            
                                    {data.Validcode ? null : (
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                        <Text style={styles.errorMsg}>
                                        {data.CodeErrorMessage}
                                        </Text>
                                        </Animatable.View>
                                    ) 
                                    }
   
                                    <TouchableOpacity 
                                        onPress={() =>closeModal(false)}
                                    >
                                        <View style={styles.button2}>
                                        
                                            <LinearGradient 
                                                colors={['#AFB42B','#827717']}
                                                style={styles.signIn2}> 
                                                <Text style={[styles.textSign,{color:'#fff'}]}>تم</Text>
                                                
                                
                                            </LinearGradient>
   
                                        </View>
                                    </TouchableOpacity> 
   
               
            
         
                                </Animatable.View>
                            </View>
                        </View>
                </Modal>
                {alert.alertVisible?
                        <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
                    :
                        null
                }
                {data.LocationModal?<GoogleMap pickLocation={pickLocation} closeLocationModal={closeLocationModal}></GoogleMap>:null}

                    {message ? (
                        <TouchableOpacity
                            style={[StyleSheet.absoluteFill, { backgroundColor: 0xffffffee, justifyContent: "center" }]}
                            onPress={() => showMessage(undefined)}>
                            <Text style={{color: message.color || "blue", fontSize: 17, textAlign: "center", margin: 20, }}>
                                {message.text}
                            </Text>
                        </TouchableOpacity>
                            ) : 
                            undefined
                    }
                    {data.isLoading ? 
                        <Loading></Loading>  
                        :
                        null
                    }
            </View>
        </KeyboardAwareScrollView>
      
    );
}

const theme= {
    colors:{
        primary: "#C0CA33"
    }
}

const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor: '#F5F5F5',       
    },
    profile_image:{
        width:150,
        height:150,
        borderRadius:150/2,
        marginTop:-75 
    },
    action: {
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingRight:3,
        paddingLeft:3,
        width:'100%'
    },  
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        textAlign: 'right',
        fontSize:16,
        marginRight:10,        
    },
    textStyle:{
        color: '#9E9E9E',
        marginLeft:10,
        fontSize: 15
    },
    footer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop:-30,
        margin:20
    },
    button:{
        flexDirection:"row",
        justifyContent:"space-around",
        paddingTop:15,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:15
    },
    header:{
        width: '100%',
        height: 80,
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row':'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:10,
    },
    headerText:{
        fontWeight:'bold',
        fontSize: 18,      
        letterSpacing: 1, 
        textAlign:'center',
        color: '#212121'
    },
    icon:{
        position: 'absolute',
        left: 16
    },
    cardContent:{
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        padding:8,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        paddingRight:20
    },
    FABStyleAndroid:{
        marginLeft:90,
        marginTop:-23,
        flexDirection:'row-reverse' 
    },
    FABStyleIOS:{
        marginLeft:90,
        marginTop:-23,
    },
    centeredView:{
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        flex:1,
    },
    modalView:{
        width:'80%',
        margin:10,
        backgroundColor:"#fff",
        borderRadius:10,
        padding:15,
        alignItems:'center',
        shadowColor:'#161924',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius:3.85,
        elevation:5,        
    },
    text_footer: {
        color: '#9E9D24',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
    },
    button2: {
        alignItems: 'center',
        marginTop: 15,
    },
    signIn2: {
        width: '50%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'  
    }
})

export default UserEditProfile
