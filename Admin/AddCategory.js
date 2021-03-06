import React,{useState}from 'react';
import { StyleSheet, 
    Text, 
    View,
    Dimensions,
    NativeModules,
    TouchableOpacity,
    Modal,
    TextInput, 
    Alert} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import firebase from '../Database/firebase';
import Loading from '../components/Loading';
import AlertView from "../components/AlertView";
import { LinearGradient } from 'expo-linear-gradient';

const AddCategory=(props)=>{
    const [alertVisible,setAlertVisible]= useState(true)
    const[Category,setCategory]=useState('');
    const [data,setData]=React.useState({
        isvalidCategory:true,
        CategoryErrorMsg:'',
        CategoryInput: React.createRef(),
        isLoading:false         
    })
    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',  
    })  
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
      

    const AddNewCategory=()=>{
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
                    // Check if the Category doesnt exist.
                    setData({
                        ...data,
                        isLoading:false,
                        isvalidCategory:false,
                        CategoryErrorMsg:'الفئة مضافة بالفعل',
                    });
                }else{
                    firebase.database().ref('Category/').push({
                        Name: Category,
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
                        },500)
                        console.log('data ' , data);
                    }).catch((error)=>{
                        //error callback
                        setData({
                            ...data,
                            isLoading:false 
                        })
                        Alert.alert(error.message)
                        console.log('error ' , error)
                    })
                }
            });
        }
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
        props.setModalVisible(false)
        setAlertVisible(false);
    }

    return (
        <KeyboardAwareScrollView style={{flex:1}}> 
            <Modal
                animationType="slide"
                transparent={true}
                visible={alertVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    
                        <View style={styles.header}>
                        <LinearGradient
                            colors={["#809d65","#9cac74"]}
                            style={{height:"100%" ,width:"100%",alignItems:'center',
                            justifyContent:'center',}}> 
                            <MaterialIcons style={Platform.OS === 'android' &&
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA' ? 
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
                                    // textAlign= 'right'
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
                                    onPress={AddNewCategory}>
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
       </KeyboardAwareScrollView> 
    );
}

const styles=StyleSheet.create({
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
    action: {
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
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
    header:{
        flexDirection:'row',
        backgroundColor:'red',
        height:60,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        overflow: 'hidden',
    },
    iconIOS:{
        position:'absolute',
        right:15
    },
    iconAndroid:{
        position:'absolute',
        left:15
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
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        paddingRight:20
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
export default AddCategory