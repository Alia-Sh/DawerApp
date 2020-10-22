import React, {useState, useEffect,Component} from 'react';
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
   Image,
   FlatList, 
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
import Google from '../components/Google';
import moment from 'moment';
import RangeSlider from 'rn-range-slider';
import WeekdayPicker from "react-native-weekday-picker";
import {CheckBox} from "native-base";

export default class AddFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            AllCategory: [],
            Category:[],
            Logo:"",
            Name:"",
            Materials:"",
            ContactInfo:"",
            Weekday:{
              Sunday:false,
              Monday:false,
              Tuesday:false,
              Wednesday:false,
              Thursday:false,
              Friday:false,
              Saturday:false,
            },
            WorkingD:[],
            WorkingH:"",
            data:{
              isValidName: true,
              LocationExist: true,
              isValidMaterials: true,
              isValidWorkingD: true,
              isValidWorkingH: true,
              isValidContact: true,
              isValidCategory:true,
              EroorMessage:'',
            },
            Location:{
              address:"",
              latitude:0,
              longitude:0
            },
            LocationModal:false,
            alert:{
              alertVisible:false,
              Title:'',
              Message:'',
              jsonPath:'', 
            },
            isLoading:false,   
        };
    }

    selectImage = async () => {
      try {
        let response = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3]
        })
        if (!response.cancelled) {
          this.setState({Logo:response.uri});
        }
      } catch (error) {
        console.log(error);
        Alert.alert(error.message);
      }
    }

    uploadImage= async (uri,imageName)=>{
      const response = await fetch(uri);
      const blob = await response.blob();

      var ref = firebase.storage().ref().child("Facilities/"+imageName); //new file in storage
      return ref.put(blob);
    }

    checkValidName=()=>{
      if(this.state.Name==""){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidName:false
              }
            };
          });
          return false; 
      }else{
          if(!this.state.data.isValidName){   
            this.setState(prevState => {
              return {
                data: {
                  ...prevState.data,
                  isValidName:true
                }
              };
            });                 
          }
          return true;
      }
    }

    checkValidMaterials=()=>{
      if(this.state.Materials==""){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidMaterials:false
              }
            };
          });
          return false; 
      }else{
          if(!this.state.data.isValidMaterials){   
            this.setState(prevState => {
              return {
                data: {
                  ...prevState.data,
                  isValidMaterials:true
                }
              };
            });                 
          }
          return true;
      }
    }

    checkValidContactInfo=()=>{
      if(this.state.ContactInfo==""){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidContact:false
              }
            };
          });
          return false; 
      }else{
          if(!this.state.data.isValidContact){   
            this.setState(prevState => {
              return {
                data: {
                  ...prevState.data,
                  isValidContact:true
                }
              };
            });                 
          }
          return true;
      }
    }

    checkWorkingD=()=>{
      this.setState({WorkingD:[]})

      if(this.state.Weekday.Sunday){
        var temp="الأحد"
        this.state.WorkingD.push(temp)
      }
  
      if(this.state.Weekday.Monday){
        var temp="الأثنين"
        this.state.WorkingD.push(temp)
      }
  
      if(this.state.Weekday.Tuesday){
        var temp="الثلاثاء"
        this.state.WorkingD.push(temp)
      }
  
      if(this.state.Weekday.Wednesday){
        var temp="الأربعاء"
        this.state.WorkingD.push(temp)
      }
  
      if(this.state.Weekday.Thursday){
        var temp="الخميس"
        this.state.WorkingD.push(temp)
      }
  
      if(this.state.Weekday.Friday){
        var temp="الجمعة"
        this.state.WorkingD.push(temp)
      }
  
      if(this.state.Weekday.Saturday){
        var temp="السبت"
        this.state.WorkingD.push(temp)
      }
      if(this.state.WorkingD.length==0){
        this.setState(prevState => {
          return {
            data: {
              ...prevState.data,
              isValidWorkingD:false
            }
          };
        });
        return false    
      }else{
        if(!this.state.data.isValidWorkingD){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidWorkingD:true
              }
            };
          });
        }
        return true;
      } 
  
  }
  

    checkValidWorkingH=()=>{
      if(this.state.WorkingH==""){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidWorkingH:false
              }
            };
          });
          console.log(this.state.WorkingD.length);
          return false; 
      }else{
          if(!this.state.data.isValidWorkingH){   
            this.setState(prevState => {
              return {
                data: {
                  ...prevState.data,
                  isValidWorkingH:true
                }
              };
            });              
          }
          console.log(this.state.WorkingD.length);
          return true;   
      }
    }

    checkLocationExist=()=>{
      if(this.state.Location.address==""){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                LocationExist:false
              }
            };
          });
          return false; 
      }else{
          if(!this.state.data.LocationExist){   
            this.setState(prevState => {
              return {
                data: {
                  ...prevState.data,
                  LocationExist:true
                }
              };
            });                
          }
          return true; 
      }
    }

    checkValidCategory=()=>{
      this.setState({Category:[]})
      for (var i in this.state.AllCategory) {
        if (this.state.AllCategory[i].checked) {
          var tempId=this.state.AllCategory[i].CategoryId
          this.state.Category.push(tempId)
        }
      }
      console.log(this.state.Category);
      if(this.state.Category.length==0){
        this.setState(prevState => {
          return {
            data: {
              ...prevState.data,
              isValidCategory:false
            }
          };
        });
        return false    
      }else{
        if(!this.state.data.isValidCategory){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidCategory:true
              }
            };
          });
        }
        return true;
      }
    }
    onCheckChanged(id) {
        const AllCategory = this.state.AllCategory;

        const index = AllCategory.findIndex(x => x.CategoryId === id);
        AllCategory[index].checked = !AllCategory[index].checked;
        this.setState(AllCategory);
    }

    componentWillMount(){
      firebase.database().ref('/Category/').on('value',snapshot=>{
        const Data = snapshot.val();
        if(Data){
          var li = []
          snapshot.forEach(function(snapshot){
            var temp={Name:snapshot.val().Name,CategoryId:snapshot.key,checked:false}
            li.push(temp)
          })
          this.setState({AllCategory:li})
        }
      })
    }

    pickLocation=(address,latitude,longitude)=>{
      this.setState(prevState => {
        return {
          Location: {
            ...prevState.Location,
            address:address,
            latitude:latitude,
            longitude:longitude
          }
        };
      })
      this.setState({LocationModal:false})
    }

    Add=()=>{
      if(this.checkValidName() && this.checkValidMaterials() && this.checkValidContactInfo() && this.checkWorkingD() && this.checkValidWorkingH() && this.checkLocationExist() && this.checkValidCategory()){
        this.setState({isLoading:true})
        var FacilityId=firebase.database().ref('RecyclingFacility/').push().getKey()
        for(var i in this.state.Category){
          var CategoryId=this.state.Category[i]
          firebase.database().ref('RecyclingFacility/'+CategoryId+"/"+FacilityId).set({
            Name:this.state.Name,
            WorkingDays:this.state.WorkingD,
            WorkingHours:this.state.WorkingH,
            ContactInfo:this.state.ContactInfo,
            Location:this.state.Location,
            AcceptedMaterials:this.state.Materials
          }).then((result)=>{
            if(this.state.Logo!=""){
              this.uploadImage(this.state.Logo,FacilityId)
            }
          }).catch((error)=>{
            Alert.alert(error.message)
          })
        }
          this.setState({isLoading:false})
          this.setState(
            prevState => {
              return {
                alert: {
                  ...prevState.alert,
                  alertVisible:true,
                  Title:"اضافة منشأة",
                  Message:"تم اضافة المنشأة بنجاح",
                  jsonPath:"suss"
                }
              };
            })
            setTimeout(()=>{
              this.setState(
                prevState => {
                  return {
                    alert: {
                      ...prevState.alert,
                      alertVisible:false,
                    }
                  };
                })
                const { navigation } = this.props;
                navigation.navigate("FacilityHome"); 
            },4000)
       
      }else{
        
      }
    }

    render() {
      const { navigation } = this.props;
        return (
          <View style={styles.container}>
            <KeyboardAwareScrollView>
              <View style={styles.fixedHeader}>
                    <LinearGradient
                        colors={["#809d65","#9cac74"]}
                        style={{height:"100%" ,width:"100%"}}> 

                        <SafeAreaView>

                        <View>
                            <Text style={styles.text_header}>إضافة منشأة جديدة</Text>
                            <FontAwesome5 name="chevron-right" size={24} color="#ffffff" style={Platform.OS === 'android' && 
                                  NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                  NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                  NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                  styles.iconAndroid:styles.iconIOS} 
                                  onPress={()=>navigation.goBack()}
                                  />
                        </View>

                        </SafeAreaView>

                    </LinearGradient>
                </View>
                <View style={{flex:8}}>

                      <View style={{alignItems:"center"}}>
                            <Image style={styles.Logo_image} 
                            source={this.state.Logo==""?require('../assets/AdminIcons/FacilityIcon.jpg'):{uri:this.state.Logo}}
                            />
                        <FAB  
                            onPress={() =>this.selectImage ()}
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
                                onChangeText={(val)=>this.setState({Name:val})}
                                textAlign= 'right'
                                onEndEditing={()=>this.checkValidName()}
                                >
                            </TextInput>  
                        </View>

                        {this.state.data.isValidName ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب ادخال اسم المنشأة</Text>
                            </Animatable.View>
                        }

                    </View>

                    <View>
                        <Text style={styles.text_footer}>المواد المقبولة:</Text>
                        <View style={styles.action}>
                            <TextInput style={styles.textInput} 
                                label="Materials"
                                placeholder="ادخل المواد المستقبلة من المنشأة مثل {زجاج،ورق..}"
                                autoCapitalize="none"
                                onChangeText={(val)=>this.setState({Materials:val})}
                                textAlign= 'right'
                                onEndEditing={() => this.checkValidMaterials()}
                                multiline
                                numberOfLines={4}
                                >
                            </TextInput>  
                        </View>

                        {this.state.data.isValidMaterials ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب ادخال المواد المقبولة</Text>
                            </Animatable.View>
                        }

                    </View>

                    <View>
                      <Text style={styles.text_footer}>معلومات التواصل:</Text>
                          <View style={styles.action}>
                              <TextInput style={styles.textInput} 
                                  label="ContactInfo"
                                  placeholder="ادخل معلومات التواصل"
                                  autoCapitalize="none"
                                  onChangeText={(val)=>this.setState({ContactInfo:val})}
                                  textAlign= 'right'
                                  onEndEditing={() => this.checkValidContactInfo()}
                                  multiline
                                  numberOfLines={4}
                                  >
                              </TextInput>  
                          </View>

                          {this.state.data.isValidContact ?
                              null 
                              : 
                              <Animatable.View animation="fadeInRight" duration={500}>
                              <Text style={styles.errorMsg}>يجب ادخال معلومات التواصل مع المنشأة</Text>
                              </Animatable.View>
                          }
                    </View>

                    <View>
                        <Text style={styles.text_footer}>ايام العمل:</Text>
                        <View style={styles.item} >
                            <CheckBox checked={this.state.Weekday.Sunday} 
                                      color="#9E9D24" 
                                      onPress={()=>
                                        this.setState(prevState => {
                                          return {
                                            Weekday: {
                                              ...prevState.Weekday,
                                              Sunday:!this.state.Weekday.Sunday
                                            }
                                          };
                                        })
                                      }
                                      />

                            <Text style={Platform.OS === 'android' && 
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                {...styles.checkBoxTxtAndroid,
                                    color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                    fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                                }:{...styles.checkBoxTxtIos,
                                  color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                  fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                              }}
                              >الأحد</Text>
            
                            <CheckBox checked={this.state.Weekday.Monday} 
                                      color="#9E9D24" 
                                      onPress={()=>
                                        this.setState(prevState => {
                                          return {
                                            Weekday: {
                                              ...prevState.Weekday,
                                              Monday:!this.state.Weekday.Monday
                                            }
                                          };
                                        })
                                      }/>

                            <Text style={Platform.OS === 'android' && 
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                {...styles.checkBoxTxtAndroid,
                                    color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                    fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                                }:{...styles.checkBoxTxtIos,
                                  color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                  fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                              }}
                              >الإثنين</Text>

                            <CheckBox checked={this.state.Weekday.Tuesday} 
                                      color="#9E9D24" 
                                      onPress={()=>
                                        this.setState(prevState => {
                                          return {
                                            Weekday: {
                                              ...prevState.Weekday,
                                              Tuesday:!this.state.Weekday.Tuesday
                                            }
                                          };
                                        })
                                        }/>

                            <Text style={Platform.OS === 'android' && 
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                {...styles.checkBoxTxtAndroid,
                                    color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                    fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                                }:{...styles.checkBoxTxtIos,
                                  color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                  fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                              }}
                              >الثلاثاء</Text>

                            <CheckBox checked={this.state.Weekday.Wednesday} 
                                      color="#9E9D24" 
                                      onPress={()=>
                                      this.setState(prevState => {
                                        return {
                                          Weekday: {
                                            ...prevState.Weekday,
                                            Wednesday:!this.state.Weekday.Wednesday
                                          }
                                        };
                                      })
                                      }/>

                            <Text style={Platform.OS === 'android' && 
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                {...styles.checkBoxTxtAndroid,
                                    color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                    fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                                }:{...styles.checkBoxTxtIos,
                                  color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                  fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                              }}
                              >الأربعاء</Text>

                            <CheckBox checked={this.state.Weekday.Thursday} 
                                      color="#9E9D24" 
                                      onPress={()=>
                                        this.setState(prevState => {
                                          return {
                                            Weekday: {
                                              ...prevState.Weekday,
                                              Thursday:!this.state.Weekday.Thursday
                                            }
                                          };
                                        })
                                        }/>

                            <Text style={Platform.OS === 'android' && 
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                {...styles.checkBoxTxtAndroid,
                                    color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                    fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                                }:{...styles.checkBoxTxtIos,
                                  color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                  fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                              }}
                              >الخميس</Text>

                            <CheckBox checked={this.state.Weekday.Friday} 
                                      color="#9E9D24" 
                                      onPress={()=>
                                        this.setState(prevState => {
                                          return {
                                            Weekday: {
                                              ...prevState.Weekday,
                                              Friday:!this.state.Weekday.Friday
                                            }
                                          };
                                        })
                                        }/>

                            <Text style={Platform.OS === 'android' && 
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                {...styles.checkBoxTxtAndroid,
                                    color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                    fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                                }:{...styles.checkBoxTxtIos,
                                  color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                  fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                              }}
                              >الجمعة</Text>

                            <CheckBox checked={this.state.Weekday.Saturday} 
                                      color="#9E9D24" 
                                      onPress={()=>
                                        this.setState(prevState => {
                                          return {
                                            Weekday: {
                                              ...prevState.Weekday,
                                              Saturday:!this.state.Weekday.Saturday
                                            }
                                          };
                                        })
                                        }/>
                            <Text style={Platform.OS === 'android' && 
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                                {...styles.checkBoxTxtAndroid,
                                    color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                    fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                                }:{...styles.checkBoxTxtIos,
                                  color:this.state.Weekday.Saturday?"#9E9D24":"gray",
                                  fontWeight:this.state.Weekday.Saturday? "bold" :"normal"
                              }}
                              >السبت</Text>
                              
                        </View>

                        {this.state.data.isValidWorkingD ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب اختيار يوم واحد على الأقل</Text>
                            </Animatable.View>
                        }
                    </View>

                    <View>
                    <Text style={styles.text_footer}>ساعات العمل:</Text>
                        <View style={styles.action}>
                            <TextInput style={styles.textInput} 
                                label="WorkingH"
                                placeholder="ادخل ساعات العمل"
                                autoCapitalize="none"
                                onChangeText={(val)=>this.setState({WorkingH:val})}
                                textAlign= 'right'
                                onEndEditing={() => this.checkValidWorkingH()}
                                >
                            </TextInput>  
                        </View>

                        {this.state.data.isValidWorkingH ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب ادخال ساعات العمل للمنشأة</Text>
                            </Animatable.View>
                        }
                    </View>

                    <View>
                        <Text style={styles.text_footer}>الموقع:</Text>
                        <View style={styles.action}>
                      <Text style={[styles.textInput,{flex: 1,flexWrap: 'wrap',fontSize:16,textAlign:"right"}]}>{this.state.Location.address}</Text>
                            <Feather
                                  onPress={()=>
                                    this.setState({LocationModal:!this.state.LocationModal})}
                                    name="chevron-left"
                                    color="grey"
                                    size={25}
                                    style={{marginTop:5}}
                                    />  
                      
                        </View>

                        {this.state.data.LocationExist ? 
                            null : (
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب إدخال الموقع</Text>
                            </Animatable.View>
                            ) }
                    </View>

                    <Text style={styles.text_footer}>إضافة المنشأة إلى فئة:</Text>
                    <View style={styles.item}>
                        {this.state.AllCategory.map((item) => 
                          <View style={{flexDirection: Platform.OS === 'android' && 
                          NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                          NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                          NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse'}}>
                            <CheckBox color="#9E9D24"  checked={item.checked} onPress={()=>this.onCheckChanged(item.CategoryId)}/>
                            <Text style={Platform.OS === 'android' && 
                                NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                                NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                                NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                              {...styles.checkBoxTxtAndroid,
                                  color:item.checked?"#9E9D24":"gray",
                                  fontWeight:item.checked? "bold" :"normal"
                              }:{...styles.checkBoxTxtIos,
                                color:item.checked?"#9E9D24":"gray",
                                fontWeight:item.checked? "bold" :"normal"
                            }}
                            >{item.Name}</Text>  
                          </View>
                        )}
                    </View>

                    {this.state.data.isValidCategory ?
                            null 
                            : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                            <Text style={styles.errorMsg}>يجب اضافة المنشأة لفئة واحدة على الأقل</Text>
                            </Animatable.View>
                        }

                    <View style={styles.button}> 
                        {this.state.isLoading? <Loading></Loading>:  
                            <Button 
                                mode="contained" 
                                color="#809d65" 
                                dark={true} 
                                compact={true} 
                                style={{width:100}} 
                                onPress={()=>this.Add()}>
                                <Text style={{color:"#fff",fontSize:18,fontWeight: 'bold'}}>إضافة</Text>
                            </Button>
                        }
                    </View>     

                </View>
                {this.state.LocationModal?<Google pickLocation={this.pickLocation}></Google>:null}
                {this.state.alert.alertVisible?
                    <AlertView title={this.state.alert.Title} message={this.state.alert.Message} jsonPath={this.state.alert.jsonPath}></AlertView>
                    :
                    null
                }      
            </KeyboardAwareScrollView>
          </View>
        )
    }
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
    iconIOS:{
      position: 'absolute',
      marginTop:20,
      right: 16
    },
    iconAndroid:{
      position: 'absolute',
      marginTop:20,
      left: 16
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
      marginRight:10,
      marginLeft:10,
      // marginTop:10,
   },
   textInput: {
      marginTop: Platform.OS === 'ios' ? 5 : 0,
      paddingLeft: 10,
      color: '#05375a',
      textAlign: 'right',
      margin:10 , 
      // marginLeft:10,
      fontSize:16 
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
      alignItems: 'center',
      margin: 30
    },
    profile_image:{
      width:150,
      height:150,
      borderRadius:150/2,
      marginTop:-20 
  },
  item:{
    width:"100%",
    // backgroundColor:"#fff",
    borderRadius:20,
    padding:10,
    marginBottom:10,
    flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
      flex: 1,flexWrap: 'wrap',
      alignItems:'center',
      justifyContent:'center'
  },
  checkBoxTxtIos:{
    marginRight:20
  },
  checkBoxTxtAndroid:{
    marginLeft:20
  }
});
