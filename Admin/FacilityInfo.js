import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,Platform,TouchableOpacity,Linking}from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Title,Card,Button,FAB}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { NativeModules } from 'react-native';
import firebase from '../Database/firebase';
import {FontAwesome5} from '@expo/vector-icons';
import { YellowBox } from 'react-native';
import { set } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../components/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from "@react-navigation/native";
import DeleteModal from '../components/DeleteModal';

const FacilityInfo=({navigation,route,props})=>{
    const isFocused = useIsFocused();
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
    const [Phone,setPhone]=useState([])
    const [Email,setEmail]=useState([])
    const [Picture,setPicture] = useState("")
    const [data,setData] = React.useState({
        isLoading:false,
        isEmailAvailable:false,
        isPhoneAvailable:false,
        PhoneeIndex:0,
        EmailIndex:0
      });

    const [VisibleDeleteModal,setDaleteModal]=useState({
        IsVisible:false,
    })

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
            // retriveImage();
            setPicture(Data.Logo);
            }
          })
    }
//it will be remove if facility's Logo work correctly //
    const retriveImage= async ()=>{
        var imageRef = firebase.storage().ref('Facilities/' + FacilityId);
        imageRef
          .getDownloadURL()
          .then((url) => {
            //from url you can fetched the uploaded image easily
            setPicture(url);
          })
          .catch((e) => console.log('getting downloadURL of image error => ', e));
      }

    // const setPhoneAndEmail=async()=>{
    //    data.isPhoneAvailable=ContactInfo.some( ContactInfo => ContactInfo['Name'] === 'رقم الهاتف' ) 
    //    data.isEmailAvailable= ContactInfo.some( ContactInfo => ContactInfo['Name'] === 'البريد الإلكتروني' )
    //    if(data.isPhoneAvailable){
    //     // data.PhoneIndex=ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'رقم الهاتف' )
    //     setPhone(ContactInfo[ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'رقم الهاتف' )].value)
    //    }
    //    if(data.isEmailAvailable){
    //     // data.EmailIndex=ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'البريد الإلكتروني' )
    //     setEmail(ContactInfo[ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'البريد الإلكتروني' )].value)
    //    }
    //    console.log(data.isEmailAvailable);
    // }
    const openDial=(phone)=>{
        if(Platform.OS==="android"){
            Linking.openURL(`tel:${phone}`)
        }else {
            Linking.openURL(`telprompt:${phone}`)
        }
    } 

    const openMaps = (latitude, longitude) => {
        const daddr = `${latitude},${longitude}`;
        // const company = Platform.OS === "ios" ? "apple" : "google";
        const company = "google";
        Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
      }

      const NavigateToUpdateFacilityInfo=()=>{
        firebase.database().ref('/Category/').on('value',snapshot=>{
            const Data = snapshot.val();
            if(Data){
              var li = []
              snapshot.forEach(function(snapshot){
                var temp={Name:snapshot.val().Name,CategoryId:snapshot.key,checked:false}
                li.push(temp)
              })
              navigation.navigate("EditFacilityInfo",{Name,AcceptedMaterials,ContactInfo,Location,WorkingDays,WorkingHours,Picture,FacilityId,li})
            }
          })
      }

      useEffect(()=>{
        retriveData()   
        
    },[props, isFocused]);

    return(
        <View style={styles.root}>
           <View style={styles.fixedHeader}>
              <LinearGradient
                colors={["#809d65","#9cac74"]}
                style={{height:"100%" ,width:"100%"}}> 

                <SafeAreaView>

                  <View style={[styles.header,styles.flexDirectionStyle]}>

                    <Text style={styles.text_header}>المنشــآت</Text>
                    
                    <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon}  onPress={()=>navigation.goBack()}/>

                  </View>

                </SafeAreaView>

              </LinearGradient>

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
                            <View style={[styles.flexDirectionStyle,{flex:1,flexWrap:'wrap'}]}>
                            {AcceptedMaterials.map((item,index) => 
                                <View style={styles.flexDirectionStyle}>
                                    <Text style={styles.mytext}>{item.Name}</Text> 
                                    {AcceptedMaterials.length-1!=index?<Text>،</Text>:null}
                                </View>
                            )}
                            </View>
                        </View>  
                    </Card>  

                    <Card style={styles.mycard}>
                        <View style={[styles.cardContent,styles.flexDirectionStyle]}>
                            <Text style={styles.textStyle}>معلومات التواصل:</Text>
                        </View> 
                        {
                        // ContactInfo.filter(e => e.Name === "رقم الهاتف").length > 0
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
                        // ContactInfo.filter(e => e.Name === "البريد الإلكتروني").length > 0
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
                
                        {data.isLoading ? 
                            <Loading></Loading>  
                            : 
                            <View style={styles.button}>
                                <Button icon="delete" mode="contained" theme={themeDelete } dark={true}
                                                    onPress={()=>setDaleteModal({
                                                        ...VisibleDeleteModal,
                                                        IsVisible:true,
                                                      })}
                                    >
                                    حذف
                                </Button>

                                <Button icon="circle-edit-outline" mode="contained" theme={theme } dark={true}
                                    onPress={() => {NavigateToUpdateFacilityInfo()}}
                                    >
                                    تحديث
                                </Button>
                            </View>
                        }
                </KeyboardAwareScrollView>
                {VisibleDeleteModal.IsVisible? <DeleteModal setDaleteModal={setDaleteModal} Name={Name} Type="منشأة" Id={FacilityId} navigation={navigation}></DeleteModal>:null}
            </View>
        </View>
    )
}

const theme= {
    colors:{
        primary: "#9cac74"
    }
}

const themeDelete= {
    colors:{
        primary: "#B71C1C",

    },
}
const styles=StyleSheet.create({
    root:{
        flex:1,
        // backgroundColor: '#F5F5F5', 
        backgroundColor: '#fff',   
    },
    header:{
        width: '100%',
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:Platform.OS === 'android'? 0 : -10
      },
      text_header: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
      },
    icon:{
        position: 'absolute',
        marginTop:20,
        left: 16
    },
    footer: {
        flex:8,
        paddingHorizontal: 20,
        paddingVertical: 10,

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
        // marginTop:3,
        marginRight:5,
        marginLeft: 5
    },
    action: {
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingRight:3,
        paddingLeft:3
    },
    textStyle:{
        color: '#9E9E9E',
        marginLeft:5,
        fontSize: 15
    },
    button:{
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row-reverse' : 'row',
        justifyContent:"space-around",
        paddingTop:15,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:15
    },
    flexDirectionStyle:{
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    },
    fixedHeader :{
        flex:1,
        backgroundColor :'#9E9D24',
        overflow: 'hidden',
      }
});
export default FacilityInfo