import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,Platform,Linking,FlatList,TouchableOpacity}from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Title,Card,Button,FAB}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { NativeModules } from 'react-native';
import firebase from '../Database/firebase';
import {FontAwesome5,MaterialIcons} from '@expo/vector-icons';
import { YellowBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArabicNumbers } from 'react-native-arabic-numbers';
//import DriverHome from './DriverHome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DeleteDriver from '../components/DeleteDriver';
YellowBox.ignoreWarnings(['Setting a timer']);
import AlertView from "../components/AlertView";


const Item = ({ item, onPress, style }) => (
  
    <TouchableOpacity onPress={onPress} style={[styles.item, style,{flex:1}]}>
      <View  style={[styles.flexDirectionStyle,{height:45,flex:1}]}>
        
      <Image
            source={require('../assets/AdminIcons/requestIcon.jpg')}
            style={{width:40,height:40,marginRight:-5,borderRadius:12}}
            resizeMode="stretch"
            />
       
        <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:5}} >
          <Text style={[styles.Status,{textAlign: Platform.OS === 'android' && 
            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}> طلب بواسطة : {item.UserName}  </Text>
          <Text style={styles.date}>وقت الإستلام : {item.Date}</Text>
          
          
        </View>
        <View style={{flex:1}}>
  
          <View style={{marginTop:5,alignItems:'flex-start'}}>
              <MaterialIcons 
                  name="error" 
                  size={30} 
                  color="#7B7B7B"
              />
          </View>
        </View>
      
       
      </View>
    </TouchableOpacity>
   
  );

const AdminViewDriver = ({navigation,route})=>{
    const [DeleteDriverModel,setDeleteDriver]= useState(false);
    
  
    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',
    })

   var  userId = route.params.ID;
    var query = firebase.database().ref('DeliveryDriver/' + userId);
    query.once("value").then(function(result) {
      const userData = result.val();
      setName(userData.Name);
      setPhone(userData.PhoneNumber);
      setUserName(userData.UserName);
      setLocation(userData.DeliveryArea)
      setEmail(userData.Email)
//retriveImage();
 
    });

    const [Name,setName] = useState("")
    const [Phone,setPhone] = useState("")
    const [UserName,setUserName] = useState("")
    const [Location,setLocation] = useState("")
    const [Email,setEmail] = useState("")
    const [Picture,setPicture] = useState("")
    // const [SecureTextEntry,setSecureTextEntry] = useState(true)

    const retriveImage= async ()=>{
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
        fetchData()

    },[]);

    const openDial=(phone)=>{
        if(Platform.OS==="android"){
            Linking.openURL(`tel:${phone}`)
        }else {
            Linking.openURL(`telprompt:${phone}`)
        }
    }
    // const updateSecureTextEntry=()=>{
    //     setSecureTextEntry(!SecureTextEntry)
    //   }

    // list
    
    const [RequestList,setRequestList] = useState([])
    const[loading,setLoading]=useState(true)
    
const fetchData=()=>{
  firebase.database().ref('/PickupRequest/').on('value',snapshot=>{
    const Data = snapshot.val();
    console.log(Data);
    if(Data){
      var li = []
        snapshot.forEach(function(snapshot){
        console.log(snapshot.key);
        console.log(snapshot.val());
        var User=snapshot.key
        firebase.database().ref('/PickupRequest/'+User).on('value',snapshot=>{
           // setUser(UserId)
          snapshot.forEach(function(snapshot){
            console.log(snapshot.key);
            console.log(snapshot.val().Status);
            if(snapshot.val().DeliveryDriverId == userId ){
                
              var temp={
                Date:snapshot.val().DateAndTime,
                key:snapshot.key,
                Status:snapshot.val().Status,
                UserId:User,
                UserName:snapshot.val().UserName
            }
            //console.log(n+'check again ');
              li.push(temp)
              setLoading(false)
            }
            
          })
        })
      })
      if(li){
         //HERE to sort the list depending on the date
      li.sort(function(a, b){
        return new Date(a.Date) - new Date(b.Date);
      });
    
    }
      setRequestList(li)

      console.log(li)
    }
  })
}

