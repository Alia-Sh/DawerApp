import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons'

const RequestDetails = ({navigation,route})=>{
    var  RequestId = route.params.ID;
    const Open=()=>{
        navigation.openDrawer()
    }
    return (
        <View style={styles.container}>
           
                <Text style={styles.textInput}>
               تفاصيل الطلب</Text>
            
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },  
    textInput: {
        textAlign: 'center', 
        marginTop: 20,  
    }
  });
export default RequestDetails;