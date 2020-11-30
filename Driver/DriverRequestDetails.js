import React,{useState,useEffect}from 'react';
import { StyleSheet, Text, View,NativeModules,Image,Linking, Alert} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'; 
import { Card, Title } from 'react-native-paper';
import firebase from '../Database/firebase';
import RejectRequestModal from '../components/RejectModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AlertView from "../components/AlertView";

const DriverRequestDetails = ({navigation,route})=>{
    var  RequestId = route.params.ID;
    var DATE=route.params.DATE
    var STATUS=route.params.STATUS
    var UserId=route.params.UserId
    console.log(STATUS);
    const [DriverList,setDriverList] = useState([])
    const[Materials,setMaterials]= useState([]);
    const[RejectModal,setRejectModal]= useState(false);
    const [UserName,setUserName]=useState("");
    const [Name,setName]=useState("");
    const [Phone,setPhone]=useState("");
    const [Location,setLocation] = useState({
      address:"",
      latitude:0,
      longitude:0
    });
    const [Picture,setPicture] = useState("")
    const [alert,setAlert]=React.useState({
      alertVisible:false,
      Title:'',
      Message:'',
      jsonPath:'',   
    })
    const [Status,setStatus]=useState(STATUS)
    console.log(Status);
    const [Token,setToken]=useState("")
    const openDial=(phone)=>{
        if(Platform.OS==="android"){
            Linking.openURL(`tel:${phone}`)
        }else {
            Linking.openURL(`telprompt:${phone}`)
        }
    }
    const fetchMaterials=(ID)=>{
      firebase.database().ref("Material/"+ID).on('value',snapshot=>{
          const Data = snapshot.val();
          if(Data){
            var li = []
            snapshot.forEach(function(snapshot){
            var temp={MaterialType:snapshot.val().MaterialType, Id:snapshot.key, Quantity:snapshot.val().Quantity,Type:snapshot.val().Type}
            li.push(temp)
            })
            setMaterials(li)
            console.log(Materials);
            console.log(li) 
          }
        })
  }

const changeReq=()=>{
    
    if(STATUS == 'Accepted'){
        firebase.database().ref('PickupRequest/'+UserId+"/"+RequestId).update({
          Status:"OutForPickup"
        }).then(()=>{
          STATUS="OutForPickup";
          setStatus("OutForPickup")
        }).then(()=>[
          sendNotifications(Token,'السائق في الطريق لاستلام الطلب','استلام الطلب')
        ]).catch((error)=>{
          Alert.alert(error.message)
        })
        console.log('im here in 1') 
        console.log('im here in 1'+STATUS) 
    }

    if (STATUS == 'OutForPickup'){
        firebase.database().ref('PickupRequest/'+UserId+"/"+RequestId).update({
          Status:"Delivered"
        }).then(()=>{
          STATUS="Delivered";
          setStatus("Delivered")
        }).then(()=>{
          sendNotifications(Token,' تم توصيل الطلب للمنشأة','توصيل الطلب')
        }).catch((error)=>{
          Alert.alert(error.message)
        })
        console.log('im here in 2'+STATUS) 
    } 
//navigation.navigate("DriverRequestDetails",{RequestId,DATE,STATUS,UserId})
}

  const fetchUserInfo=(UserId)=>{
    firebase.database().ref('User/' + UserId).on('value',snapshot=>{
      const userData = snapshot.val();
      setName(userData.Name);
      setUserName(userData.UserName);
      setPhone(userData.PhoneNumber);
      setLocation({
        ...Location,
        address:userData.Location.address,
        latitude:userData.Location.latitude,
        longitude:userData.Location.longitude           
      })
      if(userData.expoToken){
        setToken(userData.expoToken)
      }   
    }) 
    
  }
  const sendNotifications=async(token,msg,title)=>{
    if(token!=""){
      const message = {
        to: token,
        sound: 'default',
        title: title,
        body: msg,
        data: { screen: 'NotificationsPage' },
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }
  };

  const retriveImage= async (UserId)=>{
    var imageRef = firebase.storage().ref('images/' + UserId);
    imageRef
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        setPicture(url);
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
  }

  const openMaps = (latitude, longitude) => {
    const daddr = `${latitude},${longitude}`;
    // const company = Platform.OS === "ios" ? "apple" : "google";
    const company = "google";
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  }



    const ShowModal=()=>{
      setVisibleAssignModal(false)
      setAlert({
        ...alert,
        Title:'اسناد الطلب',
        Message:'تم اسناد الطلب بنجاح',
        jsonPath:"success",
        alertVisible:true,
    });
    setTimeout(() => {
        setAlert({
            ...alert,
            alertVisible:false,
        });
        navigation.navigate("AssignedRequests");
    }, 4000)
    }

  useEffect(()=>{
    fetchMaterials(RequestId)
    fetchUserInfo(UserId)
    retriveImage(UserId)
    //fetchDrivers();
  },[])
  console.log("Token",Token);
    return (
     
        <View style={styles.container}>
          <View style={styles.fixedHeader}>
              <LinearGradient
                  colors={["#809d65","#9cac74"]}
                  style={{height:"100%" ,width:"100%"}}>
                <SafeAreaView style={{flexDirection:'row-reverse'}}>
                    <View style={[styles.header,styles.flexDirectionStyle]}>
                        <FontAwesome5 name="chevron-right" size={24} color="#ffff" style={styles.icon}
                            onPress={()=>navigation.navigate("AssignedRequests")}
                          />
                        <View>
                            <Text style={styles.headerText}> تفاصيل الطلب</Text>
                        </View>
                    </View>
                </SafeAreaView>
              </LinearGradient> 
          </View>

          <View style={{flex:8}}>
            <KeyboardAwareScrollView >
            <Card style={styles.item}>
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
                    <View style={{flexDirection:'row-reverse'}}>
                      <Title style={[styles.text,{fontSize: 15}]}>:صاحب الطلب</Title>
                      <Text style={{textAlign:"right",fontSize: 15,marginTop:7}}>{Name}</Text>
                    </View>
                    <Text style={styles.user}>@{UserName}</Text>
                    <Image
                            style={{width:'80%',marginTop:10}}
                            source={require('../assets/line.png')}
                            />
              </View>
              <Title style={styles.text}> :وقت وتاريخ الاستلام</Title>
              <Text style={{textAlign:"right",fontSize: 18,marginTop:5,marginRight:10}}>{DATE}</Text>
              <Title style={styles.text}> :المواد</Title>
              {
                Materials.map((item)=>
                <View>
                  <View style={{flexDirection:"row-reverse",marginRight:8}}>
                    <Text style={styles.textStyle}>نوع المادة:</Text>
                    <Text style={{textAlign:"right",fontSize: 18,marginRight:5}}>{item.MaterialType}</Text>
                  </View>

                  <View style={{flexDirection:"row-reverse",marginRight:8}}>
                    <Text style={styles.textStyle}>الكمية:</Text>
                    <Text style={{textAlign:"right",fontSize: 18,marginRight:5,marginTop:4}}>{item.Quantity}</Text>
                    <Text style={{textAlign:"right",fontSize: 18,marginRight:5,marginTop:4}}>{item.Type}</Text>
                  </View>
              </View>
              )
              }
              <Title style={styles.text}> : موقع الاستلام</Title>
              <TouchableOpacity onPress={()=>{openMaps(Location.latitude,Location.longitude)}}>
                <Text style={{textAlign:"right",fontSize: 18,marginTop:5,marginRight:10}}>{Location.address}</Text>
              </TouchableOpacity>
              <Title style={styles.text}> : رقم الهاتف</Title>
              <TouchableOpacity onPress={()=>{openDial(Phone)}}>
                <Text style={{textAlign:"right",fontSize: 18,marginTop:5,marginRight:10}}>{Phone}</Text>
              </TouchableOpacity>

            </Card> 
            </KeyboardAwareScrollView>
            {Status =='Delivered'?   
            null:
            <View style={[styles.flexDirectionStyle,styles.button,{marginTop:5}]}>
              <TouchableOpacity style={[styles.button,]}
              onPress={()=>changeReq()}
              >
                
                <LinearGradient
                    colors={["#809d65","#9cac74"]}
                    style={styles.signIn}
                    >
                {Status =='Accepted'?   
                  <Text style={[styles.textSign,{color:'#fff'}]}>قيد الاستلام</Text>
                  :
                  <View>
                    {
                      Status =='OutForPickup'? 
                      <Text style={[styles.textSign,{color:'#fff'}]}>تم التوصيل</Text>
                    :
                      null
                    }
                  </View>
                } 
                </LinearGradient>
              </TouchableOpacity>  
 
            {/* { STATUS == 'OutForPickup'?
              <TouchableOpacity style={[styles.button,]}
              // onPress={changeReq(STATUS)}
              >
                  
                <LinearGradient
                    colors={["#809d65","#9cac74"]}
                    style={styles.signIn}
                    >   
                  <Text style={[styles.textSign,{color:'#fff'}]}>تم التوصيل</Text>
                </LinearGradient>
              </TouchableOpacity> 
              :
              null
                }     */}
             
            </View>
          }
          </View>

        
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
      paddingBottom:10,
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
      width:100,
      height:100,
      borderRadius:150/2,
      borderColor:'#f2f2f2',
      borderWidth:1
    },
    user: {
      fontSize: 15,
      textAlign :'right',
      color :'#ADADAD',
    }
  });
export default DriverRequestDetails;