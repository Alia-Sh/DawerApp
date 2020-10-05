import React,{useState,useEffect}from 'react';
import { StyleSheet, Text, View,Image,Dimensions,NativeModules,FlatList,TouchableOpacity,Modal,TextInput, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {Card,Title,FAB} from 'react-native-paper';
import {MaterialIcons} from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import firebase from '../Database/firebase';
import Loading from '../components/Loading';
import AlertView from "../components/AlertView";
import LottieView from 'lottie-react-native';

const HomeScreen = ({navigation})=>{
  const [modalVisible,setModalVisible]=useState(false);
  const[RequestList,setRequestList]= useState([])
  const[Category,setCategory]=useState('');
  const[loading,setLoading]=useState(true)
  const [data,setData]=React.useState({
      isvalidCategory:true,
      CategoryErrorMsg:'',
      CategoryInput: React.createRef(),
      isLoading:false,
      isEmptyList:false         
  })
  const [alert,setAlert]=React.useState({
      alertVisible:false,
      Title:'',
      Message:'',
      jsonPath:'',  
  }) 
  const [DeleteModal,setDaleteModal]=useState({
    IsVisible:false,
    Name:'',
    Id:''
  })

  const fetchData=()=>{
    firebase.database().ref('/Category/').once('value').then(function(snapshot) {
      const Data = snapshot.val();
      if(Data){
        var li = []
        snapshot.forEach(function(snapshot){
          console.log(snapshot.key);
          console.log(snapshot.val().Name);
          var temp={CategoryId:snapshot.val().CategoryId,Name:snapshot.val().Name,ID:snapshot.key}
          li.push(temp)
          setLoading(false)
        })
        setRequestList(li)
        console.log(li) 
      }else{
        setData({
          ...data,
          isEmptyList:true
        })
      }
    }); 
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
                      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?
                      'row':'row-reverse'}}>
              <Title style={styles.title}>{item.Name}</Title>
              </View>

              <TouchableOpacity style={styles.EditIconStyle}
                onPress={()=>setDaleteModal({
                  ...DeleteModal,
                  IsVisible:true,
                  Name:item.Name,
                  Id:item.ID
                })}
                >
                <Image 
                    source={require('../assets/DeleteIcon.png')}
                    style={styles.Delete}
                    />
              </TouchableOpacity>
          </View>
        </Card>
    )
  });

  const checkValidCategory=()=>{
    if(Category==''){
        setData({
            ...data,
            isvalidCategory:false,
            CategoryErrorMsg:'يجب إدخال اسم الفئة',
        })
        return false;
    }else{
        setData({
            ...data,
            isvalidCategory:true,
            CategoryErrorMsg:'',
        })
        return true;  
    }
}

const Add=()=>{
    if(checkValidCategory()){
        setData({
            ...data,
            isLoading:true 
        })
        firebase.database().ref("Category").orderByChild("Name")
        .equalTo(Category.toLowerCase()).once("value", snapshot => {
            const Data = snapshot.val();
            // Check if the Category  exist. 
            if (Data) {
                console.log("Category exist!");
                // Check if the Driver doesnt exist.
                setData({
                    ...data,
                    isLoading:false,
                    isvalidCategory:false,
                    CategoryErrorMsg:'الفئة مضافة بالفعل',
                });
            }else{
                firebase.database().ref('Category/').push({
                    Name: Category,
                    CategoryId:firebase.database().ref('Category/').push().getKey()
                }).then((data)=>{
                    //success callback
                    setData({
                        ...data,
                        isLoading:false,
                        isvalidCategory:true,
                        CategoryErrorMsg:'',
                    });
                    setTimeout(()=>{
                        setAlert({
                            ...alert,
                            Title:'',
                            Message:'تمت إضافة الفئة بنجاح',
                            jsonPath:"success",
                            alertVisible:true,
                        });
                        setTimeout(() => {
                            setAlert({
                                ...alert,
                                alertVisible:false,
                            }); 
                            resetData();
                        }, 4000)
                    },400)
                    console.log('data ' , data);
                }).catch((error)=>{
                    //error callback
                    setData({
                        ...data,
                        isLoading:true 
                    })
                    Alert.alert(error.message)
                    console.log('error ' , error)
                })
            }
        });
    }
}

