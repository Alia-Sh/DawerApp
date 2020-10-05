import React,{ useState ,useEffect }  from 'react';
import { StyleSheet,
    Text,
    View,
    // Button,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    FlatList,
    NativeModules,
    Platform, 
    TextInput,
    Modal,
    Picker,
    ActivityIndicator,
} from 'react-native';
import firebase from '../Database/firebase';
import { LinearGradient } from 'expo-linear-gradient'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '../components/Loading';
import {FAB} from 'react-native-paper';
// import {MaterialIcons} from '@expo/vector-icons';
import {Button}from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import AlertView from "../components/AlertView";



const Item = ({ item, onPress, style }) => (
  
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View  style={{flexDirection :'row-reverse',height:45}}>
    <Image source={require('../assets/DriverProfile2.png')} 
     style={{height:60 ,width:60,marginRight:-8,marginTop:-8}}
    />
    <View >
    <Text style={styles.title}>{item.name}</Text>
    <Text style={styles.user}>@{item.username}</Text>
    </View>
    </View>
  </TouchableOpacity>
 
);

const HomeScreen = ({navigation})=>{
  
  

  const [DriverList,setDriverList] = useState([])
  const[loading,setLoading]=useState(true)
  
//backend
const back=()=>{
  
      navigation.navigate("AdminHomePage")
   
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
  const backgroundColor = item.key === selectedId ? "#EDEEEC" : "#FAFAF7";

  return (
    <Item
      item={item}
      onPress={() => setSelectedId(item.key)}
      style={{ backgroundColor }}
    />
  );
};

const [modal,setModal] = useState(false)
const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const [selectedValue, setSelectedValue] = useState("شمال الرياض");
const [Name, setName] = useState("");
const [UserName, setUserName] = useState("");
const [Email, setEmail] = useState("");
const [Phone, setPhone] = useState("");
const [Password, setPassword] = useState("");
const[data,setData]=React.useState({
    isValidName:true,
    isValidUserName:true,
    isValidEmail:true,
    isValidPhone:true,
    isValidPassword:true,
    EroorMessage:'',
    EmailErrorMessage:'',
    PhoneErrorMessage:'',
});
const [alert,setAlert]=React.useState({
    alertVisible:false,
    Title:'',
    Message:'',
    jsonPath:'',
    isLoading:false,    
})

const checkValidName=()=>{
    if(Name==""){
        setData({
            ...data,
            isValidName:false,
        });
        return false; 
    }else{
        if(!data.isValidName){   
            setData({
                ...data,
                isValidName:true,
            });                 
        }
        return true;         
    }
}

const checkValidUserName=()=>{
    if(UserName==""){
        setData({
            ...data,
            isValidUserName:false,
        });
        return false; 
    }else{
        if(!data.isValidUserName){   
            setData({
                ...data,
                isValidUserName:true,
            });                 
        }
        return true;         
    }
}

const checkValidEmail=()=>{
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(Email==""){
        setData({
            ...data,
            isValidEmail:false,
            EmailErrorMessage:'يجب ادخال البريد الإلكتروني'
        });
        return false; 
    }else if(reg.test(Email) === false){
        setData({
            ...data,
            isValidEmail:false,
            EmailErrorMessage:'يحب ادخال الايميل بالشكل الصحيح'
        });
        return false; 
    }else{
        if(!data.isValidEmail){   
            setData({
                ...data,
                isValidEmail:true,
                EmailErrorMessage:''
            });                 
        }
        return true;         
    }
}

const checkValidPhone=()=>{
    if(Phone==""){
        setData({
            ...data,
            isValidPhone:false,
            PhoneErrorMessage:'يجب ادخال رقم الهاتف'
        });
        return false; 
    }else if(Phone.length<10){
        setData({
            ...data,
            isValidPhone:false,
            PhoneErrorMessage:'يجب ان يتكون رقم الهاتف من ١٠ ارقام'
        });
        return false;       
    }else{
        if(!data.isValidPhone){   
            setData({
                ...data,
                isValidPhone:true,
                PhoneErrorMessage:''
            });                 
        }
        return true;         
    }
}

const checkValidPassword=()=>{
    if(Password==""){
        setData({
            ...data,
            isValidPassword:false,
            EroorMessage:'يجب ادخال كلمة المرور'
        });
        return false; 
    }else if(Password.length<8){
            setData({
                ...data,
                isValidPassword:false,
                EroorMessage:'يجب أن تكون كلمة المرور ٨ أحرف على الاقل'                 
            });                               
        return false;         
    }else{
        if(!data.isValidPassword){
            setData({
                ...data,
                isValidPassword:true,
                EroorMessage:''                 
            });                             
        }
        return true  
    }
}
    
const AddDriver=()=>{
    if(checkValidName() && checkValidUserName() && checkValidEmail() && checkValidPhone() && checkValidPassword()){ 
        setAlert({
            ...alert,
            isLoading:true
        })         
        firebase.database().ref("DeliveryDriver").orderByChild("UserName")
        .equalTo(UserName.toLowerCase()).once("value", snapshot => {
            const userData = snapshot.val();  
            if (userData) { 
                setAlert({
                    isLoading:false
                });
                setTimeout(()=>{
                    setAlert({
                        ...alert,
                        Title:'اسم المستخدم',
                        Message:'اسم المستخدم قيد الإستخدام بالفعل من قبل حساب آخر',
                        jsonPath:"Error",
                        alertVisible:true,
                        isLoading:false
                    });
                    setTimeout(() => {
                        setAlert({
                            ...alert,
                            alertVisible:false,
                        });
                    }, 4000)
                },400)
            }else{
                firebase.auth().createUserWithEmailAndPassword(Email, Password).then((user)=>{
                    if (firebase.auth().currentUser) {
                        var userId = firebase.auth().currentUser.uid;
                        if (userId) {
                            firebase.database().ref('DeliveryDriver/' + userId).set({
                            Email:Email.toLowerCase(),
                            Name:Name,
                            Password:Password,
                            PhoneNumber:Phone,
                            UserName:UserName.toLowerCase(),
                            DeliveryArea:selectedValue
                            });
                           setAlert({
                                isLoading:false
                            });
                            setTimeout(()=>{
                                setAlert({
                                    ...alert,
                                    Title:'',
                                    Message:'تم إضافة السائق بنجاح',
                                    jsonPath:"success",
                                    alertVisible:true,
                                    isLoading:false
                                });
                                setTimeout(() => {
                                    setAlert({
                                        ...alert,
                                        alertVisible:false,
                                    });
                                    resetData();
                                }, 4000)
                            },400)

                        }else{
                            setAlert({
                                isLoading:false
                            });
                            setTimeout(()=>{
                                setAlert({
                                    ...alert,
                                    Title:'',
                                    Message:'لم يتم إضافة السائق بنجاح',
                                    jsonPath:"Error",
                                    alertVisible:true,
                                    isLoading:false
                                });
                                setTimeout(() => {
                                    setAlert({
                                        ...alert,
                                        alertVisible:false,
                                    });
                                }, 4000)
                            },400)
                        }
                    }
                    }).catch(function(error) {                           
                        console.log(error.message);
                        if(error.message==="The email address is already in use by another account."){
                            setAlert({
                                isLoading:false
                            });
                            setTimeout(()=>{
                                setAlert({
                                    ...alert,
                                    Title:'البريد الإلكتروني',
                                    Message:'عنوان البريد الإلكتروني قيد الإستخدام بالفعل من قبل حساب آخر',
                                    jsonPath:"Error",
                                    alertVisible:true,
                                    isLoading:false
                                });
                                setTimeout(() => {
                                    setAlert({
                                        ...alert,
                                        alertVisible:false,
                                    });
                                }, 4000)
                            },400)
                        }else{
                        Alert.alert(error.message);}
                    });
            }                   
        });
    }
}

const resetData=()=>{
    setName("");
    setUserName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setSelectedValue("شمال الرياض")
    setData({
        ...data,
        isValidName:true,
        isValidUserName:true,
        isValidEmail:true,
        isValidPhone:true,
        isValidPassword:true,
        EroorMessage:'',
        EmailErrorMessage:'',
        PhoneErrorMessage:'',
    });
    setModal(false);
    setAlert({
        ...alert,
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',
        isLoading:false,           
    })
}
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
        data={DriverList}
        renderItem={renderItem}
        keyExtractor={(item)=>item.key}
        extraData={selectedId}
        onRefresh={()=>fetchData()}
        refreshing={loading}
      />
            {/* end drivers list */}
        <FAB  
        onPress={() => setModal(true)}
          style={Platform.OS === 'android' &&
          NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
          NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?
          styles.fabAndroid:styles.fabIOS}
        small={false}
        icon="plus"
        theme={{colors:{accent:"#9cac74"}}} 
      />

      <Modal visible={modal} transparent={true} onRequestClose={()=>{ setModal(false) }}>
                    <KeyboardAwareScrollView>
                        <View backgroundColor= "#000000aa" flex= {1} style={{alignItems:'center',justifyContent:'center'}}>
                            <View backgroundColor ='#ffffff' marginTop= {40} marginBottom={100} borderRadius={30} width={width*.90} height={height*.90} >
                                <View style={styles.header}>
                                    <MaterialIcons style={Platform.OS === 'android'? styles.iconAndroid:styles.iconIOS} name="cancel" size={32} color="#fff"  onPress={resetData} />
                                    <Text style={styles.text_header_modal}>إضافة سائق توصيل</Text>
                                </View>

                                <View>
                                    <Text style={styles.text_footer}>اسم السائق:</Text>
                                    <View style={styles.action}>
                                        <TextInput style={styles.textInput} 
                                            label="Name"
                                            placeholder="ادخل اسم السائق"
                                            autoCapitalize="none"
                                            onChangeText={(val)=>setName(val)}
                                            textAlign= 'right'
                                            onEndEditing={() => checkValidName()}
                                            >
                                        </TextInput>  
                                    </View>

                                    {data.isValidName ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                        <Text style={styles.errorMsg}>يجب ادخال اسم السائق</Text>
                                        </Animatable.View>
                                    }

                                    <Text style={styles.text_footer}>اسم المستخدم:</Text>
                                    <View style={styles.action}>
                                        <TextInput style={styles.textInput} 
                                            label="UserName"
                                            placeholder="ادخل اسم المستخدم"
                                            autoCapitalize="none"
                                            onChangeText={(val)=>setUserName(val)}
                                            textAlign= 'right'
                                            onEndEditing={() => checkValidUserName()}
                                            >
                                        </TextInput>  
                                    </View>

                                    {data.isValidUserName ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                        <Text style={styles.errorMsg}>يجب ادخال اسم المستخدم</Text>
                                        </Animatable.View>
                                    }

                                    <Text style={styles.text_footer}>البريد الإلكتروني:</Text>
                                    <View style={styles.action}>
                                        <TextInput style={styles.textInput} 
                                            label="Email"
                                            placeholder="ادخل البريد الإلكتروني"
                                            autoCapitalize="none"
                                            onChangeText={(val)=>setEmail(val)}
                                            textAlign= 'right'
                                            onEndEditing={() => checkValidEmail()}
                                            >
                                        </TextInput>  
                                    </View>

                                    {data.isValidEmail ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                        <Text style={styles.errorMsg}>{data.EmailErrorMessage}</Text>
                                        </Animatable.View>
                                    }

                                    <Text style={styles.text_footer}> رقم الهاتف:</Text>
                                    <View style={styles.action}>
                                        <TextInput style={styles.textInput} 
                                            label="Phone"
                                            placeholder="ادخل رقم الهاتف"
                                            autoCapitalize="none"
                                            onChangeText={(val)=>setPhone(val)}
                                            textAlign= 'right'
                                            onEndEditing={() => checkValidPhone()}
                                            keyboardType="number-pad" //number Input
                                            maxLength={10}
                                            >
                                        </TextInput>  
                                    </View>

                                    {data.isValidPhone ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                        <Text style={styles.errorMsg}>{data.PhoneErrorMessage}</Text>
                                        </Animatable.View>
                                    }

                                    <Text style={styles.text_footer}>كلمة المرور:</Text>
                                    <View style={styles.action}>
                                        <TextInput style={styles.textInput} 
                                            label="Password"
                                            placeholder="ادخل كلمة المرور"
                                            autoCapitalize="none"
                                            onChangeText={(val)=>setPassword(val)}
                                            textAlign= 'right'
                                            onEndEditing={() => checkValidPassword()}
                                            >
                                        </TextInput>  
                                    </View>

                                    {data.isValidPassword ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                        <Text style={styles.errorMsg}>{data.EroorMessage}</Text>
                                        </Animatable.View>
                                    }

                                    <Text style={styles.text_footer}>منطقة التوصيل:</Text>
                                    <Picker
                                        selectedValue={selectedValue}
                                        style={Platform.OS === 'android'? styles.pickerStyleAndroid:styles.pickerStyleIOS}
                                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
                                        <Picker.Item label="شمال الرياض" value="شمال الرياض" />
                                        <Picker.Item label="شرق الرياض" value="شرق الرياض" />
                                        <Picker.Item label="غرب الرياض" value="غرب الرياض" />
                                        <Picker.Item label="جنوب الرياض" value="جنوب الرياض" />
                                    </Picker>      
                                </View>

                                <View style={styles.button}> 
                                    {alert.isLoading? <Loading></Loading>:  
                                        <Button 
                                            mode="contained" 
                                            color="#809d65" 
                                            dark={true} 
                                            compact={true} 
                                            style={{width:100}} 
                                            onPress={AddDriver}>
                                            <Text style={{color:"#fff",fontSize:18,fontWeight: 'bold'}}>إضافة</Text>
                                        </Button>
                                    }
                                </View>          
                            </View>
                        </View>  
                    </KeyboardAwareScrollView> 

                    {alert.alertVisible?
                        <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
                    :
                        null
                    }                   
                </Modal>


        
    
                
        </View>
      );
}

