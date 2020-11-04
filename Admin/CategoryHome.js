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
import {FontAwesome5} from '@expo/vector-icons';
import DeleteModal from '../components/DeleteModal';

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
  const [VisibleDeleteModal,setDaleteModal]=useState({
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
          <View style={[styles.cardContent,styles.flexDirectionStyle]}>
              <View style={styles.flexDirectionStyle}>
              <Title style={styles.title}>{item.Name} {item.Status}</Title>
              </View>

              <TouchableOpacity style={styles.EditIconStyle}
                onPress={()=>setDaleteModal({
                  ...VisibleDeleteModal,
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

                  <View style={[styles.header,styles.flexDirectionStyle]}>

                    <Text style={styles.text_header}>الفـئـــات</Text>
                    
                    <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} onPress={()=>navigation.goBack()}/>

                  </View>

                </SafeAreaView>

              </LinearGradient>

          </View>

          <View style={{flex:8}}>
            {data.isEmptyList? 

              <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575'}}>لا يوجد فئات مدخلة</Title>
              :
              <FlatList
                data={CategoryList}
                renderItem={({item})=>{
                return renderList(item)}}
                keyExtractor={item=>`${item.CategoryId}`}
                style={{flex:8}}
                onRefresh={()=>fetchData()}
                refreshing={loading}/> 
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

            {modalVisible?
              <AddCategory setModalVisible={setModalVisible}></AddCategory>
              :
              null
            }
            {VisibleDeleteModal.IsVisible?
              <DeleteModal setDaleteModal={setDaleteModal} Name={"ال"+VisibleDeleteModal.Name} Type="فئة" Id={VisibleDeleteModal.Id} ></DeleteModal>
              :null
            }
          </View>   
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },  
    fixedHeader :{
      flex:1,
      backgroundColor :'#9E9D24',
      overflow: 'hidden',
    },
    text_header: {
      color: '#ffff',
      fontWeight: 'bold',
      fontSize: 22,
      textAlign: 'center',
    },
    header:{
      width: '100%',
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:Platform.OS === 'android'? 0 : -10
    },
    cardContent:{
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
    flexDirectionStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    }  
});
export default HomeScreen;
