import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View, Image,
  Dimensions,
  NativeModules,
  FlatList } from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesome5} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {Card,Title,FAB} from 'react-native-paper';
import firebase from '../Database/firebase';
import SearchBar from '../components/SearchBar';

const HomeScreen = ({navigation})=>{
  

  //const [modalVisible,setModalVisible]=useState(false);
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

  // fetch all facilities Names
  const fetchData=()=>{
    // firebase.database().ref('RecyclingFacility').orderByChild("Name").on('value',snapshot=>{
      firebase.database().ref('RecyclingFacility').orderByChild("Name").on('value',snapshot=>{
      const Data = snapshot.val();
      if(Data){
        var li = []
        snapshot.forEach(function(snapshot){
          console.log(snapshot.key);
          console.log(snapshot.val().Name);
          // fetch the logo here..
          retriveImage(snapshot.key);
          console.log(Picture);
          var temp = {Name:snapshot.val().Name, FacilityId:snapshot.key, Logo: Picture}
          li.push(temp)
          setLoading(false)
        })
        setFacList(li)
        console.log(li) 
      }else{
        setData({
          ...data,
          isEmptyList:true
        })
      }
    })
  }

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

  useEffect(()=>{
    fetchData()
},[])

const [selectedId, setSelectedId] = useState(null);

const renderList =  ({ item }) =>{
  console.log("in renderList");
  console.log(item);
  return(
    <TouchableOpacity
      key={item.key}
      onPress={() => setSelectedId(item.key)}
      style={styles.mycard}>
        <View style = {{flexDirection: 'column'}}>
            {Picture==""?
            <Image 
                style = {styles.profile_image}
                source = {require('../assets/AdminIcons/FacilityIcon.jpg')}/> 
            :
            <Image
                // retrieve the logo here
                style = {styles.profile_image}
                //source = {item.Logo}/>
                source = {{uri:Picture}}/>

            }
            <Text style={styles.title}>{item.Name}</Text>
        </View>
    </TouchableOpacity>
   
      /*<View style={styles.mycard}>
        <View style={styles.cardContent}>
            <View style={{flexDirection:Platform.OS === 'android' &&
                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                    NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                    'row':'row-reverse'}}>
          
          <View style = {{flexDirection: 'column'}}>
            {Picture==""?
            <Image 
            // retrieve the logo here
                style = {styles.profile_image}
                source = {require('../assets/AdminIcons/FacilityIcon.jpg')}/> 
            :
            <Image
                style = {styles.profile_image}
                //source = {{uri:Picture}}
                source = {item.Logo}/>
            }
            <Text style={styles.title}>{item.Name}</Text>
          </View>

            </View>
        </View>
      </View>*/
  )
};

SearchInList = (word) =>{
  setSearchList(FacList.filter(item => item.Name.toLowerCase().includes(word)))
  setSearchOccur(true)
}

    return (
        <View style={styles.container}>
           <View style={styles.fixedHeader}>
              <LinearGradient
                colors={["#809d65","#9cac74"]}
                style={{height:"100%" ,width:"100%"}}> 

                <SafeAreaView>

                  <View style={styles.header}>

                    <Text style={styles.text_header}>المنشــآت</Text>
                    
                    <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} 
                                  onPress={()=>navigation.goBack()}/>


                  </View>

                </SafeAreaView>

              </LinearGradient>

          </View>

          <SearchBar
            term = {term}
            OnTermChange = {newTerm => setTerm(newTerm)}
            OnTermSubmit = {()=> SearchInList(term)}
            />

          <View style={{flex:8}}>
           {/* {data.isEmptyList? <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575'}}>لا توجد منشـآت مدخلة حتى الآن</Title>:
            */}

          {SearchOccur ? 
           
           <FlatList
            contentContainerStyle = {styles.grid}
            numColumns = {2}
            data = {SearchList}
            keyExtractor = {(item)=>item.key}
            onRefresh = {()=>fetchData()}
            refreshing = {loading}
            renderItem={renderList}
            />
            :
            <FlatList
            contentContainerStyle = {styles.grid}
            numColumns = {2}
            data = {FacList}
            keyExtractor = {(item)=>item.key}
            onRefresh = {()=>fetchData()}
            refreshing = {loading}
            renderItem={renderList}
            />
            }
            <FAB  
              onPress={()=>{
                navigation.navigate("AddFacility") }}
                style={Platform.OS === 'android' &&
                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                styles.fabAndroid:styles.fabIOS}
              small={false}
              icon="plus"
              theme={{colors:{accent:"#9cac74"}}} 
            />
                {// <Text style={styles.textInput}>
               //هنا عن المنشآت</Text>
                }
          </View>   

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
    },  
    textInput: {
        textAlign: 'center', 
        marginTop: 20,  
    },
    back: {
      width: width_logout ,
      height: height_logout,
      // marginLeft: 8 ,
      // marginRight:8,
      alignItems:'baseline',
      shadowColor :'#F1F1EA',  
    },
    fixedHeader :{
      flex:1,
      backgroundColor :'#9E9D24',
      overflow: 'hidden',
    },
    header:{
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
      textAlign: 'center',
      // marginLeft:165,
    },
    cardContent:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
      justifyContent:'space-between'
    },
    mycard:{
        backgroundColor: '#F3F3F3',
        marginVertical: 8,
        marginHorizontal: 15,
        borderRadius :0,
        elevation:1, // borderless!
        padding :12
    },
    grid: {
      marginBottom: 32,
      marginVertical: 8,
      alignItems: 'center',
    },
    profile_image:{
      width:120,
      height:120,
      //borderRadius:150/2,
      //marginTop:-75 
    },
    fabIOS: {
      position: 'absolute',
      margin: 16,
      left: 0,
      bottom: 0,
    },
    fabAndroid: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold' ,
      textAlign :'center',
      color: '#9E9D24',
      marginTop: 8,
    },
    icon:{
      position: 'absolute',
      marginTop:20,
      left: 16
    },
  
});
export default HomeScreen;
