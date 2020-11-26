import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,Platform,TouchableOpacity,Linking}from 'react-native';
import {Card}from 'react-native-paper';
import { NativeModules } from 'react-native';
import firebase from '../Database/firebase';
import {FontAwesome5} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ViewFacilityInfo=({navigation,route})=>{
    var FacilityId = route.params.item.FacilityId;
    const [AcceptedMaterials,setAcceptedMaterials] = useState([])
    const [ContactInfo,setContactInfo] = useState([])
    const [Location,setLocation] = useState({
        address:"",
        latitude:0,
        longitude:0
    })
    const [Name,setName] = useState("")
    const [WorkingDays,setWorkingDays] = useState([])
    const [WorkingHours,setWorkingHours] = useState({
        endTime:"",
        startTime:"",
    })
    const [Picture,setPicture] = useState("")

    const retriveData=()=>{

        firebase.database().ref('/RecyclingFacility/'+FacilityId).on('value',snapshot=>{
            const Data = snapshot.val();
            if(Data){
            setName(Data.Name)
            setAcceptedMaterials(Data.AcceptedMaterials)
            setContactInfo(Data.ContactInfo)
            setWorkingDays(Data.WorkingDays)
            setWorkingHours(Data.WorkingHours)
            setLocation({
                ...Location,
                address:Data.Location.address,
                latitude:Data.Location.latitude,
                longitude:Data.Location.longitude 
            })
            setPicture(Data.Logo)
            }
          })
    }

    const openDial=(phone)=>{
        if(Platform.OS==="android"){
            Linking.openURL(`tel:${phone}`)
        }else {
            Linking.openURL(`telprompt:${phone}`)
        }
    } 

    const openMaps = (latitude, longitude) => {
        const daddr = `${latitude},${longitude}`;
        const company = "google";
        Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
      }

      useEffect(()=>{
        retriveData()   
        
    },[]);

    return(
        <View style={styles.root}>
            <View style={styles.fixedHeader}>
                <SafeAreaView>
                    <View style={[styles.header,styles.flexDirectionStyle]}>
                       
                        <Text style={styles.headerText}>معلومات المنشأة</Text>
                        <FontAwesome5 name="chevron-right" size={24} color="#161924" style={styles.icon}
                            onPress={()=>navigation.goBack()}
                        />
                       
                    </View>
                </SafeAreaView>
            </View>

            <View style={styles.footer}>
                <KeyboardAwareScrollView>
                    <View style={{alignItems:"center"}}>
                        {Picture==""?
                            <Image
                                style={styles.Logo_image}
                                source={require('../assets/AdminIcons/FacilityIcon.jpg')}
                                />
                            :
                            <Image
                                style={styles.Logo_image}
                                source={{uri:Picture}}
                                />
                        }
                            <Image
                                style={{width:'70%',margin:20}}
                                source={require('../assets/line.png')}
                                />
                    </View>

                    <Card style={styles.mycard}>
                        <View style={[styles.cardContent,styles.flexDirectionStyle]}>
                            <Text style={styles.textStyle}>الاسم</Text>
                            <Text style={styles.mytext}>{Name}</Text> 
                        </View>  
                    </Card>

                    <Card style={styles.mycard}>
                        <View style={[styles.cardContent,styles.flexDirectionStyle]}>
                            <Text style={styles.textStyle}>المواد المقبولة</Text>
                            {AcceptedMaterials.map((item,index) => 
                                <View style={styles.flexDirectionStyle}>
                                    <Text style={styles.mytext}>{item.Name}</Text> 
                                    {AcceptedMaterials.length-1!=index?<Text>،</Text>:null}
                                </View>
                            )}
                        </View>  
                    </Card>  

                    <Card style={styles.mycard}>
                        <View style={[styles.cardContent,styles.flexDirectionStyle]}>
                            <Text style={styles.textStyle}>معلومات التواصل:</Text>
                        </View> 
                        {
                            ContactInfo.some( ContactInfo => ContactInfo['Name'] === 'رقم الهاتف' ) 
                        ?
                        <TouchableOpacity onPress={()=>openDial(ContactInfo[ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'رقم الهاتف' )].value)}>
                            <View style={[styles.cardContent,styles.flexDirectionStyle,{padding:0,marginRight:10,marginLeft:10}]}>
                                <Text style={styles.textStyle}>
                                    رقم الهاتف:
                                </Text>
                                <Text style={styles.mytext}>
                                    {ContactInfo[ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'رقم الهاتف' )].value}
                                </Text> 
                            </View> 
                        </TouchableOpacity>
                        :
                            null
                        }
                        {
                            ContactInfo.some( ContactInfo => ContactInfo['Name'] === 'البريد الإلكتروني' )
                        ?
                        <TouchableOpacity onPress={()=>Linking.openURL(`mailto:${ContactInfo[ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'البريد الإلكتروني' )].value}`)}>
                            <View style={[styles.cardContent,styles.flexDirectionStyle]}>
                                <Text style={styles.textStyle}>
                                    البريد الإلكتروني:
                                </Text>
                                <Text style={styles.mytext}>
                                    {ContactInfo[ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'البريد الإلكتروني' )].value}
                                </Text> 
                            </View> 
                        </TouchableOpacity>
                        :
                            null
                        }
                    </Card>  

                    <Card style={styles.mycard}>
                        <View style={[styles.cardContent,styles.flexDirectionStyle,{flex: 1,flexWrap: 'wrap'}]}>
                            <Text style={styles.textStyle}>أيام العمل</Text>
                            {WorkingDays.map((item,index) => 
                                <View style={styles.flexDirectionStyle} >
                                    <Text style={styles.mytext}>{item}</Text> 
                                    {WorkingDays.length-1!=index?<Text>،</Text>:null}
                                </View>
                            )}
                        </View>  
                    </Card> 

                    <Card style={styles.mycard}>
                            <View style={[styles.cardContent,styles.flexDirectionStyle]}>
                                <Text style={styles.textStyle}>أوقات العمل</Text>
                                <Text style={styles.mytext}>من: {WorkingHours.startTime} إلى: {WorkingHours.endTime} </Text> 
                            </View>  
                    </Card>  

                    <Card style={styles.mycard} onPress={()=>{openMaps(Location.latitude,Location.longitude)}}>
                        <View style={[styles.cardContent,styles.flexDirectionStyle]}>
                            <Text style={styles.textStyle}>الموقع</Text>
                            <Text style={[styles.mytext,{flex: 1,flexWrap: 'wrap',textAlign:'right'}]}>{Location.address}</Text> 
                        </View>  
                    </Card> 
                </KeyboardAwareScrollView>
            </View>
        </View>
    )
}


const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor: '#fff',   
    },
    header:{
        width: '100%',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:15,
    },
    headerText:{
        fontWeight:'bold',
        fontSize: 20,      
        letterSpacing: 1, 
        textAlign:'center',
        color: '#9E9D24'
    },
    icon:{
        position: 'absolute',
        left: 16,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop:-20,
        flex:8
    },
    Logo_image:{
        width:100,
        height:100,
        borderRadius:5,
        borderColor:'#f2f2f2',
        borderWidth:1
    },
    mycard:{
        margin:3,
        backgroundColor: '#fff', 
    },
    cardContent:{
        padding:10,
    },
    mytext:{
        fontSize:15,
        marginRight:5,
        marginLeft: 5
    },
    textStyle:{
        color: '#9E9E9E',
        marginLeft:5,
        fontSize: 15
    },
    flexDirectionStyle:{
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    },
    fixedHeader :{
        flex:1.1,
        backgroundColor :'#fff',
        overflow: 'hidden',
      }
});
export default ViewFacilityInfo