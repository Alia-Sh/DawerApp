import React,{useState}from 'react';
import { StyleSheet, Text,View,NativeModules,TouchableOpacity,Modal} from 'react-native';
import firebase from '../Database/firebase';
import LottieView from 'lottie-react-native';
import moment from 'moment';
const RejectModal=(props)=>{
    const [alertVisible,setAlertVisible]= useState(true)
console.log("on rejrct ",props.Token);
    const rejectRequest=(UserId,RequestId,Token)=>{
        firebase.database().ref('PickupRequest/'+UserId+"/"+RequestId).update({
            Status:"Rejected"
        }).then(()=>{
          firebase.database().ref('Notification/'+UserId+"/").push({
            RequestId: RequestId,
            DateAndTime:moment().locale('en-au').format('llll'),
            Status:'Rejected'
        }).then(()=>{
          sendNotifications(Token,'نعتذر عن قبول طلبك 🚫','تم رفض طلبك')
          props.setRejectModal(false);
          props.navigation.navigate("RequestHome");
        })
        })
    }

    const rejectJoinRequest=(userId)=>{
      firebase.database().ref('DeliveryDriver/' + userId).remove().then(()=>{
            props.setRejectModal(false);
            props.navigation.navigate("DriverHome");
        })
        console.log("rejectDriver");
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
return(            
<Modal
    animationType="slide"
    transparent={true}
    visible={alertVisible}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>{props.title}</Text>
                <View style={{width:'100%',height:0.5,backgroundColor:"#757575",marginVertical:15}}></View>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                  <View style={{width:'50%',height:100,justifyContent:'center',alignItems:'center'}}>  
                    <LottieView source={require('../assets/Warning.json')}autoPlay loop/>                           
                  </View>
                </View>

                <Text style={styles.textStyle}>{props.message}</Text>
                <View style={{flexDirection:Platform.OS === 'android' &&
                        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'row':'row-reverse',
                        alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity 
                        style={styles.okButton}
                        onPress={()=>{{props.type=="reject Request"?
                            rejectRequest(props.UserId,props.RequestId,props.Token)
                        :
                        rejectJoinRequest(props.userId)
                        }
                            
                    }}>
                      <Text style={styles.okStyle}>رفض</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={()=>{
                            props.setRejectModal(false)
                        }}>
                            <Text style={styles.okStyle}>إلغاء</Text>
                    </TouchableOpacity>
                  </View>
            </View>
        </View>
</Modal>)
}
const styles = StyleSheet.create({
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
      marginTop:10      
    },
    textStyle:{
      color:"#161924",
      textAlign:'center',
      fontSize:15,
      marginTop:20
    },   
});
export default RejectModal;