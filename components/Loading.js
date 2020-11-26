import React,{useState} from 'react';
import {Modal,StyleSheet,View,ActivityIndicator} from 'react-native';


const Loading = ()=>{
    const [alertVisible,setAlertVisible]= useState(true)

    return(
        <View style={styles.centeredView}>
            <Modal
            animationType="slide"
            transparent={true}
            visible={alertVisible}>
                <View style={styles.centeredView}>
                    <ActivityIndicator size="large" color="#9E9D24" />
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
})
export default Loading