import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
//import { TextInput } from 'react-native-paper';


const SearchBar = ({term, OnTermChange, OnTermSubmit, BarWidth, BarMargin}) =>{
    return(
        <View style = { width = BarWidth, marginHorizontal= BarMargin, styles.background}>
            <TextInput 
                autoCapitalize = "none"
                autoCorrect = {false}
                style = {styles.inputStyle}
                placeholder = "ابحث هنا" 
                value = {term}
                onChangeText = {OnTermChange}
                onEndEditing = {OnTermSubmit}
            />
            <FontAwesome5 name="search" style= {styles.iconStyle} color="gray"/>
        </View>
    );
};

const styles = StyleSheet.create({
    background:{
        backgroundColor:'#ecebe8',
        height: 35,
        //width: '80%', //was 290
        borderRadius: 5,
        marginTop: 10,
        //marginHorizontal: 30,//40
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    inputStyle:{
        marginRight: 10,
        fontSize : 15,
        width: '70%', //was 220
        textAlign: 'right'
    },
    iconStyle: {
        fontSize : 22,
        marginRight: 5,
        alignSelf: 'center'
    }
});

export default SearchBar;