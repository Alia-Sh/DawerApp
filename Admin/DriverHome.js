import React,{ useState }  from 'react';
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

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: '1',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: ' 2 ',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '3',
  },
  {
    id: '5861234f-3da1-471f-bd96-145571e29d72',
    title: '4',
  },
  {
    id: '12694a0f-3da1-471f-bd96-145571e29d72',
    title: ' 4 التسع',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d43',
    title: '   التسع',
  },
  {
    id: '58694f0f-3da1-471f-bd96-145571e29d72',
    title: 'اchdsjf',
  },

  {
    id: '58694a0f-3da1-471f-1236-145571e29d43',
    title: ' ح',
  },
  {
    id: '58694f0f-3da1-471f-bd96-148871e29d72',
    title: 'اchdsjf',
  },
];

const Item = ({ item, onPress, style }) => (
  
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View  style={{flexDirection :'row-reverse'}}>
    <Image source={require('../assets/DriverProfile2.png')} 
     style={{height:40 ,width:40,marginRight:-8}}
    />
    <Text style={styles.title}>{item.title}</Text>
    </View>
  </TouchableOpacity>
 
);

const HomeScreen = ({navigation})=>{
//backend
const back=()=>{
  
      navigation.navigate("AdminHomePage")
   
}

const [selectedId, setSelectedId] = useState(null);

const renderItem = ({ item }) => {
  const backgroundColor = item.id === selectedId ? "#EDEEEC" : "#FAFAF7";

  return (
    <Item
      item={item}
      onPress={() => setSelectedId(item.id)}
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
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
       



        
    
                
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
    //fontWeight: 'bold' ,
    textAlign :'right',
    marginRight:10,
    marginTop:10,
    
   
  },

  //end flat list
  });
export default HomeScreen;
