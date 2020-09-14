import React from 'react';
import { StyleSheet, View, Image}from 'react-native';
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import {Title,Drawer,Avatar,Caption,Paragraph,Text,TouchableRipple,Switch}from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

export function DrawerContent(props){
    return(
       <View style={{flex:1}}>
           <DrawerContentScrollView {... props}>
               <View style={styles.drawerContent}>
                   <View style={styles.userInfoSection}>
                     <View style={styles.LogoToCenter}>
                       <Image
                          source={require('../assets/DawerLogo.png')}
                          style={styles.logo}
                       />
                     </View>
                   </View>
               </View>
               <Drawer.Section style={styles.drawerSection}>
               <DrawerItem
                    icon={({color,size})=> (
                        <Icon
                        name="account-outline"
                        color={color}
                        size={size}/>
                    )}
                    label="الملف الشخصي "
                    onPress={() =>{props.navigation.navigate("UserViewProfile")}}/>

                    <DrawerItem
                    icon={({color,size})=> (
                        <Icon
                        name="exit-to-app"
                        color={color}
                        size={size}/>
                    )}
                    label="تسجيل الخروج"
                    onPress={() =>{}}/> 
           </Drawer.Section>
           </DrawerContentScrollView>
       </View> 
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 30,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    logo: {
      width: 200,
      height: 90,
    },LogoToCenter:{
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:30
    }
  });

export default DrawerContent