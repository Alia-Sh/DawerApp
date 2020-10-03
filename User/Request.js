import React, {Component}from 'react';
import { View,Text } from 'react-native-animatable';
import {Button} from 'react-native-paper';

class Request extends Component(Id,Type,Quantity) {
    constructor() {
      super()
      this.state = {
        Id: 1,
        Type:'زجاج',
        Quantity:2

    }
    }
    handleOnPress() {
       this.setState({n: this.state.n + 1})
    }
    render() {
      return (
          <View>
      <Button onPress={() => this.handleOnPress()} 
      />
      <Text>{this.state.Id}</Text>
      <Text>{this.state.Type}</Text>
      <Text>{this.state.Quantity}</Text>
      </View>
      );
    }
  }

  export default Request;