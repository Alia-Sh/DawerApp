import React,{useState,useEffect} from 'react';
import {View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Image,
    FlatList,
    Dimensions} from 'react-native';
import {Card,Title,FAB} from 'react-native-paper';
import NewRequestModal from '../User/NewRequestModal';
import firebase from '../Database/firebase';
import {MaterialIcons} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';
import { color } from 'react-native-reanimated';
const  RequestsPage= () =>{
    const [alertVisible,setAlertVisible]= useState(false);
    const[RequestList,setRequestList]= useState([]);
    const[loading,setLoading]=useState(true)
    // const [StatusColor,setStatusColor]=useState("#FFD600")
    var userId = firebase.auth().currentUser.uid;
    const fetchData=()=>{
        firebase.database().ref("PickupRequest/"+userId+"/DeliveryDriverId").orderByChild("TimeStamp").on('value',snapshot=>{
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

                case "Canceled":
                    return "تم الغاء الطلب"
            }
        }

        const getColor=(status)=>{
            switch(status){
                case "Pending":
                    return "#FBC02D"
                
                case "Accepted":
                    return "#9CCC65"

                case "OutForPickup":
                        return "#0288D1"

                case "Delivered":
                    return "#BDBDBD"

                case "Canceled":
                    return "#BF360C"
            }
        }
        const Status=getStatus(item.Status)
        // const [StatusColor,getStatusColor]=useState("")
        const StatusColor=getColor(item.Status)
        // const backgroundColor = item.key === selectedId ? "#EDEEEC" : "#F3F3F3";
        return(
            <View>
                <View>
                <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse'}}>
                <View style={[styles.RectangleShapeView,{backgroundColor:StatusColor}]}>
                    <Text style={[styles.text,{color:'#FAFAFA',margin:5}]}>{Status}</Text>
                </View>
                </View>
                    <View style={styles.cardView}>
                        <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse'}}>
                            {/* <View style={{flexWrap: 'wrap'}}> */}
                            <Title style={styles.text}>تاريخ و وقت الاستلام </Title>
                            <Title >{item.DateAndTime}</Title>
                            {/* </View> */}
                        </View>
                            <MaterialIcons 
                            // style={Platform.OS === 'android' &&
                            //         NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                            //         NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                            //         NativeModules.I18nManager.localeIdentifier === 'ar_SA' ? 
                            //         styles.iconAndroid:styles.iconIOS} 
                                    name="error" 
                                    size={32} 
                                    color="#161924"
                                    // style={{position:'absolute',right:5}}
                                    // onPress={resetData} 
                                />
                    </View>
                </View>
            </View>
        )
      });
    return(
        <View style={styles.container}>
            <View style={{flexDirection:Platform.OS === 'android' &&
                      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                      NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                      'row':'row-reverse',justifyContent:'space-between'}}>
                <TouchableOpacity onPress={()=>setAlertVisible(true)}>
                    <Title style={[styles.text,{fontWeight: 'bold'}]}>طلب جديد</Title>
                </TouchableOpacity>
                <Title style={styles.text}>{RequestList.length} عدد الطلبات</Title>
                <TouchableOpacity style={{margin:10}}
                    //  onPress={()=>DeleteRequest(item)}
                     >
                     <Image 
                        source={require('../assets/HistoryOfRequests.png')}
                        style={styles.HistoryOfRequestsIcon}
                        />
                    </TouchableOpacity>
            </View>
            <Image
                style={{width:'100%'}}
                source={require('../assets/line.png')}
                />

            {alertVisible? 
                <NewRequestModal setAlertVisible={setAlertVisible} ></NewRequestModal>

                :  
                null
            }
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
const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.09;
const wight_logo = width * 0.090;

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    text: {
        color: '#b2860e',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        marginRight:10,
        marginLeft:10,
        marginTop:10
    },
    HistoryOfRequestsIcon:{
        width:30,
        height:30,
    },
    cardView:{
        flexDirection:Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'row':'row-reverse',
        justifyContent:'space-between',
        backgroundColor: '#F3F3F3',
        // marginVertical: 5,
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
    text: {
        color: '#b2860e',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        marginRight:5,
        marginLeft:5,
        // margin:10
    },
    RectangleShapeView: {
        marginTop: 10,
        marginLeft:15,
        width: 50 * 3,
        height: 40,
        // backgroundColor: ,
        flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse',
        justifyContent:'center'
      
        }
});

export default RequestsPage;