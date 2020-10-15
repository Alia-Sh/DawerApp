import React, {useState, useEffect} from 'react';
import { StyleSheet,
   Text,
   View, 
   Platform, 
   TextInput,
   Alert,
   Dimensions,
   Modal,
   Picker,
   NativeModules,
   Image
  } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {Button} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Animatable from 'react-native-animatable';
import firebase from '../Database/firebase';
import AlertView from "../components/AlertView";
import Loading from '../components/Loading';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {Card,Title,FAB} from 'react-native-paper';
import {FontAwesome5} from '@expo/vector-icons';



  const AddFacility = ({navigation,props}) => {

    const {height} = Dimensions.get("screen");
    const {width} = Dimensions.get("screen");

    const [Name, setName] = useState("");
    const [Location, setLocation] = useState("");
    const [Logo, setLogo] = useState("");
    const [Materials, setMaterials] = useState([]); // array since it might accept >1 materials
    const [WorkingH, setWorkingH] = useState([]); // range of time
    const [Contact, setContact] = useState([]); // array because might have phone, webiste, email..?? or separate them

    const [data, setData]=React.useState({
        isValidName: true,
        LocationExist: true,
        isValidMaterials: true,
        isValidWorkingH: true,
        isValidContact: true,
        EroorMessage:'',
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




    const selectImage = async () => {
        try {
          let response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
          })
          if (!response.cancelled) {
            setLogo(response.uri);
          }
        } catch (error) {
          console.log(error);
          Alert.alert(error.message);
        }
      }

      const uploadImage= async (uri,imageName)=>{
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("Facilities/"+imageName); //new file in storage
        return ref.put(blob);
    }

    const resetData=()=>{
        
        setLogo("");
        setName("");
        setLocation("");

        setData({
            ...data,
            isValidName:true,
            LocationExist:true,          
        });
        setAlert({
            ...alert,
            alertVisible:false,
            Title:'',
            Message:'',
            jsonPath:'',
            isLoading:false,           
        })
        navigation.navigate("FacilityHome");

    }


    return(
        <View style={styles.container}>
            <View style={styles.fixedHeader}>
                <LinearGradient
                    colors={["#809d65","#9cac74"]}
                    style={{height:"100%" ,width:"100%"}}> 

                    <SafeAreaView>

                    <View>
                        <Text style={styles.text_header}>إضافة منشأة جديدة</Text>
                        <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={styles.icon} onPress={resetData}/>
                    </View>

                    </SafeAreaView>

                </LinearGradient>
            </View>


            {/* START PAGE CONTENT */}
            <View style={{flex:8}}>

                 <View>
                    <View style={{alignItems:"center"}}>
                            <Image style={styles.Logo_image} 
                            source={Logo==""?require('../assets/AdminIcons/FacilityIcon.jpg'):{uri:Logo}}
                            />
                        <FAB  
                            onPress={() =>selectImage ()}
                            small
                            icon="plus"
                            theme={{colors:{accent:"#9cac74"}}}
                            style={Platform.OS === 'android'?styles.FABStyleAndroid:styles.FABStyleIOS}/>
                    </View>


                    <View>
                        <Text style={styles.text_footer}>اسم المنشأة:</Text>
                        <View style={styles.action}>
                            <TextInput style={styles.textInput} 
                                label="Name"
                                placeholder="ادخل اسم المنشأة"
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
                            <Text style={styles.errorMsg}>يجب ادخال اسم المنشأة</Text>
                            </Animatable.View>
                        }

                    </View>

                    <View>
                        <Text style={styles.text_footer}>الموقع:</Text>
                        <View style={styles.action}>
                            <Text style={styles.Location}>{Location}</Text>
                            <Feather style={styles.feather} onPress={()=> navigation.navigate("GoogleMap")}
                            name="chevron-left"
                            size={25}/>  
                        </View>

                        {data.LocationExist ? 
                            null : (
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب إدخال الموقع</Text>
                            </Animatable.View>
                            ) }
                    </View>

                </View>

                    <View style={styles.button}> 
                        {alert.isLoading? <Loading></Loading>:  
                            <Button 
                                mode="contained" 
                                color="#809d65" 
                                dark={true} 
                                compact={true} 
                                style={{width:100}} 
                                onPress={AddFacility}>
                                <Text style={{color:"#fff",fontSize:18,fontWeight: 'bold'}}>إضافة</Text>
                            </Button>
                        }
                    </View>     
            </View>   
     
        </View>  

                        
      );
    }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
      },  
      Logo_image:{
        marginTop:8,
        width:120,
        height:120,
      },
      
      fixedHeader :{
        flex:1,
        backgroundColor :'#809d65',
        overflow: 'hidden',
      },
      text_header: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginTop:20
      },
      headerText:{
        fontWeight:'bold',
        fontSize: 18,      
        letterSpacing: 1, 
        textAlign:'center',
        color: '#212121'
      },
      icon:{
        position: 'absolute',
        marginTop:20,
        right: 16
      },
      action: {
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingRight:3,
        paddingLeft:3
      },  
      feather: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        color: '#9E9D24',
        textAlign: 'left'
      },
      Location: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        color: '#05375a',
        flex: 5,
        paddingLeft: 50
      },
      errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        paddingRight:20
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold' ,
        textAlign :'right',
        marginRight:15,
        marginLeft:15
      },
      text_footer: {
        color: '#9E9D24',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        marginRight:'5%',
        marginTop:10,
     },
     textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        textAlign: 'right',
        marginRight:'3%'  
    },
     FABStyleAndroid:{
        marginLeft:90,
        marginTop:-23,
        flexDirection:'row-reverse' 
    },
    FABStyleIOS:{
        marginLeft:90,
        marginTop:-23,
    },
      button:{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }
  });
  export default AddFacility;
  