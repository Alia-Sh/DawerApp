import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,Platform}from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Title,Card,Button,FAB}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { NativeModules } from 'react-native';
import firebase from '../Database/firebase';
import {FontAwesome5} from '@expo/vector-icons';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

const UserViewProfile = ({navigation})=>{

    var userId = firebase.auth().currentUser.uid;
    var query = firebase.database().ref('User/' + userId);
    query.once("value").then(function(result) {
      const userData = result.val();
      setName(userData.Name);
      setPhone(userData.PhoneNumber);
      setUserName(userData.UserName);
      retriveImage();
 
    });
    var query2 = firebase.database().ref('User/' + userId+'/Location');
    query2.once("value").then(function(result) {
        const userData = result.val();
        setLocation(userData.address);
    });

    const retriveImage= async ()=>{
        var userId = firebase.auth().currentUser.uid;
        var imageRef = firebase.storage().ref('images/' + userId);
        imageRef
          .getDownloadURL()
          .then((url) => {
            //from url you can fetched the uploaded image easily
            setPicture(url);
          })
          .catch((e) => console.log('getting downloadURL of image error => ', e));
      }

    useEffect(()=>{
        retriveImage()
    },[]);

    const [Name,setName] = useState("")
    const [Phone,setPhone] = useState("")
    const [UserName,setUserName] = useState("")
    const [Location,setLocation] = useState("")
    const [Picture,setPicture] = useState("")

    const goDoubleBack = () => {
        setTimeout(() => {
            navigation.goBack(null);
            navigation.goBack(null);
        }, 50);
    };

    return(

        <View style={styles.root}>

            <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"25%"}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
                        onPress={()=>{
                            navigation.navigate("HomeScreen")
                        }}/>
                    <View>
                        <Text style={styles.headerText}>الملف الشخصي</Text>
                    </View>
                 </View>
            </LinearGradient>

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
                </View>
                <View style={{alignItems:"center",margin:15}}>
                    <Title>{UserName}</Title>
                </View>

                <Card style={styles.mycard}>
                    <View style={styles.cardContent}>
                        <Feather
                            name="user"
                            color="#AFB42B"
                            size={25} /> 
                        <Text style={styles.mytext}>{Name}</Text>
                    </View>  
                </Card>

                <Card style={styles.mycard}>
                    <View style={styles.cardContent}>
                        <Feather
                            name="phone"
                            color="#AFB42B"
                            size={20}/> 
                        <Text style={styles.mytext}>{Phone}</Text>
                    </View>  
                </Card>
            
                <Card style={styles.mycard}>
                    <View style={styles.cardContent}>
                        <Feather
                            name="map-pin"
                            color="#AFB42B"
                            size={20}/> 
                        <Text style={{flex: 1,flexWrap: 'wrap',fontSize:18,textAlign:"right",marginRight:10}} >{Location}</Text>
                    </View>  
                </Card>  
                <View style={styles.button}> 
                    <Button icon="account-edit" mode="contained" theme={theme }
                        onPress={() => {
                            navigation.navigate("UserEditProfile",{UserName,Name,Phone,Location,Picture})
                        }}>
                        تحديث
                    </Button>
                </View>
            </View>   
        </View>
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
    mycard:{
        margin:3
    },
    cardContent:{
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse',
        padding:10,
    },
    mytext:{
        fontSize:18,
        marginTop:3,
        marginRight:10,
    },
    profile_image:{
        width:150,
        height:150,
        borderRadius:150/2,
        marginTop:-75 
    },
    footer: {
        backgroundColor: '#ffff',
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
    }
})
export default UserViewProfile