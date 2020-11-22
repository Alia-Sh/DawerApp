import React,{useState,useEffect}from 'react';
import { StyleSheet, Text, View,NativeModules,Image,Linking} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'; 
import { Card, Title } from 'react-native-paper';
import firebase from '../Database/firebase';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RejectRequestModal from '../components/RejectModal';
import AlertView from "../components/AlertView";

const JoinDetails = ({navigation,route})=>{

    const userId = route.params.ID;
    console.log(userId);

    const [Name,setName] = useState("")
    const [Phone,setPhone] = useState("")
    const [UserName,setUserName] = useState("")
    const [Location,setLocation] = useState("")
    const [Email,setEmail] = useState("")
    const [Picture,setPicture] = useState("")
    const [RejectModal,setRejectModal]= useState(false);
    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',
    })
    var query = firebase.database().ref('DeliveryDriver/' + userId);
    query.once("value").then(function(result) {
        const userData = result.val();
        setName(userData.Name);
        setPhone(userData.PhoneNumber);
        setUserName(userData.UserName);
        setLocation(userData.DeliveryArea)
        setEmail(userData.Email)
      });

    const openDial=(phone)=>{
        if(Platform.OS==="android"){
            Linking.openURL(`tel:${phone}`)
        }else {
            Linking.openURL(`telprompt:${phone}`)
        }
    }

    const setAccepted =()=>{

        firebase.database().ref('DeliveryDriver/' + userId).update({
            Status:"Accepted" 
        })

        setAlert({
          ...alert,
          Title:'طلب انضمام',
          Message:'تم قبول الطلب وإضافة السائق لقائمة السائقين المعتمدين',
          jsonPath:"success",
          alertVisible:true,
      });
      setTimeout(() => {
          setAlert({
              ...alert,
              alertVisible:false,
          });
          navigation.navigate("DriverHome");
      }, 4000)
            
    }

    const setRejected =()=>{
            
        firebase.database().ref('DeliveryDriver/' + userId).update({
             Status:"Rejected" 
         })
    }

    return (
        <View style={styles.container}>
          <View style={styles.fixedHeader}>
              <LinearGradient
                  colors={["#809d65","#9cac74"]}
                  style={{height:"100%" ,width:"100%"}}>
                <SafeAreaView style={{flexDirection:'row-reverse'}}>
                    <View style={[styles.header,styles.flexDirectionStyle]}>
                        <FontAwesome5 name="chevron-right" size={24} color="#ffff" style={styles.icon}
                            onPress={()=>navigation.goBack()}
                          />
                        <View>
                            <Text style={styles.headerText}>تفاصيل الطلب</Text>
                        </View>
                    </View>
                </SafeAreaView>
              </LinearGradient> 
          </View>

          <View style={{flex:8}}>
                <View style={{alignItems:"center",marginTop:30}}>
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

                <View style={{alignItems:"center",margin:15}}>
                    <Title>{Name}</Title>
                    <Text style={{color: '#9E9D24',fontSize: 18}}>@{UserName}</Text>
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

            <View style={[styles.flexDirectionStyle,styles.button,{marginTop:40}]}>
              <TouchableOpacity style={[styles.button,]}
                onPress={()=>{ setAccepted() }}>
                   <LinearGradient
                    colors={["#809d65","#9cac74"]}
                    style={styles.signIn}>   
                  <Text style={[styles.textSign,{color:'#fff'}]}>قبول</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button]}
                    onPress={()=>setRejectModal(true)}>
                    <LinearGradient
                  colors={["#B71C1C","#D32F2F"]}
                  style={styles.signIn}>   
                  <Text style={[styles.textSign,{color:'#fff'}]}>رفض</Text>
                </LinearGradient>  
                </TouchableOpacity> 
            </View>
        </View> 

        
          {RejectModal?
                <RejectRequestModal userId={userId} setRejectModal={setRejectModal} navigation={navigation} title="رفض الطلب" message="هل أنت متأكد من رفض الطلب؟" type="reject driver"></RejectRequestModal>
              :
                null
          }
          {
              alert.alertVisible?
                  <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
              :
                  null
          }
        
        </View>  

      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header:{
      width: '100%',
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:15
   },
    headerText:{
      fontWeight:'bold',
      fontSize: 20,      
      letterSpacing: 1, 
      textAlign:'center',
      color: '#ffff'
    },
    mycard:{
        margin:5,
        marginLeft:10,
        marginRight:10
    },
    cardContent:{
        flexDirection: Platform.OS === 'android' &&
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        padding:8,
    },
    flexDirectionStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    },
    icon:{
      position: 'absolute',
      left: 16
    },
    text: {
      color: '#b2860e',
      fontSize: 18,
      textAlign: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
      marginRight:5,
      marginLeft:5,
    },
    textStyle:{
      color: '#9E9E9E',
      fontSize: 17,
      marginTop:3,
      marginRight:10
    },
    item: {
      flexDirection:"column",
      backgroundColor: '#F3F3F3',
      padding: 20,
      marginVertical: 20,
      marginHorizontal: 16,
      borderRadius :10,
      shadowColor :'#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 5,
      padding :15,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft:15,
      paddingRight:15,
      paddingBottom:5
    },
    signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginLeft:50,
      marginRight:50
    },
    textSign: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    fixedHeader :{
      flex:1,
      backgroundColor :'#9E9D24',
      overflow: 'hidden',
    },
    profile_image:{
      width:120,
      height:120,
      borderRadius:120/2,
      marginTop:-20 

    },
    mytext:{
        fontSize:18,
        marginTop:3,
        marginRight:10,
        marginLeft: 10
    },
    user: {
      fontSize: 15,
      textAlign :'right',
      color :'#ADADAD',
    }
  });
export default JoinDetails;