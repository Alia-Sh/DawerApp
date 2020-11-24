import React, {useState,useEffect} from 'react';
import { StyleSheet, 
  Text, 
  View, 
  Image,
  NativeModules,
  FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesome5} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FAB} from 'react-native-paper';
import firebase from '../Database/firebase';
import SearchBar from '../components/SearchBar';

const HomeScreen = ({navigation})=>{
  

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
      firebase.database().ref('RecyclingFacility').orderByChild("Name").on('value',snapshot=>{
      const Data = snapshot.val();
      if(Data){
        var li = []
        snapshot.forEach(function(snapshot){
          console.log(snapshot.key);
          console.log(snapshot.val().Name);
          // fetch the logo here..
          //retriveImage(snapshot.key);
          console.log('I AM IN THE LOOOOOOOOOPPP')
          //console.log(Picture);
          var temp = {Name:snapshot.val().Name, FacilityId:snapshot.key, Logo:snapshot.val().Logo, Materials:snapshot.val().AcceptedMaterials}
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


const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.theItem, style]}>
    <View  style={[styles.flexDirectionStyle,{height:45}]}>
        {item.Logo==""?
          <Image source={require('../assets/AdminIcons/FacilityIcon.jpg')} 
            style={{height:50 ,width:50,marginRight:-8,marginTop:0,marginLeft:8}}
          />
        :
        <Image
            style={{height:50 ,width:50,marginRight:-8,marginTop:0,marginLeft:8}}
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
    /* CODE WITH LOGO..
    <TouchableOpacity
      key={item.key}
      onPress={() => navigation.navigate("FacilityInfo",{item})}
      style={styles.mycard}>
      <View style = {{flexDirection: "column"}}>
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
        
            <Text style={styles.title}> {item.Name}</Text>
             
      </View>
      </View>
          </TouchableOpacity> */
   
        <Item
          item={item}
          // onPress={() => setSelectedId(item.key)}
          onPress={() => navigation.navigate("FacilityInfo",{item})}
          style={{ backgroundColor :item.key === selectedId ? "#EDEEEC" : "#F3F3F3"}}
        />


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

                  <View style={[styles.header,styles.flexDirectionStyle]}>

                    <Text style={styles.text_header}>المنشــآت</Text>
                    
                    <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon}  onPress={()=>navigation.goBack()}/>

                  </View>

                </SafeAreaView>

              </LinearGradient>

          </View>

       

          <View style={{flex:8,marginLeft:10,marginRight:10}}>
            <SearchBar
              term = {term}
              OnTermChange = {newTerm => setTerm(newTerm)}
              OnTermSubmit = {()=> SearchInList(term)}
              BarWidth = {'100%'}
              />
            
           {/* {data.isEmptyList? <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575'}}>لا توجد منشـآت مدخلة حتى الآن</Title>:
            */}

            {SearchOccur ? 
              
                <FlatList
                //contentContainerStyle = {styles.grid}
                //numColumns = {2}
                data = {SearchList}
                keyExtractor = {(item)=>item.key}
                onRefresh = {()=>fetchData()}
                refreshing = {loading}
                renderItem={renderList}
                />
              :
                <FlatList
                //contentContainerStyle = {styles.grid}
                //numColumns = {2}
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
              
          </View>   

        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },  
    mytext:{
      fontSize:12,
      //marginTop:13,
      marginRight:2,
      color:'#808080'
    },
    textInput: {
      textAlign: 'center', 
      marginTop: 20,  
  },
    fixedHeader :{
      flex:1,
      backgroundColor :'#9E9D24',
      overflow: 'hidden',
    },
    header:{
      width: '100%',
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:Platform.OS === 'android'? 0 : -10
    },
    text_header: {
      color: '#ffff',
      fontWeight: 'bold',
      fontSize: 22,
      textAlign: 'center',
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
    profile_image:{
      width:120,
      height:120,
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
      fontSize: 18,
      fontWeight: 'bold' ,
      textAlign :'center',
      color: '#9E9D24',
      marginTop: 5,
    },
    icon:{
      position: 'absolute',
      marginTop:20,
      left: 16
    },
    flexDirectionStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    }
  
});
export default HomeScreen;
