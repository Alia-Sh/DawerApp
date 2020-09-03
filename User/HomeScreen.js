import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SearchBar from '../components/SearchBar';

const HomeScreen = () =>{
    return(
        <View>
            <SearchBar/>
            <Text> هنا الصفحة الرئيسية اللي فيها الخمس انواع</Text>
        </View>
    );
};

const styles = StyleSheet.create({});

export default HomeScreen;
