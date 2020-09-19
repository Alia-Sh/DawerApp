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

const DriverEditProfile  = ({navigation,route})=>{

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

                case "Password":
                    return route.params.Password

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
    const [Password,setPassword] = useState(getDetails("Password"))
    const [Email,setEmail] = useState(getDetails("Email"))
    const [NewPassword,setNewPassword] = useState(getDetails(""))
    const [enableshift,setAnbleshift]=useState(false)
    const [data,setData] = React.useState({
        isLoading:false
      });
      if(NewPassword!=""){
        Password= NewPassword; 
      }

    const updateUserInfo=()=>{
        setData({
            ... data,
            isLoading: true,
          });
        var user = firebase.auth().currentUser;
        var userId = user.uid;
            user.updateEmail(Email)
                .then(function() {
                    firebase.database().ref('DeliveryDriver/' + userId).update({
                        Name: Name,
                        PhoneNumber: Phone, 
                        Email: Email
                }).then(function(){
                    setData({
                        ... data,
                        isLoading: false,
                      });
                    navigation.navigate("DriverViewProfile",{UserName,Name,Phone,Location,Email,Password})
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
                Alert.alert(error.message)
                console.log(error)
              }); 
    }

    return(
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}>
            <View>
            <SafeAreaView style={{flexDirection:'row-reverse'}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
                        onPress={()=>{
                            navigation.navigate("DriverViewProfile")
                        }}/>
                    <View>
                        <Text style={styles.headerText}>تحديث الملف الشخصي</Text>
                    </View>
                </View>
                </SafeAreaView>

                <View style={styles.footer}>
                <View style={{alignItems:"center"}}>
            
                        <Image
                            style={styles.profile_image}
                            source={require('../assets/DriverProfile2.png')}
                            />
                        
                        <Image
                            style={{width:'80%'}}
                            source={require('../assets/line.png')}
                            />
                    
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
                        <Text style={styles.textStyle}> رقم الهاتف</Text>
                            <TextInput style={styles.textInput} 
                            label="Phone"
                            value={Phone}
                            autoCapitalize="none"
                            textAlign= 'right'
                            onFocus={()=>setAnbleshift(true)}
                            keyboardType="number-pad" //number Input
                            onChangeText={text => setPhone(text)}
                            maxLength={10}>
                        </TextInput>  
                        </View>  
                    </Card>  

                    <Card style={styles.action}>
                        <View style={styles.cardContent}>
                            <Text style={styles.textStyle}>البريد الإلكتروني</Text>
                            <TextInput style={styles.textInput} 
                                label="Name"
                                value={Email}
                                autoCapitalize="none"
                                textAlign= 'right'
                                onFocus={()=>setAnbleshift(true)}
                                onChangeText={text => setEmail(text)}>
                            </TextInput>  
                        </View>  
                    </Card>  

                    <Card style={styles.action} onPress={()=>navigation.navigate("DriverEditPassword",{Password})} >
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
                    <Text style={styles.textInput}>{Location}</Text> 
                        </View>  
                    </Card> 

                    <View style={styles.button}> 
                        {data.isLoading ? 
                            <ActivityIndicator size="large" color="#9E9D24" />   
                        : 
                        <Button icon="content-save" mode="contained" theme={theme }
                            onPress={() => updateUserInfo()}>
                            حفظ
                        </Button>
                        } 
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
        backgroundColor: '#fff',       
    },
    profile_image:{
        width:150,
        height:150,
        borderRadius:150/2,
        marginTop:-30 
    },
    action: {
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse',
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingRight:3,
        paddingLeft:3
    },  
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
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
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse',
        padding:10,
    }
})

export default DriverEditProfile