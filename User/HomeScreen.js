import React , { useState ,useEffect } from 'react';
import { StyleSheet, Text, View, NativeModules, Image, FlatList, ActionSheetIOS} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons';
import firebase from '../Database/firebase';
import SearchBar from '../components/SearchBar';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import ClassifierModal from './ClassifierModal';


const HomeScreen = ({navigation})=>{

  const [CategoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [term, setTerm] = useState('')
  const [SearchList, setSearchList] = useState([])
  const [SearchOccur, setSearchOccur] = useState(false)
  const [image, setImage] = useState('')       
  const [VisClassifierModal,setVisClassifierModal] = useState(false)


  
  var UserID=firebase.auth().currentUser.uid;
//to store the token expo in  our firebase 
 

   const registerForPushNotificationsAsync = async (UserID) => {
        const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        //post to firebase
        console.log("token",token);
        var updates = {}
        updates['/expoToken'] = token
        firebase.database().ref("User").child(UserID).update(updates)
        
        
      
       
        //call the push notification 
    }


  const Item = ({ item, onPress, style }) => (
  
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <View>
      <Text style={styles.textInput}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const fetchData=()=>{
    console.log('inside fetch categories');
    firebase.database().ref("Category").orderByChild("Name").on('value', (snapshot) =>{
  
      var li = []
      snapshot.forEach((child)=>{
        var temp={
          key: child.key,
          name : child.val().Name
        }

        li.push(temp)
        setLoading(false)
        console.log(child.key);
        console.log(child.val().Name);
        setLoading(false) 
      })
   
      setCategoriesList(li)
   
    })
  
  }
  useEffect(()=>{
    fetchData()
    registerForPushNotificationsAsync(UserID)
    Notifications.addListener(notification => navigation.navigate(notification.data.screen))
  },[])

  const [selectedId, setSelectedId] = useState(null);


  const renderItem = ({ item }) => {
    const backgroundColor = item.key === selectedId ? "#F3F3F3" : "#F3F3F3";

    return (
      <Item
        item={item}
        //onPress={() => setSelectedId(item.key)}
        onPress={() => {
            var ID =item.key;
            var Name =item.name;
            console.log(ID+' >>> to facilities..');
            navigation.navigate("FacilitiesInCategory",{ID,Name})}}
        style={{ backgroundColor }}
      />
    );
  };

  const SearchInList = (word) =>{
    setSearchList(CategoriesList.filter(item => item.name.toLowerCase().includes(word)))
    setSearchOccur(true)
  }



   // image classification options
   const camOptions =  () => {
    ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["إلغاء", "التقاط صورة", "اختيار صورة"],
      //destructiveButtonIndex: 2,
      //tintColor: 'blue',
      title : 'تصنيف نوع المادة',
      cancelButtonIndex: 0
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        // cancel action
      } else if (buttonIndex === 1) {
        pickFromCamera();
      } else if (buttonIndex === 2) {
        selectImage();
      }
    }
    );
  }

  // take photo
  const pickFromCamera = async ()=>{
    const {granted} =  await Permissions.askAsync(Permissions.CAMERA)
    if(granted){
        let data =  await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1,1]
            // quality: 0.5
          })
        if(!data.cancelled){
          const source = { uri: data.uri }
          setImage(source);
          //this.classifyImage()
          setVisClassifierModal(true)
        }
    }else{
      alert("you need to give the permission to work!")
    }
  }

  // upload photo
  const selectImage = async() => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1]
      })
      if (!response.cancelled) {
          const source = { uri: response.uri }
          setImage(source);
          //this.classifyImage()
          setVisClassifierModal(true)
      }
    } catch (error) {
      console.log(error)
      }
  }

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (status !== 'granted') {
            alert('فضلًا، قم بإعطاء صلاحية الدخول لألبوم الصور !')
        }
    }
  }


    return (
      <View>
        <View style = {{flexDirection: 'row'}}>
        <FontAwesome5 name="camera" size={34} color="#AFB42B" style={styles.icon}
            onPress={()=>camOptions()
                //{navigation.navigate("ImageClassifier")}
            }/>
            <SearchBar
            term = {term}
            OnTermChange = {newTerm => setTerm(newTerm)}
            OnTermSubmit = {()=> SearchInList(term)}
            BarWidth = {'80%'}
            BarMargin = {'30'}
            />
        </View>
          {/*<View>
                <Text style={styles.textInput}>هنا الصفحة الرئيسية اللي فيها الخمس انواع</Text>
          </View> */}
          <View style={styles.container}>
          {SearchOccur? 
          <FlatList
          contentContainerStyle = {styles.grid}
          numColumns = {2}
          data = {SearchList}
          keyExtractor = {(item)=>item.key}
          onRefresh = {()=>fetchData()}
          refreshing = {loading}
          renderItem={renderItem}
          /*renderItem = {({ item }) => {
            console.log(item);
            return <Text style = {styles.item}>{item}</Text>
          }
          }*/
        /> 
          :
          <FlatList
            contentContainerStyle = {styles.grid}
            numColumns = {2}
            data = {CategoriesList}
            keyExtractor = {(item)=>item.key}
            onRefresh = {()=>fetchData()}
            refreshing = {loading}
            renderItem={renderItem}
            /*renderItem = {({ item }) => {
              console.log(item);
              return <Text style = {styles.item}>{item}</Text>
            }
            }*/
          />}
          </View>

          {VisClassifierModal?
                <ClassifierModal img={image} setVisClassifierModal={setVisClassifierModal}></ClassifierModal>
              :
                null
          }

      </View>

      );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 35, //20 -- 55
    },  
    textInput: {
      textAlign: 'center',
      fontSize: 20, //15
      fontWeight: 'bold',
      color:'gray',  
    },
    item: {
      width: 130,
      height: 130,
      paddingTop: 50,
      marginVertical: 8, //25 -- مربع 3
      marginHorizontal: 5, //16 -- 3 مربع
      borderRadius: 0, //100 - 50 -30 -- 0 مربع 
      shadowColor: '#9E9D24',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.90, //0.50 - 0.80
      shadowRadius: 5.65, // 4.65
    },
    grid: {
      marginBottom: 32,
      marginVertical: 8,
      alignItems: 'center',
    },
    icon: {
      left: 12,
      marginTop: 10,
      marginEnd: 35
    }
  });
export default HomeScreen;
