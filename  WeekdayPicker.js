import React, {useState,Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import Day from './Day';
import { MaterialIcons } from '@expo/vector-icons';
import WeekdayPicker from "react-native-weekday-picker"

export default class WeekdayPicker2 extends Component {
    handleChange = (days) => { this.setState(days)}
    render() {
    let days = { 1:1, 2:1 , 3:1 , 4:1 , 5:1, 6:0, 0:0 }
    

    return (<WeekdayPicker
        days={days}
        onChange={this.handleChange}
        style={styles.picker}
        dayStyle={styles.day}
      />);

    }
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    height: 50,
    alignItems: 'center'
  },
  day: {
    margin:3
  }
});