import React, {useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
  TouchableOpacity
} from "react-native";
import MapView ,{Polyline}from "react-native-maps";
import { NativeModules } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import GeoFencing from 'react-native-geo-fencing';

const Google=(props)=> {
    const [alertVisible,setAlertVisible]= useState(true)
    const [state,setState] =useState({
      focusedLocation: {
        latitude: 24.774265,
        longitude: 46.738586,
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
      console.log(data);
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

//   udpateUserLocation=()=>{

//       navigator.geolocation.getCurrentPosition(
//     (position) => {
//       let point = {
//         lat: state.focusedLocation.latitude,
//         lng: state.focusedLocation.longitude
//       };

//       GeoFencing.containsLocation(point, south)
//         .then(() => console.log('point is within polygon'))
//         .catch(() => console.log('point is NOT within polygon'))
//     },
//     (error) => alert(error.message),
//     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//   );
// }

udpateUserLocation=()=>{
    const polygon = [
        { lat: 3.1336599385978805, lng: 101.31866455078125 },
        { lat: 3.3091633559540123, lng: 101.66198730468757 },
        { lat: 3.091150714460597, lng: 101.92977905273438 },
        { lat: 3.1336599385978805, lng: 101.31866455078125 }
        ];
        
        let point = {
        lat: 3.3091633559540123,
        lng: 101.66198730468757
        };
  GeoFencing.containsLocation(point, polygon)
    .then(() => console.log('point is within polygon'))
    .catch((error) => console.log(error))
  }


  const closeModal=()=>{
    props.closeLocatiomModal();
    setAlertVisible(false)
  }

  const south =[
    { latitude: 46.9133617, longitude: 24.6289015},
    { latitude: 46.6812946, longitude: 24.681821},
    { latitude: 46.7279674, longitude: 24.527119 },
    { latitude: 46.9010021, longitude: 24.575835},
    { latitude: 46.9133617, longitude: 24.6289015 }
  ];

  const east =[
    { latitude: 46.8882355, longitude: 24.8463879},
    { latitude: 46.6758014, longitude: 24.9286455},
    { latitude: 46.6812946, longitude: 24.681821 },
    { latitude: 46.9133617, longitude: 24.6289015},
    { latitude: 46.9596466, longitude: 24.644343 },
    { latitude: 46.8882355, longitude: 24.8463879 }
  ];
  const north =[
    { latitude: 46.6812946, longitude: 24.681821},
    { latitude: 46.6758014, longitude: 24.9286455},
    { latitude: 46.4780475, longitude: 24.9261548 },
    { latitude: 46.5027667, longitude: 24.6793253},
    { latitude: 46.6812946, longitude: 24.681821 }
  ];

  const west =[
    { latitude: 46.6812946, longitude: 24.681821},
    { latitude: 46.5027667, longitude: 24.6793253},
    { latitude: 46.5178729, longitude: 24.5444844 },
    { latitude: 46.7307331, longitude: 24.509502},
    { latitude: 46.6812946, longitude: 24.681821 }
  ];
    let marker = null;

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
                        <MaterialIcons name="clear" size={30} color="#212121" style={styles.icon}
                            onPress={closeModal}/>
                         <View>
                            <Text style={styles.headerText}>تحديد الموقع</Text>
                        </View>
                    </View>  

                    <MapView
                        initialRegion={state.focusedLocation}
                        region={!state.locationChosen ? state.focusedLocation : null}
                        style={styles.map}
                        onPress={pickLocationHandler}
                        ref={ref => map = ref}>
                        {marker}



<Polyline
coordinates={east}
strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
strokeColors={[
    '#7F0000',
    '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
    '#B24112',
    '#E5845C',
    '#238C23',
    '#7F0000'
]}
strokeWidth={6}
/>

<Polyline
coordinates={west}
strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
strokeColors={[
    '#7F0000',
    '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
    '#B24112',
    '#E5845C',
    '#238C23',
    '#7F0000'
]}
strokeWidth={6}
/>

<Polyline
coordinates={north}
strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
strokeColors={[
    '#7F0000',
    '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
    '#B24112',
    '#E5845C',
    '#238C23',
    '#7F0000'
]}
strokeWidth={6}
/>

<Polyline
coordinates={south}
strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
strokeColors={[
    '#7F0000',
    '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
    '#B24112',
    '#E5845C',
    '#238C23',
    '#7F0000'
]}
strokeWidth={6}
/>
                    </MapView>

                    <View style={styles.bottomView}>
                        <MaterialIcons name="my-location" size={30} color="#C0CA33" onPress={getLocationHandler}/>
                    </View>

                    {!state.isVisible? null:
                    
                      <View style={styles.button}>
                        <TouchableOpacity onPress={udpateUserLocation}  style={styles.Selecet}>
                              <Text style={[styles.textSelecet,{color:'#212121'}]}>اختـر</Text>
                        </TouchableOpacity>
                      </View>
                    
                    }
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "90%"
  },
  button: {
    margin: 15,
    backgroundColor:"#ffff",
    width: "50%",
    borderRadius:5,
    position:'absolute',
    bottom:0
  },
  headerText:{
    fontWeight:'bold',
    fontSize: 18,      
    letterSpacing: 1, 
    textAlign:'center',
    // color: '#fff'
    color: '#212121'
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
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row': 'row-reverse',
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
    height: 45,
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
