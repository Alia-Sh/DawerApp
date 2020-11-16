
import React,{useState,useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card,Title} from 'react-native-paper';
import { NativeModules,FlatList ,Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import {FontAwesome5} from '@expo/vector-icons';
import firebase from '../Database/firebase';
const  HistoryRequests= ({navigation}) =>{

const[RequestList,setRequestList]= useState([]);
 const [tempItem,setTempItem]=useState('')
 const[DetailsList,setDetailsList]= useState([]);
 const[loading,setLoading]=useState(true);






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
            var temp={DateAndTime:snapshot.val().DateAndTime, Id:snapshot.key, Status:snapshot.val().Status}
            li.push(temp)
            setLoading(false)
            })
            setRequestList(li)
            console.log(li) 
          }
        })
      }

       useEffect(()=>{
        fetchData()
    },[])
      

      //Request List
        const renderList = ((item)=>{
        const getStatus=(status)=>{
            switch(status){
                case "Pending":
                    return "الطلب معلق"
                
                case "Accepted":
                    return "تم قبول الطلب"

                case "OutForPickup":
                        return "في الطريق للاستلام"

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
                case "Pending":
                    return "#FBC02D"
                
                case "Accepted":
                    return "#7CB342"

                case "OutForPickup":
                        return "#0288D1"

                case "Delivered":
                    return "#BDBDBD"

                case "Rejected":
                    return "#BF360C"

                case "Canceled":
                    return "#FF9800"
            }
        }
        const Status=getStatus(item.Status)
        const StatusColor=getColor(item.Status)
        return(
            <View style={{flex:1,margin:1}}>
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
                            <Title style={styles.text}>تاريخ و وقت الاستلام</Title>
                            <Title style={{flexWrap: 'wrap',flex:1,marginTop:3,fontSize:16,textAlign:"right"}}>{item.DateAndTime}</Title>
                        </View>
                       
                    </View>
            </View>
        )
      });


      //***************************************** header 

    return(
     <View style={styles.root}>
     <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"8%"}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-right" size={24} color="#161924" style={styles.icon}
                        onPress={()=>{
                            navigation.goBack();
                        }}/>
                    <View>
                        <Text style={styles.headerText}>سجل طلباتي</Text>
                    </View>
                </View>
            </LinearGradient>
       

             <FlatList
                data={RequestList}
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
        height: 80,
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row':'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:-10,
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
        marginHorizontal: 10,
        borderRadius :5,
        shadowColor :'#000',
        shadowOffset: {
          width: 0,
          height:2
        },
           shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
        padding:8
    },
});
export default HistoryRequests;