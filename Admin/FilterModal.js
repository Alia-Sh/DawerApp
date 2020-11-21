import React,{Component} from 'react';
import {StyleSheet,Text,TouchableOpacity,View,NativeModules,} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class FilterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Area:
                [
                    {ID:0, Name:"شمال الرياض",selected:false},
                    {ID:1, Name:"شرق الرياض",selected:false},
                    {ID:2, Name:"غرب الرياض",selected:false},
                    {ID:3, Name:"جنوب الرياض",selected:false},
                    {ID:4, Name:"جميع المناطق",selected:false}
                ]
            ,alertVisible:true
            ,AreaSelected:''
        };
    }
    const 
    changeSelect=(ID)=>{
        const Area = this.state.Area
        for (var i in Area) {
            if (Area[i].ID == ID) {
                Area[i].selected = true;
                this.setState({AreaSelected:Area[i].Name})
            }else if(Area[i].ID != ID && Area[i].selected==true){
                Area[i].selected = false;
            }
        }
        this.setState(Area)
    }
    render() {
    return(
            <View style={styles.modalView}>
                <View style={{padding:1}}>
                    {this.state.Area.map((item,index) => 
                        <TouchableOpacity onPress={()=>{this.changeSelect(item.ID)}}>
                            <View style={{flexDirection:'row-reverse'}}>
                                <Text style={[styles.textStyle,{
                                            color:item.selected?"#9cac74":"#161924",
                                            fontSize:item.selected?18:18,
                                            fontWeight:item.selected? "bold" :"normal",flex:1}]}>{item.Name}</Text>
                                {item.selected?
                                    <Feather
                                        style={{margin:8}}
                                        name="check-circle"
                                        color="#9cac74"
                                        size={18}/>
                                    :
                                    null
                                }
                            </View> 
                                <View style={{width:'100%',height:0.5,backgroundColor:"#E0E0E0"}}></View>
                        </TouchableOpacity>
                        )}
                </View>

                <View style={{flexDirection:Platform.OS === 'android' &&
                    NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                    NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
                    NativeModules.I18nManager.localeIdentifier === 'ar_SA'?'row':'row-reverse',
                    alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity 
                    style={styles.okButton}
                    onPress={()=>{
                        this.props.FilterDrivers(this.state.AreaSelected)
                }}>
                    <Text style={styles.okStyle}>اختر</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={()=>{
                        this.props.changeLayout()
                    }}>
                        <Text style={styles.okStyle}>إلغاء</Text>
                </TouchableOpacity>
                </View>
            </View>
    );
    }

}

const styles=StyleSheet.create({
    modalView:{
        marginRight:10,
        marginLeft:10,
        backgroundColor:"#fff",
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        padding:15,
        shadowColor:'#161924',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius:3.85,
        elevation:5,        
    },
    textStyle:{
        color:"#161924",
        textAlign:'right',
        fontSize:18,
        margin:8

    },
    okStyle:{
        color:"#161924",
        textAlign:'center',
        fontSize:20
    },
    okButton:{
        backgroundColor:'#9cac74',
        borderRadius:5,
        padding:5,
        elevation:2,
        width:'30%',
        margin:15,
    },
    cancelButton:{
      backgroundColor:'#9E9E9E',
      borderRadius:5,
      padding:5,
      elevation:2,
      width:'30%',
      margin:15,
    }
})