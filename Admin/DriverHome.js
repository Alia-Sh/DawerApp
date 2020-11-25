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
import AddDriver from './AddDriver';
import {FontAwesome5, MaterialIcons} from '@expo/vector-icons'
import SearchBar from '../components/SearchBar';
//import { TabView, SceneMap } from 'react-native-tab-view';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated from 'react-native-reanimated';


const Tab = createMaterialTopTabNavigator();


//backend
const ViewDriver=(driver)=>{   
  navigation.navigate("AdminViewDriver",driver)  
}

const Item1 = ({ item, onPress, style }) => (
  
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View  style={[styles.flexDirectionStyle,{height:45}]}>
      <Image source={require('../assets/DriverProfile2.png')} 
        style={{height:60 ,width:60,marginRight:-8,marginTop:-8}}
      />

      <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:10,marginTop:-5}} >
        <Text style={[styles.title,{textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>{item.name}</Text>
        <Text style={styles.user}>@{item.username}</Text>
      </View>
    </View>
  </TouchableOpacity>
 
);

const Item2 = ({ item, onPress, style }) => (
  
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View  style={[styles.flexDirectionStyle,{height:45}]}>
      
    <Image
          source={require('../assets/PendingUser.png')}
          style={{width:55,height:55,marginRight:-8,marginTop:0,marginLeft:-20}}
          />
     
      <View style={{marginTop:Platform.OS === 'android'? -8:0,paddingLeft:10,alignItems:'flex-end'}} >
        <View  style={{flexDirection:'row'}}>
            <MaterialIcons style={{marginRight:120,marginTop:0}}
                name="error" 
                size={30} 
                color="#7B7B7B"
            />
          <Text style={[styles.Status,{textAlign: Platform.OS === 'android' && 
            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
            NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left':'right'}]}>طلب انضمام </Text>
        </View>

        <Text style={styles.date}>السائق:  {item.name} ، منطقة: {item.area}</Text>
        
      </View>
     
    </View>
  </TouchableOpacity>
 
);

const DriverHome = ({ navigation })=> {

  return (
    <View style={styles.container}>
          {//Header 
          } 
          <View style={styles.fixedHeader} >
            <LinearGradient
                colors={["#809d65","#9cac74"]}
                style={[styles.flexDirectionStyle,{height:"100%" ,width:"100%",justifyContent:'center'}]}> 
        
              <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} onPress={()=>navigation.goBack()}/>

              <Text style={styles.text_header}>سائقي التوصيل </Text>

            </LinearGradient>
         </View>
    
      <Tab.Navigator 
            		screenOptions={({ route }) => ({
                  tabBarLabel: ({ tintColor, focused, item }) => {
                    return focused
                      ? (<Text style={{ fontWeight: 'bold',}} >{route.name}</Text>)
                      : (<Text style={{ fontWeight: 'normal', fontSize: 16 }} >{route.name}</Text>)
                  },
                  
                })}
        initialRouteName="السائقون المعتمدون"
        tabBarOptions={{
            labelStyle: { fontSize: 14},
            activeTintColor :'black',
            showIcon: true,
            indicatorStyle :  {backgroundColor:'#b79f57'},
            style: { backgroundColor: "#F3F3F3"},
            tabStyle:{
              height : 60,
              flexDirection: 'row-reverse',
            }
           }}
          >

        <Tab.Screen name="طلبات الانضمام" component={joinReqs} 
                    options={{
                      borderRadius:30,
                      tabBarIcon: ({ color}) => (
                           <FontAwesome5 name="user-plus" size={18} color={color}/> ),
                          }}
          />

        <Tab.Screen name="السائقون المعتمدون" component={AppprovedDrivers} 
                    options={{
                      tabBarIcon: ({ color}) => (
                          <FontAwesome5 name="user-check" size={18} color={color} /> ),
                          }}
        />
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

function AppprovedDrivers  ({ navigation }){
  const [DriverList1,setDriverList1] = useState([])
  const [loading1,setLoading1]=useState(true)
  const [term, setTerm] = useState('') //list
  const [SearchList, setSearchList] = useState([]) // list
  const [SearchOccur, setSearchOccur] = useState(false) // list

  const fetchData1=()=>{
    console.log('inside fe');
    firebase.database().ref("DeliveryDriver").orderByChild("UserName").on('value', (snapshot) =>{
        var li = []
        snapshot.forEach((child)=>{
        if(child.val().Status === "Accepted"){
        var temp={
          key: child.key,
          username:child.val().UserName,
          name : child.val().Name   
        }
        li.push(temp)
        setLoading1(false)
        console.log(child.key);
        console.log(child.val().UserName);
        //setDriverList(temp)
        setLoading1(false) }
      })
      //this.setState({list:li})
      setDriverList1(li)
    })
  }

  useEffect(()=>{
    fetchData1()
  },[])

  const [selectedId1, setSelectedId1] = useState(null);

  const renderItem1 = ({ item }) => {
  //const backgroundColor = item.key === selectedId ? "#EDEEEC" : "#F3F3F3";

    return (
      <Item1
        item={item}
        // onPress={() => setSelectedId1(item.key)}
        
        onPress={() => 
        { var ID =item.key;
          var NAME=item.name;
          var USER = item.username;
          console.log(ID+'      >>>>>here in gome');
          navigation.navigate("AdminViewDriver",{ID,NAME,USER})}}
        style={{ backgroundColor :item.key === selectedId1 ? "#EDEEEC" : "#F3F3F3"}}
      />
    );
  };

  // Search function
  SearchInList = (word) =>{
    setSearchList(DriverList1.filter(item => item.name.toLowerCase().includes(word)))
    setSearchOccur(true)
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center'}}>

    <View style={{marginLeft:10,marginRight:10}}>

    <SearchBar
          term = {term}
          OnTermChange = {newTerm => setTerm(newTerm)}
          OnTermSubmit = {()=> SearchInList(term)}
          BarWidth = {'100%'}
      />
    </View>

    {SearchOccur ? 
      
      <FlatList
        data = {SearchList1}
        renderItem={renderItem1}
        keyExtractor = {(item)=>item.key}
        extraData={selectedId1}
        onRefresh = {()=>fetchData1()}
        refreshing = {loading1}
      />

    :

    <FlatList
      data={DriverList1}
      renderItem={renderItem1}
      keyExtractor={(item)=>item.key}
      extraData={selectedId1}
      onRefresh={()=>fetchData1()}
      refreshing={loading1}
    />
    }
    </View>

    /*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>list here!</Text>
    </View>*/
  );
}

//////////
function joinReqs  ({ navigation }) {
  const [DriverList2,setDriverList2] = useState([])
  const [loading2,setLoading2]=useState(true)
  

  const fetchData2=()=>{
    console.log('inside joinnnnn');
    firebase.database().ref("DeliveryDriver").orderByChild("UserName").on('value', (snapshot) =>{
        var li = []
        snapshot.forEach((child)=>{
        if(child.val().Status === "Pending"){
        var temp={
          key: child.key,
          username:child.val().UserName,
          name : child.val().Name,
          area: child.val().DeliveryArea  
        }
        li.push(temp)
        setLoading2(false)
        console.log(child.key);
        console.log(child.val().UserName);
        //setDriverList(temp)
        setLoading2(false) }
      })
      //this.setState({list:li})
      setDriverList2(li)
    })
  }

  useEffect(()=>{
    fetchData2()
  },[])

  const [selectedId2, setSelectedId2] = useState(null);

  const renderItem2 = ({ item }) => {

    return (
      <Item2
        item={item}        
        //onPress={() => setSelectedId2(item.key)}

        onPress={() => 
        { var ID =item.key;
          var NAME=item.name;
          var USER = item.username;
          console.log(ID+'      >>>>>here in join');
          navigation.navigate("JoinDetails",{ID,NAME,USER})}}
        style={{ backgroundColor :item.key === selectedId2 ? "#EDEEEC" : "#F3F3F3"}}
      />
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center'}}>


    <FlatList
      data={DriverList2}
      renderItem={renderItem2}
      keyExtractor={(item)=>item.key}
      extraData={selectedId2}
      onRefresh={()=>fetchData2()}
      refreshing={loading2}
    />
    
    </View>

    /*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>list here!</Text>
    </View>*/
  );
}




/* const HomeScreen = ({navigation})=>{
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'approved' },
    { key: 'second', title: 'join' },
  ]);

  const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
  );
  
  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
  );
  
  const initialLayout = { width: Dimensions.get('window').width };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
*/
//////////////
/*
const Item = ({ item, onPress, style }) => (
  
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View  style={[styles.flexDirectionStyle,{height:45}]}>
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
    const [term, setTerm] = useState('')
    const [SearchList, setSearchList] = useState([])
    const [SearchOccur, setSearchOccur] = useState(false) 
  
//backend
    const ViewDriver=(driver)=>{   
      navigation.navigate("AdminViewDriver",driver)  
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
          
          onPress={() => 
          { var ID =item.key;
            var NAME=item.name;
            var USER = item.username;
            console.log(ID+'      >>>>>here in gome');
            navigation.navigate("AdminViewDriver",{ID,NAME,USER})}}
          style={{ backgroundColor :item.key === selectedId ? "#EDEEEC" : "#F3F3F3"}}
        />
      );
      };

  // Search function
  SearchInList = (word) =>{
    setSearchList(DriverList.filter(item => item.name.toLowerCase().includes(word)))
    setSearchOccur(true)
  }

*/
   //front-end
{/* return (
        <View style={styles.container}>
          {//Header 
          } 
          <View style={styles.fixedHeader} >
            <LinearGradient
                colors={["#809d65","#9cac74"]}
                style={[styles.flexDirectionStyle,{height:"100%" ,width:"100%",justifyContent:'center'}]}> 
        
              <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} onPress={()=>navigation.goBack()}/>

              <Text style={styles.text_header}>  سائقي التوصيل </Text>

            </LinearGradient>
         </View>
        {//End Header 
          } */}
       {/* drivers list */}
        {/*  <View style={{marginLeft:10,marginRight:10}}>

            <SearchBar
                  term = {term}
                  OnTermChange = {newTerm => setTerm(newTerm)}
                  OnTermSubmit = {()=> SearchInList(term)}
                  BarWidth = {'100%'}
              />
          </View>
      
          {SearchOccur ? 
              
              <FlatList
                data = {SearchList}
                renderItem={renderItem}
                keyExtractor = {(item)=>item.key}
                extraData={selectedId}
                onRefresh = {()=>fetchData()}
                refreshing = {loading}
              />

            :

            <FlatList
              data={DriverList}
              renderItem={renderItem}
              keyExtractor={(item)=>item.key}
              extraData={selectedId}
              onRefresh={()=>fetchData()}
              refreshing={loading}
            />
          }*/}
            {/* end drivers list */}
         {/* <FAB  
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
      );*/}
//}
/*
const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
*/

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
      marginRight:15,
      marginTop:10, 
    },
    user: {
      fontSize: 12,
      textAlign :'right',
      marginRight:15,
      marginTop:5,
      color :'#ADADAD',
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
    } 
  //end flat list
  });
export default DriverHome;
