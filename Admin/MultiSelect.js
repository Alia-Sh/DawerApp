import React, { Component } from "react";
import { View, Text, StyleSheet,TextInput } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

export default class ExampleClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      startTime: "",
      endTime:"",
      data:{
        isStartTime:false,
        isValidStartTime:true,
        isValidEndTime:true
      }
    };
  }

  //Date Picker handling methods
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  handleDatePicked = time => {
    if(this.state.data.isStartTime){
      this.setState({
        startTime: moment(time).format('hh:mm A')
      });
    }else{
      this.setState({
        endTime: moment(time).format('hh:mm A')
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
    if(this.state.startTime==""){
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
    if(this.state.endTime==""){
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

  render() {
    return (
      <View style={styles.container}>
          <TextInput style={styles.textInput} 
              value={this.state.startTime}
              label="startTime"
              placeholder="ادخل وقت بدا العمل"
              autoCapitalize="none"
              onChangeText={(val)=>this.setState({startTime:val})}
              onFocus={()=>this.showDatePicker(true)}
              textAlign= 'right'
              onEndEditing={() => this.checkValidStartTime()}
          >
          </TextInput> 

          <TextInput style={styles.textInput} 
              value={this.state.endTime}
              label="endTime"
              placeholder="ادخل وقت انتهاء العمل"
              autoCapitalize="none"
              onChangeText={(val)=>this.setState({endTime:val})}
              onFocus={()=>this.showDatePicker(false)}
              textAlign= 'right'
              onEndEditing={() => this.checkValidEndTime()}
          >
          </TextInput> 

          {this.state.data.isValidStartTime ?
            null 
            : 
            <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>يجب ادخال وقت بدا العمل</Text>
            </Animatable.View>
          } 

          {this.state.data.isValidEndTime ?
            null 
            : 
            <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>يجب ادخال وقت انتهاء العمل</Text>
            </Animatable.View>
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
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    marginTop: Platform.OS === 'ios' ? 5 : 0,
    padding: 50,
    color: '#05375a',
    textAlign: 'right',
    margin:10 , 
    // marginLeft:10,
    fontSize:16 
}
});