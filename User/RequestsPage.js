import React,{useState,useEffect} from 'react';
import {View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Image,
    FlatList,
    Dimensions,
    Modal} from 'react-native';
import {Card,Title,FAB,Button} from 'react-native-paper';
import NewRequestModal from '../User/NewRequestModal';
import firebase from '../Database/firebase';
import {MaterialIcons} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';
import { color } from 'react-native-reanimated';
import { ArabicNumbers } from 'react-native-arabic-numbers';
const  RequestsPage= ({navigation}) =>{
    const [alertVisible,setAlertVisible]= useState(false);
    const[RequestList,setRequestList]= useState([]);
    const[DetailsList,setDetailsList]= useState([]);
    const[loading,setLoading]=useState(true);
    const [DetailsModal,setDetailsModal]=useState(false)
    const [tempItem,setTempItem]=useState('')
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

    const fetchDetails=(ID)=>{
        firebase.database().ref("Material/"+ID).on('value',snapshot=>{
            const Data = snapshot.val();
            if(Data){
              var li = []
              snapshot.forEach(function(snapshot){
              console.log(snapshot.key);
              console.log(snapshot.val().MaterialType);
              var temp={MaterialType:snapshot.val().MaterialType, Id:snapshot.key, Quantity:snapshot.val().Quantity}
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
            <Title style={styles.text}>:نوع المادة</Title>
            <Title style={{marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>{item.MaterialType}</Title>
            </View>
            <View style={{flexDirection:Platform.OS === 'android' &&
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ?
                                    'row':'row-reverse'}}>
            <Title style={styles.text}>:الكمية</Title>
            <Title style={{flexWrap: 'wrap',flex:1,marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>{item.Quantity}</Title>
            </View>
            <Image
                style={{width:'100%',marginTop:15}}
                source={require('../assets/line.png')}
                />
        </Card>
        );
    });

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
                            <Title style={styles.text}>:تاريخ و وقت الاستلام</Title>
                            <Title style={{flexWrap: 'wrap',flex:1,marginTop:3,fontSize:16,textAlign:"right"}}>{item.DateAndTime}</Title>
                        </View>
                        <MaterialIcons 
                            name="error" 
                            size={30} 
                            color="#212121"
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
                         <Title style={[styles.text,{color:'#424242'}]}>تفاصيل الطلب</Title>
                         <Title style={[styles.text,{marginTop:5}]}> :تاريخ و وقت الاستلام </Title>
                         <Title style={{fontSize:16,textAlign:"right"}}>{tempItem.DateAndTime}</Title>
                                <FlatList
                                    data={DetailsList}
                                    renderItem={({item})=>{
                                    return displayDetails(item)}}
                                    keyExtractor={item=>`${item.Id}`}
                            /> 
                    <View style={styles.button}> 
                    <Button mode="contained" theme={theme }>
                     إلغاء الطلب
                    </Button>
                    </View>
                                </View>
                            </View>
                         
                    </Modal>
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
                    <Title style={[styles.text,{fontWeight: 'bold',marginTop:10}]}>طلب جديد</Title>
                </TouchableOpacity>
                <Title style={[styles.text,{marginTop:10,marginLeft:Platform.OS=== 'android'?-55:55}]}> عدد الطلبات: {ArabicNumbers(RequestList.length)}</Title>
                <TouchableOpacity onPress={()=> navigation.navigate('HistoryRequests')} style={{margin:10}}
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
  
const theme= {
    colors:{
        primary: "#DC7025"
    }
}
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
        button:{
        flexDirection:"row",
        justifyContent:"space-around",
        paddingTop:20,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:10
    },
        iconIOS:{
            position:'absolute',
            right:15,
            padding:5
        },
        iconAndroid:{
            position:'absolute',
            left:15,
        }
});

export default RequestsPage;