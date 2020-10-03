import React,{useState} from 'react';
import {Modal,StyleSheet,Text,TouchableOpacity,View,Image,Dimensions,NativeModules,TextInput, Alert,FlatList,Platform} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {MaterialIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import {Card,Button} from 'react-native-paper';
import DateTimePicker from '../components/DateTimePicker'
 const NewRequestModal1=()=>{
    const [alertVisible,setAlertVisible]= useState(true)
    //test data
    const[RequestList,setRequestList]= useState([
        // {id: 1, material: "a string", Quantity: 1},
        // {id: 2, material: "another string", Quantity: 2},
        // {id: 3, material: "a string", Quantity: 3},
        // {id: 4, material: "a string", Quantity: 4},
        // {id: 5, material: "another string", Quantity: 5},
    ])
    const [Material,setMaterial]=useState('');
    const [Quantity,setQantity]=useState('');
    const [data,setData]=React.useState({
        isvalidMaterial:true,
        isvalidQuantity:true,
        MaterialErrorMsg:'',
        QuantityErrorMsg:'',
        MaterialInput: React.createRef(),
        QuantityInput: React.createRef(),
        isVisibleList:false,
        isEdit:false, 
        isEmptyList:false,
        isDateAndTimeStep:false,
        isValidDate:true,
        isValidTime:true,
        DateErrorMsg:'',
        TimeErrorMsg:'',           
    })
    const[counter,setCounter]=useState(0);
    const[id,setID]=useState('');
    const [Date,setDate]= useState('')
    const [Time,setTime]= useState('')
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

    const checkData=()=>{
        if(Date==''){
            setData({
                ...data,
                isValidDate:false,
                DateErrorMsg:'يجب إدخال تاريخ الاستلام' 
            })
            return false
        }else{
            setData({
                ...data,
                isValidDate:true,
                DateErrorMsg:'' 
            })
            return true
        }
    }

    const checkTime=()=>{
        if(Time==''){
            setData({
                ...data,
                isValidTime:false,
                TimeErrorMsg:'يجب إدخال وقت الاستلام' 
            })
            return false
        }else{
            setData({
                ...data,
                isValidTime:true,
                TimeErrorMsg:'' 
            })
            return true
        }
    }

    const ResetFalid=()=>{
        if(checkMaterial() && checkQuantity()){
            data.MaterialInput.current.clear();
            data.QuantityInput.current.clear();
            setMaterial('');
            setQantity('')
        }
    }

    const addRequest=()=>{
        if(checkMaterial() && checkQuantity()){
        var temp={id:counter,material:Material,Quantity:Quantity}
        RequestList.push(temp)
        setCounter(counter+1);
        ResetFalid();
        }
    }

    const UpdateRequest=(id,Material,Quantity)=>{
        for (var i in RequestList) {
            if (RequestList[i].id == id) {
                RequestList[i].material = Material;
                RequestList[i].Quantity = Quantity;
               break; //Stop this loop, we found it!
            }
        }
        ResetFalid();
        setData({
            ...data,
            isVisibleList:true,
            isEdit:false
        })
        
}

    const renderList = ((item)=>{
        return(
            <Card style={styles.mycard} 
            >
            <View style={styles.cardView}>
                 <Text style={styles.text}>نوع المواد:</Text>
                     <Text style={styles.Text}>{item.material}</Text>
                     <Text style={styles.text}> الكمية:</Text>
                     <Text style={styles.Text}>{item.Quantity}</Text>
                     <TouchableOpacity style={styles.EditIconStyle}
                     onPress={()=>EditRequest(item)}>
                     <Image 
                        source={require('../assets/EditIcon.png')}
                        style={styles.Edit}
                        />
                    </TouchableOpacity>
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
        setID(item.id)
    }

    const DisplayReqests=()=>{
     if(RequestList.length==0)  {
      setData({
          ...data,
          isEmptyList:true
      })   
     }else{
       setData({
           ...data,
           isVisibleList:true,
           isEmptyList:false
       })  
     } 
    }

    const DateAndTimeStep=()=>{
        addRequest();
        if(RequestList.length==0)  {
            setData({
                ...data,
                isEmptyList:true
            })   
        }else{     
            setData({
                ...data,
                isDateAndTimeStep:true,
                isEmptyList:false
            })  
        }
    }

    const Send=()=>{

    }
return (
    
<View style={styles.container}>   
    <Modal visible={alertVisible} transparent={true} onRequestClose={()=>{ setAlertVisible(false) }}>
        <KeyboardAwareScrollView >
            <View backgroundColor= "#000000aa" flex= {1} style={{alignItems:'center',justifyContent:'center'}} >
                <View backgroundColor ='#ffffff' marginTop= {100} marginBottom={100} flex= {1}>
                    {/* header of modal */}
                    <Image 
                        source={require('../assets/RequestHeader.png')}
                        style={styles.headerImage}
                        resizeMode="stretch"/>

                    <View style={styles.header}>
                        <MaterialIcons style={Platform.OS === 'android'? styles.iconAndroid:styles.iconIOS} name="cancel" size={32} color="#fff" 
                         onPress={()=>{ setAlertVisible(false) }} 
                         />
                        <Text style={styles.text_header_modal}>إنشاء طلب جديد</Text>
                    </View>

                    {/* الدوائر الثلاث اللي بالوسط مع الخط */}
                    <View style={{alignItems:'center'}}>
                        <Image
                            style={{width:'70%',marginTop:30}}
                            source={require('../assets/line.png')}/>

                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'60%',top:-20}}>
                            <Image
                                style={styles.ImageStyle}
                                source={require('../assets/pin.png')}    
                            />

                            <Image
                                style={styles.ImageStyle}
                                source={require('../assets/pin.png')}
                                resizeMethod='scale'
                            />

                            <Image
                                style={styles.ImageStyle}
                                source={require('../assets/pin.png')}
                            />
                        </View>                   
                    </View>

                    {/* اما تعرض ليست الطلبات او ادخال الطلبات */}
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
                            <View style={{flexDirection:'row',justifyContent:'space-between',margin:15}}>
                                <TouchableOpacity onPress={() =>setData({...data,isVisibleList:false})}>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={require('../assets/pin.png')}
                                        resizeMethod='scale'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() =>setData({...data,isDateAndTimeStep:true,isVisibleList:false})}>
                                <Image     
                                    style={styles.ImageStyle}
                                    source={require('../assets/pin.png')}
                                    />
                                </TouchableOpacity>  
                            </View>
                        </View>
                    :

                        // عرض فوم النوع والكمية
                        <View>

                            {/* شرط اذا ضغط على الليت ايكون ولببيست فاضية */}
                            {data.isEmptyList ?
                                <Animatable.View animation="fadeInRight" duration={500}>
                                    <Text style={styles.errorMsg2}>يجب ادخال طلب واحد على الاقل</Text>
                                </Animatable.View>
                                :
                                null
                            }

                            {/* اذا انتقل لفورم التاريخ والوقت */}
                            {data.isDateAndTimeStep?
                            
                                <View>
                                    <Text style={styles.text}>تاريخ الإستلام:</Text>
                                    <View style={{flexDirection:Platform.OS === 'android'?'row':'row-reverse'}}>
                                        <View style={styles.action}>
                                            <TextInput style={styles.textInput} 
                                                // value={Material}
                                                label="Date"
                                                placeholder="ادخل تاريخ الاستلام"
                                                autoCapitalize="none"
                                                onChangeText={(val)=>setData(val)}
                                                textAlign= 'right'
                                                onEndEditing={() => checkDate()}
                                                // ref={data.MaterialInput}
                                                >
                                            </TextInput> 
                                        </View>
                                    </View>
                                    {/* في حالة التاريخ غلط */}
                                    {data.isValidDate ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                            <Text style={styles.errorMsg}>{data.DateErrorMsg}</Text>
                                        </Animatable.View>
                                    }

                                    <Text style={styles.text}> وقت الإستلام:</Text>
                                    <View style={{flexDirection:Platform.OS === 'android'?'row':'row-reverse'}}>
                                        <View style={styles.action}>
                                            <TextInput style={styles.textInput} 
                                                // value={Quantity+""}
                                                label="Time"
                                                placeholder="ادخل وقت الاستلام"
                                                autoCapitalize="none"
                                                onChangeText={(val)=>setTime(val)}
                                                textAlign= 'right'
                                                onEndEditing={() => checkTime()}
                                                // ref={data.QuantityInput}
                                                >
                                            </TextInput> 
                                        </View> 
                                    </View>
                                    {/* في حالة التاريخ غلط */}
                                    {data.isValidTime ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                            <Text style={styles.errorMsg}>{data.TimeErrorMsg}</Text>
                                        </Animatable.View>
                                    }
                                </View>

                                :

                                // فورم النوع والكمية
                                <View>
                                    <Text style={styles.text}>نوع المادة:</Text>
                                    <View style={{flexDirection:Platform.OS === 'android'?'row':'row-reverse'}}>
                                        <View style={styles.action}>
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
                                        </View>

                                        <View style={{alignItems:'center',justifyContent:'center'}}>
                                            <TouchableOpacity onPress={() =>selectImage ()}>
                                                <Image
                                                    style={{left:0,width:40,height:40}}
                                                    source={require('../assets/Camera.png')}
                                                /> 
                                                </TouchableOpacity>
                                        </View>
                                    </View>
                                    {/* في حالة المادة غلط */}
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
                                                keyboardType="number-pad" //number Input
                                                ref={data.QuantityInput}
                                                >
                                            </TextInput> 
                                        </View> 
                                    </View>
                                    {/* في حالة الكمية غلط */}
                                    {data.isvalidQuantity ?
                                        null 
                                        : 
                                        <Animatable.View animation="fadeInRight" duration={500}>
                                            <Text style={styles.errorMsg}>{data.QuantityErrorMsg}</Text>
                                        </Animatable.View>
                                    }
                                </View>
                            }
                            {/* هذي بس عشان اشوف التغير يصير او لا راح نشيلها */}
                            <View>
                                {RequestList.map(request=> (
                                    <View key={request.id}>
                                    <Text>{request.id} {request.material} {request.Quantity}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* في حالة تعديل الطلب يشيل الدوائر اللي تحت ويعرض البوتن */}
                            {data.isEdit?                    
                                <View style={styles.button}> 
                                    <Button icon="content-save" mode="contained" theme={theme }
                                        onPress={() => UpdateRequest(id,Material,Quantity)}
                                        >
                                    حفظ
                                    </Button>
                                </View>
                                :
                            <View>
                                {/* يغير الصور اللي تحت */}
                             {data.isDateAndTimeStep?
                                <View style={{flexDirection:'row',justifyContent:'space-between',margin:15}}>
                                    <TouchableOpacity onPress={() =>setData({...data,isDateAndTimeStep:false})}>
                                        <Image
                                            style={styles.ImageStyle}
                                            source={require('../assets/pin.png')}
                                            resizeMethod='scale'
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() =>Send()}>
                                    <Image     
                                        style={styles.ImageStyle}
                                        source={require('../assets/pin.png')}
                                        />
                                    </TouchableOpacity>  
                                </View>
                                :
                                <View style={{alignItems:Platform.OS === 'android'?'flex-start':'flex-end',padding:20}}>
                                    <TouchableOpacity onPress={() =>addRequest ()}>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={require('../assets/pin.png')}    
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() =>DisplayReqests ()}>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={require('../assets/pin.png')}
                                        resizeMethod='scale'
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() =>DateAndTimeStep()}>
                                    <Image     
                                        style={styles.ImageStyle}
                                        source={require('../assets/pin.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                                </View>
                            }
                        </View>
                    }
                </View>               
            </View>
        </KeyboardAwareScrollView> 
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
        justifyContent:'center'
    },
    headerImage: {
        width:wight_logo ,
        height: height_logo,
    },
    ImageStyle:{
        width:42,
        height:39,
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
        textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
        marginRight:5,
        marginLeft:5,
        marginTop:20
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
        textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
        paddingRight:20
    },
    mycard:{
        margin:5,// بعدها عن الحواف 
        
    },
    cardView:{

        flexDirection:Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?'row':'row-reverse',
        padding:6,// بعدها عن الحواف من داخل البوكس 
    },
    Text:{
        fontSize:18,
        marginTop:20,
        marginRight:5,
        marginLeft:5,    
    },
    EditIconStyle:{
        position:'absolute',
        right:5,
        marginTop:20,
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
    }    
});

export default NewRequestModal1