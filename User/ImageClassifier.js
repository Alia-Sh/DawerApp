import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity, Image, Button, ActionSheetIOS, NativeModules} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as tf from '@tensorflow/tfjs';
//import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as jpeg from 'jpeg-js';
import * as ImagePicker from 'expo-image-picker';
//import { fetch } from '@tensorflow/tfjs-react-native';
import {bundleResourceIO} from "@tensorflow/tfjs-react-native";
import {FontAwesome5} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'; 
import firebase from '../Database/firebase';
import { TextInput } from 'react-native';

// There is an ERROR here, so i commneted the functions below..

const ImageClassifier = ({navigation})=> {

  const [isTfReady,setIsTfReady] = useState(false)
  const [isModelReady,setIsModelReady] = useState(false)
  const [predictions,setPredictions] = useState(null)
  const [image,setImage] = useState(null)
  const [link,setLink] = useState(null)


  const getPred = async()=>{
    await tf.ready(); // preparing TensorFlow

    //const model = await tf.loadLayersModel(link);
    //const example = tf.image.cropAndResize(image.next().value.reshape([1, 224, 224, 3]));
    //const predict = model.predict(example);
    const modelJSON = require('../assets/tfjs_files/model.json');
    const modelWeights = require('../assets/tfjs_files/group1-shard1of21.bin');
    const model = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
      .catch(e => console.log(e));
    console.log("Model loaded!");
    const predicted = await model.predict(image); 
    console.log(predicted); 
    setLink(predicted);
  }

  /*
   const loadModel = async()=>{
    const modelJSON = require('../assets/tfjs_files/model.json');
    const modelWeights = require('../assets/tfjs_files/group1-shard1of21.bin');
    const model = await tf
      .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
      .catch(e => console.log(e));
    console.log("Model loaded!");
    return model;
  };


  const getModel= async ()=>{
    var modelRef = firebase.storage().ref('Model');
    modelRef
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        setLink(url);
      })
      .catch((e) => console.log('getting downloadURL of model error => ', e));
  }
  */
/*
  componentDidMount = async ()  =>  {
    await tf.ready(); // preparing TensorFlow
    setIsTfReady(true);
    model = await mobilenet.load(); // preparing MobileNet model
    setIsModelReady(true);
    this.getPermissionAsync(); // get permission for accessing camera on mobile device
  }
*/
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (status !== 'granted') {
            alert('فضلًا، قم بإعطاء صلاحية الدخول لألبوم الصور !')
        }
    }
  }

  // image classification options
  const camOptions =  () => {
    ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["إلغاء", "التقاط صورة", "اختيار صورة"],
      destructiveButtonIndex: 2,
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

  // take photo from camera
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
          getPred();
          //this.classifyImage()
        }
    }else{
      alert("you need to give the permission to work!")
    }
  }

  // select image from gallery
  const selectImage = async() => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3]
      })
      if (!response.cancelled) {
          const source = { uri: response.uri }
          setImage(source);
          getPred();
          //this.classifyImage()
      }
    } catch (error) {
      console.log(error)
      }
  }

  const classifyImage = async () => {
    try {
      const imageAssetPath = Image.resolveAssetSource(this.state.image)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer()
      const imageTensor = this.imageToTensor(rawImageData)
      const predictions = await this.model.classify(imageTensor)
      setPredictions(predictions);
    } catch (error) {
      console.log('Exception Error: ', error)
    }
  }

  const imageToTensor = (rawImageData)=> {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]
      offset += 4
    }
    return tf.tensor3d(buffer, [height, width, 3])
  }

  // prediction
  const renderPrediction = (prediction) => {
    return (
      <View style={styles.welcomeContainer}>
        <Text key={prediction.className} style={styles.text}>
          Prediction: {prediction.className} {', '} Probability: {prediction.probability}
        </Text>
      </View>
    )
  }

