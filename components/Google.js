import React, { Component,useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
  TouchableOpacity
} from "react-native";
import MapView from "react-native-maps";
import {FontAwesome5} from '@expo/vector-icons';
import { NativeModules } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import firebase from '../Database/firebase';
import Placesearch from 'react-native-placesearch';
import { LinearGradient } from 'expo-linear-gradient';
import AddFacility from '../Admin/AddFacility'
const Google=(props)=> {
  console.log(props.state);
    const [alertVisible,setAlertVisible]= useState(true)
  const [state,setState] =useState(  {
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
  )

  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    map.animateToRegion({
      ...state.focusedLocation,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    const Key="AIzaSyAocOTaKxXxXHKfs-k_lqjocebqw2PxBYM";
    const url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+coords.latitude+","+coords.longitude+"&key="+Key;
    fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setState(prevState => {
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
      pickLocationHandler(coordsEvent);
    },
  err => {
    console.log(err);
    alert("يجب تفعيل الموقع للوصول الى موقعك الحالي");
  })
  }

  udpateUserLocation=()=>{
    // props.setLocation({
    //   latitude:state.focusedLocation.latitude,
    //   longitude:state.focusedLocation.longitude,
    //   address:state.formatted_address
    // })
    props.pickLocation(state.formatted_address,state.focusedLocation.latitude,state.focusedLocation.longitude);
    closeModal();
  }

  const closeModal=()=>{

    setAlertVisible(false)
    
  }

    let marker = null;
    // const { navigation } = this.props;

    if (state.locationChosen) {
      marker = <MapView.Marker coordinate={state.focusedLocation} />;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={alertVisible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <View style={styles.header}>
                    <LinearGradient
                            colors={["#809d65","#9cac74"]}
                            style={{height:"100%" ,width:"100%",alignItems:'center',
                            justifyContent:'center',flexDirection: Platform.OS === 'android' && 
                            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row': 'row-reverse' ,}}> 
                        <MaterialIcons name="cancel" size={30} color="#fff" style={styles.icon}
                            onPress={closeModal}/>
                         <View>
                            <Text style={styles.headerText}>تحديث الموقع</Text>
                        </View>
                        </LinearGradient>
                    </View>  

                    <MapView
                        initialRegion={state.focusedLocation}
                        region={!state.locationChosen ? state.focusedLocation : null}
                        style={styles.map}
                        onPress={pickLocationHandler}
                        ref={ref => map = ref}>
                        {marker}
                    </MapView>

                    <View style={styles.bottomView}>
                        <MaterialIcons name="my-location" size={30} color="#C0CA33" onPress={getLocationHandler}/>
                    </View>

                    {!state.isVisible? null:
                    
                    <View style={styles.button}>
                      <TouchableOpacity onPress={udpateUserLocation}>
                        <LinearGradient
                            colors={["#809d65","#9cac74"]}
                            style={styles.Selecet}>
                            <Text style={[styles.textSelecet,{color:'#fff'}]}>اختـر</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                    
                    }
                </View>
            </View>
        </Modal>
    );
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
    height: "90%"
  },
  button: {
    margin: 15,
    backgroundColor:"#C0CA33",
    width: "50%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    position:'absolute',
    bottom:0
  },
  headerText:{
    fontWeight:'bold',
    fontSize: 18,      
    letterSpacing: 1, 
    textAlign:'center',
    color: '#fff'
    // color: '#212121'
  },
  icon:{
    position: 'absolute',
    left: 16
    },
  header:{
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop:15,
    backgroundColor:'#C0CA33',
    borderRadius:5,
    overflow: 'hidden',
  },
  bottomView: {
    flexDirection: 'row',
    height: 50,
    width:50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    bottom: 10,
    left: 10,
    backgroundColor:"white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  },
  centeredView:{
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    flex:1,
},
modalView:{
    width:'90%',
    height:'70%',
    margin:10,
    backgroundColor:"#fff",
    borderRadius:10,
    padding:5,
    alignItems:'center',
    shadowColor:'#161924',
    shadowOffset:{
        width:0,
        height:2
    },
    shadowOpacity:0.25,
    shadowRadius:3.85,
    elevation:5,        
},
Selecet: {
  width: '100%',
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10
},
textSelecet: {
  fontSize: 18,
  fontWeight: 'bold'  
}
});
export default Google;