const Delete=(id)=>{
  firebase.database().ref('Category/' + id).remove();
  setDaleteModal({
    ...DeleteModal,
    IsVisible:false
  })
}


const resetData=()=>{
    setData({
        ...data,
        isvalidCategory:true,
        CategoryErrorMsg:'',
        isLoading:false  
    })
    setAlert({
        ...alert,
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',  
    })
    setCategory('')
    setModalVisible(false);
}
    return (
      <View style={styles.container}>
          <View style={styles.fixedHeader} >
              <LinearGradient
                colors={["#809d65","#9cac74"]}
                style={{height:"100%" ,width:"100%"}}> 

                <SafeAreaView>

                  <View style={styles.header}>

                    <TouchableOpacity  
                      onPress={()=>navigation.goBack()}>
                    <Image
                      source={require('../assets/AdminIcons/left-arrow.png')}
                      style={styles.back}
                      resizeMode="stretch"
                    />
                    </TouchableOpacity>

                    <Text style={styles.text_header}>الفـئـــات</Text>

                    <Image
                      source={require('../assets/AdminIcons/HomePageLogo.png')}
                      style={styles.logo}
                      resizeMode="stretch"
                    />

                  </View>

                </SafeAreaView>

              </LinearGradient>

          </View>

          <View style={{flex:8}}>
            {data.isEmptyList? <Title style={{alignItems:'center',alignContent:'center',justifyContent:'center',textAlign:'center',color:'#757575'}}>لا يوجد فئات مدخلة</Title>:
          
            <FlatList
                data={RequestList}
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
                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?
                styles.fabAndroid:styles.fabIOS}
              small={false}
              icon="plus"
              theme={{colors:{accent:"#9cac74"}}} 
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>                   
                        <View style={styles.header2}>
                          <LinearGradient
                            colors={["#809d65","#9cac74"]}
                            style={{height:"100%" ,width:"100%",alignItems:'center',
                            justifyContent:'center',}}> 
                              <MaterialIcons style={Platform.OS === 'android' &&
                                  NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                  NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 
                                  styles.iconAndroid:styles.iconIOS} 
                                  name="cancel" size={32} color="#fff" 
                                  onPress={resetData} 
                              />
                              <Text style={styles.text_header_modal}>إضافة فئة جديدة</Text>
                            </LinearGradient>
                        </View>
                    
                        <Text style={styles.text}>اسم الفئة:</Text>
                            <View style={styles.action}>
                                <TextInput style={styles.textInput} 
                                    label="Name"
                                    placeholder="ادخل اسم الفئة"
                                    autoCapitalize="none"
                                    onChangeText={(val)=>setCategory(val)}
                                    textAlign= 'right'
                                    onEndEditing={() => checkValidCategory()}
                                    ref={data.CategoryInput}
                                >
                                </TextInput>  
                            </View>

                        {data.isvalidCategory ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                                <Text style={styles.errorMsg}>{data.CategoryErrorMsg}</Text>
                            </Animatable.View>
                        }

                        {data.isLoading? 
                            <Loading></Loading>
                            :  
                            <View style={{alignItems:'center',justifyContent:'center',margin:10}}>
                              <TouchableOpacity 
                                  style={styles.AddButton}
                                  onPress={Add}>
                                  <LinearGradient
                                      colors={["#809d65","#9cac74"]}
                                      style={styles.Add}>
                                      <Text style={styles.okStyle}>اضافة</Text>
                                  </LinearGradient>
                              </TouchableOpacity>
                            </View>
                        }
                    </View>
                
                </View>

                {alert.alertVisible?
                    <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
                    :
                    null
                } 
            </Modal>

            <Modal
                  animationType="slide"
                  transparent={true}
                  visible={DeleteModal.IsVisible}>
                      <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                              <Text style={styles.modalText}>حذف فئـة</Text>
                              <View style={{width:'100%',height:0.5,backgroundColor:"#757575",marginVertical:15}}></View>

                              <View style={{justifyContent:'center',alignItems:'center'}}>
                                <View style={{width:'50%',height:100,justifyContent:'center',alignItems:'center'}}>  
                                  <LottieView source={require('../assets/Warning.json')}autoPlay loop/>                           
                                </View>
                              </View>

                              <Text style={styles.textStyle}>هل انت متاكد من حذف فئـة ال{DeleteModal.Name}</Text>
                              <View style={{flexDirection:Platform.OS === 'android' &&
                                      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?'row':'row-reverse',alignItems:'center',justifyContent:'center'}}>
                                  <TouchableOpacity 
                                      style={styles.okButton}
                                      onPress={()=>{
                                      Delete(DeleteModal.Id)
                                  }}>
                                    <Text style={styles.okStyle}>نعم</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity 
                                      style={styles.cancelButton}
                                      onPress={()=>{
                                          setDaleteModal({
                                            ...DeleteModal,
                                            IsVisible:false
                                          })
                                      }}>
                                          <Text style={styles.okStyle}>إلغاء</Text>
                                  </TouchableOpacity>
                                </View>
                          </View>
                      </View>
              </Modal>
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
const height_headerImage = height * 0.10;
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
      marginLeft: 8 ,
      marginRight:8,
      alignItems:'baseline',
      shadowColor :'#F1F1EA',  
    },
    text_header: {
      color: '#ffff',
      fontWeight: 'bold',
      fontSize: 22,
      textAlign: 'center',
      marginLeft:25,
    },
    logo: {
      width: width_logo ,
      height: height_logo,
    },
    header:{
      width: '100%',
      height: 80,
      flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop:Platform.OS === 'android'? 0 : -10
    },
    cardContent:{
      flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row' : 'row-reverse',
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
        right: 0,
        bottom: 0,
    },
    fabAndroid: {
        position: 'absolute',
        margin: 16,
        left: 0,
        bottom: 0,
    },
    centeredView:{
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        flex:1,
    },
    modalView:{
        width:'80%',
        margin:10,
        backgroundColor:"#fff",
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
        backgroundColor:'#558B2F',
        borderRadius:5,
        padding:10,
        elevation:2,
        width:'30%',
        margin:15,
    },
    cancelButton:{
      backgroundColor:'#B71C1C',
      borderRadius:5,
      padding:10,
      elevation:2,
      width:'30%',
      margin:15,
    },
    action: {
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row' : 'row-reverse',
        marginTop: 10,
        borderWidth:2,
        borderColor:'#f2f2f2',
        padding: 10,
        margin:10,
        borderRadius:5
    },
    text: {
        color: '#9E9D24',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
        marginRight:'5%',
        marginLeft:'5%',
        marginTop:10
    },
    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : 0,
        paddingLeft: 5,
        color: '#05375a',
        textAlign: 'right',
        marginRight:5  
    },
    headerImage: {
        width:'100%' ,
        height: height_headerImage,
        borderTopLeftRadius:5,
        borderTopRightRadius:5
    },
    header2:{
        flexDirection:'row',
        backgroundColor:'red',
        height:60,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        overflow: 'hidden',
    },
    iconIOS:{
        position:'absolute',
        left:15,
    },
    iconAndroid:{
        position:'absolute',
        right:15,
    },
    text_header_modal:{
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
        paddingRight:20
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold' ,
      textAlign :'right',
      marginRight:15,
      marginLeft:15
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
    AddButton:{
      borderRadius:5,
      elevation:2,
      width:'50%',
  },
  Add: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },   
});
export default HomeScreen;