const removeDriver=()=>{

}

  

  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
  //const backgroundColor = item.key === selectedId ? "#EDEEEC" : "#F3F3F3";

      return (
        <Item
          item={item}
          // onPress={() => setSelectedId(item.key)}
          
          onPress={() => 
          { var ID =item.key;
            var DATE=item.Date;
            var STATUS = item.Status;
            var UserId=item.UserId;
            console.log(ID+'      >>>>>here in gome');
            navigation.navigate("AssignedRequestsToDriver",{ID,DATE,STATUS,UserId})}}
          style={{ backgroundColor :item.key === selectedId ? "#F3F3F3":'#FFFFFF' }}
        />
      );
      };

    //end of list


    return(
    
        <View style={styles.root}>
            <SafeAreaView style={{flexDirection:'row-reverse'}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-right" size={24} color="#161924" style={styles.icon}
                        onPress={()=>{
                          navigation.navigate("DriverHome")
                        }}/>
                    <View>
                        <Text style={styles.headerText}>@ {UserName}</Text>
                    </View>
                    <View>
                    
                    </View>
                
                    {//this front end to remove user user-times
                    }{/*

                    
                    <View style={{flexDirection:'row-reverse',position:'absolute',right:16,top:25,
                    shadowColor :'#F1F1EA',
                    shadowOffset :{width:5,height:5},
                     shadowOpacity :60,
                     }}>
                    <FontAwesome5 name="user-times" size={24} color="#B71C1C" style={styles.icon2}
                        onPress={()=>{
                          removeDriver();
                        }}/>
                    </View>
                   */ }
                    
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
                {/*
                    <View style={{alignItems:'center',padding:7,
                shadowColor :'#F1F1EA',
                shadowOffset :{width:5,height:5},
                 shadowOpacity :20,    
                }}
                    >
                <Card style={{width:'55%',alignItems:'center'}}
                      //  onPress={()=>openDial(Phone)}
                      >
                    <View style={styles.cardContent}>
                    <Feather name="user-x" size={24} color="#B71C1C"
                        onPress={()=>{
                          removeDriver();
                        }}/>

                        <Text style={styles.delText}>حذف السائق </Text>
                    </View>  
                </Card>
                </View>
                */}

                <View style={{alignItems:"center"}}>
                    
                      
                            <View style={{alignItems:"center",margin:15}}>
                           <Title style={{color: '#9E9D24',fontSize:20}}>الطلبات المسندة : {ArabicNumbers(RequestList.length)}</Title>

                           
                       </View>
                       <Image
                            style={{width:'95%',marginTop:-8,marginBottom:3}}
                            source={require('../assets/line.png')}
                            />
                </View>
                
                <View>
                    { RequestList == 0?
                    <Text  style={{textAlign:'center',fontSize: 15,
                    marginTop:5,
                    color :'#7B7B7B',
            }}>
                        لا يوجد طلبات مسندة
                    </Text>

                    
                    
      
    :
            <FlatList
              data={RequestList.slice(0,4)}
              renderItem={renderItem}
              keyExtractor={(item)=>item.key}
              extraData={selectedId}
              onRefresh={()=>fetchData()}
              refreshing={loading}
            />
            }
          
            {/* end request list*/ }
            { RequestList.length >4 ?
            <TouchableOpacity 
            onPress={() => 
                { 
                   var ID =userId
                  navigation.navigate("DriverAllRequests",{ID})}}
            >
                  <Text style={{color: '#434343',
                                 fontSize: 14,
                                 marginRight:9,
                                padding:4,
                                 fontWeight:'bold'}}>
                     المزيد
                      </Text> 
                      </TouchableOpacity>
                      :
                      null
}
                </View>
                
                            <View style={styles.button}>
                                <Button icon="delete" mode="contained" theme={themeDelete } dark={true}
                                                    onPress={()=>setDeleteDriver(true)}
                                    >
                                     حذف السائق
                                </Button>

                            </View>
                        
                
                            {DeleteDriverModel?
                <DeleteDriverModel 
                userId={userId} setDeleteDriver={setDeleteDriver}
                 navigation={navigation} title="حذف سائق" message="هل أنت متأكد من حذف السائق ؟"
                  ></DeleteDriverModel>
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
            </KeyboardAwareScrollView> 
        </View>
        
    );
}

const theme= {
    colors:{
        primary: "#C0CA33"
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
    delText:{
        fontSize:18,
        marginTop:3,
        marginRight:10,
        marginLeft: 10,
        fontWeight:'bold',
        color:"#B71C1C"

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
        marginTop:-20,
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
        left: 16
    },
    vii:{
        height:"25%",
        borderBottomLeftRadius:90,
        borderBottomRightRadius:90,
        overflow: 'hidden',
        backgroundColor:"red"
    },
    icon2:{
        position: 'absolute',
        right: 16
    },
    text: {
        // color: '#809d65',
         fontSize: 14,
         textAlign: 'center',
         marginRight:9,
         marginLeft:9,
     },
     item: {
        backgroundColor: '#F3F3F3',
        padding: 20,
        marginVertical: 8,
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
      title: {
        fontSize: 18,
        fontWeight: 'bold' ,
        textAlign :'right',
        marginRight:30,
        marginTop:10, 
      },
      user: {
        fontSize: 12,
        textAlign :'right',
        marginRight:30,
        marginTop:5,
        color :'#ADADAD',
      },
      Status: {
        fontSize: 16,
        fontWeight: 'bold' ,
        textAlign :'right',
        marginRight:5,
        marginTop:5, 
      },
      date: {
        fontSize: 13,
        textAlign :'right',
        marginRight:10,
        marginTop:5,
        color :'#7B7B7B',
      },
      fabIOS: {
        position: 'absolute',
        margin: 16,
        left: 0,
        bottom: 0,
      },
      fabAndroid: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      },
      icon:{
        position: 'absolute',
        marginTop:30,
        left: 16
      },
      flexDirectionStyle:{
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
      } ,
    //end flat list
  
})
export default AdminViewDriver