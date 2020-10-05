import React from 'react';
import { StyleSheet, Text, View,NativeModules} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons'

const HomeScreen = ({navigation})=>{
    
    return (
        <View style={styles.container}>
           
                <Text style={styles.textInput}>هنا الصفحة الرئيسية اللي فيها الخمس انواع</Text>
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
export default HomeScreen;
