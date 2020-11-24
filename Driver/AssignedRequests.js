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
import {Title} from 'react-native-paper';
import {FontAwesome5, MaterialIcons} from '@expo/vector-icons'
import SearchBar from '../components/SearchBar';
//import { TabView, SceneMap } from 'react-native-tab-view';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated from 'react-native-reanimated';
import { ArabicNumbers } from 'react-native-arabic-numbers';


const Tab = createMaterialTopTabNavigator();

const Item = ({ item, onPress, style }) => (
  
    <TouchableOpacity onPress={onPress} style={[styles.item, style,{flex:1}]}>
      <View  style={[styles.flexDirectionStyle,{height:45,flex:1}]}>
        
      <Image
            source={require('../assets/AdminIcons/requestIcon.jpg')}
            style={{width:40,height:40,marginRight:-5,borderRadius:12}}
            resizeMode="stretch"
            />
       
        <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:10}} >
          <Text style={[styles.Status,{textAlign: Platform.OS === 'android' && 
            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>{item.UserName}</Text>
          <Text style={styles.date}>وقت الإستلام : {item.Date}</Text>      
        </View>
        <View style={{flex:1}}>
  
          <View style={{marginRight:'15%',marginLeft:'5%',marginTop:5,alignItems:'flex-start'}}>
              <MaterialIcons 
                  name="error" 
                  size={30} 
                  color="#7B7B7B"
              />
          </View>
        </View>
      
       
      </View>
    </TouchableOpacity>
   
  );
  


//backend
const AssignedRequests = ({ navigation })=> {

  return (
    <View style={styles.container}>
          {//Header 
          } 
          <View style={styles.fixedHeader} >
            <LinearGradient
                colors={["#809d65","#9cac74"]}
                style={[styles.flexDirectionStyle,{height:"100%" ,width:"100%",justifyContent:'center'}]}> 
        
              <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} onPress={()=>navigation.goBack()}/>

              <Text style={styles.text_header}>  الـطـلـبـات </Text>

            </LinearGradient>
         </View>
    
      <Tab.Navigator style ={ {backgroundColor:'#F3F3F3'} }
      		screenOptions={({ route }) => ({
            tabBarLabel: ({ tintColor, focused, item }) => {
              return focused
                ? (<Text style={{ fontWeight: 'bold',}} >{route.name}</Text>)
                : (<Text style={{ fontWeight: 'normal', fontSize: 15 }} >{route.name}</Text>)
            },
            
          })}
        initialRouteName=" الطلبات"
        tabBarOptions={{
            labelStyle: { fontSize: 14},
            activeTintColor :'red',
            indicatorStyle :  {backgroundColor:"#809d65" },
            style : {backgroundColor:'#F3F3F3'} 
          }}>
        <Tab.Screen name="تم التوصيل " component={DliveredRequests} />
        <Tab.Screen name="قيد الاستلام " component={OntheWay} />
        <Tab.Screen name=" الطلبات" component={Requests} />
       
        
      </Tab.Navigator>
    </View>

  );
}

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={{ flexDirection: 'row', paddingTop: 20 }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        // modify inputRange for custom behavior
        const inputRange = state.routes.map((_, i) => i);
        const opacity = Animated.interpolate(position, {
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Animated.Text style={{ opacity }}>{label}</Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function OntheWay  ({ navigation }){
  
    const [RequestList,setRequestList] = useState([])
    const[loading,setLoading]=useState(true)
    const [term, setTerm] = useState('')
    const [SearchList, setSearchList] = useState([])
    const [SearchOccur, setSearchOccur] = useState(false) 
    
  
//backend
    var currentUser = firebase.auth().currentUser.uid;  

    const fetchData=()=>{
      firebase.database().ref('/PickupRequest/').on('value',snapshot=>{
        const Data = snapshot.val();
        if(Data){
          var li = []
          snapshot.forEach(function(snapshot){
            var UserId=snapshot.key
            firebase.database().ref('/PickupRequest/'+UserId).on('value',snapshot=>{
              snapshot.forEach(function(snapshot){
                if(snapshot.val().DeliveryDriverId == currentUser && snapshot.val().Status =='OutForPickup' ){
                  var temp={Date:snapshot.val().DateAndTime,
                    key:snapshot.key,
                    Status:snapshot.val().Status,
                    UserId:UserId,
                    UserName:snapshot.val().UserName
                  }
                  li.push(temp)
                  setLoading(false)
                }
              })
            })
          })
          if(li){
            li.sort(function(a, b){
              return new Date(a.Date) - new Date(b.Date);
            });
          }
          setRequestList(li)
        }
      })
    }

    useEffect(()=>{
      fetchData()
    },[])

    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
      return (
        <Item
          item={item}
          onPress={() => 
            {var ID =item.key;
            var DATE=item.Date;
            var STATUS = item.Status;
            var UserId=item.UserId;
            console.log(ID+'      >>>>>here in gome');
            navigation.navigate("DriverRequestDetails",{ID,DATE,STATUS,UserId})}}
            style={{ backgroundColor :item.key === selectedId ? "#EDEEEC" : "#F3F3F3"}}
        />
      );
    };

      //front-end
    return (
        <View style={styles.container}>
          
          <Title style={[styles.text,{marginTop:10,marginBottom:3}]}> عدد الطلبات  : {ArabicNumbers(RequestList.length)}</Title>

          <View style={{alignItems:"center"}}>
            <Image
                style={{width:'70%',marginBottom:3,height:3,alignItems:'center'}}
                source={require('../assets/line.png')}/>
          </View>

          <FlatList
            data={RequestList}
            renderItem={renderItem}
            keyExtractor={(item)=>item.key}
            extraData={selectedId}
            onRefresh={()=>fetchData()}
            refreshing={loading}
          />
          
            {/* end request list*/ }          
        </View>
    );
}

////////// to dispaly accepted req
function Requests  ({ navigation }) {
  
    const [RequestList,setRequestList] = useState([])
    const[loading,setLoading]=useState(true)
    const [term, setTerm] = useState('')
    const [SearchList, setSearchList] = useState([])
    const [SearchOccur, setSearchOccur] = useState(false) 
    
  
//backend

    var currentUser = firebase.auth().currentUser.uid;  

    const fetchData=async()=>{
      firebase.database().ref('/PickupRequest/').on('value',snapshot=>{
        const Data = snapshot.val();
        if(Data){
          var li = []
            snapshot.forEach(function(snapshot){
            var UserId=snapshot.key
            firebase.database().ref('/PickupRequest/'+UserId).on('value',snapshot=>{
              snapshot.forEach(function(snapshot){
                if(snapshot.val().DeliveryDriverId == currentUser && snapshot.val().Status =='Accepted' ){
                  var temp={Date:snapshot.val().DateAndTime,
                    key:snapshot.key,
                    Status:snapshot.val().Status,
                    UserId:UserId,
                    UserName:snapshot.val().UserName
                  }
                  li.push(temp)
                  setLoading(false)
                } 
              })
            })
          })
          if(li){
            li.sort(function(a, b){
              return new Date(a.Date) - new Date(b.Date);
            });
          }
          setRequestList(li)
        }
      })
    }

    useEffect(()=>{
      fetchData()
    },[])

    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
      return (
        <Item
          item={item}
          onPress={() => 
          { var ID =item.key;
            var DATE=item.Date;
            var STATUS = item.Status;
            var UserId=item.UserId;
            console.log(ID+'      >>>>>here in gome');
            navigation.navigate("DriverRequestDetails",{ID,DATE,STATUS,UserId})}}
          style={{ backgroundColor :item.key === selectedId ? "#EDEEEC" : "#F3F3F3"}}
        />
      );
    };

      //front-end
    return (
        <View style={styles.container}>
          
          <Title style={[styles.text,{marginTop:10,marginBottom:3}]}> عدد الطلبات  : {ArabicNumbers(RequestList.length)}</Title>
            <View style={{alignItems:"center"}}>
                <Image
                  style={{width:'70%',marginBottom:3,height:3,alignItems:'center'}}
                  source={require('../assets/line.png')}/>
            </View>

            <FlatList
              data={RequestList}
              renderItem={renderItem}
              keyExtractor={(item)=>item.key}
              extraData={selectedId}
              onRefresh={()=>fetchData()}
              refreshing={loading}
            />
        </View>
      );

}
//end of all req

//Tab 3

function DliveredRequests  ({ navigation }) {
   
    const [RequestList,setRequestList] = useState([])
    const[loading,setLoading]=useState(true)
    const [term, setTerm] = useState('')
    const [SearchList, setSearchList] = useState([])
    const [SearchOccur, setSearchOccur] = useState(false) 
    
  
//backend
    
    var currentUser = firebase.auth().currentUser.uid;  

    const fetchData=()=>{
      firebase.database().ref('/PickupRequest/').on('value',snapshot=>{
        const Data = snapshot.val();
        if(Data){
          var li = []
          snapshot.forEach(function(snapshot){
            var UserId=snapshot.key
            firebase.database().ref('/PickupRequest/'+UserId).on('value',snapshot=>{
              snapshot.forEach(function(snapshot){
                if(snapshot.val().DeliveryDriverId == currentUser && snapshot.val().Status =='Delivered' ){
                  var temp={Date:snapshot.val().DateAndTime,
                    key:snapshot.key,
                    Status:snapshot.val().Status,
                    UserId:UserId,
                    UserName:snapshot.val().UserName
                  }
                  li.push(temp)
                  setLoading(false)
                } 
              })
            })
          })
          if(li){
            li.sort(function(a, b){
              return new Date(a.Date) - new Date(b.Date);
            });
          }
          setRequestList(li)
        }
      })
    }

    useEffect(()=>{
      fetchData()
    },[])

  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
      return (
        <Item
          item={item}
          onPress={() => 
          {var ID =item.key;
          var DATE=item.Date;
          var STATUS = item.Status;
          var UserId=item.UserId;
          console.log(ID+'      >>>>>here in gome');
          navigation.navigate("DriverRequestDetails",{ID,DATE,STATUS,UserId})}}
          style={{ backgroundColor :item.key === selectedId ? "#EDEEEC" : "#F3F3F3"}}
        />
      );
  };

      //front-end
    return (
        <View style={styles.container}>
          
          <Title style={[styles.text,{marginTop:10,marginBottom:3}]}> عدد الطلبات  : {ArabicNumbers(RequestList.length)}</Title>

          <View style={{alignItems:"center"}}>
            <Image
                style={{width:'70%',marginBottom:3,height:3,alignItems:'center'}}
                source={require('../assets/line.png')}/>
          </View>

          <FlatList
            data={RequestList}
            renderItem={renderItem}
            keyExtractor={(item)=>item.key}
            extraData={selectedId}
            onRefresh={()=>fetchData()}
            refreshing={loading}
          />
            {/* end request list*/ }
                
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
    },   
  //header  
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
    Status: {
      fontSize: 18,
      fontWeight: 'bold' ,
      textAlign :'right',
      marginRight:30,
      marginTop:5, 
    },
    date: {
      fontSize: 14,
      textAlign :'right',
      marginRight:30,
      marginTop:5,
      color :'#7B7B7B',
    },
    icon:{
      position: 'absolute',
      marginTop:30,
      left: 16
    },
    flexDirectionStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    } ,
  //end flat list
  text: {
    // color: '#809d65',
     fontSize: 18,
     textAlign: 'center',
     marginRight:9,
     marginLeft:9,
 },
  });
