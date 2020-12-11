import React, {useState}from 'react';
import { StyleSheet, Text, View,Image,Platform,Linking}from 'react-native';
import {Title,Card}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { NativeModules } from 'react-native';
import firebase from '../Database/firebase';
import {FontAwesome5} from '@expo/vector-icons';
import { YellowBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
YellowBox.ignoreWarnings(['Setting a timer']);

const UserViewDriver = ({navigation,route})=>{
    const [Name,setName] = useState("")
    const [Phone,setPhone] = useState("")
    const [UserName,setUserName] = useState("")
    const [Location,setLocation] = useState("")
    const [Email,setEmail] = useState("")
    const [Picture,setPicture] = useState("")
    var  userId = route.params.DriverId;

    var query = firebase.database().ref('DeliveryDriver/' + userId);
    query.once("value").then(function(result) {
        const userData = result.val();
        setName(userData.Name);
        setPhone(userData.PhoneNumber);
        setUserName(userData.UserName);
        setLocation(userData.DeliveryArea)
        setEmail(userData.Email)
    });

    var imageRef = firebase.storage().ref('images/' + userId);
    imageRef
        .getDownloadURL()
        .then((url) => {
        //from url you can fetched the uploaded image easily
        setPicture(url);
        })
        .catch((e) => {
        setPicture("")
        console.log('getting downloadURL of image error => ', e)
        });


    const openDial=(phone)=>{
        if(Platform.OS==="android"){
            Linking.openURL(`tel:${phone}`)
        }else {
            Linking.openURL(`telprompt:${phone}`)
        }
    }

    const resetData=()=>{
        setName("")
        setPhone("")
        setUserName("")
        setLocation("")
        setEmail("")
        setPicture("")
        navigation.goBack();
    }


    return(
    
        <View style={styles.root}>
            <SafeAreaView style={{flexDirection:'row-reverse'}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-right" size={24} color="#161924" style={styles.icon}
                        onPress={resetData}/>
                    <View>
                        <Text style={styles.headerText}>@{UserName}</Text>
                    </View>
                    <View>
                    
                    </View>
                    
                </View>
            </SafeAreaView>

            <KeyboardAwareScrollView style={styles.root}>
                <View style={styles.footer}>
                    <View style={{alignItems:"center"}}>
                        {Picture==""?
                            <Image
                                style={styles.profile_image}
                                source={require('../assets/DefaultImage.png')}
                                />
                            :
                            <Image
                                style={styles.profile_image}
                                source={{uri:Picture}}
                                />
                        }
                            <Image
                                style={{width:'70%',marginTop:10}}
                                source={require('../assets/line.png')}
                                />
                    </View>

                    <View style={{alignItems:"center",margin:10}}>
                        <Title>{Name}</Title>
                    </View>

                    <Card style={styles.mycard}
                            onPress={()=>openDial(Phone)}>
                        <View style={styles.cardContent}>
                            <Feather
                                name="phone"
                                color="#929000"
                                size={25}/> 
                            <Text style={styles.mytext}>{Phone}</Text>
                        </View>  
                    </Card>
                
                    <Card style={styles.mycard}
                        onPress={()=>Linking.openURL(`mailto:${Email}`)}>
                        <View style={styles.cardContent}>
                            <Feather
                                name="mail"
                                color="#929000"
                                size={25}/> 
                            <Text style={styles.mytext}>{Email}</Text>
                        </View>  
                    </Card>  

                    <Card style={styles.mycard}>
                        <View style={styles.cardContent}>
                            <Feather
                                name="map-pin"
                                color="#929000"
                                size={25}/> 
                            <Text style={styles.mytext} >{Location}</Text>
                        </View>  
                    </Card> 
                </View> 
            </KeyboardAwareScrollView> 
        </View>
        
    );
}

const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor: '#fff',    
    },
    mycard:{
        margin:3
    },
    cardContent:{
        flexDirection: Platform.OS === 'android' &&
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        padding:8,
    },
    mytext:{
        fontSize:18,
        marginTop:3,
        marginRight:10,
        marginLeft: 10
    },
    profile_image:{
        width:130,
        height:130,
        borderRadius:130/2,
        marginTop:-20 
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop:-10,
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
        fontSize: 24,      
        letterSpacing: 1, 
        textAlign:'center',
        color: '#9E9D24'
    },
    icon:{
    position: 'absolute',
    marginTop:30,
    left: 16
    },

  
})
export default UserViewDriver