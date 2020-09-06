import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity, Image, Button, ActionSheetIOS } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as jpeg from 'jpeg-js';
import * as ImagePicker from 'expo-image-picker';
import { fetch } from '@tensorflow/tfjs-react-native';

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

  return (
    <View style={styles.container}>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      <View style={styles.welcomeContainer}>
      <StatusBar barStyle='light-content' />
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>
          TensorFlow.js ready? {isTfReady ? <Text>✅</Text> : ''}
        </Text>

        <View style={styles.loadingModelContainer}>
          <Text style={styles.text}>MobileNet model ready? </Text>
          {isModelReady ? (
            <Text style={styles.text}>✅</Text>
          ) : (
            <ActivityIndicator size='small' />
          )}
        </View>
      </View>
  
     {/* My code ! */}

     <TouchableOpacity
        style={styles.ButtonSty}
        onPress={this.camOptions}>
            
        <Text>تصنيف الصورة</Text>
      </TouchableOpacity>
      
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
  )
}
}        

const theme = {
  colors:{
      primary:"#006aff"
  }
}
const styles = StyleSheet.create({
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
