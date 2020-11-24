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
YellowBox.ignoreWarnings(['Setting a timer']);


const Item = ({ item, onPress, style }) => (
  
    <TouchableOpacity onPress={onPress} style={[styles.item, style,{flex:1}]}>
      <View  style={[styles.flexDirectionStyle,{height:45,flex:1}]}>
        
      <Image
            source={require('../assets/AdminIcons/requestIcon.jpg')}
            style={{width:40,height:40,marginRight:-5,borderRadius:12}}
            resizeMode="stretch"
            />
       
        <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:10}} >
          <Text style={[styles.Status,{textAlign: Platform.OS === 'android' && 
            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>طلب  </Text>
          <Text style={styles.date}>وقت الإستلام : {item.Date}</Text>
          
          
        </View>
        <View style={{flex:1}}>
  
          <View style={{marginRight:'15%',marginLeft:'5%',marginTop:5,alignItems:'flex-start'}}>
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
                
              var temp={Date:snapshot.val().DateAndTime,
                key:snapshot.key,
                Status:snapshot.val().Status,
                UserId:User,
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
            navigation.navigate("DriverRequestDetails",{ID,DATE,STATUS,UserId})}}
          style={{ backgroundColor :item.key === selectedId ? "#EDEEEC" : "#F3F3F3"}}
        />
      );
      };

    //end of list


    return(
    <KeyboardAwareScrollView>
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
                </View>
            </SafeAreaView>


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

                <View style={{alignItems:"center"}}>
                    
                      
                            <View style={{alignItems:"center",margin:15}}>
                           <Title style={{color: '#9E9D24',fontSize:20}}>الطلبات المسندة</Title>

                           <Title style={[styles.text,{marginTop:-5,marginBottom:3}]}
       > عدد الطلبات  : {ArabicNumbers(RequestList.length)}</Title>
                           
                       </View>
                       <Image
                            style={{width:'70%',marginTop:-8}}
                            source={require('../assets/line.png')}
                            />
                </View>
                
                <View>
                    
      
    
            <FlatList
              data={RequestList}
              renderItem={renderItem}
              keyExtractor={(item)=>item.key}
              extraData={selectedId}
              onRefresh={()=>fetchData()}
              refreshing={loading}
            />
          
            {/* end request list*/ }
                    
                </View>
                

               

            </View>  

        </View>
        </KeyboardAwareScrollView> 
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
        fontSize: 18,
        fontWeight: 'bold' ,
        textAlign :'right',
        marginRight:30,
        marginTop:5, 
      },
      date: {
        fontSize: 14,
        textAlign :'right',
        marginRight:30,
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