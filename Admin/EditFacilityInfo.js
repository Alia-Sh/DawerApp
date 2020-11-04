import React, {Component} from 'react';
import { StyleSheet,
   Text,
   View, 
   Platform, 
   TextInput,
   Alert,
   NativeModules,
   Image,
   TouchableOpacity 
  } from 'react-native';
import {Button} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Animatable from 'react-native-animatable';
import firebase from '../Database/firebase';
import AlertView from "../components/AlertView";
import Loading from '../components/Loading';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {FAB} from 'react-native-paper';
import {FontAwesome5} from '@expo/vector-icons';
import GoogleMap from '../components/GoogleMap';
import moment from 'moment';
import {CheckBox} from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class EditFacilityInfo extends Component {


    constructor(props) {
        super(props);
        this.state = {
          AllCategory: this.props.route.params.li,
          Category:this.props.route.params.AcceptedMaterials,
          Logo:this.props.route.params.Picture,
          Name:this.props.route.params.Name,
          CurrentName:this.props.route.params.Name,
          ContactInfo:this.props.route.params.ContactInfo,
          Phone:"",
          Email:"",
          Weekday:{
            Sunday:false,
            Monday:false,
            Tuesday:false,
            Wednesday:false,
            Thursday:false,
            Friday:false,
            Saturday:false,
          },
          WorkingD:this.props.route.params.WorkingDays,
          WorkingH:{
            startTime: this.props.route.params.WorkingHours.startTime,
            endTime:this.props.route.params.WorkingHours.endTime, 
          },
          data:{
            isValidName: true,
            LocationExist: true,
            isValidWorkingD: true,
            isValidWorkingH: true,
            isValidContact: true,
            isValidPhone:true,
            isValidEmail:true,
            isValidCategory:true,
            EroorMessage:'',
            isStartTime:true,
            isValidStartTime:true,
            isValidEndTime:true
          },
          Location:{
            address: this.props.route.params.Location.address,
            latitude:this.props.route.params.Location.latitude,
            longitude:this.props.route.params.Location.longitude
          },
          LocationModal:false,
          alert:{
            alertVisible:false,
            Title:'',
            Message:'',
            jsonPath:'', 
          },
          isLoading:false, 
          isDatePickerVisible: false,
          FacilityId:this.props.route.params.FacilityId
      };
        this.selectCheckbox()
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

    checkValidPhone=()=>{
      if(this.state.Phone!=""){
        if(this.state.Phone.length<7){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidPhone:false
              }
            };
          });
          return false; 
        }
      else{
        if(!this.state.data.isValidPhone){   
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidPhone:true
              }
            };
          });                 
        }
          return true;
      }  
    }else{
      if(!this.state.data.isValidPhone){   
        this.setState(prevState => {
          return {
            data: {
              ...prevState.data,
              isValidPhone:true
            }
          };
        });                 
      }
        return true;
    }  
  }
    
    checkValidEmail=()=>{
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(this.state.Email!=""){
          if(reg.test(this.state.Email) === false){
            this.setState(prevState => {
              return {
                data: {
                  ...prevState.data,
                  isValidEmail:false
                }
              };
            });
          return false; 
      }else{
        if(!this.state.data.isValidEmail){   
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidEmail:true
              }
            };
          });                 
        }
        return true;        
      }
    }else{
      if(!this.state.data.isValidEmail){   
        this.setState(prevState => {
          return {
            data: {
              ...prevState.data,
              isValidEmail:true
            }
          };
        });                 
      }
      return true;        
    }
  }

    checkValidContactInfo=()=>{
      this.state.ContactInfo=[]
      if( this.checkValidPhone() && this.checkValidEmail()){
        if(this.state.Phone!=""){
          var tempPhone={Name:"رقم الهاتف",value:this.state.Phone}
          this.state.ContactInfo.push(tempPhone)
        }
        if(this.state.Email!=""){
          var tempEmail={Name:"البريد الإلكتروني",value:this.state.Email}
          this.state.ContactInfo.push(tempEmail)
        }
        if(this.state.ContactInfo.length==0){
          this.setState(prevState => {
            return {
              data: {
                ...prevState.data,
                isValidContact:false
              }
            };
          });
          return false    
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
  }

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  handleDatePicked = time => {
    if(this.state.data.isStartTime){
      this.setState(prevState => {
        return {
          WorkingH: {
            ...prevState.WorkingH,
            startTime: moment(time).format('hh:mm A')
          }
        };
      });
    }else{
      this.setState(prevState => {
        return {
          WorkingH: {
            ...prevState.WorkingH,
            endTime: moment(time).format('hh:mm A')
          }
        };
      }); 
    }
    this.hideDatePicker();
  };

  showDatePicker = (isStartTime) => {
    this.setState(prevState => {
      return {
        data: {
          ...prevState.data,
          isStartTime:isStartTime
        }
      };
    });
    this.setState({ isDatePickerVisible: true });
  };

  checkValidStartTime=()=>{
    if(this.state.WorkingH.startTime==""){
      this.setState(prevState => {
        return {
          data: {
            ...prevState.data,
            isValidStartTime:false
          }
        };
      });
      return false; 
  }else{
      if(!this.state.data.isValidStartTime){   
        this.setState(prevState => {
          return {
            data: {
              ...prevState.data,
              isValidStartTime:true
            }
          };
        });                 
      }
      return true;
  }
  }

  checkValidEndTime=()=>{
    if(this.state.WorkingH.endTime==""){
      this.setState(prevState => {
        return {
          data: {
            ...prevState.data,
            isValidEndTime:false
          }
        };
      });
      return false; 
  }else{
      if(!this.state.data.isValidEndTime){   
        this.setState(prevState => {
          return {
            data: {
              ...prevState.data,
              isValidEndTime:true
            }
          };
        });                 
      }
      return true;
  }
  }

    checkWorkingD=()=>{
      this.state.WorkingD=[]
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
    if(this.checkValidStartTime() && this.checkValidEndTime()){
      var beginningTime = moment(this.state.WorkingH.startTime, 'hh:mma');
      var endTime = moment(this.state.WorkingH.endTime, 'hh:mma');
      if(endTime.isBefore(beginningTime)){
        this.setState(prevState => {
          return {
            data: {
              ...prevState.data,
              isValidWorkingH:false
            }
          };
        }); 
        return false
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
        return true;   
      }
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
      this.state.Category=[]
      for (var i in this.state.AllCategory) {
        if (this.state.AllCategory[i].checked) {
          var tempId={CategoryId:this.state.AllCategory[i].CategoryId,Name:this.state.AllCategory[i].Name}
          this.state.Category.push(tempId)
        }
      }
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

    selectCheckbox(){
        for (var i in this.state.Category) {
            var temp=this.state.Category[i].Name
            var AllCategory=this.state.AllCategory
            var isValid=AllCategory.some( AllCategory => AllCategory['Name'] === temp ) 
            if(isValid){
                var index=AllCategory.findIndex( AllCategory => AllCategory['Name'] === temp )
                var item=this.state.AllCategory[index]
                item.checked=true
                AllCategory[index]=item
                this.setState({AllCategory})
             }
        }
        for( var i in this.state.WorkingD){
            switch(this.state.WorkingD[i]){
                case "الأحد":
                    this.state.Weekday.Sunday=true
                      break;
                case "الأثنين":
                    this.state.Weekday.Monday=true
                      break;
                case "الثلاثاء":
                this.state.Weekday.Tuesday=true
                    break; 
                case "الأربعاء":
                    this.state.Weekday.Wednesday=true
                        break;
                case "الخميس":
                    this.state.Weekday.Thursday=true
                        break;
                case "الجمعة":
                    this.state.Weekday.Friday=true
                        break;
                case "السبت":
                    this.state.Weekday.Saturday=true
                        break;          
            }
        }
        var ContactInfo=this.state.ContactInfo
        var isPhoneAvailable=ContactInfo.some( ContactInfo => ContactInfo['Name'] === 'رقم الهاتف' )
        var isEmailAvailable= ContactInfo.some( ContactInfo => ContactInfo['Name'] === 'البريد الإلكتروني' )
        if(isPhoneAvailable){
          this.state.Phone=ContactInfo[ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'رقم الهاتف' )].value
        }
        if(isEmailAvailable){
          this.state.Email=ContactInfo[ContactInfo.findIndex( ContactInfo => ContactInfo['Name'] === 'البريد الإلكتروني' )].value
        }    
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

    closeLocatiomModal=()=>{
      this.setState({LocationModal:false})
    }

    updateFacility=()=>{
      if(this.checkValidName() && this.checkValidCategory() && 
        this.checkValidContactInfo() && this.checkWorkingD() && 
        this.checkValidWorkingH() && this.checkLocationExist()){

        this.setState({isLoading:true})

        firebase.database().ref("RecyclingFacility").orderByChild("Name")
        .equalTo(this.state.Name.toLowerCase()).on("value", snapshot => {
            const Data = snapshot.val();
            // Check if the Facility  exist. 
            if (Data && this.state.CurrentName!=this.state.Name) {
                console.log("Facility exist!");
                // Check if the Facility doesnt exist.
                this.setState({isLoading:false})
                this.setState(
                  prevState => {
                    return {
                      alert: {
                        ...prevState.alert,
                        alertVisible:true,
                        Title:"تحديث منشأة",
                        Message:"اسم المنشأة مضافة بالفعل",
                        jsonPath:"Error"
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
                  },4000)
            }else{

              var FacilityId=this.state.FacilityId
              this.updateFacilityInCategory(FacilityId)

              firebase.database().ref('RecyclingFacility/'+FacilityId).update({
                Name:this.state.Name,
                WorkingDays:this.state.WorkingD,
                WorkingHours:this.state.WorkingH,
                ContactInfo:this.state.ContactInfo,
                Location:this.state.Location,
                AcceptedMaterials:this.state.Category
                }).then((data)=>{
                    //success callback
                    if(this.state.Logo!=""){
                      this.uploadImage(this.state.Logo,FacilityId)
                    }
                    this.setState({isLoading:false})
                    setTimeout(()=>{
                      this.setState(
                        prevState => {
                          return {
                            alert: {
                              ...prevState.alert,
                              alertVisible:true,
                              Title:"تحديث معلومات المنشأة",
                              Message:"تم تحديث معلومات المنشأة بنجاح",
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
                            // navigation.navigate("FacilityHome"); 
                            navigation.goBack()
                        },3500)
                    },400)

                    console.log('data ' , data);
                }).catch((error)=>{
                    //error callback
                    this.setState({isLoading:false})
                    Alert.alert(error.message)
                    console.log('error ' , error)
                })
            }
        });

      }
    }

    updateFacilityInCategory=(FacilityId)=>{
      for(var i in this.state.AllCategory){
        var CategoryId=this.state.AllCategory[i].CategoryId
        var CategoryName=this.state.AllCategory[i].Name
        var isInclude=this.state.Category.some( Category => this.state.Category['Name'] === CategoryName ) 
        if(!isInclude){
          firebase.database().ref('Category/'+CategoryId+'/RecyclingFacility/'+ FacilityId).remove();
        }
      }

      for(var i in this.state.Category){
        var CategoryId=this.state.Category[i].CategoryId
        firebase.database().ref('Category/'+CategoryId+'/RecyclingFacility/'+FacilityId).update({
          Name:this.state.Name,
          WorkingDays:this.state.WorkingD,
          WorkingHours:this.state.WorkingH,
          ContactInfo:this.state.ContactInfo,
          Location:this.state.Location,
          AcceptedMaterials:this.state.Category
        }).catch((error)=>{
          Alert.alert(error.message)
        })
      }
    }

    render() {
      const { navigation } = this.props;
        return (
          <View style={styles.container}>
            <SafeAreaView style={{flexDirection:'row-reverse'}}>
                <View style={[styles.header,styles.flexDirectionStyle]}>
                    <FontAwesome5 name="chevron-right" size={24} color="#161924" style={styles.icon}
                        onPress={()=>navigation.goBack()}
                      />
                    <View>
                        <Text style={styles.headerText}>معلومات المنشأة</Text>
                    </View>
                </View>
            </SafeAreaView>

            <View style={{flex:8}}>
              <KeyboardAwareScrollView>

                  <View style={{alignItems:"center"}}>
                        <Image style={styles.Logo_image} 
                        source={this.state.Logo==""?require('../assets/AdminIcons/FacilityIcon.jpg'):{uri:this.state.Logo}}
                        />
                    <FAB  
                        onPress={() =>this.selectImage ()}
                        small
                        icon="plus"
                        theme={{colors:{accent:"#9E9D24"}}}
                        style={Platform.OS === 'android'?styles.FABStyleAndroid:styles.FABStyleIOS}/>
                    <Image
                        style={{width:'70%',margin:20}}
                        source={require('../assets/line.png')}
                        />
                  </View>

                  <View>
                    <Text style={styles.text_footer}>اسم المنشأة:</Text>
                    <View style={[styles.action,styles.flexDirectionStyle]}>
                        <TextInput style={styles.textInput}
                            value={this.state.Name}
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
                    <View style={[styles.item,styles.flexDirectionStyle]}>
                      {this.state.AllCategory.map((item) => 
                        <View style={styles.flexDirectionStyle}>
                          <CheckBox color="#9E9D24"  checked={item.checked} onPress={()=>this.onCheckChanged(item.CategoryId)}/>
                          <Text style={Platform.OS === 'android' && 
                              NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                              NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                              NativeModules.I18nManager.localeIdentifier === 'ar_SA'?
                              {...styles.checkBoxTxtAndroid,
                                color:item.checked?"#9E9D24":"gray",
                                fontWeight:item.checked? "bold" :"normal"
                              }:
                              {...styles.checkBoxTxtIos,
                              color:item.checked?"#9E9D24":"gray",
                              fontWeight:item.checked? "bold" :"normal"
                              }}>{item.Name}
                          </Text> 
                        </View>                   
                      )}
                    </View>

                    {this.state.data.isValidCategory ?
                        null 
                      : 
                        <Animatable.View animation="fadeInRight" duration={500}>
                          <Text style={styles.errorMsg}>يجب اختيار مادة واحدة على الأقل</Text>
                        </Animatable.View>
                    }

                  </View>

                  <View>

                    <Text style={styles.text_footer}>معلومات التواصل:</Text>
                    <View style={{paddingRight:15,paddingLeft:15,paddingTop:15}}>
                        <View style={styles.flexDirectionStyle}>
                            <Text style={styles.textStyle}>رقم الهاتف:</Text>
                            <View style={[styles.action,styles.flexDirectionStyle]}>
                              <TextInput style={[styles.textInput,{marginTop:-5}]} 
                                  value={this.state.Phone}
                                  autoCapitalize="none"
                                  textAlign= 'right'
                                  keyboardType="number-pad" //number Input
                                  onChangeText={(val)=>this.setState({Phone:val})}
                                  onEndEditing={() => this.checkValidPhone()}
                                  placeholder="ادخل رقم الهاتف للمنشأة "
                                  maxLength={10}>
                              </TextInput> 
                            </View> 
                        </View> 

                        {this.state.data.isValidPhone ?
                            null 
                          : 
                            <Animatable.View animation="fadeInRight" duration={500}>
                              <Text style={styles.errorMsg}>يجب ادخال رقم الهاتف بشكل صحيح</Text>
                            </Animatable.View>
                        } 

                        <View style={styles.flexDirectionStyle}>
                            <Text style={styles.textStyle}>البريد الإلكتروني:</Text>
                            <View style={[styles.action,styles.flexDirectionStyle]}>
                              <TextInput style={[styles.textInput,{marginTop:-5}]} 
                                  value={this.state.Email}
                                  label="Email"
                                  autoCapitalize="none"
                                  textAlign= 'right'
                                  onChangeText={(val)=>this.setState({Email:val})}
                                  onEndEditing={() => this.checkValidEmail()}
                                  placeholder="ادخل البريد الإلكتروني للمنشأة "
                                  >
                              </TextInput> 
                            </View> 
                        </View> 
                        {this.state.data.isValidEmail ?
                            null 
                          : 

                            <Animatable.View animation="fadeInRight" duration={500}>
                              <Text style={styles.errorMsg}>يجب ادخال البريد الإلكتروني بشكل صحيح</Text>
                            </Animatable.View>
                        } 
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
                    <View style={[styles.item,styles.flexDirectionStyle]} >
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
                                color:this.state.Weekday.Sunday?"#9E9D24":"gray",
                                fontWeight:this.state.Weekday.Sunday? "bold" :"normal"
                            }:{...styles.checkBoxTxtIos,
                              color:this.state.Weekday.Sunday?"#9E9D24":"gray",
                              fontWeight:this.state.Weekday.Sunday? "bold" :"normal"
                            }}>
                          الأحد
                        </Text>
        
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
                                color:this.state.Weekday.Monday?"#9E9D24":"gray",
                                fontWeight:this.state.Weekday.Monday? "bold" :"normal"
                            }:{...styles.checkBoxTxtIos,
                              color:this.state.Weekday.Monday?"#9E9D24":"gray",
                              fontWeight:this.state.Weekday.Monday? "bold" :"normal"
                            }}>
                            الإثنين
                        </Text>

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
                                color:this.state.Weekday.Tuesday?"#9E9D24":"gray",
                                fontWeight:this.state.Weekday.Tuesday? "bold" :"normal"
                            }:{...styles.checkBoxTxtIos,
                              color:this.state.Weekday.Tuesday?"#9E9D24":"gray",
                              fontWeight:this.state.Weekday.Tuesday? "bold" :"normal"
                            }}>
                            الثلاثاء
                        </Text>

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
                                color:this.state.Weekday.Wednesday?"#9E9D24":"gray",
                                fontWeight:this.state.Weekday.Wednesday? "bold" :"normal"
                            }:{...styles.checkBoxTxtIos,
                              color:this.state.Weekday.Wednesday?"#9E9D24":"gray",
                              fontWeight:this.state.Weekday.Wednesday? "bold" :"normal"
                            }}>
                            الأربعاء
                        </Text>

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
                                color:this.state.Weekday.Thursday?"#9E9D24":"gray",
                                fontWeight:this.state.Weekday.Thursday? "bold" :"normal"
                            }:{...styles.checkBoxTxtIos,
                              color:this.state.Weekday.Thursday?"#9E9D24":"gray",
                              fontWeight:this.state.Weekday.Thursday? "bold" :"normal"
                            }}>
                            الخميس
                        </Text>

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
                                color:this.state.Weekday.Friday?"#9E9D24":"gray",
                                fontWeight:this.state.Weekday.Friday? "bold" :"normal"
                            }:{...styles.checkBoxTxtIos,
                              color:this.state.Weekday.Friday?"#9E9D24":"gray",
                              fontWeight:this.state.Weekday.Friday? "bold" :"normal"
                            }}>
                            الجمعة
                          </Text>

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
                            }}>
                            السبت
                          </Text>
                          
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
                      <View style={[styles.action,styles.flexDirectionStyle]}>

                        <Text style={[styles.textStyle,{paddingRight:5,fontSize:18}]}>من:</Text>

                        <TextInput style={[styles.textInput,{margin:0,marginRight:5,marginTop:0}]} 
                            value={this.state.WorkingH.startTime}
                            label="startTime"
                            placeholder="ادخل وقت بدء العمل"
                            autoCapitalize="none"
                            onChangeText={(val)=>
                              this.setState(prevState => {
                                return {
                                  WorkingH: {
                                  ...prevState.WorkingH,
                                  startTime:val
                                  }
                                };
                              })}
                            onFocus={()=>this.showDatePicker(true)}
                            textAlign= 'right'
                            onEndEditing={() => this.checkValidStartTime()}
                          >
                        </TextInput> 
                        
                        <Text style={[styles.textStyle,{paddingRight:5,fontSize:18}]}>الى:</Text>

                        <TextInput style={[styles.textInput,{margin:0,marginRight:5,marginTop:0}]}
                            value={this.state.WorkingH.endTime}
                            label="endTime"
                            placeholder="ادخل وقت انتهاء العمل"
                            autoCapitalize="none"
                            onChangeText={(val)=>
                              this.setState(prevState => {
                                return {
                                  WorkingH: {
                                  ...prevState.WorkingH,
                                  endTime:val
                                  }
                                };
                              })}
                            onFocus={()=>this.showDatePicker(false)}
                            textAlign= 'right'
                            onEndEditing={() => this.checkValidEndTime()}
                          >
                        </TextInput> 
                    </View>

                    {this.state.data.isValidStartTime ?
                      null 
                      : 
                      <Animatable.View animation="fadeInRight" duration={500}>
                        <Text style={styles.errorMsg}>يجب ادخال وقت بدء العمل</Text>
                      </Animatable.View>
                    } 

                    {this.state.data.isValidEndTime ?
                      null 
                      : 
                      <Animatable.View animation="fadeInRight" duration={500}>
                        <Text style={styles.errorMsg}>يجب ادخال وقت انتهاء العمل</Text>
                      </Animatable.View>
                    } 

                    {this.state.data.isValidWorkingH ?
                        null 
                        : 
                        <Animatable.View animation="fadeInRight" duration={500}>
                          <Text style={styles.errorMsg}>يجب ادخال ساعات العمل بشكل صحيح</Text>
                        </Animatable.View>
                    }
                </View>

                <View>
                    <Text style={styles.text_footer}>الموقع:</Text>
                      <View style={[styles.action,styles.flexDirectionStyle]}>
                        <TouchableOpacity
                          onPress={()=>
                          this.setState({LocationModal:!this.state.LocationModal})}
                          style={[styles.flexDirectionStyle,{flex:1}]}>  

                            <Text style={[styles.textInput,{flex: 1,flexWrap: 'wrap',fontSize:16,textAlign:"right"}]}>{this.state.Location.address}</Text>
                              <Feather
                                  onPress={()=>this.setState({LocationModal:!this.state.LocationModal})}
                                  name="chevron-left"
                                  color="grey"
                                  size={25}
                                  style={{marginTop:5}}
                              />  
                          </TouchableOpacity>
                      </View>

                      {this.state.data.LocationExist ? 
                          null : 
                          (
                        <Animatable.View animation="fadeInRight" duration={500}>
                          <Text style={styles.errorMsg}>يجب إدخال الموقع</Text>
                        </Animatable.View>
                        )
                      }
                </View>

                {this.state.isLoading ? 
                    <Loading></Loading>  
                    : 
                    <View style={styles.button}>

                        <Button icon="content-save" mode="contained" theme={theme } 
                            onPress={() => this.updateFacility()}>
                            حفظ
                        </Button>
                    </View>
                    }
  
              </KeyboardAwareScrollView>

            </View>
                {this.state.LocationModal?
                    <GoogleMap pickLocation={this.pickLocation} closeLocatiomModal={this.closeLocatiomModal}></GoogleMap>
                    :
                    null
                }

                {this.state.alert.alertVisible?
                    <AlertView title={this.state.alert.Title} message={this.state.alert.Message} jsonPath={this.state.alert.jsonPath}></AlertView>
                    :
                    null
                }     
                <DateTimePicker
                    mode="time"
                    isVisible={this.state.isDatePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDatePicker}
                    cancelTextIOS="الغاء"
                    confirmTextIOS="تأكيد"
                    datePickerModeAndroid={'spinner'}
                    is24Hour={false}
                    headerTextIOS="اختر الوقت"
                    /> 
          </View>
        )
    }
}
const theme= {
    colors:{
        primary: "#9E9D24"
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },  
    Logo_image:{
      marginTop:8,
      width:120,
      height:120,
    },
    headerText:{
        fontWeight:'bold',
        fontSize: 20,      
        letterSpacing: 1, 
        textAlign:'center',
        color: '#9E9D24'
    },
    action: {
        flex:1,
      margin: 5,
      paddingRight:3,
      paddingLeft:3,
    },
    errorMsg: {
      color: '#FF0000',
      fontSize: 14,
      textAlign: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
      paddingRight:20,
      paddingBottom:6
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
   },
   textInput: {
      flex:1,
      marginTop: Platform.OS === 'ios' ? 5 : 0,
      paddingLeft: 10,
      color: '#05375a',
      textAlign: 'right',
      margin:10, 
      padding:5,
      fontSize:14 ,
      borderRadius:5,
      borderWidth: 1,
      borderColor: '#f2f2f2',
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
      margin: 15
  },
  item:{
    width:"100%",
    borderRadius:20,
    padding:10,
    flex: 1,flexWrap: 'wrap',
    alignItems:'flex-start',
    justifyContent:'flex-start'
  },
  checkBoxTxtIos:{
    marginRight:20,
    marginBottom:5,
  },
  checkBoxTxtAndroid:{
    marginLeft:20,
    marginBottom:5,
  },
  textStyle:{
    color: '#9E9E9E',
    fontSize: 15,
  },
  header:{
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:15
  },
  flexDirectionStyle:{
    flexDirection: Platform.OS === 'android' && 
    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
    NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
  },
  icon:{
    position: 'absolute',
    left: 16
  }
});
