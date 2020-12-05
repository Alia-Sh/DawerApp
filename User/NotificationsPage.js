import React ,{useState,useEffect}from 'react';
import {View, Text, StyleSheet,NativeModules,Image,FlatList,Modal} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/ar-sa'
import firebase from '../Database/firebase';
import {Card,Title} from 'react-native-paper';
const  NotificationsPage= () =>{
    const [NotificationList,setNotificationList]=useState([])
    const[loading,setLoading]=useState(true);
    const[DetailsList,setDetailsList]= useState([]);
    const [DetailsModal,setDetailsModal]=useState(false);
    const[reqDtae,setReqDate]=useState("");
    const [driverName,setDriverName]=useState("");
    var userId = firebase.auth().currentUser.uid;

    useEffect(()=>{
        fetchData()
    },[])

    const setDetails=(item)=>{
        console.log(item);
        setDetailsList([])
        // setTempItem(item)
        fetchDetails(item.requestId);
        setDetailsModal(true)
    }

    const fetchDetails=(ID)=>{
        firebase.database().ref("PickupRequest/"+userId+"/"+ID).on('value',snapshot=>{
            setReqDate(snapshot.val().DateAndTime)
        });
        firebase.database().ref("Material/"+ID).on('value',snapshot=>{
            const Data = snapshot.val();
            if(Data){
              var li = []
              snapshot.forEach(function(snapshot){
              var temp={MaterialType:snapshot.val().MaterialType, Id:snapshot.key,Type:snapshot.val().Type ,Quantity:snapshot.val().Quantity}
              li.push(temp)
            //   setLoading(false)
              })
              setDetailsList(li)
            }
          })
    }

    const fetchData=async()=>{
        firebase.database().ref("Notification/"+userId).on('value',async snapshot=>{
          const Data = snapshot.val();
          if(Data){
            var li = []
            await snapshot.forEach( function(snapshot){
                var temp={DateAndTime:snapshot.val().DateAndTime, Id:snapshot.key, Status:snapshot.val().Status,requestId:snapshot.val().RequestId,DriverId:snapshot.val().DriverId}
                li.push(temp)
                setLoading(false)

                                    // var temp={DateAndTime:snapshot.val().DateAndTime, Id:snapshot.key, Status:snapshot.val().Status,requestId:snapshot.val().RequestId,DriverId:snapshot.val().DriverId}
                                    // li.push(temp)
                                    // setLoading(false)

            })
            for (var i in li) {
                if(li[i].DriverId){
                    firebase.database().ref("DeliveryDriver/"+li[i].DriverId).on('value',Result=>{
            
                        console.log("Result",Result.val());
        
                                            li[i].DriverName=Result.val().Name
                                            // li.push(temp)
                                            // setLoading(false)
                                            })
                }
            }
            if(li){
              li.sort(function(a, b){
                return  new Date(b.DateAndTime) -new Date(a.DateAndTime);
              });
            }
            setNotificationList(li)
            console.log(NotificationList);
            if (NotificationList.length==0)
            setLoading(false)
          }
        })
    }

    const displayDetails=((item)=>{
        return(
        <Card>
            <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse'}}>
            <Text style={[styles.text,{marginTop:5,fontWeight:'500'}]}>نوع المادة: </Text>
            <Title style={{fontSize:16,textAlign:"right"}}>{item.MaterialType}</Title>
            </View>
            <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse'}}>
            <Text style={[styles.text,{marginTop:5,fontWeight:'500'}]}>الكمية: </Text>
            
            <Title style={{flex:-1,marginTop:2,marginRight:5,fontSize:16,textAlign:"right"}}>{item.Quantity}</Title>
             <Title style={{marginTop:2,fontSize:16,textAlign:"right"}}>{item.Type}</Title>
            </View>
            <Image
                style={{width:'100%',marginTop:15}}
                source={require('../assets/line.png')}
                />
        </Card>
        );
    });

    const renderList = ((item)=>{
        return(
            <View style={styles.container}>
                {item.Status=='Accepted'?
                            <View style={styles.cardContent}>
                            <Image
                                source={require('../assets/AdminIcons/requestIcon.jpg')}
                                style={{width:40,height:40,marginRight:-5,borderRadius:12}}
                                resizeMode="stretch"
                            />
            
                            <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>تم قبول طلبك واسناده الى 
                                <Text style={{fontWeight: "bold"}}> {item.DriverName}</Text>
                                .
                            </Text>
                            <Text style={styles.time}>{moment.utc(item.DateAndTime).local('ar-sa').startOf('seconds').fromNow()}</Text>    
                            <MaterialIcons 
                                name="error" 
                                size={30} 
                                color="#7B7B7B"
                                onPress={()=>{ setDetails(item)}}
                            />
                        </View>
                        :
                        null
                }

                {item.Status=='OutForPickup'?
                    <View style={styles.cardContent}>
                        <Image
                            source={require('../assets/DriverProfile2.png')}
                            style={{width:45,height:50,marginRight:-5,borderRadius:12}}
                            resizeMode="stretch"
                        />

                        <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}><Text style={{fontWeight: "bold"}}>{item.DriverName}</Text> في الطريق لاستلام طلبك.
                        </Text>
                        <Text style={styles.time}>{moment.utc(item.DateAndTime).local('ar-sa').startOf('seconds').fromNow()}</Text>        
                        <MaterialIcons 
                            name="error" 
                            size={30} 
                            color="#7B7B7B"
                            onPress={()=>{ setDetails(item)}}
                        />
                    </View> 
                    :
                    null
                }

                {item.Status=='Delivered'?
                    <View style={styles.cardContent}>
                        <Image
                            source={require('../assets/DriverProfile2.png')}
                            style={{width:45,height:50,marginRight:-5,borderRadius:12}}
                            resizeMode="stretch"
                        />

                        <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>تم توصيل طلبك إلى المنشأة
                        </Text>
                        <Text style={styles.time}>{moment.utc(item.DateAndTime).local('ar-sa').startOf('seconds').fromNow()}</Text> 
                                    
                        <MaterialIcons 
                            name="error" 
                            size={30} 
                            color="#7B7B7B"
                            onPress={()=>{ setDetails(item)}}
                        />
                    </View> 
                    :
                    null
                }

                {item.Status=='Rejected'?
                    <View style={styles.cardContent}>
                        <Image
                            source={require('../assets/rejectRequestIcon.png')}
                            style={{width:40,height:40,marginRight:-5,borderRadius:12}}
                            resizeMode="stretch"
                        />

                        <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>تم رفض  طلبك
                        </Text>
                        <Text style={styles.time}>{moment.utc(item.DateAndTime).local('ar-sa').startOf('seconds').fromNow()}</Text> 
                                    
                        <MaterialIcons 
                            name="error" 
                            size={30} 
                            color="#7B7B7B"
                            onPress={()=>{ setDetails(item)}}
                        />
                    </View> 
                    :
                    null 
                }

                {item.Status=='Remember'?
                    <View style={styles.cardContent}>
                        <Image
                            source={require('../assets/rememberIcon.png')}
                            style={{width:40,height:40,marginRight:-5,borderRadius:12}}
                            resizeMode="stretch"
                        />

                        <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>لديك موعد غداً لتسليم طلب
                        </Text>
                        <Text style={styles.time}>{moment.utc("Sun, Dec 4, 2020 9:45 AM").local('ar-sa').startOf('seconds').fromNow()}</Text> 
                                    
                        <MaterialIcons 
                            name="error" 
                            size={30} 
                            color="#7B7B7B"
                            onPress={()=>{ setDetails(item)}}
                        />
                    </View> 
                    :
                    null
                }
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
                            <Text style={[styles.text,{color:'#424242',fontWeight:'600',marginTop:5}]}>تفاصيل الطلب</Text>
                            <Text style={[styles.text,{marginTop:15,fontWeight:'500'}]}>تاريخ و وقت الاستلام :</Text>
                            <Title style={{fontSize:16,textAlign:"right"}}>{reqDtae}</Title>
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

    return(
        <View style={styles.container}>
            {
                NotificationList.length==0?
                <Text  style={{textAlign:'center',fontSize: 15,
                marginTop:5,
                color :'#7B7B7B'}}>
                    لا يوجد تنبيهات
                </Text>
                :
                <FlatList
                data={NotificationList}
                renderItem={({item})=>{
                return renderList(item)}}
                keyExtractor={item=>`${item.Id}`}
                style={{flex:8}}
                onRefresh={()=>fetchData()}
                refreshing={loading}
              /> 
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    cardContent:{
        flexDirection:Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'row':'row-reverse',
        backgroundColor: '#F3F3F3',
        marginHorizontal: 2,
        padding:8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems:'center',
    },
    cardContent2:{
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        justifyContent:'center',
        padding:8,
    },
    action: {
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingRight:3,
        paddingLeft:3,
        width:'100%'
    }, 
    time: {
        fontSize: 14,
        textAlign :'right',
        color :'#9E9E9E',
        top:15,
        margin:5
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
    iconIOS:{
        position:'absolute',
        right:15,
        padding:5
    },
    iconAndroid:{
        position:'absolute',
        left:15,
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
});

export default NotificationsPage;