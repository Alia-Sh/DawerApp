import React,{useState,useEffect}from 'react';
import { StyleSheet, 
    Text,
    View,
    NativeModules,
    TouchableOpacity,
    Modal,
    Image,
    TouchableHighlight,
    Animated,
    LayoutAnimation, Platform, UIManager} from 'react-native';
import firebase from '../Database/firebase';
import {MaterialIcons} from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { LinearGradient } from 'expo-linear-gradient'; 
import moment from 'moment';
import Loading from '../components/Loading';
import {FontAwesome5} from '@expo/vector-icons';
import FilterModal from './FilterModal';

const AssignModal=(props)=>{
    var DATEANDTIME=props.DATE
    var INDEX=DATEANDTIME.indexOf(" ");
    var DATE=moment(DATEANDTIME.substring(0,INDEX)).format('Y/M/D');
    var TIME=DATEANDTIME.substring(INDEX+1);
    var  RequestId = props.ID;
    var UserId=props.UserId;
    var AssignList=props.AssignList;
    const [alertVisible,setAlertVisible]= useState(true)
    const [FilterModalVisible,setFilterModalVisible]= useState(false)
    const [isLoading,setIsLoading]= useState(false)
    const [DriverList,setDriverList] = useState(
        AssignList.map((AssignList,index)=>({
            key:`${index}`,
            DriverId:AssignList.DriverId,
            DriverUserName:AssignList.DriverUserName,
            DriverName:AssignList.DriverName,
            DeliveryArea:AssignList.DeliveryArea
        })),
        );
    const [DriverList2,setDriverList2] = useState(
        AssignList.map((AssignList,index)=>({
            key:`${index}`,
            DriverId:AssignList.DriverId,
            DriverUserName:AssignList.DriverUserName,
            DriverName:AssignList.DriverName,
            DeliveryArea:AssignList.DeliveryArea
        })),
        );
    const [expanded,setExpanded]=useState(false)
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    const changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFilterModalVisible(!FilterModalVisible)
        setExpanded(!expanded);
    }

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
            firebase.database().ref('PickupRequest/'+UserId+"/"+RequestId).update({
                Status:"Accepted",
                DeliveryDriverId:DriverId
            }).then(()=>{
                    props.ShowModal()
            })
    }

    const FilterDrivers=(area)=>{
        if(area!=""){
            setDriverList(DriverList2.filter(item => item.DeliveryArea == area))
            console.log(DriverList2);
        }
        if(area=="جميع المناطق"){
            setDriverList(DriverList2)
        }
        console.log(area);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFilterModalVisible(!FilterModalVisible)
        setExpanded(!expanded);
    }

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
      };

    const VisibleItem=props=>{
        const {
            data,
            rowHeightAnimatedValue,
            onAssign,
            rightActionState,
          } = props;

          if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
                onAssign();
            });
          }
        return(
            <TouchableHighlight style={styles.item}>
                <View  style={[styles.flexDirectionStyle,{height:30}]}>
                    <Image source={require('../assets/DriverProfile2.png')} 
                        style={{height:50 ,width:50,marginRight:-8,marginTop:-10}}
                    />

                    <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:10,justifyContent :'center'}} >
                        <Text style={[styles.title,{textAlign: Platform.OS === 'android' && 
                            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>{data.item.DriverName}</Text>
                        <Text style={styles.user}>@{data.item.DriverUserName}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    const HiddenItemWithActions=props=>{
        const {
            swipeAnimatedValue,
            leftActionActivated,
            rightActionActivated,
            rowActionAnimatedValue,
            rowHeightAnimatedValue,
            onClose,
            onAssign,
          } = props;

        if (rightActionActivated) {
            Animated.spring(rowActionAnimatedValue, {
              toValue: 500,
              useNativeDriver: false
            }).start();
          }

        return(
            <Animated.View style={[styles.rowBack,{height: rowHeightAnimatedValue}]}>             
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
            </Animated.View>
        );

    }

    const renderItem=(data,rowMap)=>{
        const rowHeightAnimatedValue = new Animated.Value(60);
        return(
            <VisibleItem 
                data={data}    
                rowHeightAnimatedValue={rowHeightAnimatedValue} 
                onAssign={()=> AssignRow(rowMap,data.item.key,data.item.DriverId)}/>
        );

    }
        
    const renderHiddenItem=(data,rowMap)=>{
        const rowActionAnimatedValue = new Animated.Value(75);
        const rowHeightAnimatedValue = new Animated.Value(60);
        return(
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={()=> closeRow(rowMap,data.item.key)}
                onAssign={()=> AssignRow(rowMap,data.item.key,data.item.DriverId)}/>
        );
    }
    useEffect(()=>{
        fetchData()
      },[])
      const test=()=>{
          console.log("on test");
      }
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
                            <View style={{alignItems:'center', justifyContent:'space-between' ,flexDirection:'row'}}>
                                <FontAwesome5 name="filter" size={19} color="#212121" style={styles.filterIcon}
                                    onPress={()=> changeLayout()}/>
                                <Text style={styles.modalText}>اسناد الطلب</Text>
                                <MaterialIcons name="clear" size={30} color="#212121" style={styles.icon}
                                    onPress={()=>{props.setVisibleAssignModal(false)}}
                                />
                            </View>
                        </LinearGradient>

                        <View style={{ height: expanded ? null : 0, overflow: 'hidden',paddingBottom:6}}>
                            {
                                FilterModalVisible?
                                <FilterModal changeLayout={changeLayout} FilterDrivers={FilterDrivers}></FilterModal>
                            :
                                null
                            }
                        </View>
            
                        <SwipeListView
                            data={DriverList}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            rightOpenValue={-75}
                            leftOpenValue={75}
                            disableRightSwipe
                            onRowDidOpen={onRowDidOpen}
                            leftActivationValue={100}
                            rightActivationValue={-150}
                            leftActionValue={0}
                            rightActionValue={-500}
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
        </Modal>
        )
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
    modalText:{
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
    item: {
        backgroundColor: '#F3F3F3',
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
        backgroundColor: '#9cac74',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding :15,
        marginVertical: 10,
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
        paddingRight: 7,
    },
    backRightBtnRight: {
        // a49951
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
        paddingRight:10 
    },
    filterIcon:{
        paddingLeft:10    
    }

});
export default AssignModal;
