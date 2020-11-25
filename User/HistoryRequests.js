
import React,{useState,useEffect} from 'react';
import {View, Text, StyleSheet,Modal,Image} from 'react-native';
import {Card,Title} from 'react-native-paper';
import { NativeModules,FlatList ,Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import {FontAwesome5} from '@expo/vector-icons';
import firebase from '../Database/firebase';
import { ArabicNumbers } from 'react-native-arabic-numbers';
import {MaterialIcons} from '@expo/vector-icons';
const  HistoryRequests= ({navigation}) =>{
const[HistoryReq,setHistoryReq]= useState([]);
 const[DetailsList,setDetailsList]= useState([]);
 const[loading,setLoading]=useState(true);
 const [DetailsModal,setDetailsModal]=useState(false)
    const [tempItem,setTempItem]=useState('')




//**********firebase 
var userId = firebase.auth().currentUser.uid;
 const fetchData=()=>{
        firebase.database().ref("PickupRequest/"+userId).orderByChild("DateAndTime").on('value',snapshot=>{
          const Data = snapshot.val();
          if(Data){
            var li = []
            snapshot.forEach(function(snapshot){
            console.log(snapshot.key);
            console.log(snapshot.val().DateAndTime);
             if(snapshot.val().Status==="Canceled" ||snapshot.val().Status==="Delivered"||snapshot.val().Status==="Rejected"){
            var temp={DateAndTime:snapshot.val().DateAndTime, Id:snapshot.key, Status:snapshot.val().Status}
            li.push(temp)
            setLoading(false)}
            })
            setHistoryReq(li)
            console.log(li) 
            if(HistoryRequests.length==0)
             setLoading(false)
          }
        })
      }

       useEffect(()=>{
        fetchData()
    },[])
      
    //fech deatals
      const fetchDetails=(ID)=>{
        firebase.database().ref("Material/"+ID).on('value',snapshot=>{
            const Data = snapshot.val();
            if(Data){
              var li = []
              snapshot.forEach(function(snapshot){
              console.log(snapshot.key);
              console.log(snapshot.val().MaterialType);
              var temp={MaterialType:snapshot.val().MaterialType, Id:snapshot.key, Quantity:snapshot.val().Quantity,Type:snapshot.val().Type}
              li.push(temp)
            //   setLoading(false)
              })
              setDetailsList(li)
              console.log(li) 
            }
          })
    }
     const setDetails=(item)=>{
        setDetailsList([])
        setTempItem(item)
        fetchDetails(item.Id);
        setDetailsModal(true)
    }

     const displayDetails=((item)=>{
        return(
        <Card>
            <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse'}}>
            <Text style={[styles.textH,{fontWeight:'500'}]}> نوع المادة :</Text>
            <Title style={{marginTop:-2,marginRight:5,marginLeft:5,fontSize:16,textAlign:"right"}}>{item.MaterialType}</Title>
            </View>
            <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse'}}>
            <Text style={[styles.textH,{fontWeight:'500'}]}>الكمية :</Text>
            <Title style={{flexWrap: 'wrap',flex:-1,marginTop:2,marginRight:5,marginLeft:5,fontSize:16,textAlign:"right"}}>{item.Quantity}</Title>
            <Title style={{marginTop:2,fontSize:16,textAlign:"right"}}>{item.Type}</Title>
            </View>
            <Image
                style={{width:'100%',marginTop:15}}
                source={require('../assets/line.png')}
                />
        </Card>
        );
    });





      //Request List
        const renderList = ((item)=>{
        const getStatus=(status)=>{
            switch(status){

                case "Delivered":
                    return "تم توصيل الطلب"

                case "Rejected":
                    return "تم رفض الطلب"
                    
                case "Canceled":
                        return "تم الغاء الطلب"
            }
        }

        const getColor=(status)=>{
            switch(status){
               
                case "Delivered":
                    return "#BDBDBD"

                case "Rejected":
                    return "#BF360C"

                case "Canceled":
                    return "#ACADAC"
            }
        }
        const Status=getStatus(item.Status)
        const StatusColor=getColor(item.Status)
         return(
            <View style={{flex:1}}>
                <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse',flex:1}}>
                    <View style={[styles.RectangleShapeView,{backgroundColor:StatusColor}]}>
                        <Text style={[styles.text,{color:'#FAFAFA',margin:5,fontSize: 16}]}>{Status}</Text>
                    </View>
                </View>
                    <View style={[styles.cardView,{flex:1}]}>
                        <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse',flex:1}}>
                            <Text style={[styles.textH,{fontWeight:'500'}]}>تاريخ وقت الاستلام :</Text>
                            <Title style={{flexWrap: 'wrap',flex:1,marginTop:3,fontSize:16,textAlign:"right"}}>{item.DateAndTime}</Title>
                        </View>
                        <MaterialIcons 
                            name="error" 
                            size={30} 
                            color="#424242"
                            onPress={()=>{ setDetails(item)}}
                        />
                    </View>
                    
                    <Modal 
                    visible={DetailsModal} 
                    transparent={true} 
                    onRequestClose={()=>{ setDetailsModal(false) }}
                    animationType="fade">
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                            <View style={{backgroundColor:'#AFB42B',height:40,width:'100%',position:'absolute'}}/>
                                <MaterialIcons style={Platform.OS === 'android' && 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ? styles.iconAndroid:styles.iconIOS} name="clear" size={25} color="#424242" 
                         onPress={()=>{ setDetailsModal(false) }}
                         />
                         <Text style={[styles.textH,{color:'#424242',fontWeight:'700'}]}>تفاصيل الطلب</Text>
                         <Text style={[styles.textH,{marginTop:10,fontWeight:'500'}]}>تاريخ و وقت الاستلام :</Text>
                         <Title style={{fontSize:16,textAlign:"right"}}>{tempItem.DateAndTime}</Title>
                                <FlatList
                                    data={DetailsList}
                                    renderItem={({item})=>{
                                    return displayDetails(item)}}
                                    keyExtractor={item=>`${item.Id}`}
                            /> 
                    
                                </View>
                            </View>
                         
                    </Modal>
     </View>
        )
      });

      //***************************************** header 

    return(
     <View style={styles.root}>
     <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"10%"}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-right" size={24} color="#fff" style={styles.icon}
                        onPress={()=>{
                            navigation.goBack();
                        }}/>
                    <View>
                        <Text style={styles.headerText}>سـجـل طلـبـاتي</Text>
                    </View>
                </View>
            </LinearGradient>
             {/* <View style={{flexDirection:Platform.OS === 'android' &&
                      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                      NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                      'row':'row-reverse',justifyContent:'space-between'}}> */}
                
                <Text style={[styles.textH,{ fontWeight:'500', }]}>عدد الطلبات السابقة: {ArabicNumbers(HistoryReq.length)}</Text>
               
            {/* </View> */}
            <Image
                style={{width:'100%'}}
                source={require('../assets/line.png')}
                />

       

             <FlatList
                data={HistoryReq}
                renderItem={({item})=>{
                return renderList(item)}}
                keyExtractor={item=>`${item.Id}`}
                style={{flex:8}}
                
                onRefresh={()=>fetchData()}
                refreshing={loading}
              />
       
        </View>
    );
};


