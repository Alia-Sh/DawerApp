import React , { useState ,useEffect } from 'react';
import { StyleSheet, Text, View, NativeModules,FlatList} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons';
import firebase from '../Database/firebase';
import SearchBar from '../components/SearchBar';

const DriverFacilities = ({navigation})=>{

  
  const [FacList,setFacList] = useState([])
  const [loading,setLoading] = useState(true)
  const [Picture,setPicture] = useState("")
  const [term, setTerm] = useState('')
  const [SearchList, setSearchList] = useState([])
  const [SearchOccur, setSearchOccur] = useState(false)  

  const [data,setData]=React.useState({
    isLoading:false,
    isEmptyList:false         
  })

    const fetchData=()=>{
        console.log('inside fetch categories');
        firebase.database().ref("Category").orderByChild("Name").on('value', (snapshot) =>{
      
          var li = []
          snapshot.forEach((child)=>{
            var temp={
              key: child.key,
              name : child.val().Name
            }
            fetchSubs(child.key)
            
            li.push(temp)
            setLoading(false)
            console.log(child.key);
            console.log(child.val().Name);
            setLoading(false) 
          })
       
          setCategoriesList(li)
       
        })
      
      }


    useEffect(()=>{
    fetchData()
    },[])

    const fetchSubs=(id)=>{
        firebase.database().ref("/Category/"+id+"/RecyclingFacility/").orderByChild("Name").on('value',snapshot=>{
        const Data = snapshot.val();
        if(Data){
          var li = []
          snapshot.forEach(function(snapshot){
            console.log(snapshot.key);
            console.log(snapshot.val().Name);
            // fetch the logo here..
            //retriveImage(snapshot.key);
            console.log(Picture);
            var temp = {Name:snapshot.val().Name, FacilityId:snapshot.key, Logo: Picture}
            li.push(temp)
            setLoading(false)
          })
          setFacList(li)
          console.log(li) 
        }else{
          setData({
            isLoading:true,
            isEmptyList:true
          })
        }
      })
    }




}

const styles = StyleSheet.create({
    container: {
      marginTop: 35, //20 -- 55
    },  
    textInput: {
      textAlign: 'center',
      fontSize: 20, //15
      fontWeight: 'bold',
      color:'gray',  
    },
    item: {
      width: 130,
      height: 130,
      paddingTop: 50,
      marginVertical: 8, //25 -- مربع 3
      marginHorizontal: 8, //16 -- 3 مربع
      borderRadius: 30, //100 - 50 -30 -- 0 مربع 
      shadowColor: '#9E9D24',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.90, //0.50 - 0.80
      shadowRadius: 5.65, // 4.65
    },
    grid: {
      marginBottom: 32,
      marginVertical: 8,
      alignItems: 'center',
    },
    icon: {
      left: 12,
      marginTop: 10,
      marginEnd: 35
    }
  });
export default DriverFacilities;