import React, {useState,useEffect} from 'react';
import {Title, Image} from 'react-native-paper';
import {View,NativeModules,
    FlatList, StyleSheet,
    TouchableOpacity, Text,
} from 'react-native';
import firebase from '../Database/firebase';
import { LinearGradient } from 'expo-linear-gradient'; 
import SearchBar from '../components/SearchBar';
import {FontAwesome5} from '@expo/vector-icons';






const  MyPosts= ({navigation}) =>{

    const [term, setTerm] = useState('')
    const [SearchList, setSearchList] = useState([])
    const [SearchOccur, setSearchOccur] = useState(false)
    const [Searchisempty, setSearchisempty] = useState(false)  
    const [PostList,setPostList] = useState([])
    const[loading,setLoading]=useState(true)
    const [data,setData]=React.useState({
        isLoading:false ,
        isEmptyList:false  
    });
    
    var userId = firebase.auth().currentUser.uid;

    const fetchData=()=>{
        firebase.database().ref('Posts/').on('value',snapshot=>{
          const Data1 = snapshot.val();
          if(Data1){
            var My=[]
            snapshot.forEach(function(snapshot){
              console.log(snapshot.key);
              console.log(snapshot.val());
              var temp={AuthorUserName:snapshot.val().AuthorUserName,PostId:snapshot.key,Date:snapshot.val().Date, Description:snapshot.val().Description, Subject:snapshot.val().Subject, Id:snapshot.val().Id}
              if(temp.Id == userId){
                My.push(temp)
                setLoading(false)
                }
            
            })
            if((My)==''){
                setData({
                  ...data,
                  isEmptyList:true
                })
            }     else{
                    setData({
                      ...data,
                      isEmptyList:false
                    })
                  }
                  setPostList(My)
                  setSearchisempty(false)
                  setSearchOccur(false)
                  setSearchList([])
                  console.log(My)
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

    const [selectedId, setSelectedId] = useState(null);

    const Item = ({ item, onPress, style }) => (
        <View style={styles.mycard}>
      <TouchableOpacity onPress={onPress} style={[styles.theItem, style]}>
          
      <View style={styles.flexDirectionStyle}>
             <Title style={styles.title}>{item.Subject}</Title>
  
              </View>
              <Text style={styles.Postinfo}>
              {item.AuthorUserName}
              </Text>
             
              <LinearGradient
              colors={['#9E9D24','#9E9D24']}
              style={{width: '95%', height: '0.5%', margin: 10}} /> 
             <Text style={styles.postDescription}
              numberOfLines={3}>
              {item.Description}</Text>
       
      </TouchableOpacity>
      </View>
    );

    const renderList =  ( item ) =>{
        console.log("in renderList");
        console.log(item);
        return(
            <Item
            item={item}
            onPress={() => navigation.navigate("PostDetails",{item})}
            style={{ backgroundColor :item.PostId === selectedId ? "#EDEEEC" : "#F3F3F3"}}
          />
        )
    };

    const SearchInList = (word) =>{
      if (PostList.filter(item => item.Subject.toLowerCase().includes(word)) == ''){
       setSearchisempty(true)
      }
      else {
      setSearchList(PostList.filter(item => item.Subject.toLowerCase().includes(word)))
      setSearchOccur(true)
      setSearchisempty(false)
      }

    }


      
    return(

           
            <View style={{flex:8}}>
             <View  style={styles.fixedHeader}>
         <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{ height: '100%', width: '100%', flexDirection:'row', justifyContent: 'space-between'}}>
         <Title style={styles.text_header}>منشوراتي</Title>
            <FontAwesome5 name="chevron-left" size={30} color="#ffffff" style={Platform.OS === 'android' && 
                                      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                      NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                      styles.iconAndroid:styles.iconIOS} 
                                      onPress={()=>navigation.goBack()} />
            </LinearGradient>
        </View>
            
            <View style={{marginBottom:9}}>
              <SearchBar
            term = {term}
            OnTermChange = {newTerm => setTerm(newTerm)}
            OnTermSubmit = {()=> SearchInList(term)}
            BarWidth = {'80%'}
            BarMargin = {'30'}
            />
            </View>

            {Searchisempty? 
                <View style={styles.grid}>
          <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575', fontSize: 13}}>لا يوجد نتائج</Title>
          </View>
         :
         null
         }
              {data.isEmptyList? 

              <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575', marginTop: 250, fontSize: 13}}>لا يوجد لديك منشورات</Title>
              :
              <FlatList
        data={PostList.reverse()}
        keyExtractor={item=>`${item.PostId}`}
        refreshing={loading}
        onRefresh={()=>fetchData()}
        renderItem={({item})=>{
            return renderList(item)}}
        />
              
              }
      
              {SearchOccur? 
          <FlatList
          contentContainerStyle = {styles.grid} 
          data = {SearchList}
          keyExtractor = {(item)=>item.key}
          onRefresh = {()=>fetchData()}
          refreshing = {loading}
          renderItem={({item})=>{
          return renderList(item)}}
        /> 
        :
         null
         }
                
         
        
        
 
        

              
            </View>
                
    );
};

const styles = StyleSheet.create({
     container: {
        flex: 1,
        //marginTop: 40, //20 -- 55
      },
      fixedHeader: {
        backgroundColor: '#9E9D24',
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        height: '10%'
    },
    text_header: {
        position:'absolute',
        marginTop: 39, 
        marginLeft: 150,
        alignItems: 'center',
        color: '#fff',
        fontSize: 25
    },
    logo: {
        width: 90,
        height: 40,
      marginRight: 50 , // was left 65
      marginTop: 35, // was top 36
      alignItems: 'center',
      justifyContent: 'center',
  },
  action: {
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
    margin:15,
    fontSize: 20,
    color: '#9E9D24',
    fontWeight: 'bold',
    textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
    
    
},
  action1: {
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
    borderWidth:2,
    borderColor:'#f2f2f2',
    padding: 10,
    borderRadius:5,
    width: '90%',
    marginRight: 20,
    textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
},
      action2: {
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        borderWidth:2,
        borderColor:'#f2f2f2',
        paddingBottom:60,
        width: '90%',
        height: '40%',
        marginRight: 20,
        borderRadius:5,
        textAlign: Platform.OS === 'android' && 
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
          NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
    },
    text: {
        color: '#9E9D24',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        marginRight:'5%',
        marginLeft:'5%',
        marginTop:10
    },
    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : 0,
        color: '#05375a',
    },
      fabIOS: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      },
     fabAndroid: {
       position: 'absolute',
        margin: 16,
        left: 0,
        bottom: 0,
      },
      iconIOS:{
        position:'absolute',
        left:6,
        marginTop: 39, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconAndroid:{
        position:'absolute',
        right:15,
        marginRight: 65 , // was left 65 --> must be tested
        marginTop: 28, // was top 36
        alignItems: 'center',
        justifyContent: 'center',
    },
    PublishButton:{
        borderRadius:5,
        elevation:2,
        width:'20%',
        height: '15%',
        marginLeft: 145 ,
        marginTop:10,
        backgroundColor: '#9E9D24',
        alignItems: 'center',
        justifyContent: 'center',
      
    }
    ,okStyle:{
    color:"#ffff",
    textAlign:'center',
    fontSize:20,

},
errorMsg: {
    color: '#FF0000',
    fontSize: 14,
    marginRight: 20,
  textAlign: Platform.OS === 'android' && 
  NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
  NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
  NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
},
errorMsg2: {
    color: '#FF0000',
    fontSize: 14,
    marginRight: 20,
    marginBottom: 12,
  textAlign: Platform.OS === 'android' && 
  NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
  NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
  NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right',
},
flexDirectionStyle:{
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold' ,
    textAlign: 'right',
    marginRight: 8 , 
     alignItems: 'center',
     color: '#9E9D24',
     marginBottom: 0,
     marginTop: 12
},
  mycard:{
    backgroundColor: '#F3F3F3',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius :10,
    shadowColor :'#000',
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 5,
    padding :2,
  }, 
  Postinfo:{
    fontSize: 15,
    textAlign: 'right',
    marginRight: 9 , 
    alignItems: 'center',
     color: 'gray'
  },
  postDescription:{
    fontSize: 15,
    textAlign: 'right',
    marginRight: 9 , 
    color: 'gray'
  },
  grid: {
    marginBottom: 580,
      },
      icon: {
        left: 12,
        marginTop: 10,
        marginEnd: 25
      }

  
});

export default MyPosts;