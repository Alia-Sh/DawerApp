import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,KeyboardAvoidingView,TextInput, Alert,ActivityIndicator} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import {Title,Card,Button,FAB}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '../Database/firebase';
import * as ImagePicker from 'expo-image-picker';
import { NativeModules } from 'react-native';

const UserEditProfile  = ({navigation,route})=>{
    const getDetails=(type)=>{
        if(route.params){
            switch(type){
                case "UserName":
                    return route.params.UserName
                
                case "Name":
                    return route.params.Name

                case "Phone":
                        return route.params.Phone

                case "Location":
                    return route.params.Location

                case "Picture":
                    return route.params.Picture
            }
        }
        return ""
    }

    retriveImage= async ()=>{
        var userId = firebase.auth().currentUser.uid;
        var imageRef = firebase.storage().ref('images/' + userId);
        imageRef
          .getDownloadURL()
          .then((url) => {
            //from url you can fetched the uploaded image easily
            setPicture(url)
          })
          .catch((e) => console.log('getting downloadURL of image error => ', e));
      }

    useEffect(()=>{
        retriveImage()
    },[]);

    const [Name,setName] = useState(getDetails("Name"))
    const [Phone,setPhone] = useState(getDetails("Phone"))
    const [UserName,setUserName] = useState(getDetails("UserName"))
    const [Location,setLocation] = useState(getDetails("Location"))
    const [Picture,setPicture] = useState(getDetails("Picture"))
    const [enableshift,setAnbleshift]=useState(false)
    const [data,setData] = React.useState({
        isLoading:false
      });

    var userId = firebase.auth().currentUser.uid;
    var query2 = firebase.database().ref('User/' + userId+'/Location');
    query2.once("value").then(function(result) {
        const userData = result.val();
        setLocation(userData.address);
    });

    const updateUserInfo=()=>{
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('User/' + userId).update({
            Name: Name,
            PhoneNumber: Phone,      
        });
        navigation.navigate("UserViewProfile",{UserName,Name,Phone,Location,Picture})
    }

    const selectImage = async () => {
        try {
          let response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
          })
          if (!response.cancelled) {
            setData({
                ...data,
                isLoading:true
            });
            var userId = firebase.auth().currentUser.uid;
            uploadImage(response.uri,userId)
            .then(()=> {
                setData({
                    ...data,
                    isLoading:false
                });
               retriveImage();
            }).catch((error)=> {
                setData({
                    ...data,
                    isLoading:false
                });
                Alert.alert(error);
            });
          }
        } catch (error) {
          console.log(error)
        }
      }

    uploadImage= async (uri,imageName)=>{
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("images/"+imageName);
        return ref.put(blob);
    }

    return(
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}>
            <View>
                <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"25%"}}>
                    <View style={styles.header}>
                    <FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
                        onPress={()=>{
                            navigation.navigate("UserViewProfile")
                        }}/>
                        <View>
                            <Text style={styles.headerText}>تحديث الملف الشخصي</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.footer}>
                    <View style={{alignItems:"center"}}>
                        {data.isLoading ? <ActivityIndicator size="large" color="#9E9D24" /> : 
                            <Image style={styles.profile_image} 
                            source={{uri:Picture==""? "data:image/png;base64,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":Picture}}
                            />
                        }
                        <FAB  
                            onPress={() =>selectImage ()}
                            small
                            icon="plus"
                            theme={{colors:{accent:"#C0CA33"}}}
                            style={{marginLeft:90,marginTop:-23}}/>
                    </View>

                    <View style={{alignItems:"center",margin:10}}>
                        <Title>{UserName}</Title>
                    </View>

                    <Card style={styles.action}>
                        <View style={styles.cardContent}>
                            <Text style={styles.textStyle}>  الاسم</Text>
                            <TextInput style={styles.textInput} 
                                label="Name"
                                value={Name}
                                autoCapitalize="none"
                                textAlign= 'right'
                                onChangeText={text => setName(text)}>
                            </TextInput>  
                        </View>  
                    </Card>  
  
                    <Card style={styles.action} onPress={()=>navigation.navigate("GoogleMap")} >
                        <View style={styles.cardContent}>
                        <Text style={styles.textStyle}> الموقع</Text>
                            <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}>{Location}</Text>
                            <Feather
                                    name="chevron-left"
                                    color="grey"
                                    size={23}/>  
                        </View>  
                    </Card>  

                    <View style={styles.button}> 
                        <Button icon="content-save" mode="contained" theme={theme }
                            onPress={() => updateUserInfo()}>
                                حفظ
                        </Button>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const theme= {
    colors:{
        primary: "#C0CA33"
    }
}

const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor: '#F5F5F5',       
    },
    profile_image:{
        width:150,
        height:150,
        borderRadius:150/2,
        marginTop:-75 
    },
    action: {
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse',
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingRight:3,
        paddingLeft:3
    },  
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        textAlign: 'right',
        fontSize:16,
        marginRight:10,        
    },
    textStyle:{
        color: '#9E9E9E',
        marginLeft:10,
        fontSize: 15
    },
    footer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop:-20,
        margin:20
    },
    button:{
        flexDirection:"row",
        justifyContent:"space-around",
        paddingTop:15,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:15
    },
    header:{
        width: '100%',
        height: 80,
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:10,
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
        left: 16
    },
    cardContent:{
        flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' ? 'row' : 'row-reverse',
        padding:8,
    }
})

export default UserEditProfile


/*   <Card style={styles.action} onPress={()=>navigation.navigate("EditPassword")} >
<View style={styles.cardContent}>
<Text style={styles.textStyle}>كلمة المرور</Text>
    <Text style={styles.textInput,{flex: 1,flexWrap: 'wrap',marginTop:2,marginRight:10,fontSize:16,textAlign:"right"}}></Text>
    <Feather
            name="chevron-left"
            color="grey"
            size={23}/>  
</View>  
</Card> */ 

/*  <Card style={styles.action}>
                        <View style={styles.cardContent}>
                        <Text style={styles.textStyle}> رقم الهاتف</Text>
                            <TextInput style={styles.textInput} 
                            label="Phone"
                            value={Phone}
                            autoCapitalize="none"
                            textAlign= 'right'
                            onFocus={()=>setAnbleshift(false)}
                            keyboardType="number-pad" //number Input
                            onChangeText={text => setPhone(text)}
                            maxLength={10}>
                        </TextInput>  
                        </View>  
                    </Card>  
*/
