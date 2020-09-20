import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,KeyboardAvoidingView,TextInput, Alert,ActivityIndicator} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Title,Card,Button,FAB}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '../Database/firebase';
import * as ImagePicker from 'expo-image-picker';
import { NativeModules } from 'react-native';

const UserEditProfile  = ({navigation,route})=>{

    var userId = firebase.auth().currentUser.uid;
    var query = firebase.database().ref('User/' + userId+'/Location');
    query.once("value").then(function(result) {
        const userData = result.val();
        setLocation(userData.address);
    });

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

    const retriveImage= async ()=>{
        userId = firebase.auth().currentUser.uid;
        var imageRef = firebase.storage().ref('images/' + userId);
        imageRef
          .getDownloadURL()
          .then((url) => {
            //from url you can fetched the uploaded image easily
            setPicture(url)
          })
          .catch((e) => console.log('getting downloadURL of image error => ', e));
      }

    useEffect(()=>{
        retriveImage()
    },[]);

    const [Name,setName] = useState(getDetails("Name"))
    const [Phone,setPhone] = useState(getDetails("Phone"))
    const [UserName,setUserName] = useState(getDetails("UserName"))
    const [Location,setLocation] = useState(getDetails("Location"))
    const [Picture,setPicture] = useState(getDetails("Picture"))
    const [enableshift,setAnbleshift]=useState(false)
    const [data,setData] = React.useState({
        isLoading:false
      });

    const updateUserInfo=()=>{
        firebase.database().ref('User/' + userId).update({
            Name: Name,
            PhoneNumber: Phone,      
        });
        navigation.navigate("UserViewProfile",{UserName,Name,Phone,Location,Picture})
    }

    const selectImage = async () => {
        try {
          let response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
          })
          if (!response.cancelled) {
            setData({
                ...data,
                isLoading:true
            });
            var userId = firebase.auth().currentUser.uid;
            uploadImage(response.uri,userId)
            .then(()=> {
                setData({
                    ...data,
                    isLoading:false
                });
               retriveImage();
            }).catch((error)=> {
                setData({
                    ...data,
                    isLoading:false
                });
                Alert.alert(error.message);
            });
          }
        } catch (error) {
          console.log(error)
        }
      }

    const uploadImage= async (uri,imageName)=>{
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("images/"+imageName);
        return ref.put(blob);
    }

    return(
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}>
            <View>
                <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"25%"}}>
                    <View style={styles.header}>
                    <FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
                        onPress={()=>{
                            navigation.navigate("UserViewProfile")
                        }}/>
                        <View>
                            <Text style={styles.headerText}>تحديث الملف الشخصي</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.footer}>
                    <View style={{alignItems:"center"}}>
                        {data.isLoading ? <ActivityIndicator size="large" color="#9E9D24" /> : 
                            <Image style={styles.profile_image} 
                            source={Picture==""?require('../assets/DefaultImage.png'):{uri:Picture}}
                            />
                        }
                        <FAB  
                            onPress={() =>selectImage ()}
                            small
                            icon="plus"
                            theme={{colors:{accent:"#C0CA33"}}}
                            style={{marginLeft:90,marginTop:-23}}/>
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
                            onFocus={()=>setAnbleshift(false)}
                            keyboardType="number-pad" //number Input
                            onChangeText={text => setPhone(text)}
                            maxLength={10}>
                        </TextInput>  
                        </View>  
                    </Card>  

                    <Card style={styles.action} onPress={()=>navigation.navigate("EditPassword")} >
                        <View style={styles.cardContent}>
                        <Text style={styles.textStyle}>كلمة المرور</Text>
                            <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}></Text>
                            <Feather
                                    name="chevron-left"
                                    color="grey"
                                    size={23}/>  
                        </View>  
                    </Card>  
                    
                    <Card style={styles.action} onPress={()=>navigation.navigate("GoogleMap")} >
                        <View style={styles.cardContent}>
                        <Text style={styles.textStyle}> الموقع</Text>
                            <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>{Location}</Text>
                            <Feather
                                    name="chevron-left"
                                    color="grey"
                                    size={23}/>  
                        </View>  
                    </Card>  

                    <View style={styles.button}> 
                        <Button icon="content-save" mode="contained" theme={theme }
                            onPress={() => updateUserInfo()}>
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
    profile_image:{
        width:150,
        height:150,
        borderRadius:150/2,
        marginTop:-75 
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
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse',
        padding:8,
    }
})

export default UserEditProfile