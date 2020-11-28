import React,{useState,useEffect}from 'react';
import { StyleSheet, Text,View,NativeModules,TouchableOpacity,Alert,Modal} from 'react-native';
import firebase from '../Database/firebase';
import LottieView from 'lottie-react-native';
import AlertView from '../components/AlertView';

const DeleteDriver=(props)=>{


    const [Req,setReq] = useState([])
    const [alert,setAlert]=useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',   
    })


    useEffect(()=>{
        fetchData(props.userId)
      },[])

    fetchData=(userId)=>{
        firebase.database().ref('/PickupRequest/').on('value',snapshot=>{
            const Data = snapshot.val();
            if(Data){
              var li = []
              snapshot.forEach(function(snapshot){
                var User=snapshot.key
                firebase.database().ref('/PickupRequest/'+User).on('value',snapshot=>{

                  snapshot.forEach(function(snapshot){
                    if(snapshot.val().DeliveryDriverId == userId && snapshot.val().Status != 'Delivered' ){
                      var temp={
                        Status:snapshot.val().Status,
                      }
                      li.push(temp)
                     
                    }
                  })
                })
              })
              
              setReq(li)
            }
          })
    }
    const [alertVisible1,setAlertVisible]= useState(true)
    
    const removeDriver=(userId)=>{
        
         ////////////////////////////////////////////
   
          if(Req.length == 0){ //update
               console.log('!!!!!!!!!!!!!in the if!!!!!!!!!!!!!!!!!!!');
           firebase.database().ref('DeliveryDriver/' + userId).update({
               Status:"Suspend" 
           }).then(()=>{
            
                setTimeout(()=>{
                setAlert({
                    ...alert,
                    Title:'حذف السائق',
                    Message:'تم حذف السائق بنجاح',
                    jsonPath:"success",
                    alertVisible:true,
                });
              
                setTimeout(() => {
                    setAlert({
                        ...alert,
                        alertVisible:false,
                    });
                    
                                       props.navigation.navigate("DriverHome");
                                       props.setDeleteDriver(false);


                }, 4000)
              },400)
              console.log('!!!!!!!!!!!!!!!deleted yes!!!!!!!!!!!!!'+alert.alertVisible+'!!!!!!!!!!');
                
              
           })
       }//updates
       else {
     //  props.setDeleteDriver(false);
      // props.navigation.navigate("DriverHome");
         console.log('!!!!!!!!!!!!!!!deleted no!!!!!!!!!!!!!!!!!!!!!!!');
           console.log("rejectDriver");
           setTimeout(()=>{
            setAlert({
                ...alert,
                Title:' حدث خطأ ما',
                Message:'تعذر حذف السائق ، تأكد من عدم وجود طلبات مسندة لم يتم إيصالها',
                jsonPath:"Error",
                alertVisible:true,
            });
            setTimeout(() => {
                setAlert({
                    ...alert,
                    alertVisible:false,
                });
            }, 4000)
          },400) 
        }
   
           

    }

        /////////////////////////////Here the old
       { /*firebase.database().ref('DeliveryDriver/' + userId).update({
            Status:"Rejected" 
        }).then(()=>{
            props.setDeleteDriver(false);
            props.navigation.navigate("DriverHome");
        })
    console.log("rejectDriver");*/}
    
return(            
<Modal
    animationType="slide"
    transparent={true}
    visible={alertVisible1}>
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
                        onPress={()=>{{
                            removeDriver(props.userId)
                        }
                            
                    }}>
                      <Text style={styles.okStyle}>حذف</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={()=>{
                            props.setDeleteDriver(false)
                        }}>
                            <Text style={styles.okStyle}>إلغاء</Text>
                    </TouchableOpacity>
                      
         
        
                  </View>
            </View>
            
        </View>
        {alert.alertVisible?
                <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
            :
                null
        }
</Modal>

);
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
export default DeleteDriver;