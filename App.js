import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Contants from 'expo-constants';
import DriverLogin from './Driver/DriverLogin' ;
import DriverHomePage from './Driver/DriverHomePage' ;
import AdminLogin from './Admin/AdminLogin' ;
import AdminHomePage from './Admin/AdminHomePage' ;
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerContent from './User/DrawerContent';
import DriverDrawerContent from './Driver/DrawerContent';
import UserViewProfile from './User/UserViewProfile' ;
import UserEditProfile from './User/UserEditProfile' ;
import EditPassword from './User/EditPassword';
import GoogleMap from './User/GoogleMap';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './User/HomeScreen';
import DriverViewProfile from './Driver/DriverViewProfile';
import DriverEditProfile from './Driver/DriverEditProfile';
import DriverEditPassword from './Driver/DriverEditPassword';
import DriverHome from './Admin/DriverHome' ;
import CategoryHome from './Admin/CategoryHome' ;
import FacilityHome from './Admin/FacilityHome' ;
import RequestHome from './Admin/RequestHome' ;
import CommunityHome from './Admin/CommunityHome' ;



const Stack = createStackNavigator();
const myOptions={
  headerShown: false
}

const Drawer = createDrawerNavigator();
const DriverDrawer = createDrawerNavigator();
function Root() {
  return (
<Drawer.Navigator initioalRouteName="HomeScreen" drawerContent={props => <DrawerContent { ... props}/>} drawerPosition='right'>
          <Drawer.Screen name="HomeScreen" component={HomeScreen} options={myOptions}/>
          <Drawer.Screen name="UserViewProfile" component={UserViewProfile} options={myOptions}/>
          <Drawer.Screen name="DriverHomePage" component={DriverHomePage} options={myOptions}/>
          <Drawer.Screen name="UserEditProfile" component={UserEditProfile} options={myOptions}/>
          <Drawer.Screen name="EditPassword" component={EditPassword} options={myOptions}/>
          <Drawer.Screen name="GoogleMap" component={GoogleMap} options={myOptions}/>
        </Drawer.Navigator>
  );
}

function DriverNavigation() {
  return (
<DriverDrawer.Navigator initioalRouteName="DriverHomePage" drawerContent={props => <DriverDrawerContent { ... props}/>} drawerPosition='right'>
          <DriverDrawer.Screen name="DriverHomePage" component={DriverHomePage} options={myOptions}/>
          <DriverDrawer.Screen name="DriverViewProfile" component={DriverViewProfile} options={myOptions}/>
          <DriverDrawer.Screen name="DriverEditProfile" component={DriverEditProfile} options={myOptions}/>
          <DriverDrawer.Screen name="DriverEditPassword" component={DriverEditPassword} options={myOptions}/>
          <DriverDrawer.Screen name="DriverLogin" component={App} options={myOptions}/>
        </DriverDrawer.Navigator>
  );
}
function App() {
  return (
    <View style={styles.container}>
        <Stack.Navigator>
           <Stack.Screen name="AdminLogin" component={AdminLogin} options={myOptions}/> 
          <Stack.Screen name="DriverLogin" component={DriverLogin} options={myOptions}/>
          <Stack.Screen name="DriverHomePage" component={DriverNavigation} options={myOptions}/>
          <Stack.Screen name="HomeScreen" component={Root} options={myOptions}/>
          <Stack.Screen name="AdminHomePage" component={AdminHomePage} options={myOptions}/>
          <Stack.Screen name="DriverViewProfile" component={DriverViewProfile} options={myOptions}/>
          <Stack.Screen name="DriverHome" component={DriverHome} options={myOptions}/>
          <Stack.Screen name="RequestHome" component={RequestHome} options={myOptions}/>
          <Stack.Screen name="CategoryHome" component={CategoryHome} options={myOptions}/>
          <Stack.Screen name="FacilityHome" component={FacilityHome} options={myOptions}/>
          <Stack.Screen name="CommunityHome" component={CommunityHome} options={myOptions}/>
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

