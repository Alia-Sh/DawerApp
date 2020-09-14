import React, { Component} from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Dimensions
} from "react-native";
import MapView from "react-native-maps";
import {FontAwesome5} from '@expo/vector-icons';
import { NativeModules } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import firebase from '../Database/firebase';
export default class GoogleMap extends Component {

  state =  {
      focusedLocation: {
        latitude: 24.68773,
        longitude: 46.72185,
        latitudeDelta: 0.0122,
        longitudeDelta:
          Dimensions.get("window").width /
          Dimensions.get("window").height *
          0.0122
      },
      locationChosen: false,
      isVisible: false,
      formatted_address:''

  }

  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    this.map.animateToRegion({
      ...this.state.focusedLocation,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    const Key="AIzaSyAocOTaKxXxXHKfs-k_lqjocebqw2PxBYM";
    const url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+coords.latitude+","+coords.longitude+"&key="+Key;
    fetch(url)
    .then(response=>response.json())
    .then(data=>{
      this.setState(prevState => {
        return {
          focusedLocation: {
            ...prevState.focusedLocation,
            latitude: coords.latitude,
            longitude: coords.longitude
          },
          locationChosen: true,
          isVisible:true,
          formatted_address:data.results[0].formatted_address
        };
      });
    }).catch(err =>console.log(err));
  };

  getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coordsEvent = {
        nativeEvent: {
          coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,           
          }
        }
      };
      this.pickLocationHandler(coordsEvent);
    },
  err => {
    console.log(err);
    alert("يجب تفعيل الموقع للوصول الى موقعك الحالي");
  })
  }

  udpateUserLocation=()=>{
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('User/' + userId+'/Location').update({
      latitude: this.state.focusedLocation.latitude,
      longitude: this.state.focusedLocation.longitude,
      address:this.state.formatted_address,     
    });
    const { navigation } = this.props;
    const Location=this.state.formatted_address
    navigation.navigate("UserEditProfile",Location); 
  }

  render() {
    let marker = null;
    const { navigation } = this.props;

    if (this.state.locationChosen) {
      marker = <MapView.Marker coordinate={this.state.focusedLocation} />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
              onPress={()=>{
                navigation.navigate("UserEditProfile")}}/>
          <View>
              <Text style={styles.headerText}>تحديث الموقع</Text>
          </View>
        </View>  

        <MapView
          initialRegion={this.state.focusedLocation}
          region={!this.state.locationChosen ? this.state.focusedLocation : null}
          style={styles.map}
          onPress={this.pickLocationHandler}
          ref={ref => this.map = ref}>
          {marker}
        </MapView>

        <View style={styles.bottomView}>
          <MaterialIcons name="my-location" size={30} color="#C0CA33" 
            onPress={this.getLocationHandler}/>
        </View>
        {!this.state.isVisible? null:
          <View style={styles.button}>
            <Button title="اختر" onPress={this.udpateUserLocation} color="#161924" />
          </View>
        }
      </View>
    );
  }
}

const {height} = Dimensions.get("screen");
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flex: 1
  },
  map: {
    width: "100%",
    height: height*.77
  },
  button: {
    margin: 15,
    backgroundColor:"#C0CA33",
    width: "40%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    color:"red"
  },
  headerText:{
    fontWeight:'bold',
    fontSize: 18,      
    letterSpacing: 1, 
    textAlign:'center',
    color: '#212121'
  },
  icon:{
    position: 'absolute',
    left: 16
    },
  header:{
    width: '100%',
    height: 60,
    flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:15,
  },
  bottomView: {
    flexDirection: 'row',
    height: 50,
    width:50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    bottom: '15%',
    left: 10,
    backgroundColor:"white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  }
});
