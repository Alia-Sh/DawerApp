import React,{useState} from 'react';
import {Modal,StyleSheet,Text,TouchableOpacity,View,Image,Dimensions,NativeModules,TextInput, Alert,FlatList,Platform} from 'react-native';

const DisplayRequest=(MaterialList,DateAndTime)=>{
    const renderList = ((item)=>{
        return(
            <Card 
            >
            <View style={styles.cardView}>
                <View>
                    <Text style={styles.text}>نوع المواد:</Text>
                     <Text style={styles.Text}>{item.material}</Text>
                     <Text style={styles.text}> الكمية:</Text>
                     <Text style={styles.Text}>{item.Quantity}</Text>
                     {/* <Text style={styles.text}> تاريخ و وقت الإستلام:</Text>
                     <Text style={styles.Text}>{item.DateAndTime}</Text> */}
                </View>

                <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:10}}>
                     <TouchableOpacity style={styles.EditIconStyle}
                     onPress={()=>EditRequest(item)}>
                     <Image 
                        source={require('../assets/EditIcon.png')}
                        style={styles.Edit}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.EditIconStyle}
                     onPress={()=>DeleteRequest(item)}>
                     <Image 
                        source={require('../assets/DeleteIcon.png')}
                        style={styles.Edit}
                        />
                    </TouchableOpacity>

                </View>
             </View>
        </Card>
        )

    })
    return(
        <View style={{flex:1}}>
        <FlatList
        data={MaterialList}
        renderItem={({item})=>{
          return renderList(item)
        }}
        keyExtractor={item=>`${item.id}`}
        // onRefresh={()=>fetchData()}
        // refreshing={loading}
        />
        <View style={{flexDirection:'row',justifyContent:'space-between',margin:15}}>
            <TouchableOpacity onPress={() =>setData({...data,isVisibleList:false})}>
                <Image
                    style={styles.ImageStyle}
                    source={require('../assets/back.png')}
                    resizeMethod='scale'
                />
            </TouchableOpacity>
            <TouchableOpacity 
             onPress={() =>DateAndTimeStep()}
            >
            <Image     
                style={styles.ImageStyle}
                source={require('../assets/send.png')}
                />
            </TouchableOpacity>  
        </View>
    </View>
    )
}

const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.09;
const wight_logo = width * 0.90;
const theme= {
    colors:{
        primary: "#C0CA33"
    }
}
const styles=StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    headerImage: {
        width:wight_logo ,
        height: height_logo,
    },
    ImageStyle:{
        width:42,
        height:39,
        margin:5
    },
    header:{
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        top:-45
    },
    text_header_modal:{
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    iconIOS:{
        position:'absolute',
        left:15
    },
    iconAndroid:{
        position:'absolute',
        right:15
    },
    text: {
        color: '#b2860e',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
        marginRight:5,
        marginLeft:5,
        marginTop:20
    },
    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        textAlign: 'right',
        marginRight:10,  
    },
    action: {
        // flexDirection: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'row' : 'row-reverse',
        margin: 10,
        borderColor:'#f2f2f2',
        borderWidth:2,
        borderRadius:5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingTop: 10,
        paddingBottom:10,
        width:'70%'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ? 'left' : 'right',
        paddingRight:20
    },
    mycard:{
        // margin:5,// بعدها عن الحواف 
        
    },
    cardView:{
        // flexDirection:Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?'row':'row-reverse',
        // justifyContent:'space-between',
        backgroundColor: '#F3F3F3',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius :10,
        shadowColor :'#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
        // padding :12,
    },
    Text:{
        fontSize:18,
        // marginTop:20,
        marginRight:5,
        marginLeft:5,  
        textAlign:Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier === 'ar_EG' || NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?'left':'right'  
    },
    EditIconStyle:{
        margin:10
    },
    Edit:{
        width:30,
        height:30,
    },
    button:{
        flexDirection:"row",
        justifyContent:"space-around",
        paddingTop:15,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:15
    },
    errorMsg2: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: 'center',
    }    
});
export default DisplayRequest