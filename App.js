import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Contants from 'expo-constants';
import DriverLogin from './Driver/DriverLogin' ;
import DriverHomePage from './Driver/DriverHomePage' ;
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
const myOptions={
  headerShown: false
}
function App() {
  return (
    <View style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen name="DriverLogin" component={DriverLogin} options={myOptions}/>
          <Stack.Screen name="DriverHomePage" component={DriverHomePage} options={myOptions}/>
        </Stack.Navigator>
      
    </View>
  );
}

export default ()=>{
  return (
    <NavigationContainer>
      <App/>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


/////// Alia's code.. not finished yet

//import HomeScreen from './User/HomeScreen';

/*const navigator = createStackNavigator({
  Homepage: HomeScreen

}, {
  initialRouteName: 'Homepage',
});*/

/*export default function App() {
  return (
    <View style={styles.container}>
      <Text>Our GREATE App!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/

/*export default createAppContainer(navigator);*/

