import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SearchBar = () =>{
    return(
        <View style = {styles.background}>
            <Text> اكتب اسم المنشأة التي تريد البحث عنها </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    background:{
        backgroundColor:'#F0EEEE',
        height: 50,
        borderRadius: 5,
        marginHorizontal: 15
    }
});

export default SearchBar;