import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,Platform,NativeModules, TextInput, KeyboardAvoidingView, FlatList, Modal, TouchableOpacity}from 'react-native';
import {Card, Title}from 'react-native-paper';
import firebase from '../Database/firebase';
import {FontAwesome5} from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient'; 
import moment from 'moment-hijri';
import AlertView from "../components/AlertView";
import LottieView from 'lottie-react-native';





const PostDetails=({navigation,route})=>{
    var PostId = route.params.item.PostId;
    const[Description,setDescription]=useState('');
    const[Subject,setSubject]=useState('');
    const [CDate, setCDate] = useState('');
    const [UserName,setUserName] = useState('')

    const [DeletIcon,setDeletIcon] = useState(false)


    const[Reply,setReply]=useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [ReplierUserName,setReplierUserName] = useState('')
    const [RepliesList,setRepliesList] = useState([])
    const[loading,setLoading]=useState(true)

    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',  
    });

    const [data,setData]=React.useState({
        isLoading:false ,
        noReply: true,
        Replyinput: React.createRef(),
        isEmptyList:false ,
        visible: false
    });

    useEffect(() => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hijriDate = moment()
                      .format('iYYYY/iM/iD');
        var time = moment()
                      .format(' hh:mm a');
        setCurrentDate(date + '/' + month + '/' + year + ' | ' + hijriDate 
        + ' ' + time);
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
            if (Data.Id==userId){
                setDeletIcon(true)
            }
            }
          })
    }


    const reSetData=()=>{
        setData({
            ...data,
            noReply: true,
            isEmptyList:false

        });
        setReply('');
    }
    

