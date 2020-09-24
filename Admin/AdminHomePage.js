import React from 'react';
import { StyleSheet,
   Text,
   View,
   Button,
   Dimensions,
   TouchableOpacity,
    Image,
    StatusBar, Alert
} from 'react-native';
import firebase from '../Database/firebase';
import { LinearGradient } from 'expo-linear-gradient'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';


        




const AdminHomePage = ({navigation})=>{
  //backend

  const logout=()=>{
    firebase.auth().signOut().then(function() {
      console.log('loged out')
        navigation.navigate("AdminLogin")
      }).catch(function(error) {
          console.log(error)
      });
}

 openRightPage=(page)=>{

  switch(page) {
 
    case 'facility':
      navigation.navigate("FacilityHome");
      break;
    
    case 'driver':
      navigation.navigate("DriverHome");
      break;

    case 'request':
      navigation.navigate("RequestHome");
      break;

    case 'category':
      navigation.navigate("CategoryHome");
      break;

      case 'community':
      navigation.navigate("CommunityHome");
      break;

    default:
      ;
  
    }

}


  //front end
    return (
        <View style={styles.container}>
     
     <StatusBar backgroundColor='#009387' barStyle="light=content"/>
     <SafeAreaView>
         <View style={styles.fixedHeader} >
         <LinearGradient
        colors={["#809d65","#9cac74"]}
        style={{height:"100%" ,width:"100%", flexDirection: 'row',
        justifyContent:'space-between'}}> 
        
         <TouchableOpacity  onPress={()=> logout()} >
         <Image
          source={require('../assets/AdminIcons/shutdown.png')}
          style={styles.logout}
          resizeMode="stretch"
          />
          </TouchableOpacity>
         <Image
          source={require('../assets/AdminIcons/HomePageLogo.png')}
          style={styles.logo}
          resizeMode="stretch"
          />
          </LinearGradient>
         </View>
         
        {//Here to display icones
        }
        <View style={styles.containericons}>
          <View style={styles.icon} >
            <View style={styles.insidIcones}>
              <TouchableOpacity onPress={()=> openRightPage("facility")}>
            <Image
          source={require('../assets/AdminIcons/FacilityIcon.jpg')}
          style={styles.iconsquare}
          resizeMode="stretch"
          />
          </TouchableOpacity>
            </View>
            <View style={styles.insidIcones}>
              <TouchableOpacity onPress={()=> openRightPage("driver")}>
            <Image
          source={require('../assets/AdminIcons/driverIcon.jpg')}
          style={styles.iconsquare}
          resizeMode="stretch"
          />
          </TouchableOpacity>
            </View>
          </View>
          <View style={styles.icon} >
          <View style={styles.insidIcones}>
          <TouchableOpacity onPress={()=> openRightPage("request")}>
            <Image
          source={require('../assets/AdminIcons/requestIcon.jpg')}
          style={styles.iconsquare}
          resizeMode="stretch"
          />
           </TouchableOpacity>
            </View>
            <View style={styles.insidIcones}>
           <TouchableOpacity onPress={()=> openRightPage("category")}>
            <Image
          source={require('../assets/AdminIcons/categoryIcon.png')}
          style={styles.iconsquare}
          resizeMode="stretch"
          />
           </TouchableOpacity>
          
            </View>
            
            </View>
        </View>
        <View style={styles.communityStuff}>
          
        <Image
          source={require('../assets/AdminIcons/communityBack.png')}
          style={styles.communityB}
          resizeMode="stretch"
          />

        <Image
          source={require('../assets/AdminIcons/communityIcon.png')}
          style={styles.communityA}
          resizeMode="stretch"
      
          />
     
        </View>


        
          
        </SafeAreaView>  
        </View>
      );

}
// here styles
const {height} = Dimensions.get("screen");
const height_logo = height* 0.17;
const height_logout = height* 0.04;
const height_mid = height* 0.60;

const {width} = Dimensions.get("screen");
const width_logo = width* 0.22;
const width_logout = width* 0.055;
const width_mid = width* 0.85;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAF7',
      width: width,
      height:height*.3,
    }, 
   
    
    logo: {
      width: width_logo ,
      height: height_logo,
      marginTop: -18 ,
    // alignItems:'baseline',
     shadowColor :'#F1F1EA',
     // shadowOffset :{width:2,height:2},
     // shadowOpacity :20,
  
  },
  logout: {
    width: width_logout ,
    height: height_logout,
    marginTop: 24 ,
    marginLeft: 20 ,
    alignItems:'baseline',
    shadowColor :'#F1F1EA',
   // shadowOffset :{width:2,height:2},
    //shadowOpacity :20,
    borderRadius :10,
   // padding :30,

},

    fixedHeader :{
     // flex :2,
      height:height*.30,
      backgroundColor :'#9E9D24',
      flexDirection: 'row',
      justifyContent:'space-between',
      borderBottomRightRadius:150,
      borderBottomLeftRadius:150,
      overflow: 'hidden',
      height:'55%'
     // alignItems :'center'
    },
    containericons :{
      width : width_mid,
      height :height_mid,
      alignSelf :'center',
     // zIndex: 5,
      position: 'absolute',
      top:width*.45,
      
    },

    icon :{
      flexDirection: 'row',
      justifyContent:'space-around',
      alignSelf :'center',
      
    },

    insidIcones: {
      shadowColor :'#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
      padding :20,
     
      
    },
    iconsquare :{
      width :130,
      height :130,
      borderRadius:10,
    },

    communityStuff:{
      flexDirection :'row-reverse',
      
    },
    communityB :{
      width :80,
      height :60,
      position: 'absolute',
      top:width*.90,
      borderTopLeftRadius :5,
      
    },
    communityA :{
      width :75,
      height :55,
      position: 'absolute',
      top:width*.90,
      left :height *.001,
      
    }
    


  
  });

export default AdminHomePage