import React , { useState ,useEffect } from 'react';
import { StyleSheet, Text, View,Image, NativeModules,FlatList, Dimensions,Platform,TouchableOpacity,Animated,LayoutAnimation, UIManager} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons';
import {Title} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient'; 
import firebase from '../Database/firebase';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import { useIsFocused } from "@react-navigation/native";
import * as geolib from 'geolib';
import FilterModal from './FilterModal';

const FacilitiesInCategory = ({navigation, route,props}) => {
  const isFocused = useIsFocused();
  const CategoryID = route.params.ID;
  const CategoryName = route.params.Name;

    const [FacList,setFacList] = useState([])
    const [FacDistance,setFacDistance] = useState([])
    const [loading,setLoading] = useState(true)
    const [Picture,setPicture] = useState("")
    const [term, setTerm] = useState('')
    const [SearchList, setSearchList] = useState([])
    const [SearchOccur, setSearchOccur] = useState(false)        
  
    const [data,setData]=React.useState({
        isLoading:false,
        isEmptyList:false         
    })
    const [Location,setLocation] = useState({
      address:"",
      latitude:0,
      longitude:0
  })
    const [FilterModalVisible,setFilterModalVisible]= useState(false)
    const [expanded,setExpanded]=useState(false)
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    const changeLayout = () => {
      if(FacList.length>0){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFilterModalVisible(!FilterModalVisible)
        setExpanded(!expanded);
      }
    }


    const fetchUserLocation=()=>{
        var userId = firebase.auth().currentUser.uid;
        var query = firebase.database().ref('User/' + userId);
        query.on("value",function(result) {
          const userData = result.val();
          setLocation({
            ...Location,
            address:userData.Location.address,
            latitude:userData.Location.latitude,
            longitude:userData.Location.longitude           
          })
        });        
    } 



    const filterFacilities=(type)=>{
      var Filter=geolib.orderByDistance({ latitude: Location.latitude, longitude: Location.longitude},FacList)
        if(type=="من الأقرب إلى الأبعد"){
          setFacList(Filter)
        }
        if(type=="من الأبعد إلى الأقرب"){
          setFacList(Filter.reverse())
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFilterModalVisible(!FilterModalVisible)
        setExpanded(!expanded);
    }

    // fetch all facilities Names
  const fetchData=()=>{
      firebase.database().ref("/Category/"+CategoryID+"/RecyclingFacility/").orderByChild("Name").on('value',snapshot=>{
      const Data = snapshot.val();
      if(Data){
        var li = []
        var Distance=[]
        snapshot.forEach(function(snapshot){
          console.log(snapshot.key);
          console.log(snapshot.val().Name);
          // fetch the logo here..
          //retriveImage(snapshot.key);
          console.log(Picture);
          var temp = {Name:snapshot.val().Name, FacilityId:snapshot.key, Logo: snapshot.val().Logo,latitude:snapshot.val().Location.latitude,longitude:snapshot.val().Location.longitude, Materials:snapshot.val().AcceptedMaterials}
          var Dis={latitude:snapshot.val().Location.latitude,longitude:snapshot.val().Location.longitude}
          li.push(temp)
          Distance.push(Dis)
          setLoading(false)
        })
        setFacList(li)
        setFacDistance(Distance)
        console.log(li) 
        console.log(Distance);
      }else{
        setData({
          isLoading:true,
          isEmptyList:true
        })
      }
    })
  }

  useEffect(()=>{
    fetchData()
    fetchUserLocation()
},[props, isFocused])

  //retrive facility logo
  const retriveImage = (id) =>{
    var imageRef = firebase.storage().ref('Facilities/'+id); //facilities path 
    imageRef
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        setPicture(url);
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
  }


const [selectedId, setSelectedId] = useState(null);

const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.theItem, style]}>
    <View  style={[styles.flexDirectionStyle,{height:45}]}>
    {item.Logo==""?
      <Image source={require('../assets/AdminIcons/FacilityIcon.jpg')} 
        style={{height:50 ,width:50,marginRight:-8,marginTop:0,marginLeft:8,borderRadius:5}}
      />
    :
    <Image
        style={{height:50 ,width:50,marginRight:-8,marginTop:0,marginLeft:8,borderRadius:5}}
        source={{uri:item.Logo}}
        />
    }

      <View style={{marginTop:Platform.OS === 'android'? -8:3,paddingLeft:10}}>
      <Text style={[styles.title,{textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>{item.Name}</Text>
      
      <View style = {styles.flexDirectionStyle}>
      {item.Materials.map((item2,index) => 
                          <View style = {styles.flexDirectionStyle}>
                            <Text style={styles.mytext}>{item2.Name}</Text> 
                            {(item.Materials).length-1!=index?<Text style={styles.mytext}>،</Text>:null}
                          </View>                          
                          )}    
              </View>

      </View>
    </View>

  </TouchableOpacity>
 
);
const renderList =  ({ item }) =>{
  console.log("in renderList");
  console.log(item);
  return(
    <Item
      item={item}
      // onPress={() => setSelectedId(item.key)}
      onPress={() => navigation.navigate("ViewFacilityInfo",{item})}
      style={{ backgroundColor :item.key === selectedId ? "#EDEEEC" : "#F3F3F3"}}
    />
  )
};

const SearchInList = (word) =>{
  setSearchList(FacList.filter(item => item.Name.toLowerCase().includes(word)))
  setSearchOccur(true)
}

const resetData=()=>{
  setFacList([])
  setLoading(true)
  setPicture("")
  setTerm('')
  setSearchList([])
  setSearchOccur(false)        

  setData({
    ...data,
      isLoading:false,
      isEmptyList:false         
    })

    setFilterModalVisible(false)
    setExpanded(false);

    navigation.navigate("HomeScreen")
}

    return (
        <View style={styles.container}>
        <View style={styles.fixedHeader}>
          <View style ={{zIndex:1,alignItems:'center'}}>
          <Image 
              source={require('../assets/InfoFormBackground.png')}
              style={styles.imageTop}
              resizeMode='stretch'
              />
    
          <SafeAreaView style={{flexDirection: Platform.OS === 'android' && 
            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',marginTop:10}}>
                 <LinearGradient
                    colors={["transparent","#transparent"]}
                    style={{ height: '100%', width: '100%', flexDirection:'row', justifyContent: 'space-between',marginTop:40}}>

                      <FontAwesome5 name="filter" size={24} color="gray" style={{marginLeft:15}}
                      onPress={()=> changeLayout()}/>
                      {/* style={{marginTop: 25,marginLeft:15}} */}
                      <Text style={styles.text_header}>{CategoryName}</Text>

                      <FontAwesome5 name="chevron-right" size={24} color="#212121" style={styles.icon} 
                                onPress={()=>{resetData()}}/>

                </LinearGradient>             

            </SafeAreaView>
            {/*<LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"100%" ,width:"100%"}}> 

                <SafeAreaView>

                <View style={styles.header}>
                <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} 
                                onPress={()=>{navigation.navigate("HomeScreen")}}/>

                    <Text style={styles.text_header}>{CategoryName}</Text>
                  
                </View>

                </SafeAreaView>
            </LinearGradient> */}
            </View>
            <Image 
              source={require('../assets/line.png')}
              style={{width:'100%',position: 'relative'}}
              resizeMode='stretch'
              />
        </View>
              
        <View style={{flex:8, marginTop:10, margin :15}}>
            <SearchBar
                  term = {term}
                  OnTermChange = {newTerm => setTerm(newTerm)}
                  OnTermSubmit = {()=> SearchInList(term)}
                  BarWidth = {'100%'}
                  BarMargin = {'40'}

            />
            {/*{data.isEmptyList? <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575'}}>لا توجد منشـآت مدخلة حتى الآن</Title>:
            */}
            {FacList.length==0?
                                <Text  style={{textAlign:'center',fontSize: 15,
                                marginTop:5,
                                color :'#7B7B7B',
                        }}>
                                    لا يوجد منشآت لهذه الفئة
                                </Text>
            :
            <View>
            {SearchOccur ? 
            
            <FlatList
            // contentContainerStyle = {styles.grid}
            // numColumns = {2}
            data = {SearchList}
            keyExtractor = {(item)=>item.key}
            onRefresh = {()=>fetchData()}
            refreshing = {loading}
            renderItem={renderList}
            />
            :
            <FlatList
            // contentContainerStyle = {styles.grid}
            // numColumns = {2}
            data = {FacList}
            keyExtractor = {(item)=>item.key}
            onRefresh = {()=>fetchData()}
            refreshing = {loading}
            renderItem={renderList}
            />
            
            }
            </View> 
          }
        </View> 

          { FilterModalVisible?
                 <FilterModal changeLayout={changeLayout} filterFacilities={filterFacilities}></FilterModal>
                            :
                                null
          }
                       
        </View>
    );

}

const {width} = Dimensions.get("screen");
const {height} = Dimensions.get("screen");
const height_logout = height* 0.03;
const width_logout = width* 0.045;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor:'#000'
    },  
    textInput: {
      textAlign: 'center',
      fontSize: 20, //15
      fontWeight: 'bold',
      color:'gray',  
    },
    imageTop: {
      width: 160 ,
      height:140 ,
      position: 'absolute',
      marginTop: 10
    },
    profile_image: {
        width:110,
        height:110,
        borderRadius:5,
        borderColor:'#f2f2f2',
        borderWidth:1
        //borderRadius:150/2,
        //marginTop:-75 
    },
    back: {
        width: width_logout ,
        height: height_logout,
        // marginLeft: 8 ,
        // marginRight:8,
        alignItems:'baseline',
        shadowColor :'#F1F1EA',  
    },
    fixedHeader: {
        flex:2,
        alignItems:'center',
    },
    header: {
        width: '100%',
        height: 80,
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' :'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:Platform.OS === 'android'? 0 : -10
    },
    text_header: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 22,
        // textAlign: 'center',
        // marginTop: 40,
        // marginHorizontal: 75,
        // marginRight: 150
    },
    mycard: {
        backgroundColor: '#F3F3F3',
        marginVertical: 12,
        marginHorizontal: 15,
        borderRadius :0,
        elevation:1, // borderless!
        padding :12
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
    title: {
        fontSize: 20,
        fontWeight: 'bold' ,
        textAlign :'center',
        color: '#9E9D24',
        marginTop: 8,
    },
    icon: {
      marginRight: 15
    },
    theItem:{
      backgroundColor: '#F3F3F3',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius :8,
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
    flexDirectionStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold' ,
      textAlign :'center',
      color: '#9E9D24',
      marginTop: 5,
    },
    mytext:{
      fontSize:12,
      //marginTop:13,
      marginRight:2,
      color:'#808080'
    },
  });
export default FacilitiesInCategory;