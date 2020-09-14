import React, {useState}from 'react';
import { StyleSheet, Text, View,KeyboardAvoidingView,TextInput, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Button}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '../Database/firebase';
import * as Animatable from 'react-native-animatable';
import { NativeModules } from 'react-native';

const EditPassword = ({navigation})=>{
    var userId = firebase.auth().currentUser.uid;
    var query = firebase.database().ref('User/' + userId);
    query.once("value").then(function(result) {
      const userData = result.val();
      setPassword(userData.Password);
 
  });
    const [Password,setPassword] = useState('')
    const [CurrentPassword,setCurrentPassword] = useState('')
    const [NewPassword,setNewPassword] = useState('')
    const [CinfirmPassword,setConfirmPassword] = useState('')
    const [enableshift,setAnbleshift]=useState(false)
    const [data,setData] = React.useState({
        secureTextEntry: true,
        isValidPassword:true,
        isValidNewPassword:true,
        isValidCinfirmPassword: true,
        isEmpty:true
      });

    const updateSecureTextEntry=()=>{
        setData({
          ... data,
          secureTextEntry:!data.secureTextEntry
        })
    }

    const checkValidPassword =()=>{
        if(CurrentPassword.length<1){
            setData({
                ... data,
                isEmpty:false
                })  
        }else{
            setData({
                ... data,
                isEmpty:true
                })               
        }
        if(CurrentPassword!=Password){
            setData({
                ... data,
                isValidPassword:false
                }) 
        }else{
            setData({
                ... data,
                isValidPassword:true
                })   
        }
    }

    const checkValidNewPassword =()=>{
        if(NewPassword.length<8){
            setData({
                ... data,
                isValidNewPassword:false
                })    
        }else{
            setData({
                ... data,
                isValidNewPassword:true
                })   
        }
    }
    const checkCinfirmPassword =()=>{
        if(NewPassword!=CinfirmPassword){
            setData({
                ... data,
                isValidCinfirmPassword:false
                })    
        }else{
            setData({
                ... data,
                isValidCinfirmPassword:true
                })   
        }
    }

    const updatePassword=()=>{
        if(CurrentPassword!=Password){
            setData({
                ... data,
                isValidPassword:false
              }); 
          }else{
            setData({
                ... data,
                isValidPassword:true
              });
              if(NewPassword.length<8){
                setData({
                    ... data,
                    isValidNewPassword:false
                  });  
              }else{
                setData({
                    ... data,
                    isValidNewPassword:true
                  });
                  if(NewPassword!=CinfirmPassword){
                    setData({
                        ... data,
                        isValidCinfirmPassword:false
                      });   
                  }else{
                    var user = firebase.auth().currentUser;
                    var userId = user.uid;
                    firebase.database().ref('User/' + userId).update({
                        Password: NewPassword,
                    });
                    user.updatePassword(NewPassword).then(function() {
                      }).catch(function(error) {
                        // An error happened.
                        console.log("error")
                        console.log(error)
                        Alert.alert("error")
                      });
                    setData({
                        ... data,
                        isValidCinfirmPassword:true
                      });
                      setCurrentPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                      navigation.navigate("UserEditProfile")  
                  }     
              }    
          }                 
    }
    return(
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}>
            <View>
                <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"40%"}}>
                    <View style={styles.header}>
                        <FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
                            onPress={()=>{
                                navigation.navigate("UserEditProfile")
                        }}/>
                        <View>
                            <Text style={styles.headerText}>تحديث كلمة المرور</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.footer}>

                    <View style={styles.action}>
                        <Text style={styles.textStyle}>كلمة المرور الحالية</Text>
                        <TextInput style={styles.textInput} 
                            label="Password"
                            value={CurrentPassword}
                            autoCapitalize="none"
                            textAlign= 'right'
                            secureTextEntry={data.secureTextEntry?true:false} 
                            onFocus={()=>setAnbleshift(false)}  
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
                            onFocus={()=>setAnbleshift(false)}  
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
                            value={CinfirmPassword}
                            autoCapitalize="none"
                            textAlign= 'right'
                            secureTextEntry={data.secureTextEntry?true:false} 
                            onFocus={()=>setAnbleshift(false)}  
                            onChangeText={text => setConfirmPassword(text)}
                            onEndEditing={() => checkCinfirmPassword()}>
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

                    {data.isValidCinfirmPassword ? null : 
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
        </KeyboardAvoidingView>
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
        marginTop:-20,
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
    }
})
export default EditPassword