import React,{useState,useEffect} from 'react';
import {Modal,StyleSheet,Text,TouchableOpacity,View,Image,Dimensions,NativeModules,TextInput, Alert,FlatList,Platform,Picker} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {MaterialIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import {Card} from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import firebase from '../Database/firebase';
import AlertView from "../components/AlertView";
import Loading from '../components/Loading';

 const NewRequestModal=(props)=>{
    const[CategoryList,setCategoryList]= useState([{Name:'زجاج'}])
    const [alertVisible,setAlertVisible]= useState(true)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [RequestList,setRequestList]= useState([])
    const [Material,setMaterial]=useState('');
    const [Quantity,setQantity]=useState('');
    const [counter,setCounter]=useState(0);
    const [id,setID]=useState('');
    const [Location,setLocation] = useState('')
    const [DateAndTime,setDateAndTime]= useState('');
    const [selectedValue, setSelectedValue] = useState("زجاج");

    const [data,setData]=React.useState({
        isvalidMaterial:true,
        isvalidQuantity:true,
        MaterialErrorMsg:'',
        QuantityErrorMsg:'',
        MaterialInput: React.createRef(),
        QuantityInput: React.createRef(),
        DateAndTimeInput: React.createRef(),
        isVisibleList:false,
        isEdit:false, 
        isEmptyList:false,
        isValidDateAndTime:true,
        DateAndTimeErrorMsg:'',
        isLoading:false,  
        isDateAndTimeStep:false,
        isDisplayRequests:false      
    });
    var userId = firebase.auth().currentUser.uid;
    var query2 = firebase.database().ref('User/' + userId+'/Location');
    query2.once("value").then(function(result) {
        const userData = result.val();
        setLocation(userData.address);
    });

    const [alert,setAlert]=React.useState({
        alertVisible:false,
        Title:'',
        Message:'',
        jsonPath:'',  
    })

    const selectImage = async () => {
        try {
          let response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
          })
          if (!response.cancelled) {
              //Here is the classifier
          }
        } catch (error) {
          console.log(error);
          Alert.alert(error.message);
        }
      }

    const checkMaterial=()=>{
        if(Material==''){
            setData({
                ...data,
                isvalidMaterial:false,
                MaterialErrorMsg:'يجب إدخال نوع المادة' 
            })
            return false
        }else{
            setData({
                ...data,
                isvalidMaterial:true,
                MaterialErrorMsg:'' 
            })
            return true
        }
    }

    const checkQuantity=()=>{
        if(Quantity==''){
            setData({
                ...data,
                isvalidQuantity:false,
                QuantityErrorMsg:'يجب إدخال كمية المادة' 
            })
            return false
        }else{
            setData({
                ...data,
                isvalidQuantity:true,
                QuantityErrorMsg:'' 
            })
            return true
        }
    }

    const checkDateAndTime=()=>{
        if(DateAndTime==''){
            setData({
                ...data,
                isValidDateAndTime:false,
                DateAndTimeErrorMsg:'يجب إدخال تاريخ و وقت الاستلام' 
            })
            return false         
        }else{
            setData({
                ...data,
                isValidDateAndTime:true,
                DateAndTimeErrorMsg:'' 
            })
            return true
        }
    }

    const ResetField=()=>{
        if(checkMaterial() && checkQuantity()){
            // data.MaterialInput.current.clear();
            data.QuantityInput.current.clear();
            // data.DateAndTimeInput.current.clear();
            setMaterial(CategoryList[0].Name);
            setQantity('');
            // setDateAndTime('')
        }
    }

    const addRequest=()=>{
        if(checkMaterial() && checkQuantity()){
        var temp={id:counter,material:Material,Quantity:Quantity}
        RequestList.push(temp)
        setCounter(counter+1);
        ResetField();
        setData({
            ...data,
            isEmptyList:false
        })
        }
    }

    const UpdateRequest=(id,Material,Quantity)=>{
        if(checkMaterial() && checkQuantity()){
        for (var i in RequestList) {
            if (RequestList[i].id == id) {
                RequestList[i].material = Material;
                RequestList[i].Quantity = Quantity;
               break; //Stop this loop, we found it!
            }
        }
      
        ResetField();
        setData({
            ...data,
            isVisibleList:true,
            isEdit:false
        })
    }
        
}

    const renderList = ((item)=>{
        return(
            <Card 
            >
            <View style={[styles.cardView,{
                        flexDirection:Platform.OS === 'android' && 
                        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                        'row':'row-reverse',
                        justifyContent:'space-between',}]}>
                <View>
                    <View style={{flexDirection:'row-reverse'}}>
                    <Text style={styles.text}>نوع المادة:</Text>
                     <Text style={styles.Text}>{item.material}</Text>
                     </View>
                     <View style={{flexDirection:'row-reverse'}}>
                     <Text style={styles.text}> الكمية:</Text>
                     <Text style={styles.Text}>{item.Quantity}</Text>
                     </View>
                </View>

                <View style={{alignItems:'center',justifyContent:'space-between'}}>
                     <TouchableOpacity style={styles.EditIconStyle}
                     onPress={()=>EditRequest(item)}>
                     <Image 
                        source={require('../assets/EditIcon.png')}
                        style={styles.Edit}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.EditIconStyle}
                     onPress={()=>DeleteRequest(item.id)}>
                     <Image 
                        source={require('../assets/DeleteIcon.png')}
                        style={styles.Edit}
                        />
                    </TouchableOpacity>

                </View>
             </View>
        </Card>
        )

    })

    const renderRequest = ((item)=>{
        return(
            <Card>
                <View style={styles.cardView}>
                    <View style={{flexDirection:Platform.OS === 'android' &&
                                        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                        'row':'row-reverse'}}>
                    <Text style={styles.text}>نوع المادة:</Text>
                    <Text style={styles.Text}>{item.material}</Text>
                    </View>
                    <View style={{flexDirection:Platform.OS === 'android' &&
                                        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                        'row':'row-reverse'}}>
                    <Text style={styles.text}> الكمية:</Text>
                    <Text style={styles.Text}>{item.Quantity}</Text>
                    </View>
                    </View>
            </Card>
        )

    })

    const EditRequest=(item)=>{
        setData({
            ...data,
            isVisibleList:false,
            isEdit:true
        })
        setMaterial(item.material);
        setQantity(item.Quantity)
        // setDateAndTime(item.DateAndTime)
        setID(item.id)
    }

    const DisplayMaterials=()=>{
        // addRequest();
     if(RequestList.length==0)  {
      setData({
          ...data,
          isEmptyList:true,
          
          isvalidMaterial:true,
          isvalidQuantity:true,
          isVisibleList:false,
          isEdit:false, 
          isValidDateAndTime:true,
          MaterialErrorMsg:'',
          QuantityErrorMsg:'',
          DateAndTimeErrorMsg:'',   

      })   
     }else{
       setData({
           ...data,
           isVisibleList:true,
           isEmptyList:false,

           isvalidMaterial:true,
           isvalidQuantity:true,
           isEdit:false, 
           isValidDateAndTime:true,
           MaterialErrorMsg:'',
           QuantityErrorMsg:'',
           DateAndTimeErrorMsg:'',
       })  
     } 
    }


    const Send=()=>{
        setData({
            ...data,
            isLoading:true 
        })
        // for (var i in RequestList) {
            var RequestId = firebase.database().ref('Category/').push().getKey();
            firebase.database().ref('/PickupRequest/'+userId+'/DeliveryDriverId/'+RequestId).set({
                DateAndTime:DateAndTime,
                Status:'Pending',
                Location:Location,
                TimeStamp: firebase.database.ServerValue.TIMESTAMP,
            }).then((data)=>{
                AddMaterialsToDatabase(RequestId);
            }).catch((error)=>{
                // error callback
                setData({
                    ...data,
                    isLoading:false 
                })
                Alert.alert(error.message)
                console.log('error ' , error)
            })
        // }
    }

    const AddMaterialsToDatabase=(RequestId)=>{
        for (var i in RequestList) {
        firebase.database().ref('/Material/'+RequestId).push({
            MaterialType:RequestList[i].material,
            Quantity:RequestList[i].Quantity,
        }).then(()=>{
        //success callback
        setData({
            ...data,
            isLoading:false,
        });
        setTimeout(()=>{
            setAlert({
                ...alert,
                Title:'',
                Message:'تمت إرسال الطلب بنجاح',
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
        }).catch(()=>{
            //Error callback
            setData({
                ...data,
                isLoading:false,
            });
            setTimeout(()=>{
                setAlert({
                    ...alert,
                    Title:'',
                    Message:'لم يتم إرسال الطلب ',
                    jsonPath:"Error",
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
        })
    }
    }

    const DeleteRequest=(id)=>{
        setRequestList(RequestList.filter(item => item.id != id))
        setData({
            ...data,
            isVisibleList:true,
            isEdit:false
        })
    }

    const DateAndTimeStep=()=>{
        // addRequest();
        if(RequestList.length==0)  {
        setData({
            ...data,
            isEmptyList:true
        })
        }else{
            setData({
                ...data,
                isEmptyList:false,
                isDateAndTimeStep:true,
                isVisibleList:false,//if from edit list to date and time step
                isEdit:false//if back in edit
            })
        }
    }

    const DisplayRequests=()=>{
        if(RequestList.length!=0 && checkDateAndTime()){
          setData({
              ...data,
              isDisplayRequests:true
          })  
        }
    }

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (datetime) => {
        console.warn("A date has been picked: ", datetime);
        // setDateAndTime(moment(datetime).format('MMM, Do YYY HH:mm'))
        setDateAndTime(moment(datetime).format('LLLL'))
        hideDatePicker();
    };

    const resetData=()=>{
        setAlertVisible(false)
        setDatePickerVisibility(false);
        setRequestList([])
        setMaterial(CategoryList[0].Name);
        setQantity('');
        setCounter(0);
        setID('');
        setDateAndTime('');
        setData({
            isvalidMaterial:true,
            isvalidQuantity:true,
            MaterialErrorMsg:'',
            QuantityErrorMsg:'',
            isVisibleList:false,
            isEdit:false, 
            isEmptyList:false,
            isValidDateAndTime:true,
            DateAndTimeErrorMsg:'',        
        });
        props.setAlertVisible(false);
    }

    const goBackFromEdit=()=>{
        setData({
            ...data,
            isVisibleList:false,
            isEdit:false})
            setMaterial(CategoryList[0].Name);
            setQantity('');
    }
    
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
            //   setLoading(false)
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
        setTimeout(() => {
            setMaterial(CategoryList[0].Name);
            console.log('Material');
            console.log(Material);
        }, 400)
    },[])
    
return (
    
<View style={styles.container}>   
    <Modal visible={alertVisible} transparent={true} onRequestClose={()=>{ setAlertVisible(false) }}>
    
            <View backgroundColor= "#000000aa" flex= {1} style={{alignItems:'center',justifyContent:'center'}} >
                <View backgroundColor='#f6f6f7' marginTop= {80} marginBottom={80} flex= {1}>
                    <Image 
                        source={require('../assets/RequestHeader.png')}
                        style={styles.headerImage}
                        resizeMode="stretch"/>

                    <View style={styles.header}>
                        <MaterialIcons style={Platform.OS === 'android'? styles.iconAndroid:styles.iconIOS} name="cancel" size={32} color="#fff" 
                         onPress={resetData} 
                         />
                        <Text style={styles.text_header_modal}>إنشاء طلب جديد</Text>
                    </View>

                    {data.isVisibleList?
                        <View style={{flex:1}}>
                            <FlatList
                            data={RequestList}
                            renderItem={({item})=>{
                              return renderList(item)
                            }}
                            keyExtractor={item=>`${item.id}`}
                            // onRefresh={()=>fetchData()}
                            // refreshing={loading}
                            />
                            <View style={{flexDirection:Platform.OS === 'android' &&
                                        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                        'row-reverse':'row',
                                        justifyContent:'space-between'
                                        ,margin:15}}>
                                <TouchableOpacity onPress={goBackFromEdit}>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={require('../assets/back.png')}
                                        resizeMethod='scale'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                 onPress={() =>DateAndTimeStep()}
                                >
                                <Image     
                                    style={styles.ImageStyle}
                                    source={require('../assets/send.png')}
                                    />
                                </TouchableOpacity>  
                            </View>
                        </View>
                    :
                    <View style={{flex:1}}>
                        {data.isDisplayRequests?                      
                        <View style={{flex:1}}>
                            <FlatList
                            data={RequestList}
                            renderItem={({item})=>{
                              return renderRequest(item)
                            }}
                            keyExtractor={item=>`${item.id}`}
                            // onRefresh={()=>fetchData()}
                            // refreshing={loading}
                            />
                            <Card>
                                <View style={[styles.cardView,{backgroundColor:'#fff'}]}>
                                    <Text style={styles.text}>تاريخ و وقت الاستلام:</Text>
                                    <Text style={styles.Text}>{DateAndTime}</Text>
                                </View>
                            </Card>
                            <View style={{flexDirection:Platform.OS === 'android' &&
                                        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                        'row-reverse':'row',
                                        justifyContent:'space-between',
                                        margin:15}}>
                                <TouchableOpacity onPress={() =>setData({...data,isDisplayRequests:false})}>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={require('../assets/back.png')}
                                        resizeMethod='scale'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                //  onPress={() =>DateAndTimeStep()}
                                onPress={Send}
                                >
                                <Image     
                                    style={styles.ImageStyle}
                                    source={require('../assets/sendRequest.png')}
                                    />
                                </TouchableOpacity>  
                            </View>
                        </View>
                        :
                    <KeyboardAwareScrollView >
                        <View>
                            
                            {data.isEmptyList ?
                                <Animatable.View animation="fadeInRight" duration={500}>
                                    <Text style={styles.errorMsg2}>يجب ادخال طلب واحد على الاقل</Text>
                                </Animatable.View>
                                :
                                null
                            }

                            {data.isDateAndTimeStep?
                            <View>
                                <Text style={styles.text}>تاريخ و وقت الإستلام:</Text>
                                <View style={{flexDirection:Platform.OS === 'android'?'row':'row-reverse'}}>
                                    <View style={[styles.action,{width:'80%'}]}>
                                        <TextInput style={styles.textInput} 
                                            value={DateAndTime}
                                            label="Date"
                                            placeholder="ادخل تاريخ و وقت الاستلام"
                                            autoCapitalize="none"
                                            onChangeText={(val)=>setDateAndTime(val)}
                                            onFocus={showDatePicker}
                                            textAlign= 'right'
                                            onEndEditing={() => checkDateAndTime()}
                                            ref={data.DateAndTimeInput}
                                            >
                                        </TextInput> 
                                    </View>
                                </View>

                                {data.isValidDateAndTime ?
                                    null 
                                    : 
                                    <Animatable.View animation="fadeInRight" duration={500}>
                                        <Text style={styles.errorMsg}>{data.DateAndTimeErrorMsg}</Text>
                                    </Animatable.View>
                                }
                                </View>
                                :
                                <View>
                                    <Text style={styles.text}>نوع المادة:</Text>
                                    <View style={{flexDirection:Platform.OS === 'android'?'row':'row-reverse',paddingBottom:50}}>
                                        {/* <View style={styles.action}>
                                            <TextInput style={styles.textInput} 
                                                value={Material}
                                                label="Material"
                                                placeholder="ادخل نوع المواد"
                                                autoCapitalize="none"
                                                onChangeText={(val)=>setMaterial(val)}
                                                textAlign= 'right'
                                                onEndEditing={() => checkMaterial()}
                                                ref={data.MaterialInput}
                                                >
                                            </TextInput> 
                                        </View> */}

                                    <Picker
                                        selectedValue={Material}
                                        style={Platform.OS === 'android'? styles.pickerStyleAndroid:styles.pickerStyleIOS}
                                        onValueChange={(itemValue, itemIndex) => setMaterial(itemValue)}>
                                        {/* <Picker.Item label="شمال الرياض" value="شمال الرياض"  enabled={false}/> */}
                                        {/* <Picker.Item label="شرق الرياض" value="شرق الرياض" />
                                        <Picker.Item label="غرب الرياض" value="غرب الرياض" />
                                        <Picker.Item label="جنوب الرياض" value="جنوب الرياض" />  */}
                                        {CategoryList.map(element =>
                                            <Picker.Item label={element.Name} value={element.Name} />
                                        )}

                                    </Picker>  

                                        <View style={{alignItems:'center',justifyContent:'center'}}>
                                            <TouchableOpacity onPress={() =>selectImage ()}>
                                                <Image
                                                    style={{right:30,width:40,height:40}}
                                                    source={require('../assets/Camera.png')}
                                                /> 
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {data.isvalidMaterial ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                            <Text style={styles.errorMsg}>{data.MaterialErrorMsg}</Text>
                                        </Animatable.View>
                                    }

                                    <Text style={styles.text}> الكمية:</Text>
                                    <View style={{flexDirection:Platform.OS === 'android'?'row':'row-reverse'}}>
                                        <View style={styles.action}>
                                            <TextInput style={styles.textInput} 
                                                value={Quantity+""}
                                                label="Quantity"
                                                placeholder="ادخل كمية المادة"
                                                autoCapitalize="none"
                                                onChangeText={(val)=>setQantity(val)}
                                                textAlign= 'right'
                                                onEndEditing={() => checkQuantity()}
                                                // keyboardType="number-pad" //number Input
                                                ref={data.QuantityInput}
                                                >
                                            </TextInput> 
                                        </View> 
                                    </View>
                                    {data.isvalidQuantity ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                            <Text style={styles.errorMsg}>{data.QuantityErrorMsg}</Text>
                                        </Animatable.View>
                                    }

                                </View>
                                }

                            {/* <View>
                                {RequestList.map(request=> (
                                    <View key={request.id}>
                                    <Text>{request.id} {request.material} {request.Quantity} {request.DateAndTime}</Text>
                                    </View>
                                ))}
                            </View> */}

                            {data.isEdit?                   
                                <View style={{flexDirection:Platform.OS === 'android' &&
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                'row-reverse':'row',justifyContent:'space-between',margin:15}}>
                                <TouchableOpacity onPress={() =>setData({...data,isVisibleList:true})}>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={require('../assets/back.png')}
                                        resizeMethod='scale'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => UpdateRequest(id,Material,Quantity)}
                                >
                                <Image     
                                    style={styles.ImageStyle}
                                    source={require('../assets/Save.png')}
                                    />
                                </TouchableOpacity>  
                                </View>
                                :
                            <View>
                                {data.isDateAndTimeStep?
                                <View style={{flexDirection:Platform.OS === 'android' &&
                                            NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                            NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                            NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                            'row-reverse':'row',
                                            justifyContent:'space-between',
                                            margin:15}}>
                                    <TouchableOpacity onPress={() =>setData({...data,isDateAndTimeStep:false})}>
                                        <Image
                                            style={styles.ImageStyle}
                                            source={require('../assets/back.png')}
                                            resizeMethod='scale'
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    // onPress={Send}
                                    onPress={() =>DisplayRequests()}
                                    >
                                <Image     
                                    style={styles.ImageStyle}
                                    source={require('../assets/send.png')}
                                    />
                                    </TouchableOpacity>  
                                    </View>
                                :
                                <View style={{alignItems:Platform.OS === 'android'?'flex-start':'flex-end',padding:20}}>
                                    <TouchableOpacity onPress={() =>addRequest ()}>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={require('../assets/addRequest.png')}    
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() =>DisplayMaterials ()}>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={require('../assets/RequestList.png')}
                                        resizeMethod='scale'
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    onPress={() =>DateAndTimeStep()}
                                    >
                                    <Image     
                                        style={styles.ImageStyle}
                                        source={require('../assets/send.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                }
                            </View>
                            }
                        
                        </View>
                        </KeyboardAwareScrollView>
                    }
                        </View>
                    } 
                </View>               
            </View>

        <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        // mode="date"
        // onConfirm={handleConfirm}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        cancelTextIOS="الغاء"
        confirmTextIOS="تأكيد"
        datePickerModeAndroid={'spinner'}
        is24Hour={false}
        minimumDate={new window.Date()}
        // style ={{backgroundColor: "blue"}}
        />
        {alert.alertVisible?
            <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
            :
            null
        }

        {data.isLoading? 
            <Loading></Loading>

            :  
            null
        }
    </Modal>            
</View>


);
}
const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.09;
const wight_logo = width * 0.90;
const theme= {
    colors:{
        primary: "#C0CA33"
    }
}
const styles=StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    headerImage: {
        width:wight_logo ,
        height: height_logo,
    },
    ImageStyle:{
        width:42,
        height:39,
        margin:5
    },
    header:{
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        top:-45
    },
    text_header_modal:{
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    iconIOS:{
        position:'absolute',
        left:15
    },
    iconAndroid:{
        position:'absolute',
        right:15
    },
    text: {
        color: '#b2860e',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        marginRight:5,
        marginLeft:5,
        margin:10
    },
    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        textAlign: 'right',
        marginRight:10,  
    },
    action: {
        // flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row' : 'row-reverse',
        margin: 10,
        borderColor:'#f2f2f2',
        borderWidth:2,
        borderRadius:5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingTop: 10,
        paddingBottom:10,
        width:'70%'
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
    mycard:{
        // margin:5,// بعدها عن الحواف 
        
    },
    cardView:{
        // flexDirection:Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?'row':'row-reverse',
        // justifyContent:'space-between',
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
    },
    Text:{
        fontSize:18,
        margin:10,
        marginRight:5,
        marginLeft:5,  
        textAlign:Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'left':'right'  
    },
    EditIconStyle:{
        margin:10
    },
    Edit:{
        width:30,
        height:30,
    },
    button:{
        flexDirection:"row",
        justifyContent:"space-around",
        paddingTop:15,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:15
    },
    errorMsg2: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: 'center',
    },
    pickerStyleIOS:{
        height: 50,
        width: '70%',
        // position: 'absolute', 
        // bottom:0,
        top:-80
    },
    pickerStyleAndroid:{
        height: 50,
        width: '100%',
    }   
});

export default NewRequestModal