import React,{useState,useEffect}from 'react';
import { StyleSheet,
   Text, 
   View,
   Image,
   Dimensions,
   NativeModules,
   FlatList,
   TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {Card,Title,FAB} from 'react-native-paper';
import firebase from '../Database/firebase';
import AddCategory from './AddCategory';
import DeleteCategory from './DeleteCategory';
import {FontAwesome5} from '@expo/vector-icons'

const HomeScreen = ({navigation})=>{
  const [modalVisible,setModalVisible]=useState(false);
  const[CategoryList,setCategoryList]= useState([])
  const[loading,setLoading]=useState(true)
  const [data,setData]=React.useState({
      isvalidCategory:true,
      CategoryErrorMsg:'',
      CategoryInput: React.createRef(),
      isLoading:false,
      isEmptyList:false         
  })
  const [DeleteModal,setDaleteModal]=useState({
    IsVisible:false,
    Name:'',
    Id:''
  })

  const fetchData=()=>{
    firebase.database().ref('/Category/').on('value',snapshot=>{
      const Data = snapshot.val();
      if(Data){
        var li = []
        snapshot.forEach(function(snapshot){
          console.log(snapshot.key);
          console.log(snapshot.val().Name);
          var temp={Name:snapshot.val().Name,CategoryId:snapshot.key}
          li.push(temp)
          setLoading(false)
        })
        setCategoryList(li)
        console.log(li) 
      }else{
        setData({
          ...data,
          isEmptyList:true
        })
      }
    })
  }

  useEffect(()=>{
    fetchData()
},[])

  const renderList = ((item)=>{
    return(
        <Card style={styles.mycard} >
          <View style={styles.cardContent}>
              <View style={{flexDirection:Platform.OS === 'android' &&
                      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                      NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                      'row':'row-reverse'}}>
              <Title style={styles.title}>{item.Name}</Title>
              </View>

              <TouchableOpacity style={styles.EditIconStyle}
                onPress={()=>setDaleteModal({
                  ...DeleteModal,
                  IsVisible:true,
                  Name:item.Name,
                  Id:item.CategoryId
                })}
                >
                <Image 
                    source={require('../assets/DeleteIconRed.png')}
                    style={styles.Delete}
                    />
              </TouchableOpacity>
          </View>
        </Card>
    )
  });

    return (
      <View style={styles.container}>
          <View style={styles.fixedHeader} >
              <LinearGradient
                colors={["#809d65","#9cac74"]}
                style={{height:"100%" ,width:"100%"}}> 

                <SafeAreaView>

                  <View style={styles.header}>

                    <Text style={styles.text_header}>الفـئـــات</Text>
                    
                    <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} 
                                  onPress={()=>navigation.goBack()}/>

                  </View>

                </SafeAreaView>

              </LinearGradient>

          </View>

          <View style={{flex:8}}>
            {data.isEmptyList? <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575'}}>لا يوجد فئات مدخلة</Title>:
          
            <FlatList
                data={CategoryList}
                renderItem={({item})=>{
                return renderList(item)}}
                keyExtractor={item=>`${item.CategoryId}`}
                style={{flex:8}}
                
                onRefresh={()=>fetchData()}
                refreshing={loading}
              /> 
                }
            <FAB  
              onPress={()=>setModalVisible(true)}
                style={Platform.OS === 'android' &&
                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                styles.fabAndroid:styles.fabIOS}
              small={false}
              icon="plus"
              theme={{colors:{accent:"#9cac74"}}} 
            />

            {modalVisible?<AddCategory setModalVisible={setModalVisible}></AddCategory>:null}

            {DeleteModal.IsVisible?<DeleteCategory Id={DeleteModal.Id} setDaleteModal={setDaleteModal} Name={DeleteModal.Name}></DeleteCategory>:null}
          </View>   
      </View>
    );
}

const {width} = Dimensions.get("screen");
const width_logo = width* 0.22;
const width_logout = width* 0.045;
const {height} = Dimensions.get("screen");
const height_logo = height* 0.17;
const height_logout = height* 0.03;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },  
    fixedHeader :{
      flex:1,
      backgroundColor :'#9E9D24',
      overflow: 'hidden',
    },
    back: {
      width: width_logout ,
      height: height_logout,
      // marginLeft: 8 ,
      // marginRight:8,
      alignItems:'baseline',
      shadowColor :'#F1F1EA',  
    },
    text_header: {
      color: '#ffff',
      fontWeight: 'bold',
      fontSize: 22,
      textAlign: 'center',
      // marginLeft:165,
    },
    logo: {
      width: width_logo ,
      height: height_logo,
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
    cardContent:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
      justifyContent:'space-between'
    },
    mycard:{
        backgroundColor: '#F3F3F3',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius :10,
        shadowColor :'#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
        padding :12,
      },
    Delete:{
        width:30,
        height:30,
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
      textAlign :'right',
      marginRight:15,
      marginLeft:15
    },
    icon:{
      position: 'absolute',
      marginTop:20,
      left: 16
    },  
});
export default HomeScreen;
