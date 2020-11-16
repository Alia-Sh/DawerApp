import React,{useState,useEffect}from 'react';
import { StyleSheet, Text, View,NativeModules } from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'; 
import { Tile } from 'react-native-elements';
import { Card, Title } from 'react-native-paper';
import firebase from '../Database/firebase';
const RequestDetails = ({navigation,route})=>{
    var  RequestId = route.params.ID;
    var DATE=route.params.DATE
    var STATUS=route.params.STATUS
    const[Materials,setMaterials]= useState([]);

    const fetchMaterials=(ID)=>{
      firebase.database().ref("Material/"+ID).on('value',snapshot=>{
          const Data = snapshot.val();
          if(Data){
            var li = []
            snapshot.forEach(function(snapshot){
            console.log(snapshot.key);
            console.log(snapshot.val().MaterialType);
            var temp={MaterialType:snapshot.val().MaterialType, Id:snapshot.key, Quantity:snapshot.val().Quantity}
            li.push(temp)
            })
            setMaterials(li)
            console.log(Materials);
            console.log(li) 
          }
        })
  }

  const rejectRequest=()=>{

  }

  useEffect(()=>{
    fetchMaterials(RequestId)
  },[])

    return (
        <View style={styles.container}>
          <View style={styles.fixedHeader}>
              <LinearGradient
                  colors={["#809d65","#9cac74"]}
                  style={{height:"100%" ,width:"100%"}}>
                <SafeAreaView style={{flexDirection:'row-reverse'}}>
                    <View style={[styles.header,styles.flexDirectionStyle]}>
                        <FontAwesome5 name="chevron-right" size={24} color="#ffff" style={styles.icon}
                            onPress={()=>navigation.goBack()}
                          />
                        <View>
                            <Text style={styles.headerText}> تفاصيل الطلب</Text>
                        </View>
                    </View>
                </SafeAreaView>
              </LinearGradient> 
          </View>

          <View style={{flex:8}}>
            <Card style={styles.item}>
              <Title style={styles.text}> :وقت وتاريخ الاستلام</Title>
              <Text style={{textAlign:"right",fontSize: 18,marginTop:5,marginRight:10}}>{DATE}</Text>
              <Title style={styles.text}> :المواد</Title>
              {
                Materials.map((item)=>
                <View>
                  <View style={{flexDirection:"row-reverse",marginRight:8}}>
                    <Text style={styles.textStyle}>نوع المادة:</Text>
                    <Text style={{textAlign:"right",fontSize: 18,marginRight:5}}>{item.MaterialType}</Text>
                  </View>

                  <View style={{flexDirection:"row-reverse",marginRight:8}}>
                    <Text style={styles.textStyle}>الكمية:</Text>
                    <Text style={{textAlign:"right",fontSize: 18,marginRight:5,marginTop:4}}>{item.Quantity}</Text>
                  </View>
              </View>
              )
              }
            </Card> 

            <View style={[styles.flexDirectionStyle,styles.button,{position:'absolute',bottom:10,left: 0, right: 0}]}>
              <TouchableOpacity style={[styles.button,]}>
                <LinearGradient
                    colors={["#809d65","#9cac74"]}
                    style={styles.signIn}>   
                  <Text style={[styles.textSign,{color:'#fff'}]}>قبول</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button]}>
                <LinearGradient
                  colors={["#B71C1C","#D32F2F"]}
                  style={styles.signIn}>   
                  <Text style={[styles.textSign,{color:'#fff'}]}>رفض</Text>
                </LinearGradient>  
                </TouchableOpacity> 
            </View> 
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
    },
    header:{
      width: '100%',
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:15
   },
    headerText:{
      fontWeight:'bold',
      fontSize: 20,      
      letterSpacing: 1, 
      textAlign:'center',
      color: '#ffff'
    },
    flexDirectionStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    },
    icon:{
      position: 'absolute',
      left: 16
    },
    text: {
      color: '#b2860e',
      fontSize: 18,
      textAlign: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
      marginRight:5,
      marginLeft:5,
    },
    textStyle:{
      color: '#9E9E9E',
      fontSize: 17,
      marginTop:3,
      marginRight:10
    },
    item: {
      flexDirection:"column",
      backgroundColor: '#F3F3F3',
      padding: 20,
      marginVertical: 20,
      marginHorizontal: 16,
      borderRadius :10,
      shadowColor :'#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 5,
      padding :15,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding:15,
    },
    signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginLeft:50,
      marginRight:50
    },
    textSign: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    fixedHeader :{
      flex:1,
      backgroundColor :'#9E9D24',
      overflow: 'hidden',
    }
  });
export default RequestDetails;