import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Contants from 'expo-constants';
import DriverLogin from './Driver/DriverLogin' ;
import DriverHomePage from './Driver/DriverHomePage' ;
import AdminLogin from './Admin/AdminLogin' ;
import AdminHomePage from './Admin/AdminHomePage' ;
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import UserHomePage from './User/UserHomePage' ;
import DrawerContent from './User/DrawerContent';
import UserViewProfile from './User/UserViewProfile' ;
import UserEditProfile from './User/UserEditProfile' ;
import EditPassword from './User/EditPassword';
import GoogleMap from './User/GoogleMap';
import {createDrawerNavigator} from '@react-navigation/drawer';


const Stack = createStackNavigator();
const myOptions={
  headerShown: false
}

const Drawer = createDrawerNavigator();
function Root() {
  return (
<Drawer.Navigator initioalRouteName="UserHomePage" drawerContent={props => <DrawerContent { ... props}/>}>
          <Drawer.Screen name="UserHomePage" component={UserHomePage} options={myOptions}/>
          <Drawer.Screen name="UserViewProfile" component={UserViewProfile} options={myOptions}/>
          <Drawer.Screen name="DriverHomePage" component={DriverHomePage} options={myOptions}/>
          <Drawer.Screen name="UserEditProfile" component={UserEditProfile} options={myOptions}/>
          <Drawer.Screen name="EditPassword" component={EditPassword} options={myOptions}/>
          <Drawer.Screen name="GoogleMap" component={GoogleMap} options={myOptions}/>
        </Drawer.Navigator>
  );
}
function App() {
  return (
    <View style={styles.container}>
        <Stack.Navigator>
        <Stack.Screen name="AdminLogin" component={AdminLogin} options={myOptions}/>
          <Stack.Screen name="DriverLogin" component={DriverLogin} options={myOptions}/>
          <Stack.Screen name="DriverHomePage" component={DriverHomePage} options={myOptions}/>
          <Stack.Screen name="UserHomePage" component={Root} options={myOptions}/>
          <Stack.Screen name="AdminHomePage" component={AdminHomePage} options={myOptions}/>
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

