import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,KeyboardAvoidingView,TextInput, Alert,ActivityIndicator} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Title,Card,Button,FAB}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '../Database/firebase';
import * as ImagePicker from 'expo-image-picker';
import { NativeModules } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import AlertView from "../components/AlertView";
import Loading from '../components/Loading'

const DriverEditProfile  = ({navigation,route})=>{

    var user = firebase.auth().currentUser;
    var userId = user.uid;

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

                case "Email":
                    return route.params.Email
            }
        }
        return ""
    }

    const [Name,setName] = useState(getDetails("Name"))
    const [Phone,setPhone] = useState(getDetails("Phone"))
    const [UserName,setUserName] = useState(getDetails("UserName"))
    const [Location,setLocation] = useState(getDetails("Location"))
    const [Email,setEmail] = useState(getDetails("Email"))
    const [Picture,setPicture] = useState(getDetails("Picture"))
    const [data,setData] = React.useState({
        isLoading:false,
        isValidPhone:true,
        PhoneErrorMessage:'',
        isValidEmail:true,
      });
    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',   
    })

      const checkValidPhone=()=>{
        if(Phone==""){
            setData({
                ...data,
                isValidPhone:false,
                PhoneErrorMessage:'يجب ادخال رقم الهاتف'
            });
            return false; 
        }else if(Phone.length<10){
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
            return true;         
        }
    }

    const checkValidEmail=()=>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(Email==""){
            setData({
                ...data,
                isValidEmail:false,
                EmailErrorMessage:'يجب ادخال البريد الإلكتروني'
            });
            return false; 
        }else if(reg.test(Email) === false){
            setData({
                ...data,
                isValidEmail:false,
                EmailErrorMessage:'يحب ادخال الايميل بالشكل الصحيح'
            });
            return false; 
        }else{
            if(!data.isValidEmail){   
                setData({
                    ...data,
                    isValidEmail:true,
                    EmailErrorMessage:''
                });                 
            }
            return true;         
        }
    }

    const updateDriverInfo=()=>{
        if(checkValidPhone() && checkValidEmail()){
            setData({
                ... data,
                isLoading: true,
              });
                user.updateEmail(Email)
                    .then(function() {
                        firebase.database().ref('DeliveryDriver/' + userId).update({
                            Name: Name,
                            PhoneNumber: Phone, 
                            Email: Email
                    }).then(function(){

                        if(Picture!=""){
                            uploadImage(Picture,userId)
                                .then(()=> {
                                    setData({
                                        ...data,
                                        isLoading:false
                                    });
                                    navigation.navigate("DriverViewProfile",{UserName,Name,Phone,Location,Email,Picture})
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
                            navigation.navigate("DriverViewProfile",{UserName,Name,Phone,Location,Email,Picture}) 
                        }
                    })
                    .catch(function(error){
                        setData({
                            ... data,
                            isLoading: false,
                          });
                        console.log(error)
                    });
                  }).catch(function(error) {
                    // An error happened.
                    setData({
                        ... data,
                        isLoading: false,
                      });
                    console.log(error.message);
                    if(error.message==="The email address is already in use by another account."){
                        setTimeout(()=>{
                            setAlert({
                                ...alert,
                                Title:'البريد الإلكتروني',
                                Message:'عنوان البريد الإلكتروني قيد الإستخدام بالفعل من قبل حساب آخر',
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

                    }else if (error.message==="This operation is sensitive and requires recent authentication. Log in again before retrying this request."){
                        setTimeout(()=>{
                            setAlert({
                                ...alert,
                                Title:'',
                                Message:'هذه العملية حساسة وتتطلب مصادقة حديثة. قم بتسجيل الدخول مرة أخرى قبل إعادة محاولة هذا الطلب.',
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
                    }else{
                    Alert.alert(error.message);}
                  }); 
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
        setPhone(getDetails("Phone"))
        setEmail(getDetails("Email"))
        setPicture(getDetails("Picture"))
        setData({
            ...data,
            isLoading:false,
            isValidPhone:true,
            PhoneErrorMessage:'',
            isValidEmail:true,           
        })
        setAlert({
            ...alert,
            alertVisible:false,
            Title:'',
            Message:'',
            jsonPath:'',  
        })
        navigation.navigate("DriverViewProfile");
}

    return(
        <KeyboardAwareScrollView style={styles.root}>
            <View style={styles.root}>
            <SafeAreaView style={{flexDirection:'row-reverse'}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-right" size={24} color="#161924" style={styles.icon}
                        onPress={resetData}/>
                    <View>
                        <Text style={styles.headerText}>تحديث الملف الشخصي</Text>
                    </View>
                </View>
                </SafeAreaView>

                <View style={styles.footer}>
                <View style={{alignItems:"center"}}>
            
                <View style={{alignItems:"center"}}>
                            <Image style={styles.profile_image} 
                            source={Picture==""?require('../assets/DefaultImage.png'):{uri:Picture}}
                            />
                        <FAB  
                            onPress={() =>selectImage ()}
                            small
                            icon="plus"
                            theme={{colors:{accent:"#C0CA33"}}}
                            style={Platform.OS === 'android' && 
                            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                            NativeModules.I18nManager.localeIdentifier === 'ar_SA'?styles.FABStyleAndroid:styles.FABStyleIOS}/>
                    </View>
                        
                        <Image
                            style={{width:'70%',marginTop:15}}
                            source={require('../assets/line.png')}
                            />
                    
                    </View>

                    <View style={{alignItems:"center",margin:10}}>
                        <Title>@{UserName}</Title>
                    </View>

                    <Card style={styles.action}>
                        <View style={styles.cardContent}>
                            <Text style={styles.textStyle}>  الاسم</Text>
                            <TextInput style={Platform.OS === 'android'? styles.textInputAndroid : styles.textInputIOS} 
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
                        <Text style={styles.textStyle}> رقم الهاتف</Text>
                            <TextInput style={Platform.OS === 'android'? styles.textInputAndroid : styles.textInputIOS} 
                            label="Phone"
                            value={Phone}
                            autoCapitalize="none"
                            textAlign= 'right'
                            keyboardType="number-pad" //number Input
                            onChangeText={text => setPhone(text)}
                            onEndEditing={() => checkValidPhone()}
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

                    <Card style={styles.action}>
                        <View style={styles.cardContent}>
                            <Text style={styles.textStyle}>البريد الإلكتروني</Text>
                            <TextInput style={Platform.OS === 'android'? styles.textInputAndroid : styles.textInputIOS} 
                                label="Name"
                                value={Email}
                                autoCapitalize="none"
                                textAlign= 'right'
                                onEndEditing={() => checkValidEmail()}
                                onChangeText={text => setEmail(text)}>
                            </TextInput>  
                        </View>  
                    </Card> 

                    {data.isValidEmail ?
                    null 
                    : 
                        <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>{data.EmailErrorMessage}</Text>
                        </Animatable.View>
                    } 

                    <Card style={styles.action} 
                        onPress={()=>navigation.navigate("DriverEditPassword")} 
                    >
                        <View style={styles.cardContent}>
                        <Text style={styles.textStyle}>كلمة المرور</Text>
                            <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}></Text>
                            <Feather
                                    name="chevron-left"
                                    color="grey"
                                    size={23}/>  
                        </View>  
                    </Card>  

                    <Card style={styles.action}>
                        <View style={styles.cardContent}>
                            <Text style={styles.textStyle}>منطقة التوصيل</Text>
                    <Text style={styles.textInput,{color: '#757575',fontSize:16,marginLeft:10}}>{Location}</Text> 
                        </View>  
                    </Card> 

                    <View style={styles.button}> 
                        {data.isLoading ? 
                            <Loading></Loading>  
                        : 
                        <Button icon="content-save" mode="contained" theme={theme }
                            onPress={() => updateDriverInfo()}>
                            حفظ
                        </Button>
                        } 
                    </View>
                </View>
                {alert.alertVisible?
                        <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
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
        backgroundColor: '#fff',       
    },
    profile_image:{
        width:150,
        height:150,
        borderRadius:150/2,
        marginTop:-20 
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
        paddingLeft:3
    },  
    textInputIOS: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        color: '#05375a',
        textAlign: 'right',
        fontSize:16,
        marginRight:10,        
    },
    textInputAndroid: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -1,
        color: '#05375a',
        textAlign: 'right',
        fontSize:16,
        marginLeft:10,        
    },
    textStyle:{
        color: '#9E9E9E',
        marginLeft:10,
        fontSize: 15
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop:-20,
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
    },
    headerText:{
        fontWeight:'bold',
        fontSize: 18,      
        letterSpacing: 1, 
        textAlign:'center',
        color: '#9E9D24'
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
        padding:10,
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        paddingRight:20
    }
})

export default DriverEditProfile