//**********************style
const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.09;
const wight_logo = width * 0.090;



const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor: '#F5F5F5',    
    },
    
    header:{
        width: '100%',
        height:80,
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row':'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop:8,
    },
    headerText:{
        // fontWeight:'bold',
        // fontSize: 18, 
        // marginTop:5,
        // letterSpacing: 1, 
        // textAlign:'center',
        // color: '#212121'
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,

  
    },
    icon:{
        position: 'absolute',
        left: 16
    },
      RectangleShapeView: {
        marginTop: 10,
        marginLeft:15,
        width: 45 * 3,
        height: 35,
        flexDirection:Platform.OS === 'android' &&
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
        'row':'row-reverse',
        justifyContent:'center',
        borderTopLeftRadius:5,
        borderTopRightRadius:5
      
        },
    cardView:{
        flexDirection:Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'row':'row-reverse',
        justifyContent:'space-between',
        backgroundColor: '#F3F3F3',
        margin:1,
        marginHorizontal: 10,
        borderRadius :5,
        shadowColor :'#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
        padding:8
    },
    centeredView:{
            justifyContent:'center',
            alignItems:'center',
            alignContent:'center',
            flex:1,
        },
        modalView:{
            width:'80%',
            margin:10,
            backgroundColor:"#fff",
            borderRadius:10,
            // padding:15,
            alignItems:'center',
            shadowColor:'#161924',
            shadowOffset:{
                width:0,
                height:2
            },
            shadowOpacity:0.25,
            shadowRadius:3.85,
            elevation:5,        
        },
         textH: {
        
        color: '#b2860e',
        fontSize: 18,
        textAlign:'center',
        margin:5
        // textAlign: Platform.OS === 'android' && 
        // NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        // NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        // NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        // marginRight:5,
        // marginLeft:5,
    },
    iconIOS:{
            position:'absolute',
            right:15,
            padding:5
        },
        iconAndroid:{
            position:'absolute',
            left:15,
        },
});
export default HistoryRequests;