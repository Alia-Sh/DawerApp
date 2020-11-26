import React,{useState} from 'react';
import {Modal,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import LottieView from 'lottie-react-native';

const AlertView = ({title,message,jsonPath})=>{
    const [alertVisible,setAlertVisible]= useState(true)

    return(
        
        <Modal
            animationType="slide"
            transparent={true}
            visible={alertVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{title}</Text>
                        <View style={{width:'100%',height:0.5,backgroundColor:"#757575",marginVertical:15}}></View>
                            <View style={{width:'50%',height:100}}>  
                            {jsonPath=="Error"?
                            <LottieView source={require('../assets/ErrorIcon.json')}autoPlay loop/>:
                            <LottieView source={require('../assets/successIcon.json')}autoPlay loop/>
                            }                             
                        </View>
                        <Text style={styles.textStyle}>{message}</Text>
                        <TouchableOpacity 
                        style={styles.openButton}
                        onPress={()=>{
                            setAlertVisible(!alertVisible)
                        }}>
                            <Text style={styles.okStyle}>تم</Text>
                    </TouchableOpacity>
                    </View>
                </View>
        </Modal>
    );

}

const styles=StyleSheet.create({
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
        padding:15,
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
    textStyle:{
        color:"#161924",
        textAlign:'center',
        fontSize:15,
        marginTop:20
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
    },
    okStyle:{
        color:"#161924",
        textAlign:'center',
        fontSize:20
    },
    openButton:{
        backgroundColor:'#809d65',
        borderRadius:5,
        padding:10,
        elevation:2,
        width:'100%',
        marginTop:20
    }
})
export default AlertView