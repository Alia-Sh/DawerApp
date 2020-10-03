import React,{ useState ,useEffect }  from 'react';
import { StyleSheet,
   Text,
   View,
   Button,
   Dimensions,
   TouchableOpacity,
    Image,
     Alert,
     FlatList
} from 'react-native';
import firebase from '../Database/firebase';
import { LinearGradient } from 'expo-linear-gradient'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '../components/Loading';



const Item = ({ item, onPress, style }) => (
  
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View  style={{flexDirection :'row-reverse',height:45}}>
    <Image source={require('../assets/DriverProfile2.png')} 
     style={{height:60 ,width:60,marginRight:-8,marginTop:-8}}
    />
    <View >
    <Text style={styles.title}>{item.name}</Text>
    <Text style={styles.user}>@{item.username}</Text>
    </View>
    </View>
  </TouchableOpacity>
 
);

const HomeScreen = ({navigation})=>{
  
  

  const [DriverList,setDriverList] = useState([])
  const[loading,setLoading]=useState(true)
  
//backend
const back=()=>{
  
      navigation.navigate("AdminHomePage")
   
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
  const backgroundColor = item.key === selectedId ? "#EDEEEC" : "#FAFAF7";

  return (
    <Item
      item={item}
      onPress={() => setSelectedId(item.key)}
      style={{ backgroundColor }}
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
        style={{height:"100%" ,width:"100%", flexDirection: 'row',
        justifyContent:'space-between'}}> 
        
         <TouchableOpacity  onPress={()=> back()} >
         <Image
          source={require('../assets/AdminIcons/left-arrow.png')}
          style={styles.back}
          resizeMode="stretch"
          />
          </TouchableOpacity>
          <Text style={styles.text_header}>  سائقي التوصيل </Text>
         <Image
          source={require('../assets/AdminIcons/HomePageLogo.png')}
          style={styles.logo}
          resizeMode="stretch"
          />
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


        
    
                
        </View>
      );
}

// here styles
const {height} = Dimensions.get("screen");
const height_logo = height* 0.17;
const height_logout = height* 0.04;


const {width} = Dimensions.get("screen");
const width_logo = width* 0.22;
const width_logout = width* 0.055;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAF7',
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
    marginTop: 28 ,
    marginLeft: 8 ,
    alignItems:'baseline',
    shadowColor :'#F1F1EA',

},

    fixedHeader :{
      backgroundColor :'#9E9D24',
      flexDirection: 'row',
      justifyContent:'space-between',
      overflow: 'hidden',
      height:'10%'
    
    },

    text_header: {
      color: '#ffff',
      fontWeight: 'bold',
      fontSize: 22,
      textAlign: 'center',
      marginTop:30,
      marginRight:-70,
      
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

  //end flat list
  });
export default HomeScreen;