/*

  return(
    <Text>Hi, I am the classifier</Text>
  );
};

//StyleSheets..

export default ImageClassifier;

///////////// OOOOOLLLLLLLDDDDDDDD
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      isModelReady: false,
      predictions: null,
      image: null,
    };
  }

  async componentDidMount() {
    await tf.ready(); // preparing TensorFlow
    this.setState({ isTfReady: true,});
    this.model = await mobilenet.load(); // preparing MobileNet model
    this.setState({ isModelReady: true });
    this.getPermissionAsync(); // get permission for accessing camera on mobile device
  }

getPermissionAsync = async () => {
  if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
          alert('فضلًا، قم بإعطاء صلاحية الدخول لألبوم الصور !')
      }
  }
}

imageToTensor(rawImageData) {
  const TO_UINT8ARRAY = true
  const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
  // Drop the alpha channel info for mobilenet
  const buffer = new Uint8Array(width * height * 3)
  let offset = 0 // offset into original data
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = data[offset]
    buffer[i + 1] = data[offset + 1]
    buffer[i + 2] = data[offset + 2]
    offset += 4
  }
  return tf.tensor3d(buffer, [height, width, 3])
}

classifyImage = async () => {
  try {
    const imageAssetPath = Image.resolveAssetSource(this.state.image)
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
    const rawImageData = await response.arrayBuffer()
    const imageTensor = this.imageToTensor(rawImageData)
    const predictions = await this.model.classify(imageTensor)
    this.setState({ predictions: predictions })
  } catch (error) {
    console.log('Exception Error: ', error)
  }
}

// image classification options
camOptions = async () => {
    ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["إلغاء", "التقاط صورة", "اختيار صورة"],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 0
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        // cancel action
      } else if (buttonIndex === 1) {
        this.pickFromCamera();
      } else if (buttonIndex === 2) {
        this.selectImage();
      }
    }
    );
  }

// take photo from camera
pickFromCamera = async ()=>{
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
           this.setState({ image: source })
           this.classifyImage()
        }
    }else{
       alert("you need to give the permission to work!")
    }
  }

// select image from gallery
selectImage = async () => {
  try {
    let response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    })
    if (!response.cancelled) {
        const source = { uri: response.uri }
        this.setState({ image: source })
        this.classifyImage()
    }
  } catch (error) {
    console.log(error)
  }
}

// prediction
renderPrediction = (prediction) => {
  return (
    <View style={styles.welcomeContainer}>
      <Text key={prediction.className} style={styles.text}>
        Prediction: {prediction.className} {', '} Probability: {prediction.probability}
      </Text>
    </View>
  )
}

render() {
  const { isTfReady, isModelReady, predictions, image } = this.state
*/
  return (
    <View style={styles.container}>
       <LinearGradient
                    colors={["#827717","#AFB42B"]}
                    style={{height:"12%"}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
                        onPress={()=>{
                            navigation.navigate("HomeScreen")
                        }}/>
                    <View>
                        <Text style={styles.headerText}>تصنيف الصورة</Text>
                    </View>
                 </View>
            </LinearGradient>

    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      <View style={styles.welcomeContainer}>
      <StatusBar barStyle='light-content' />
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>
          TensorFlow.js ready? {setIsTfReady ? <Text>✅</Text> : ''}
        </Text>

        <View style={styles.loadingModelContainer}>
          <Text style={styles.text}>Custom model ready? </Text>
          {setIsModelReady ? (
            <Text style={styles.text}>✅</Text>
          ) : (
            <ActivityIndicator size='small' />
          )}
        </View>
      </View>
     {/* My code ! */}

     <TouchableOpacity
        style={styles.ButtonSty}
        onPress={camOptions}
        >
            
        <Text>تصنيف الصورة</Text>
      </TouchableOpacity>
      
      <View>
      <Text style = {{color: 'white', marginTop: 14}}> Prediction is HERE : {link}</Text>

      </View>
      
        {/*
        <Button 
             style={styles.inputStyle}
             icon={image==""?"upload":"check"}
             mode="contained" 
             theme={theme}
             title="تصنيف الصورة"
             onPress={this.camOptions}>
        </Button>
        */}

       {/*
       <TouchableOpacity
        style={styles.imageWrapper}
        onPress={isModelReady ? this.selectImage : undefined}>
        {image && <Image source={image} style={styles.imageContainer} />}

        {isModelReady && !image && (
          <Text style={styles.transparentText}></Text>
        )}
      </TouchableOpacity> 
      <View style={styles.predictionWrapper}>
        {isModelReady && image && (
          <Text style={styles.text}>
            Predictions: {predictions ? '' : 'Predicting...'}
          </Text>
        )}
        {isModelReady &&
          predictions &&
          predictions.map(p => this.renderPrediction(p))}
        </View> */}
      </View>
      </ScrollView>
    </View>
  );
}
       

const theme = {
  colors:{
      primary:"#006aff"
  }
}
const styles = StyleSheet.create({
  header:{
    width: '100%',
    height: 80,
    flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
  },
  icon:{
    position: 'absolute',
    left: 16
  },
  headerText:{
    fontWeight:'bold',
    fontSize: 18,      
    letterSpacing: 1, 
    textAlign:'center',
    color: '#212121'
  },
  container: {
    flex: 1,
    backgroundColor: '#171f24'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 30,
  },
  loadingContainer: {
    marginTop: 80,
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 16
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: '#808080',
    borderWidth: 5,
    borderStyle: 'dashed',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  transparentText: {
    color: '#ffffff',
    opacity: 0.7
  },
  inputStyle: {
    margin:5 
  },
  ButtonSty: {
    alignItems: "center",
    backgroundColor: "#AFB42B",
    padding: 8,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 10
  },
})
export default ImageClassifier;