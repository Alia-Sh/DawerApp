import React, {useState} from 'react';
import { StyleSheet,
   Text,
   View, 
   Platform, 
   TextInput,
   Alert,
   Dimensions,
   Modal,
   Picker,
   NativeModules,
  } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {Button}from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Animatable from 'react-native-animatable';
import firebase from '../Database/firebase';
import AlertView from "../components/AlertView";
import Loading from '../components/Loading';



  const RequestJoin=(props)=>{

    const [modal,setModal] = useState(true)
    const {height} = Dimensions.get("screen");
    const {width} = Dimensions.get("screen");
    const [selectedValue, setSelectedValue] = useState("شمال الرياض");
    const [Name, setName] = useState("");
    const [UserName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [Phone, setPhone] = useState("");
    const [Password, setPassword] = useState("");
    const[data,setData]=React.useState({
        isValidName:true,
        isValidUserName:true,
        isValidEmail:true,
        isValidPhone:true,
        isValidPassword:true,
        EroorMessage:'',
        EmailErrorMessage:'',
        PhoneErrorMessage:'',
    });
    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',
        isLoading:false,    
    })

    const checkValidName=()=>{
        if(Name==""){
            setData({
                ...data,
                isValidName:false,
            });
            return false; 
        }else{
            if(!data.isValidName){   
                setData({
                    ...data,
                    isValidName:true,
                });                 
            }
            return true;         
        }
    }

    const checkValidUserName=()=>{
        if(UserName==""){
            setData({
                ...data,
                isValidUserName:false,
            });
            return false; 
        }else{
            if(!data.isValidUserName){   
                setData({
                    ...data,
                    isValidUserName:true,
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

    const checkValidPhone=()=>{
        if(Phone==""){
            setData({
                ...data,
                isValidPhone:false,
                PhoneErrorMessage:'يجب ادخال رقم الجوال'
            });
            return false; 
        }else if(Phone.length<10){
            setData({
                ...data,
                isValidPhone:false,
                PhoneErrorMessage:'يجب ان يتكون رقم الجوال من ١٠ ارقام'
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

    const checkValidPassword=()=>{
        if(Password==""){
            setData({
                ...data,
                isValidPassword:false,
                EroorMessage:'يجب ادخال كلمة المرور'
            });
            return false; 
        }else if(Password.length<8){
                setData({
                    ...data,
                    isValidPassword:false,
                    EroorMessage:'يجب أن تكون كلمة المرور ٨ أحرف على الاقل'                 
                });                               
            return false;         
        }else{
            if(!data.isValidPassword){
                setData({
                    ...data,
                    isValidPassword:true,
                    EroorMessage:''                 
                });                             
            }
            return true  
        }
    }
        
    const sendJounRequest=()=>{
        if(checkValidName() && checkValidUserName() && checkValidEmail() && checkValidPhone() && checkValidPassword()){ 
            setAlert({
                ...alert,
                isLoading:true
            })         
            firebase.database().ref("DeliveryDriver").orderByChild("UserName")
            .equalTo(UserName.toLowerCase()).once("value", snapshot => {
                const userData = snapshot.val();  
                if (userData) { 
                    setAlert({
                        isLoading:false
                    });
                    setTimeout(()=>{
                        setAlert({
                            ...alert,
                            Title:'اسم المستخدم',
                            Message:'اسم المستخدم قيد الإستخدام بالفعل من قبل حساب آخر',
                            jsonPath:"Error",
                            alertVisible:true,
                            isLoading:false
                        });
                        setTimeout(() => {
                            setAlert({
                                ...alert,
                                alertVisible:false,
                            });
                        }, 4000)
                    },400)
                }else{
                    firebase.auth().createUserWithEmailAndPassword(Email, Password).then((user)=>{
                        if (firebase.auth().currentUser) {
                            var userId = firebase.auth().currentUser.uid;
                            if (userId) {
                                firebase.database().ref('DeliveryDriver/' + userId).set({
                                Email:Email.toLowerCase(),
                                Name:Name,
                                //Password:Password,
                                Status:"Pending",
                                PhoneNumber:Phone,
                                UserName:UserName.toLowerCase(),
                                DeliveryArea:selectedValue
                                });
                               setAlert({
                                    isLoading:false
                                });
                                setTimeout(()=>{
                                    setAlert({
                                        ...alert,
                                        Title:'',
                                        Message:'تم إرسال طلبك بنجاح',
                                        jsonPath:"success",
                                        alertVisible:true,
                                        isLoading:false
                                    });
                                    setTimeout(() => {
                                        setAlert({
                                            ...alert,
                                            alertVisible:false,
                                        });
                                        resetData();
                                    }, 4000)
                                },400)
    
                            }else{
                                setAlert({
                                    isLoading:false
                                });
                                setTimeout(()=>{
                                    setAlert({
                                        ...alert,
                                        Title:'',
                                        Message:'حصلت مشكلة في إرسال طلبك',
                                        jsonPath:"Error",
                                        alertVisible:true,
                                        isLoading:false
                                    });
                                    setTimeout(() => {
                                        setAlert({
                                            ...alert,
                                            alertVisible:false,
                                        });
                                    }, 4000)
                                },400)
                            }
                        }
                        }).catch(function(error) {                           
                            console.log(error.message);
                            if(error.message==="The email address is already in use by another account."){
                                setAlert({
                                    isLoading:false
                                });
                                setTimeout(()=>{
                                    setAlert({
                                        ...alert,
                                        Title:'البريد الإلكتروني',
                                        Message:'عنوان البريد الإلكتروني قيد الإستخدام بالفعل من قبل حساب آخر',
                                        jsonPath:"Error",
                                        alertVisible:true,
                                        isLoading:false
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
            });
        }
    }

    const resetData=()=>{
        
        setName("");
        setUserName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setSelectedValue("شمال الرياض")
        setData({
            ...data,
            isValidName:true,
            isValidUserName:true,
            isValidEmail:true,
            isValidPhone:true,
            isValidPassword:true,
            EroorMessage:'',
            EmailErrorMessage:'',
            PhoneErrorMessage:'',
        });
        props.setModalVisible(false)
        setModal(false);
        setAlert({
            ...alert,
            alertVisible:false,
            Title:'',
            Message:'',
            jsonPath:'',
            isLoading:false,           
        })
    }

      return(
        <Modal visible={modal} transparent={true} onRequestClose={()=>{ setModal(false) }} animationType="fade" presentationStyle='fullScreen'>
        <KeyboardAwareScrollView>
            <View backgroundColor= "#000000aa" flex= {1} style={{alignItems:'center',justifyContent:'center'}}>
                <View backgroundColor ='#ffffff' marginTop= {40} marginBottom={100} borderRadius={30} width={width*.90} height={height*.90} >
                    <View style={styles.header}>
                        <MaterialIcons style={Platform.OS === 'android'? styles.iconAndroid:styles.iconIOS} name="cancel" size={32} color="#fff"  onPress={resetData} />
                            <Text style={styles.text_header_modal}>طلب انضمام كسائق</Text> 
                    </View>

                    <View>
                        <Text style={styles.text_footer}>اسم السائق:</Text>
                        <View style={styles.action}>
                            <TextInput style={styles.textInput} 
                                label="Name"
                                placeholder="ادخل اسم السائق"
                                autoCapitalize="none"
                                onChangeText={(val)=>setName(val)}
                                onEndEditing={() => checkValidName()}
                                >
                            </TextInput>  
                        </View>

                        {data.isValidName ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب ادخال اسم السائق</Text>
                            </Animatable.View>
                        }

                        <Text style={styles.text_footer}>اسم المستخدم:</Text>
                        <View style={styles.action}>
                            <TextInput style={styles.textInput} 
                                label="UserName"
                                placeholder="ادخل اسم المستخدم"
                                autoCapitalize="none"
                                onChangeText={(val)=>setUserName(val)}
                                onEndEditing={() => checkValidUserName()}
                                >
                            </TextInput>  
                        </View>

                        {data.isValidUserName ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب ادخال اسم المستخدم</Text>
                            </Animatable.View>
                        }

                        <Text style={styles.text_footer}>البريد الإلكتروني:</Text>
                        <View style={styles.action}>
                            <TextInput style={styles.textInput} 
                                label="Email"
                                placeholder="ادخل البريد الإلكتروني"
                                autoCapitalize="none"
                                onChangeText={(val)=>setEmail(val)}
                                onEndEditing={() => checkValidEmail()}
                                >
                            </TextInput>  
                        </View>

                        {data.isValidEmail ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>{data.EmailErrorMessage}</Text>
                            </Animatable.View>
                        }

                        <Text style={styles.text_footer}> رقم الجوال:</Text>
                        <View style={styles.action}>
                            <TextInput style={styles.textInput} 
                                label="Phone"
                                placeholder="ادخل رقم الجوال"
                                autoCapitalize="none"
                                onChangeText={(val)=>setPhone(val)}
                                onEndEditing={() => checkValidPhone()}
                                keyboardType="number-pad" //number Input
                                maxLength={10}
                                >
                            </TextInput>  
                        </View>

                        {data.isValidPhone ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>{data.PhoneErrorMessage}</Text>
                            </Animatable.View>
                        }

                        <Text style={styles.text_footer}>كلمة المرور:</Text>
                        <View style={styles.action}>
                            <TextInput style={styles.textInput} 
                                label="Password"
                                placeholder="ادخل كلمة المرور"
                                autoCapitalize="none"
                                onChangeText={(val)=>setPassword(val)}
                                onEndEditing={() => checkValidPassword()}
                                >
                            </TextInput>  
                        </View>

                        {data.isValidPassword ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>{data.EroorMessage}</Text>
                            </Animatable.View>
                        }

                        <Text style={styles.text_footer}>منطقة التوصيل:</Text>
                        <Picker
                            selectedValue={selectedValue}
                            style={Platform.OS === 'android'? styles.pickerStyleAndroid:styles.pickerStyleIOS}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
                            <Picker.Item label="شمال الرياض" value="شمال الرياض" />
                            <Picker.Item label="شرق الرياض" value="شرق الرياض" />
                            <Picker.Item label="غرب الرياض" value="غرب الرياض" />
                            <Picker.Item label="جنوب الرياض" value="جنوب الرياض" />
                        </Picker>      
                    </View>

                    <View style={styles.button}> 
                        {alert.isLoading? <Loading></Loading>:  
                            <Button 
                                mode="contained" 
                                color="#809d65" 
                                dark={true} 
                                compact={true} 
                                style={{width:100}} 
                                onPress={sendJounRequest}>
                                <Text style={{color:"#fff",fontSize:18,fontWeight: 'bold'}}>إرسال</Text>
                            </Button>
                        }
                    </View>          
                </View>
            </View>  
        </KeyboardAwareScrollView> 

        {alert.alertVisible?
            <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
        :
            null
        }                   
    </Modal>
      );
  }

  const {height} = Dimensions.get("screen");
  const marginTopSpace = height * 0.020;

  const styles = StyleSheet.create({
    header:{
        height:"10%",
        backgroundColor:"#809d65",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    text_header_modal:{
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    iconIOS:{
        position:'absolute',
        right:15
    },
    iconAndroid:{
        position:'absolute',
        left:15
    },
    text_footer: {
        color: '#9E9D24',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        marginRight:'5%',
        marginTop:marginTopSpace
    },
    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        marginRight:'8%'  
    },
    action: {
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 10,
    },
    button:{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerStyleIOS:{
        height: 50,
        width: '100%',
        position: 'absolute', 
        bottom:0
    },
    pickerStyleAndroid:{
        height: 50,
        width: '100%',
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
  });
  export default RequestJoin