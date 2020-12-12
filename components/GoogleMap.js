import React, {useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
  TouchableOpacity
} from "react-native";
import MapView from "react-native-maps";
import { NativeModules } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

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

  const pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    map.animateToRegion({
      ...state.focusedLocation,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    const Key="AIzaSyCx56jtGjlHH9DEY04EpWCa_HmRJ4lzOuQ";
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

  udpateUserLocation=()=>{
    props.pickLocation(state.formatted_address,state.focusedLocation.latitude,state.focusedLocation.longitude);
    closeModal();
  }

  const closeModal=()=>{
    props.closeLocationModal();
    setAlertVisible(false)
  }

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