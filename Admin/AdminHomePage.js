import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AdminHomePage = ({navigation})=>{
    return (
        <View style={styles.container}>
            <Text style={styles.textInput}>Hello from admin home page</Text>
        </View>
      );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },  textInput: {
        textAlign: 'center', 
        marginTop: 20,  
    }
  });

export default AdminHomePage