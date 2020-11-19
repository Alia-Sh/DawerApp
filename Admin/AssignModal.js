import React,{useState,useEffect}from 'react';
import { StyleSheet, 
    Text,
    View,
    NativeModules,
    TouchableOpacity,
    Modal,
    Image,
    TouchableHighlight,
    Alert,
    Animated} from 'react-native';
import firebase from '../Database/firebase';
import {MaterialIcons} from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { LinearGradient } from 'expo-linear-gradient'; 
import moment from 'moment';
import Loading from '../components/Loading';
import AlertView from "../components/AlertView";

const AssignModal=(props)=>{
    var DATEANDTIME=props.DATE
    var INDEX=DATEANDTIME.indexOf(" ");
    var DATE=moment(DATEANDTIME.substring(0,INDEX)).format('Y/M/D');
    var TIME=DATEANDTIME.substring(INDEX+1);
    var  RequestId = props.ID;
    var UserId=props.UserId;
    var AssignList=props.AssignList;
    const [alertVisible,setAlertVisible]= useState(true)
    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',   
    })
    const [isLoading,setIsLoading]= useState(false)
    const [DriverList,setDriverList] = useState(
        AssignList.map((AssignList,index)=>({
            key:`${index}`,
            DriverId:AssignList.DriverId,
            DriverUserName:AssignList.DriverUserName,
            DriverName:AssignList.DriverName
        })),
        );

    const fetchData=()=>{
        for (var i in DriverList) {
            firebase.database().ref('/PickupRequest/').on('value',snapshot=>{
                const request = snapshot.val(); 
                if(request){
                    snapshot.forEach(function(snapshot){
                        var UserId=snapshot.key
                      firebase.database().ref('/PickupRequest/'+UserId).on('value',snapshot=>{
                        snapshot.forEach(function(snapshot){
                            if(snapshot.val().Status==="Pending" || snapshot.val().Status==="Accepted" ){
                                if(DriverList[i].DriverId==snapshot.val().DeliveryDriverId){
                                    var dateAndTime=snapshot.val().DateAndTime;
                                    var index=dateAndTime.indexOf(" ");
                                    var date=moment(dateAndTime.substring(0, index)).format('Y/M/D');
                                    var time=moment(dateAndTime.substring(index+1), 'HH:mma');
                                    if(date==DATE){
                                        if(moment(TIME,'HH:mm').isBetween(moment(moment(time, 'HH:mm').subtract('30', 'minutes').format('HH:mm'),'HH:mm'), moment(moment(time, 'HH:mm').add('30', 'minutes').format('HH:mm'),'HH:mm')) || 
                                            moment(TIME,'HH:mm').isSame(moment(moment(time, 'HH:mm').subtract('30', 'minutes').format('HH:mm'),'HH:mm')) || 
                                            moment(TIME,'HH:mm').isSame(moment(moment(time, 'HH:mm').add('30', 'minutes').format('HH:mm'),'HH:mm'))){
                                            setDriverList(DriverList.filter(item => item.DriverId != snapshot.val().DeliveryDriverId))
                                         }
                                    }
                                }
                            }
                        })
                      })
                    })
                }
            });
        }    
    }

    const closeRow = (rowMap, rowKey) => {
        if(rowMap[rowKey]){
            rowMap[rowKey].closeRow();
        }
      }

    const AssignRow=(rowMap,rowKey,DriverId)=>{
        closeRow(rowMap,rowKey);
        setTimeout(()=>{
            setIsLoading(true)

            setTimeout(()=>{
                firebase.database().ref('PickupRequest/'+UserId+"/"+RequestId).update({
                    Status:"Accepted",
                    DeliveryDriverId:DriverId
                }).then(()=>{
                    setIsLoading(false)
                    setTimeout(()=>{
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
                            props.setVisibleAssignModal(false)
                            props.navigation.goBack();
                        }, 4000)
                    },300)
                })
            },500)
        },500)
    }
    const VisibleItem=props=>{
        const data=props;
        return(
            <TouchableHighlight style={styles.item}>
                <View  style={[styles.flexDirectionStyle,{height:35}]}>
                    <Image source={require('../assets/DriverProfile2.png')} 
                        style={{height:50 ,width:50,marginRight:-8,marginTop:-8}}
                    />

                    <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:10}} >
                        <Text style={[styles.title,{textAlign: Platform.OS === 'android' && 
                            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>{data.data.item.DriverName}</Text>
                        <Text style={styles.user}>@{data.data.item.DriverUserName}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    const HiddenItemWithActions=props=>{
        const {swipeAnimatedValue,onClose,onAssign}=props;

        return(
            <View style={styles.rowBack}>             
                <TouchableOpacity style={[styles.backRightBtn,styles.backRightBtnRight]} onPress={onAssign}>
                    <Animated.View
                        style={[
                            {transform: [
                                {
                                    scale: swipeAnimatedValue.interpolate({
                                    inputRange: [-90, -1],
                                    outputRange: [1, 0],
                                    extrapolate: 'clamp',
                                    }),
                                },
                            ],
                            },
                        ]}>
                        <Text style={styles.textSign}>إســناد</Text>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        );

    }

    const renderItem=(data,rowMap)=>{
        return(
            <VisibleItem data={data}/>
        );

    }
        
    const renderHiddenItem=(data,rowMap)=>{

        return(
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                onClose={()=> closeRow(rowMap,data.item.key)}
                onAssign={()=> AssignRow(rowMap,data.item.key,data.item.DriverId)}/>
        );
    }
    useEffect(()=>{
        fetchData()
      },[])
    return(            
        <Modal
            animationType="slide"
            transparent={true}
            visible={alertVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <LinearGradient 
                            colors={["#809d65","#9cac74"]}
                            style={{borderRadius:5}}>
                        <Text style={styles.modalText}>اسناد الطلب</Text>
                        <MaterialIcons name="clear" size={30} color="#212121" style={styles.icon}
                            onPress={()=>{
                                props.setVisibleAssignModal(false)
                            }}
                            />
                        </LinearGradient>
                        <SwipeListView
                            data={DriverList}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            rightOpenValue={-75}
                            disableRightSwipe
                            style={{marginTop:10}}>
                        </SwipeListView>
                        {
                            isLoading?
                                <Loading></Loading>
                            : 
                            null
                        }
                    </View>
                </View>
                {
                    alert.alertVisible?
                        <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
                    :
                        null
                }
        </Modal>)
}

const styles = StyleSheet.create({
    centeredView:{
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        flex:1,
        marginTop:50,
        marginBottom:50
    },
    modalView:{
        width:'85%',
        margin:10,
        backgroundColor:"#fff",
        borderRadius:10,
        shadowColor:'#161924',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius:3.85,
        elevation:5,                
    },
    okStyle:{
        color:"#ffff",
        textAlign:'center',
        fontSize:20
    },
    okButton:{
        backgroundColor:'#B71C1C',
        borderRadius:5,
        padding:10,
        elevation:2,
        width:'30%',
        margin:15,
    },
    cancelButton:{
      backgroundColor:'#9E9E9E',
      borderRadius:5,
      padding:10,
      elevation:2,
      width:'30%',
      margin:15,
    },
    modalText:{
    //   color:'#fff',
      textAlign:'center',
      fontWeight:'bold',
      fontSize:25,
      shadowColor:'#161924',
      shadowOffset:{
          width:0,
          height:2
      },
      shadowOpacity:0.3,
      shadowRadius:3.84,
      elevation:5,
      margin:10      
    },
    textStyle:{
      color:"#161924",
      textAlign:'center',
      fontSize:15,
      marginTop:20
    },
    item: {
        backgroundColor: '#F3F3F3',
        // padding: 20,
        marginVertical: 5,
        marginHorizontal: 10,
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
      flexDirectionStyle:{
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
      },
      rowBack: {
        alignItems: 'center',
        // colors={["#809d65","#9cac74"]}

        backgroundColor: '#9cac74',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingLeft: 15,
        // marginLeft: 15,
        // marginTop: 15,
        // borderRadius: 5,
        // marginBottom:15,
        // marginRight:31
        padding :15,
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius :10,
      },
      backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        paddingRight: 17,
      },
      backRightBtnLeft: {
        backgroundColor: '#1f65ff',
        right: 75,
      },
      backRightBtnRight: {
        backgroundColor: '#9cac74',
        right: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
      },
      textSign: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'#fff' ,
    },
    user: {
        fontSize: 12,
        textAlign :'right',
        marginRight:20,
        marginTop:5,
        color :'#ADADAD',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold' ,
        textAlign :'right',
        marginRight:15,
        marginTop:0, 
    },
    icon:{
        position: 'absolute',
        right: 16,
        top:10
    },  
});
export default AssignModal;
