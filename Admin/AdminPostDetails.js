import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,Platform,NativeModules,FlatList}from 'react-native';
import {Card, Title}from 'react-native-paper';
import firebase from '../Database/firebase';
import {FontAwesome5} from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient'; 





const AdminPostDetails=({navigation,route})=>{
    var PostId = route.params.item.PostId;
    const[Description,setDescription]=useState('');
    const[Subject,setSubject]=useState('');
    const [CDate, setCDate] = useState('');
    const [UserName,setUserName] = useState('')



    const [RepliesList,setRepliesList] = useState([])
    const[loading,setLoading]=useState(true)


    const [data,setData]=React.useState({
        isLoading:false ,
        noReply: true,
        Replyinput: React.createRef(),
        isEmptyList:false ,
    });

    useEffect(() => {
        retriveData();
        fetchData();
      }, []);
    
      var userId = firebase.auth().currentUser.uid;
      var query = firebase.database().ref('User/' + userId);
      query.once("value").then(function(result){
          setReplierUserName(result.val().UserName);
      }); 


    const retriveData=()=>{
        firebase.database().ref('/Posts/'+PostId).on('value',snapshot=>{
            const Data = snapshot.val();
            if(Data){
            setDescription(Data.Description)
            setCDate(Data.Date)
            setSubject(Data.Subject)
            setUserName(Data.AuthorUserName)
            }
          })
    }


const fetchData=()=>{
    firebase.database().ref('Posts/'+PostId+'/replies').on('value',snapshot=>{
      const Data1 = snapshot.val();
      if(Data1){
        var li = []
        snapshot.forEach(function(snapshot){
          console.log(snapshot.key);
          console.log(snapshot.val());
          var temp={UserName:snapshot.val().UserName,ReplyId:snapshot.key,ReplyDate:snapshot.val().Date, ReplyDescription:snapshot.val().Reply}
          li.push(temp)
          setLoading(false)
        })
        setRepliesList(li)
        console.log(li) 
      }else{
        setData({
          ...data,
          isEmptyList:true
        })
      }
    })
  }

  const renderList = ((item)=>{
    return(
        <Card style={styles.mycard}>
              <View style={styles.flexDirectionStyle}>
              <Title style={styles.ReplyTitle}>{item.UserName} رد من قبل</Title>
              </View>
              <View style={styles.flexDirectionStyle}>
              <Text style={styles.ReplyDescription}>{item.ReplyDescription}</Text>
              </View>
              <View style={styles.flexDirectionStyle}>
              <Text style={styles.Replyinfo}>{item.ReplyDate}</Text>
              </View>
        </Card>
    )
  });



    return(
        <View style={styles.root}>
            <View  style={styles.fixedHeader}>
         <LinearGradient
                    colors={["#809d65","#9cac74"]}
                    style={{ height: '100%', width: '100%', flexDirection:'row', justifyContent: 'space-between'}}>
            
                     <Image source={require('../assets/UserLogo2.png')} 
                     style={styles.logo}
                     resizeMode='stretch' />
                      
                      <Text style={styles.text_header}>منشور</Text>

                    <FontAwesome5 name="chevron-right" size={24} color="#fff" style={styles.icon}
                    onPress={()=>navigation.goBack()}
                    />
                     
            </LinearGradient>
        
            </View>

            <View style={styles.footer}>
                <KeyboardAwareScrollView>
                    
                    <FontAwesome5 name="trash" size={20} style={styles.Postinfo3}
                    onPress={()=> {firebase.database().ref('Posts/'+PostId).remove()
                    navigation.goBack()}}/>

                    <Text style={styles.title}>{Subject}</Text>                    
        

                <View>
                
                    <Text style={styles.postDescription}>
                          {Description}
                    </Text> 
                    </View>
                <Text style={styles.Postinfo2}>{UserName} :الكاتب</Text>
                <Text style={styles.Postinfo2}> {CDate}</Text>
                <LinearGradient colors={["#809d65","#9cac74"]} style={{width: '95%', height: '0.5%', margin: 10}} />

                {data.isEmptyList? 

              <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575', marginTop: 150, fontSize: 13}}>لا يوجد ردود</Title>
              :
              <FlatList
              data={RepliesList}
              renderItem={({item})=>{
              return renderList(item)}}
              keyExtractor={item=>`${item.ReplyId}`}
              onRefresh={()=>fetchData()}
              refreshing={loading}/>
               } 
                </KeyboardAwareScrollView>
            </View>
            

            
</View>
    )
}


const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor: '#fff',   
    },
    header:{
        flexDirection:'row',
        backgroundColor:'red',
        height:60,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        overflow: 'hidden',
    },
    footer: {
        paddingHorizontal: 10,
        paddingVertical: 30,
        marginTop:-20,
        flex:8,
    },
    fixedHeader :{
        backgroundColor: '#9E9D24',
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        height: '10%'
      },
    logo: {
        width: 85, // was 90
        height: 35, // was 40
        //marginLeft: 285 , 
        marginTop: 30, //35
    },
    Reply: {
        height: 45,
        margin: 4 , 
    },
    title: {
      fontSize: 32,//was 36
      fontWeight: 'bold' ,
      textAlign: 'center',
      color: '#809d65',
    },
    ReplyTitle: {
        fontSize: 11,
        fontWeight: 'bold' ,
        textAlign: 'right',
         marginRight: 3 , 
         color: '#809d65',
         marginTop: -4
    },
    icon:{
        position: 'absolute',
        //left: 16,
        right: 14,
        marginTop: 35,//39
    },
    ReplyIcon:{
        position: 'absolute',
        left: 9,
        marginTop: 11,
    },
    mycard:{
        backgroundColor: '#F3F3F3',
        marginBottom: 5,
      }, 
      Postinfo:{
        fontSize: 12,
        textAlign: 'right',
        marginRight: 9 , 
        alignItems: 'center',
         color: 'gray',
         
      },
      Replyinfo:{
        fontSize: 9,
        marginTop: 10 ,
        color: 'gray',
        marginRight: 203,
         
      },
      ReplyDescription:{
        fontSize: 14,
         color: 'gray',
         textAlign: 'right',
         marginRight: 3 ,
         marginTop: -6  
      },
      Postinfo2:{
        fontSize: 12,
        textAlign: 'right',
         color: 'gray',
         width: '98.5%',
         marginTop: 3
         
      },
      Postinfo3:{
        color: 'darkred',
        textAlign: 'right',
       },
      postDescription:{
        fontSize: 15,
        textAlign: 'right',
        color: 'black',
        width: '99%',
        marginBottom: 35,
        marginTop: 30
      },
      fabIOS: {
        marginBottom:0,
        width: '100%',
        flex:1 ,
        flexDirection: 'row',
        overflow: 'hidden',
      },
     fabAndroid: {
        marginBottom:0,
        width: '100%',
        flex:1 ,
        flexDirection: 'row',
        overflow: 'hidden',
      },
      flexDirectionStyle:{
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
      },
      text_header: { // NEW
        marginRight: 150,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop:30
    },


    
});



export default AdminPostDetails;