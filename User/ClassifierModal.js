import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity, Image, Modal, Button, ActionSheetIOS, NativeModules} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {MaterialIcons} from '@expo/vector-icons';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
//import * as mobilenet from '@tensorflow-models/mobilenet';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as jpeg from 'jpeg-js';
import * as ImagePicker from 'expo-image-picker';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native'
import {FontAwesome5} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'; 
//import firebase from '../Database/firebase';

export default class ClassifierModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isTfReady: false,
        isModelReady: false,
        predictions: null,
        image: null,
        MyModel: null, 
        alertVisible: true,
      };
    }
   
    async componentDidMount() {
      await tf.setBackend('rn-webgl');
      await tf.ready(); // preparing TensorFlow
      this.setState({ isTfReady: true,});
      this.setState({ image: this.props.img });
      console.log("BEFORE LOAD")
      const modelJSON = require('../assets/tfjs_files/model.json');
      const modelWeights = require('../assets/tfjs_files/group1-shard.bin');
      console.log("AFTER LOAD")
      const model = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
        .catch(e => console.log(e));
      console.log("Model loaded!");
      this.setState({ MyModel: model });
      this.setState({ isModelReady: true });
      //this.setState({ image: this.props.img });
      this.classifyImage()
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
      //const scaling = tf.scalar(255.0);
      //const normalized = rawImageData.div(scaling); // make th change..
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
      return tf.tensor3d(buffer, [ height, width, 3])
    }
  
  
    classifyImage = async () => {
      try {
        const imageAssetPath = Image.resolveAssetSource(this.state.image)
        const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
        const rawImageData = await response.arrayBuffer()
        console.log("Before Image Tensor!");
        const imageTensor = (this.imageToTensor(rawImageData)).resizeBilinear([384, 512]).reshape([1, 384, 512, 3])
        console.log("After Image Tensor!");
        const predictions = await (this.state.MyModel).predict(imageTensor.div(tf.scalar(255.0))).data();
        console.log("After predictions!");
        console.log(predictions);
  
        // get the highest prediction
        const { max, maxIndex } = this.indexOfMax(predictions);
        const maxFixed = parseFloat(max.toFixed(4));
        if (maxIndex === 0) {
          this.setState({ predictions: "زجاج"})//+" with probability = "+maxFixed })
        } else if (maxIndex === 1) {
          this.setState({ predictions: "ورق"})//+" with probability = "+maxFixed })
        } else if (maxIndex === 2) {
          this.setState({ predictions: "بلاستيك"})//+" with probability = "+maxFixed })
        }
      } catch (error) {
        console.log('Exception Error: ', error)
      }
    }
  
    indexOfMax = (arr)=>{
      if (arr.length === 0) {
        return -1;
      }
      let max = arr[0];
      let maxIndex = 0;
    
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
          max = arr[i];
          maxIndex = i;
        }
      }
      return {
        max,maxIndex
      };
    };


  // printing results
  renderPrediction = (prediction) => {
    return (
      <View style={styles.welcomeContainer}>
          <Text style={styles.text}>
          نوع المادة: {prediction}
        </Text>
      </View>
    )
  }

  // FOR TESTING & PRESENTATION PURPOSES
  camOptions = async () => {
    ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["إلغاء", "التقاط صورة", "اختيار صورة"],
      //destructiveButtonIndex: 2,
      //tintColor: 'blue',
      title : 'تصنيف نوع المادة',
      message: 'فضلًا أدخل صورة واضحة لمادة واحدة فقط',
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

  pickFromCamera = async ()=>{
    const {granted} =  await Permissions.askAsync(Permissions.CAMERA)
    if(granted){
         let data =  await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1,1]
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

  selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1]
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

  render() {
    const { isTfReady, isModelReady, predictions, image,  MyModel } = this.state
    const { navigation } = this.props;

  return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.alertVisible}
            onRequestClose={()=>{ this.setState({alertVisible: false}) }}
            >
         <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <LinearGradient
                        colors={["#827717","#AFB42B"]}
                        style={{height:"10%"}}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerText}>تصنيف الصورة</Text>
                        </View>
                        <MaterialIcons style={Platform.OS === 'android' && 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                    NativeModules.I18nManager.localeIdentifier === 'ar_SA' ? styles.iconAndroid:styles.iconIOS} name="clear" size={30} color="#fff" style={styles.icon}
                         //onPress={()=>{ this.setState({alertVisible: false}) }}
                           onPress={()=>{ this.props.setVisClassifierModal(false) }}
                         />
                        {/*<FontAwesome5 name="chevron-left" size={24} color="#161924" style={styles.icon}
                            onPress={()=>{
                                navigation.navigate("HomeScreen")
                            }}/> */}
                    </View>
                </LinearGradient>

        {/*<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> */}

        <View style={styles.welcomeContainer}>
        <StatusBar barStyle='light-content' />
        <View style={styles.loadingContainer}>
            {/* <Text style={styles.text}>
            TensorFlow.js ready? {isTfReady ? <Text>✅</Text> : ''}
                </Text> */}

            <View>
             {/* <Text style={styles.text}>Custom model ready? </Text> */}

            {isModelReady ? (
                <Text style={styles.text}>تم تحميل المصنف بنجاح ! </Text>
            ) : (
                <View style = {{flexDirection: 'row'}}>
                <ActivityIndicator size='small' />
                <Text style={styles.text}>فضلًا انتظر، جاري تحميل المصنف..  </Text>
                </View>
            )}
            </View>
        </View>
        {/* My code ! */}

        {/* <TouchableOpacity
            style={styles.ButtonSty}
            onPress={this.camOptions}>
                
            <Text>خيارات الصورة</Text>
        </TouchableOpacity>
        
        <View>
        <Text style = {{color: 'white', marginTop: 14}}> Prediction is HERE : {link}</Text>

        </View> */}
        

        <TouchableOpacity
            style={styles.imageWrapper}
            onPress={isModelReady ? this.camOptions : undefined}>
            {image && <Image source={this.state.image} style={styles.imageContainer} />}

            {isModelReady && !image && (
            <Text style={styles.transparentText}></Text>
            )}
        </TouchableOpacity> 
        <View style={styles.predictionWrapper}>
            {isModelReady && image && (
            <Text style={styles.text}>
                {predictions ? '' : 'جاري التصنيف...'}
            </Text>
            )}
            {isModelReady &&
            predictions &&
            this.renderPrediction(predictions)}
            </View>
        </View>
      {/* </ScrollView> */}
        </View>
        </View>
    </Modal>

    );
    }
}
       

const theme = {
  colors:{
      primary:"#006aff"
  }
}
const styles = StyleSheet.create({
  header:{
    width: '100%',
    //height: 0,
    flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
  },
  icon:{
    position: 'absolute',
    right: 16
  },
  headerText:{
    fontWeight:'bold',
    fontSize: 18,      
    letterSpacing: 1, 
    textAlign:'center',
    color: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#171f24'
  },
  modalView:{
    width:'85%',
    margin:10,
    backgroundColor:"#212121",
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
  centeredView:{
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    flex:1,
    marginTop:50,
    marginBottom:50
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 0, // was 30
  },
  loadingContainer: {
    marginTop: 40,
    justifyContent: 'center'
    
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imageWrapper: {
    width: 233,
    height: 233,
    padding: 5,
    borderColor: '#808080',
    borderWidth: 3,
    borderStyle: 'dashed',
    marginTop: 30,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 208,
    height: 208,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10
  },
  predictionWrapper: {
    height: 70,
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