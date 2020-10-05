import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Contants from 'expo-constants';
import DriverLogin from './Driver/DriverLogin' ;
import DriverHomePage from './Driver/DriverHomePage' ;
import DriverViewProfile from './Driver/DriverViewProfile' ;
import DriverEditProfile from './Driver/DriverEditProfile' ;
import DriverEditPassword from './Driver/DriverEditPassword' ;
import ResetPassword from './Driver/ResetPassword';
import AdminLogin from './Admin/AdminLogin' ;
import AdminHomePage from './Admin/AdminHomePage' ;
import DriverHome from './Admin/DriverHome' ;
import CategoryHome from './Admin/CategoryHome' ;
import FacilityHome from './Admin/FacilityHome' ;
import RequestHome from './Admin/RequestHome' ;
import CommunityHome from './Admin/CommunityHome' ;
import DeliveryDriverOptions from './Admin/DeliveryDriverOptions';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import UserHomePage from './User/UserHomePage' ;
import DrawerContent from './User/DrawerContent';
import DriverDrawerContent from './Driver/DrawerContent';
import UserViewProfile from './User/UserViewProfile' ;
import UserEditProfile from './User/UserEditProfile' ;
import EditPassword from './User/EditPassword';
import GoogleMap from './User/GoogleMap';
import UserLogin from './User/UserLogin' ;
import CreateAccount from './User/CreateAccount';
import GoogleMapCreateAccount from './User/GoogleMapCreateAccount';
import NewRequestModal1 from './User/NewRequestModal1';
import DateTimePicker from './components/DateTimePicker'
import ChooseBetweenUsers from './Screens/ChooseBetweenUsers';



const Stack = createStackNavigator();
const createStack = createStackNavigator();



const myOptions={
 headerShown: false,
}

const Drawer = createDrawerNavigator();
const DriverDrawer = createDrawerNavigator();


function DriverNavigation() {
  return (
<DriverDrawer.Navigator initioalRouteName="DriverHomePage" drawerContent={props => <DriverDrawerContent { ... props}/>} drawerPosition='right'>
          <DriverDrawer.Screen name="DriverHomePage" component={DriverHomePage} options={myOptions}/>
          <DriverDrawer.Screen name="DriverViewProfile" component={DriverViewProfile} options={myOptions}/>
          <DriverDrawer.Screen name="DriverEditProfile" component={DriverEditProfile} options={myOptions}/>
          <DriverDrawer.Screen name="DriverEditPassword" component={DriverEditPassword} options={myOptions}/>
          {/* <DriverDrawer.Screen name="DriverLogin" component={App} options={myOptions}/> */}
        </DriverDrawer.Navigator>
  );
}


function Root() {
  return (
<Drawer.Navigator initioalRouteName="UserHomePage" drawerContent={props => <DrawerContent { ... props}/>} drawerPosition='right'>
          <Drawer.Screen name="UserHomePage" component={UserHomePage} options={myOptions}/>
          <Drawer.Screen name="UserViewProfile" component={UserViewProfile} options={myOptions}/>
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
          <Stack.Screen name="ChooseBetweenUsers" component={ChooseBetweenUsers} options={myOptions}/>
          <Stack.Screen name="DriverLogin" component={DriverLogin} options={myOptions}/>
          <Stack.Screen name="AdminLogin" component={AdminLogin} options={myOptions}/>
          <Stack.Screen name="AdminHomePage" component={AdminHomePage} options={myOptions}/>
          <Stack.Screen name="CreateAccount" component={create} options={myOptions}/>
          <Stack.Screen name="UserLogin" component={UserLogin} options={myOptions}/>
          <Stack.Screen name="DriverHomePage" component={DriverNavigation} options={myOptions}/>
          <Stack.Screen name="UserHomePage" component={Root} options={myOptions}/>
          <Stack.Screen name="GoogleMapCreateAccount" component={GoogleMapCreateAccount} options={myOptions}/>
          <Stack.Screen name="DriverHome" component={DriverHome} options={myOptions}/>
          <Stack.Screen name="RequestHome" component={RequestHome} options={myOptions}/>
          <Stack.Screen name="CategoryHome" component={CategoryHome} options={myOptions}/>
          <Stack.Screen name="FacilityHome" component={FacilityHome} options={myOptions}/>
          <Stack.Screen name="CommunityHome" component={CommunityHome} options={myOptions}/>
          <Stack.Screen name="DeliveryDriverOptions" component={DeliveryDriverOptions} options={myOptions}/>
          <Stack.Screen name="ResetPassword" component={ResetPassword} options={myOptions}/>
        </Stack.Navigator>
    </View>
  );
}



function create() {
  return (
    <View style={styles.container}>
        <createStack.Navigator>
          <createStack.Screen name="CreateAccount" component={CreateAccount} options={myOptions}/>
        </createStack.Navigator>
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