export default AssignedRequests;

/* 
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
import {Title} from 'react-native-paper';
import {FontAwesome5} from '@expo/vector-icons'
import {MaterialIcons} from '@expo/vector-icons';
import { ArabicNumbers } from 'react-native-arabic-numbers';


const Item = ({ item, onPress, style }) => (
  
  <TouchableOpacity onPress={onPress} style={[styles.item, style,{flex:1}]}>
    <View  style={[styles.flexDirectionStyle,{height:45,flex:1}]}>
      
    <Image
          source={require('../assets/AdminIcons/requestIcon.jpg')}
          style={{width:40,height:40,marginRight:-5,borderRadius:12}}
          resizeMode="stretch"
          />
     
      <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:10}} >
        <Text style={[styles.Status,{textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>طلب بواسطة : {item.UserName} </Text>
        <Text style={styles.date}>وقت الإستلام : {item.Date}</Text>
        
        
      </View>
      <View style={{flex:1}}>

        <View style={{marginRight:'15%',marginLeft:'5%',marginTop:5,alignItems:'flex-start'}}>
            <MaterialIcons 
                name="error" 
                size={30} 
                color="#7B7B7B"
            />
        </View>
      </View>
    
     
    </View>
  </TouchableOpacity>
 
);

const AssignedRequests = ({navigation})=>{
  
    const [modalVisible,setModalVisible]=useState(false);
    const [RequestList,setRequestList] = useState([])
    const[loading,setLoading]=useState(true)
    const [term, setTerm] = useState('')
    const [SearchList, setSearchList] = useState([])
    const [SearchOccur, setSearchOccur] = useState(false) 
    
  
//backend
    
var n =' hello'
var currentUser = firebase.auth().currentUser.uid;  

const fetchUser=(UserId)=>{

   // var n='None'
                var query = firebase.database().ref('User/' + UserId);
                query.once("value").then(function(result) {
                const userData = result.val();
                  n = userData.Name;
                   console.log(n);
                    });

}
const fetchData=()=>{
  firebase.database().ref('/PickupRequest/').on('value',snapshot=>{
    const Data = snapshot.val();
    console.log(Data);
    if(Data){
      var li = []
        snapshot.forEach(function(snapshot){
        console.log(snapshot.key);
        console.log(snapshot.val());
        var UserId=snapshot.key
        firebase.database().ref('/PickupRequest/'+UserId).on('value',snapshot=>{
           // setUser(UserId)
          snapshot.forEach(function(snapshot){
            console.log(snapshot.key);
            console.log(snapshot.val().Status);
            fetchUser(UserId)
            if(snapshot.val().DeliveryDriverId == currentUser){
                fetchUser(UserId)
              var temp={Date:snapshot.val().DateAndTime,
                key:snapshot.key,
                Status:snapshot.val().Status,
                UserId:UserId,
                UserName:n
            }
            console.log(n+'check again ');
              li.push(temp)
              setLoading(false)
            }
            
          })
        })
      })
      if(li){
        //console.log(li);
       // console.log('((((((((((((((((((((((SORTED');
   //  li.sort((a,b) => new Date(a) < new Date(b) ? 1 : -1);
    // console.log(li);
   //HERE to sort the list depending on the date
      li.sort(function(a, b){
        return new Date(a.Date) - new Date(b.Date);
      });
    
    }
      setRequestList(li)

      console.log(li)
    }
  })
}

  useEffect(()=>{
    fetchData()
   // fetchUser(UserId)
  },[])

  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
  //const backgroundColor = item.key === selectedId ? "#EDEEEC" : "#F3F3F3";

      return (
        <Item
          item={item}
          // onPress={() => setSelectedId(item.key)}
          
          onPress={() => 
          { var ID =item.key;
            var DATE=item.Date;
            var STATUS = item.Status;
            var UserId=item.UserId;
            console.log(ID+'      >>>>>here in gome');
            navigation.navigate("RequestDetails",{ID,DATE,STATUS,UserId})}}
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
                style={[styles.flexDirectionStyle,{height:"100%" ,width:"100%",justifyContent:'center'}]}> 
        
              <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} onPress={()=>navigation.goBack()}/>

              <Text style={styles.text_header}>  الـطـلـبـات </Text>

            </LinearGradient>
         </View>
        {//End Header 
          } 
       {/* Request list }
      
       <Title style={[styles.text,{marginTop:10,marginBottom:3}]}
       > عدد الطلبات  : {ArabicNumbers(RequestList.length)}</Title>
       <View style={{alignItems:"center"}}>
            <Image
                            style={{width:'70%',marginBottom:3,height:3,alignItems:'center'}}
                            source={require('../assets/line.png')}
                            />
</View>
            <FlatList
              data={RequestList}
              renderItem={renderItem}
              keyExtractor={(item)=>item.key}
              extraData={selectedId}
              onRefresh={()=>fetchData()}
              refreshing={loading}
            />
          
            {/* end request list }
                
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
    },   
  //header  
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
    Status: {
      fontSize: 18,
      fontWeight: 'bold' ,
      textAlign :'right',
      marginRight:30,
      marginTop:5, 
    },
    date: {
      fontSize: 14,
      textAlign :'right',
      marginRight:30,
      marginTop:5,
      color :'#7B7B7B',
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
    icon:{
      position: 'absolute',
      marginTop:30,
      left: 16
    },
    flexDirectionStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    } ,
  //end flat list
  text: {
   // color: '#809d65',
    fontSize: 18,
    textAlign: 'center',
    marginRight:9,
    marginLeft:9,
},
  });
export default AssignedRequests;


*/

