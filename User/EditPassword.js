import React, {useState}from 'react';
import { StyleSheet, Text, View,KeyboardAvoidingView,TextInput, Alert,Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Button}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '../Database/firebase';
import * as Animatable from 'react-native-animatable';
import { NativeModules } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const EditPassword = ({navigation})=>{
    var user = firebase.auth().currentUser;
    var userId = user.uid;
    var query = firebase.database().ref('User/' + userId);
    query.once("value").then(function(result) {
      const userData = result.val();
      setPassword(userData.Password);
 
  });
    const [Password,setPassword] = useState('')
    const [CurrentPassword,setCurrentPassword] = useState('')
    const [NewPassword,setNewPassword] = useState('')
    const [ConfirmPassword,setConfirmPassword] = useState('')
    const [data,setData] = React.useState({
        secureTextEntry: true,
        isValidPassword:true,
        isValidNewPassword:true,
        isValidConfirmPassword: true,
        isEmpty:true
      });

    const updateSecureTextEntry=()=>{
        setData({
          ... data,
          secureTextEntry:!data.secureTextEntry
        })
    }

    const checkValidPassword =()=>{
        if(CurrentPassword==''){
            setData({
                ... data,
                isEmpty:false,
                isValidPassword:true,
                }) 
                return false; 
        }else if(CurrentPassword!=Password){
            setData({
                ... data,
                isValidPassword:false,
                isEmpty:true
                }) 
                return false;               
        }else{
            setData({
                ... data,
                isValidPassword:true,
                isEmpty:true
                }) 
                return true;    
        }
    }

    const checkValidNewPassword =()=>{
        if(NewPassword.length<8){
            setData({
                ... data,
                isValidNewPassword:false
                })
                return false;     
        }else{
            setData({
                ... data,
                isValidNewPassword:true
                })
                return true;    
        }
    }
    const checkConfirmPassword =()=>{
        if(NewPassword!=ConfirmPassword){
            setData({
                ... data,
                isValidConfirmPassword:false
                })
                return false;     
        }else{
            setData({
                ... data,
                isValidConfirmPassword:true
                })
                return true;    
        }
    }

    const updatePassword=()=>{

        if (checkValidPassword() && checkValidNewPassword() && checkConfirmPassword() ){
            setData({
                ... data,
                isLoading: true,
              });
                user.updatePassword(NewPassword).then(function() {
                    firebase.database().ref('User/' + userId).update({
                        Password: NewPassword,
                        }).then(function(){
                            setPassword(NewPassword);
                            resetData();
                        }).catch(function(error){
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
                    console.log(error)
                    }); 
        }

    }

    const resetData=()=>{
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setData({
            ... data,
            secureTextEntry: true,
            isValidPassword:true,
            isValidNewPassword:true,
            isValidConfirmPassword: true,
            isEmpty:true,
            isLoading: false,
          });
            navigation.navigate("UserEditProfile")  
    }
    return(
        <KeyboardAwareScrollView>
            <View>
                <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"40%"}}>
                    <View style={styles.header}>
                        <FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
                            onPress={
                                resetData
                            }/>
                        <View>
                            <Text style={styles.headerText}>تحديث كلمة المرور</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.footer}>

                    <View style={{alignItems:"center"}}>
                
                        <Image
                            style={styles.profile_image}
                            source={require('../assets/resetPassword.png')}
                            />
                        
                        <Image
                            style={{width:'80%',margin:10}}
                            source={require('../assets/line.png')}
                            />

                    </View>

                    <View style={styles.action}>
                        <Text style={styles.textStyle}>كلمة المرور الحالية</Text>
                        <TextInput style={styles.textInput} 
                            label="Password"
                            value={CurrentPassword}
                            autoCapitalize="none"
                            textAlign= 'right'
                            secureTextEntry={data.secureTextEntry?true:false} 
                            onChangeText={text => setCurrentPassword(text)}
                            onEndEditing={() => checkValidPassword()}>
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


                    {data.isValidPassword ? null : 
                        <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>كلمة المرور الحالية غير صحيحة</Text>
                        </Animatable.View>
                    }

                    {data.isEmpty ? null : 
                        <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب ادخال كلمة المرور الحالية</Text>
                        </Animatable.View>
                    }

                    <View style={styles.action}>
                        <Text style={styles.textStyle}>كلمة مرور جديدة</Text>
                        <TextInput style={styles.textInput} 
                            label="Password"
                            value={NewPassword}
                            autoCapitalize="none"
                            textAlign= 'right'
                            secureTextEntry={data.secureTextEntry?true:false} 
                            onChangeText={text => setNewPassword(text)}
                            onEndEditing={() => checkValidNewPassword()}>
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

                    {data.isValidNewPassword ? null : 
                        <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}> يجب أن تكون كلمة المرور ٨ أحرف على الاقل</Text>
                        </Animatable.View>
                    }

                    <View style={styles.action}>
                        <Text style={styles.textStyle}>تأكيد كلمة المرور</Text>
                        <TextInput style={styles.textInput} 
                            label="Password"
                            value={ConfirmPassword}
                            autoCapitalize="none"
                            textAlign= 'right'
                            secureTextEntry={data.secureTextEntry?true:false} 
                            onChangeText={text => setConfirmPassword(text)}
                            onEndEditing={() => checkConfirmPassword()}>
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

                    {data.isValidConfirmPassword ? null : 
                        <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}> كلمتا المرور غير متطابقتان</Text>
                        </Animatable.View>
                    }

                    <View style={styles.button}> 
                        <Button icon="content-save" mode="contained" theme={theme }
                            onPress={() => updatePassword()}>
                                حفظ
                        </Button>
                    </View>

                </View>
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
    action: {
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse',
        margin: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        paddingRight:5,
        paddingLeft:5
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
        marginTop:-50,
        margin:20
    },
    button:{
        flexDirection:"row",
        justifyContent:"space-around",
        paddingTop:40,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:15
    },
    header:{
        width: '100%',
        height: 80,
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row-reverse' : 'row',
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'left' : 'right',  
    },
    profile_image:{
        width:140,
        height:150,
        marginTop:-100,
        marginBottom: 15
    }
})
export default EditPassword