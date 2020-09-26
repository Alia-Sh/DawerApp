import React from 'react';
import { StyleSheet, Text, View,NativeModules} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons'

const HomeScreen = ({navigation})=>{
    const Open=()=>{
        navigation.openDrawer()
    }
    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex:1}}>
                <TouchableOpacity
                    style={{margin: 16,flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse'}}
                    onPress={Open}>  
                    <FontAwesome5 name="bars" size={24} color="#161924"/>
                </TouchableOpacity>
                <Text style={styles.textInput}>هنا الصفحة الرئيسية اللي فيها الخمس انواع</Text>
            </SafeAreaView>
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
