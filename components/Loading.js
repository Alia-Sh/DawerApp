import React,{useState} from 'react';
import {Modal,StyleSheet,Text,TouchableOpacity,View,ActivityIndicator} from 'react-native';
import LottieView from 'lottie-react-native';

const Loading = ()=>{
    const [alertVisible,setAlertVisible]= useState(true)

    return(
        <View style={styles.centeredView}>
            <Modal
            animationType="slide"
            transparent={true}
            visible={alertVisible}>
                <View style={styles.centeredView}>
                    {/* <View style={styles.modalView}> */}
                    <ActivityIndicator size="large" color="#9E9D24" />
                    {/* </View> */}
                </View>
            </Modal>
        </View>
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
        // backgroundColor:"#fff",
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
export default Loading