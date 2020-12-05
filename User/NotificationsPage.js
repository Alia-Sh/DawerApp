import React from 'react';
import {View, Text, StyleSheet,NativeModules} from 'react-native';
import {Card,Title} from 'react-native-paper';

const  NotificationsPage= () =>{
    return(
        <View style={styles.container}>
            <Card style={styles.cardContent}>  
               <Text>test</Text>  
            </Card>

            <Card style={styles.cardContent}>  
               <Text>test</Text>  
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    cardContent:{
        flexDirection:Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'row':'row-reverse',
        backgroundColor: '#F3F3F3',
        margin:2,
        marginHorizontal: 2,
        borderRadius :5,
        shadowColor :'#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
        padding:8,
        borderBottomWidth:1,
        borderBottomColor:'red'
    }
});

export default NotificationsPage;