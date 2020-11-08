import React,{useState}from 'react';
import { StyleSheet, Text,View,NativeModules,TouchableOpacity,Modal} from 'react-native';
import firebase from '../Database/firebase';
import LottieView from 'lottie-react-native';

const DeleteModal=(props)=>{
    const [alertVisible,setAlertVisible]= useState(true)
    const Delete=(id,Type)=>{
        if(Type=="فئة"){
                firebase.database().ref('Category/' + id).remove();
                props.setDaleteModal({
                  IsVisible:false
                })
        }else if(Type=="منشأة"){
                firebase.database().ref('/Category/').once('value',snapshot=>{
                    snapshot.forEach(function(snapshot){
                        var CategoryId=snapshot.key
                        snapshot.forEach(function(snapshot){
                            snapshot.forEach(function(snapshot){
                                if(snapshot.key===id){
                                    firebase.database().ref('Category/'+CategoryId+'/RecyclingFacility/' + id).remove(); 
                                }

                            })
                        })
                    })
                })
                firebase.database().ref('RecyclingFacility/' + id).remove();
                var desertRef = firebase.storage().ref('Facilities/' + id);
                        if(desertRef){
                            desertRef.delete().catch((error)=>{
                                console.log(error);
                            })
                        }
                props.setDaleteModal({
                  IsVisible:false
                })
                props.navigation.navigate("FacilityHome"); 
        }
    }
return(            
<Modal
    animationType="slide"
    transparent={true}
    visible={alertVisible}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>حذف {props.Type}</Text>
                <View style={{width:'100%',height:0.5,backgroundColor:"#757575",marginVertical:15}}></View>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                  <View style={{width:'50%',height:100,justifyContent:'center',alignItems:'center'}}>  
                    <LottieView source={require('../assets/Warning.json')}autoPlay loop/>                           
                  </View>
                </View>

                <Text style={styles.textStyle}>هل انت متاكد من حذف {props.Type} {props.Name}</Text>
                <View style={{flexDirection:Platform.OS === 'android' &&
                        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'row':'row-reverse',
                        alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity 
                        style={styles.okButton}
                        onPress={()=>{
                        Delete(props.Id,props.Type)
                    }}>
                      <Text style={styles.okStyle}>حذف</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={()=>{
                            props.setDaleteModal({
                              IsVisible:false
                            })
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
      marginTop:5      
    },
    textStyle:{
      color:"#161924",
      textAlign:'center',
      fontSize:15,
      marginTop:20
    },   
});
export default DeleteModal;