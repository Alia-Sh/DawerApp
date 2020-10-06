import React from 'react';
import { StyleSheet, Text, View, NativeModules} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons'

const HomeScreen = ({navigation})=>{
    
    return (
      //<View style={styles.viewPadding}>
      <View>
        <View style={styles.container}>
        <FontAwesome5 name="camera" size={24} color="#AFB42B" style={alignItems = "left"}
            onPress={()=>{
                navigation.navigate("ImageClassifier")
            }}/>
        </View>
          <View style={styles.container}>
                  <Text style={styles.textInput}>هنا الصفحة الرئيسية اللي فيها الخمس انواع</Text>
          </View>
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
        padding: 35,  
    },
    viewPadding: {
      padding : 35,
    }
  });
export default HomeScreen;
