import React,{ useState ,useEffect }  from 'react';
import { StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    FlatList,
    NativeModules,
    Platform, 
} from 'react-native';
import firebase from '../Database/firebase';
import { LinearGradient } from 'expo-linear-gradient'; 
import {FAB} from 'react-native-paper';
import AddDriver from './AddDriver'


const Item = ({ item, onPress, style }) => (
  
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View  style={{flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row': 'row-reverse',height:45}}>
    <Image source={require('../assets/DriverProfile2.png')} 
     style={{height:60 ,width:60,marginRight:-8,marginTop:-8}}
    />
    <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:10}} >
    <Text style={[styles.title,{textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>{item.name}</Text>
    <Text style={styles.user}>@{item.username}</Text>
    </View>
    </View>
  </TouchableOpacity>
 
);

const HomeScreen = ({navigation})=>{
  
    const [modalVisible,setModalVisible]=useState(false);
    const [DriverList,setDriverList] = useState([])
    const[loading,setLoading]=useState(true)
  
//backend
    const back=()=>{
    
        // navigation.navigate("AdminHomePage")
        navigation.goBack()
    
    }
    const ViewDriver=()=>{
    
      navigation.navigate("AdminViewDriver")
  
  
  }

const fetchData=()=>{
  console.log('inside fe');
  firebase.database().ref("DeliveryDriver").orderByChild("UserName").on('value', (snapshot) =>{

    var li = []
    snapshot.forEach((child)=>{
var temp={
  key: child.key,
  username:child.val().UserName,
  name : child.val().Name
  
}
     li.push(temp)
     setLoading(false)
    console.log(child.key);
    console.log(child.val().UserName);
    //setDriverList(temp)
    setLoading(false) 
  })
 //this.setState({list:li})
 
setDriverList(li)
 
})

}

useEffect(()=>{
  fetchData()
},[])

const [selectedId, setSelectedId] = useState(null);

const renderItem = ({ item }) => {
  //const backgroundColor = item.key === selectedId ? "#EDEEEC" : "#F3F3F3";

  return (
    <Item
      item={item}
     // onPress={() => setSelectedId(item.key)}
     onPress={() => ViewDriver()}
      style={{ backgroundColor :item.key === selectedId ? "#EDEEEC" : "#F3F3F3"}}
    />
  );
};



   //front-end
    return (
        <View style={styles.container}>
          {//Header 
          } 
     
         <View style={styles.fixedHeader} >
         <LinearGradient
        colors={["#809d65","#9cac74"]}
        style={{height:"100%" ,width:"100%", 
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row': 'row-reverse',
        justifyContent:'center'}}> 
        
         <TouchableOpacity  onPress={()=> back()} style={{position:'absolute',left:10}}>
         <Image
          source={require('../assets/AdminIcons/left-arrow.png')}
          style={styles.back}
          resizeMode="stretch"
          />
          </TouchableOpacity>
          <Text style={styles.text_header}>  سائقي التوصيل </Text>
          </LinearGradient>
         </View>
        {//End Header 
          } 
       {/* drivers list */}
     

       <FlatList
        data={DriverList}
        renderItem={renderItem}
        keyExtractor={(item)=>item.key}
        extraData={selectedId}
        onRefresh={()=>fetchData()}
        refreshing={loading}
      />
            {/* end drivers list */}
        <FAB  
        onPress={() => setModalVisible(true)}
          style={Platform.OS === 'android' &&
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
          styles.fabAndroid:styles.fabIOS}
        small={false}
        icon="plus"
        theme={{colors:{accent:"#9cac74"}}} 
      />
      {modalVisible?<AddDriver setModalVisible={setModalVisible}></AddDriver>:null}
                
        </View>
      );
}

// here styles
const {height} = Dimensions.get("screen");
const height_logo = height* 0.17;
const height_logout = height* 0.03;



const {width} = Dimensions.get("screen");
const width_logo = width* 0.22;
const width_logout = width* 0.045;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F3F3',
     // width: width, 
    }, 
   
  //header  
    logo: {
      width: width_logo ,
      height: height_logo,
      marginTop :-15,
 
  },

  back: {
    width: width_logout ,
    height: height_logout,
    marginTop: 35 ,
    shadowColor :'#F1F1EA',

},

    fixedHeader :{
      backgroundColor :'#9E9D24',
      overflow: 'hidden',
      height:'10%'
    
    },

    text_header: {
      color: '#ffff',
      fontWeight: 'bold',
      fontSize: 22,
      textAlign: 'center',
      marginTop:30,   
  },
  
  //end header
//flatlist
  item: {
    backgroundColor: '#F3F3F3',
    padding: 20,
    marginVertical: 8,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold' ,
    textAlign :'right',
    marginRight:30,
    marginTop:10,
    
    
   
  },
  user: {
    fontSize: 12,
    //fontWeight: 'bold' ,
    textAlign :'right',
    marginRight:30,
    marginTop:5,
    color :'#ADADAD',
    
   
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



  //end flat list
  });
export default HomeScreen;