const AddReply=()=>{    
    var userId2 = firebase.auth().currentUser.uid;      
    if(Reply == ''){
        setData({
        ...data,
        noReply: false,
        })
        }
       else {     
        firebase.database().ref('Posts/'+PostId+'/replies').push({
            UserName: '@'+ReplierUserName,
            Date: currentDate,
            Id: userId2,
            Reply: Reply,
        }).then((data)=>{
            reSetData();
            console.log('data ' , data);
        }).catch((error)=>{
            //error callback
            setData({
                ...data,
                isLoading:false,
                isEmptyList:false
            })
            Alert.alert(error.message)
            console.log('error ' , error)
        }) 
        
        }       
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

  const delet = ()=>{
    fetchData()
    firebase.database().ref('Posts/'+PostId).remove()
    navigation.goBack()
  }

    return(
        <View style={styles.root}>
            <View  style={styles.fixedHeader}>
         <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{ height: '100%', width: '100%', flexDirection:'row', justifyContent: 'space-between'}}>
            
                     <Image source={require('../assets/UserLogo2.png')} 
                     style={styles.logo}
                     resizeMode='stretch' />
                    <FontAwesome5 name="chevron-left" size={31} color="#fff" style={styles.icon}
                    onPress={()=>navigation.goBack()}
                    />
                     
            </LinearGradient>
        
            </View>

            <View style={styles.footer}>
                <KeyboardAwareScrollView>
                    
                    {DeletIcon?
                    <FontAwesome5 name="trash" size={20} style={styles.Postinfo3}
                    onPress={()=> { setData({
                      ...data,
                      visible: true
                    })}}/>
                    :
                      null
                    }
                    <Text style={styles.title}>{Subject}</Text>
                    
            
                    
        

                <View>
                
                    <Text style={styles.postDescription}>
                          {Description}
                    </Text> 
                    </View>
                <Text style={styles.Postinfo2}>{UserName} :الكاتب</Text>
                <Text style={styles.Postinfo2}> {CDate}</Text>
                <LinearGradient colors={['#9E9D24','#9E9D24']}  style={{width: '95%', height: '0.5%', margin: 10}} />

                {data.isEmptyList? 

              <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575', marginTop: 250, fontSize: 13}}>لا يوجد ردود</Title>
              :
              <FlatList
              data={RepliesList}
              renderItem={({item})=>{
              return renderList(item)}}
              keyExtractor={item=>`${item.ReplyId}`}
             // style={{flex:1}}
              onRefresh={()=>fetchData()}
              refreshing={loading}/>
               } 
                </KeyboardAwareScrollView>
            </View>
            

            <KeyboardAvoidingView behavior="padding" style={{flex:1.04, marginTop: -100}}>
            <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={Platform.OS === 'android' &&
              NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
              NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
              NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
              styles.fabAndroid:styles.fabIOS}>

            <FontAwesome5 name="reply" size={31} color="#fff" style={styles.ReplyIcon}
                    onPress={()=> AddReply()}
                    />
            <TextInput style={styles.Reply} 
            value={Reply}
            label="ٍReply"
            placeholder="اكتب هنا ردك  .."
            autoCapitalize="none"
            alignItems= 'right' 
            editable={true} 
            color= '#05375a'
            backgroundColor= '#fff'
            padding= {10}
            width= '86%'
            marginLeft= {47}
            multiline={true}
            borderRadius= {15}
            textAlign={Platform.OS === 'android' && 
            NativeModules.I18nManager.localeIdentifier === 'ar_EG' ||
            NativeModules.I18nManager.localeIdentifier === 'ar_SA' || 
            NativeModules.I18nManager.localeIdentifier === 'ar_AE'? 'left' : 'right'} 
            onChangeText={(val)=>setReply(val)}
            ref={data.Replyinput}
            >
            </TextInput>  
            </LinearGradient>
            </KeyboardAvoidingView>
            {alert.alertVisible?
            <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
            :null}


<Modal animationType="slide" transparent={true} visible={data.visible}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>حذف المنشور</Text>
                <View style={{width:'100%',height:0.5,backgroundColor:"#757575",marginVertical:15}}></View>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                  <View style={{width:'50%',height:100,justifyContent:'center',alignItems:'center'}}>  
                    <LottieView source={require('../assets/Warning.json')}autoPlay loop/>                           
                  </View>
                </View>

                <Text style={styles.textStyle}>هل انت متاكد من حذف المنشور؟</Text>
                <View style={{flexDirection:Platform.OS === 'android' &&
                        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'row':'row-reverse',
                        alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity 
                        style={styles.okButton}
                        onPress={()=>{ delet()
                          setData({
                            ...data,
                            visible: false
                          })     
                    }}>
                      <Text style={styles.okStyle}>حذف</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={()=>{
                            setData({
                              visible:false
                            })
                        }}>
                            <Text style={styles.okStyle}>إلغاء</Text>
                    </TouchableOpacity>
                  </View>
            </View>
        </View>
</Modal>



            
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
        width: 90,
        height: 40,
      marginLeft: 285 , 
      marginTop: 35, 
    },
    Reply: {
        height: 45,
        margin: 4 , 
    },
    title: {
      fontSize: 35,
      fontWeight: 'bold' ,
      textAlign: 'center',
      color: '#9E9D24',
    },
    ReplyTitle: {
        fontSize: 11,
        fontWeight: 'bold' ,
        textAlign: 'right',
         marginRight: 3 , 
         color: '#9E9D24',
         marginTop: -4
    },
    icon:{
        position: 'absolute',
        left: 16,
        marginTop: 39,
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
        marginTop: 10
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
      centeredView:{
        justifyContent:'center',
        alignItems:'center',
         alignContent:'center',
         flex: 1,
    },
  modalView:{
        width:'80%',
        margin:10,
        backgroundColor:"#ffff",
        borderRadius:10,
        shadowColor:'#161924',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius:3.85,
        elevation:5,                
    },
  okStyle:{
        color:"#ffff",
        textAlign:'center',
        fontSize:20
    },
  okButton:{
        backgroundColor:'#B71C1C',
        borderRadius:5,
        padding:10,
        elevation:2,
        width:'30%',
        margin:15,
    },
  cancelButton:{
      backgroundColor:'#9E9E9E',
      borderRadius:5,
      padding:10,
      elevation:2,
      width:'30%',
      margin:15,
    },
  modalText:{
      textAlign:'center',
      fontWeight:'bold',
      fontSize:25,
      shadowColor:'#161924',
      shadowOffset:{
          width:0,
          height:2
      },
      shadowOpacity:0.3,
      shadowRadius:3.84,
      elevation:5,
      marginTop:5      
    },
  textStyle:{
      color:"#161924",
      textAlign:'center',
      fontSize:15,
      marginTop:20
    },   



      


    
});



export default PostDetails;