// here styles
const {height} = Dimensions.get("screen");
const height_logo = height* 0.17;
const height_logout = height* 0.04;
const marginTopSpace = height * 0.020;


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
    fontWeight: 'bold' ,
    textAlign :'right',
    marginRight:30,
    marginTop:10,
    
   
  },
  user: {
    fontSize: 12,
    //fontWeight: 'bold' ,
    textAlign :'right',
    marginRight:30,
    marginTop:5,
    color :'#ADADAD',
    
   
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
header:{
  height:"10%",
  backgroundColor:"#809d65",
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  alignItems:'center',
  justifyContent:'center',
  flexDirection:'row',
},
iconIOS:{
  position:'absolute',
  left:15
},
iconAndroid:{
  position:'absolute',
  right:15
},
text_header_modal:{
  color: '#ffff',
  fontWeight: 'bold',
  fontSize: 20,
  textAlign: 'center',
},
text_footer: {
  color: '#9E9D24',
  fontSize: 18,
  textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
  marginRight:'5%',
  marginTop:marginTopSpace
},
textInput: {
  marginTop: Platform.OS === 'ios' ? 0 : -12,
  paddingLeft: 10,
  color: '#05375a',
  textAlign: 'right',
  marginRight:'8%'  
},
action: {
  flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row' : 'row-reverse',
  marginTop: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#f2f2f2',
  paddingBottom: 10,
},
errorMsg: {
  color: '#FF0000',
  fontSize: 14,
  textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
  paddingRight:20
},
pickerStyleIOS:{
  height: 50,
  width: '100%',
  position: 'absolute', 
  bottom:0
},
pickerStyleAndroid:{
  height: 50,
  width: '100%',
},
button:{
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: -10,
  justifyContent: 'center',
  alignItems: 'center',
}

  //end flat list
  });
export default HomeScreen;
