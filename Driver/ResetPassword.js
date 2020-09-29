import React, {useEffect} from 'react';
import { StyleSheet,
    Text,
    View, 
    TouchableOpacity,
    Platform, 
    TextInput,
    Alert,
    StatusBar,
    Dimensions,
    KeyboardAvoidingView,
    ActivityIndicator,
    NativeModules,
    Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesome5} from '@expo/vector-icons';
import { Title } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient'; 
import Loading from '../components/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from '../Database/firebase';
import AlertView from '../components/AlertView'

const ResetPassword=({navigation})=>{
    const [data,setData] = React.useState({
        Email: '',
        check_textInputChange: false,
        isValidEmail:true,
        EmailErrorMessage:'',
        isLoading:false
      });

    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',   
    })

    const textInputChange= (val)=>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(val.length != 0 && reg.test(val) === true){
          setData({
            ... data,
            Email: val,
            check_textInputChange:true
          });
        }else {
          setData({
            ... data,
            Email: val,
            check_textInputChange:false
          });
        }
    }

    const checkValidEmail=()=>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(data.Email==""){
            setData({
                ...data,
                isValidEmail:false,
                EmailErrorMessage:'يجب إدخال البريد الإلكتروني'
            });
            return false; 
        }else if(reg.test(data.Email) === false){
            setData({
                ...data,
                isValidEmail:false,
                EmailErrorMessage:'يحب إدخال الإيميل بالشكل الصحيح'
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

    const SendResetPasswordEmail=()=>{
        setData({
            ... data,
            isLoading: true,
          });
        if(checkValidEmail()){
            firebase.auth().sendPasswordResetEmail(data.Email).then(()=>{
                setData({
                    ... data,
                    isLoading: false,
                  });
                  setTimeout(()=>{
                    setAlert({
                        ...alert,
                        Title:'تحقق من بريدك الوارد',
                        Message:'لقد أرسلنا لك رسالة بريد إلكتروني للتحقق',
                        jsonPath:"success",
                        alertVisible:true,
                    });
                    setTimeout(() => {
                        setAlert({
                            ...alert,
                            alertVisible:false,
                        });
                    }, 4000)
                  },400) 
            })
            .catch((error)=>{
                console.log(error.message);
                if(error.message==="There is no user record corresponding to this identifier. The user may have been deleted."){
                    setData({
                        ... data,
                        isLoading: false,
                      });
                      setTimeout(()=>{
                        setAlert({
                            ...alert,
                            Title:'البريد الإلكتروني',
                            Message:'لا يوجد البريد الإلكتروني مطابق لهذا البريد. ربما تم حذف المستخدم.',
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
                    Alert.alert(error.message)
                }
            });
        }else{
Alert
        }
    }
return(
    <KeyboardAwareScrollView style={styles.container}>
    <View style={styles.container}>
        <SafeAreaView>
            <TouchableOpacity
                    style={{margin: 16}}
                    onPress={()=>navigation.goBack(null)}>  
                        <FontAwesome5 name="chevron-left" size={24} color="#212121"/>
            </TouchableOpacity>

            <View style={styles.header}>               
                <Animatable.Image 
                    animation="slideInUp"
                    duraton="1500"
                    style={styles.profile_image}
                    source={require('../assets/resetPassword.png')}
                    />
                <Image
                    style={{width:'80%',margin:10}}
                    source={require('../assets/line.png')}/>
            </View>

            <Animatable.View 
                // animation="bounceIn"
                animation="slideInUp"
                duraton="1500"
                style={styles.footer}>
                {/* <View style={styles.centerdStyle}> */}
                    <Title style={styles.text_header} >هل نسيت كلمة المرور؟</Title>
                    <View style={styles.action}>
                        <FontAwesome
                            name="envelope"
                            color="#9E9D24"
                            size={20}/> 
                
                        <TextInput style={styles.textInput} 
                        //   value={data.UserName}
                            label="Email"
                            placeholder="أدخل البريد الاكتروني"
                            autoCapitalize="none"
                            onChangeText={(val)=>textInputChange(val)}
                            onEndEditing={() => checkValidEmail()}>
                        </TextInput>  

                        {data.check_textInputChange?
                            <Animatable.View Animation="bounceIn" duraton="1500">
                            <Feather
                            name="check-circle"
                            color="green"
                            size={15}/> 
                            </Animatable.View> 
                        :
                            null
                        }   
                    </View>
                {/* </View> */}
                {data.isValidEmail ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                        <Text style={styles.errorMsg}>{data.EmailErrorMessage}</Text>
                                        </Animatable.View>
                                    }

                <TouchableOpacity 
                    onPress={() => SendResetPasswordEmail()}
                    >
                    <View style={styles.button}>

                        {data.isLoading ? 
                            <Loading></Loading>  
                        : 
                            <LinearGradient
                                colors={['#AFB42B','#827717']}
                                style={styles.signIn}> 
                                <Text style={[styles.textSign,{color:'#fff'}]}>إرسال </Text>
                            </LinearGradient>
                        }      
                    </View>
                </TouchableOpacity>
            
            </Animatable.View> 
        </SafeAreaView>
        {alert.alertVisible?
                        <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
                    :
                        null
                    }
    </View>
    </KeyboardAwareScrollView>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#fff",
    },
    profile_image:{
        width:140,
        height:150,
        marginTop:-20,
        marginBottom: 15
    },
    centerdStyle:{
        alignItems:'center',
        justifyContent:'center',
        // marginTop:50,
    },
    titleStyle:{
      color:'#212121',
      fontWeight: 'bold',
      fontSize:25,
    //   marginTop:40
    },
    action: {
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row' : 'row-reverse',
        marginTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        shadowColor :'#827717',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        margin:5,
        borderRadius: 10,
        padding:15,
        backgroundColor:'#fff'  
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        textAlign: 'right',
        paddingRight: 10        
    },
    button: {
        alignItems: 'center',
        marginTop: 20,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'  
    },
    footer: {
        flex: 1.5,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    header: {
        flex: 1.3,
        justifyContent: 'flex-end',
        paddingHorizontal: 35,
        paddingBottom: 10,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 40
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
        paddingLeft:15,
        paddingRight:15,
    },
    text_header: {
        color: '#9E9D24',
        fontWeight: 'bold',
        fontSize:25,
        textAlign: 'center'
    }
});
export default ResetPassword