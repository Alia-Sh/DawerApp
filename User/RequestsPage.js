import React,{useState,useEffect} from 'react';
import {View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Image,
    FlatList} from 'react-native';
import {Card,Title,FAB} from 'react-native-paper';
import NewRequestModal from '../User/NewRequestModal';
import firebase from '../Database/firebase';
const  RequestsPage= () =>{
    const [alertVisible,setAlertVisible]= useState(false);
    // const[RequestList,setRequestList]= useState([]);
    // const[loading,setLoading]=useState(true)
    // var userId = firebase.auth().currentUser.uid;
    // const fetchData=()=>{
    //     firebase.database().ref("PickupRequest/"+userId+"/DeliveryDriverId").orderByChild("TimeStamp").on('value',snapshot=>{
    //       const Data = snapshot.val();
    //       if(Data){
    //         var li = []
    //         snapshot.forEach(function(snapshot){
    //         console.log(snapshot.key);
    //         console.log(snapshot.val().DateAndTime);
    //         var temp={DateAndTime:snapshot.val().DateAndTime,Id:snapshot.key}
    //         li.push(temp)
    //         setLoading(false)
    //         })
    //         setRequestList(li)
    //         console.log(li) 
    //       }
    //     })
    //   }
    
    //   useEffect(()=>{
    //     fetchData()
    // },[])

    // const renderList = ((item)=>{
    //     return(
    //         <Card style={styles.mycard} >
    //           <View style={styles.cardContent}>
    //               <View style={{flexDirection:Platform.OS === 'android' &&
    //                       NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
    //                       NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?
    //                       'row':'row-reverse'}}>
    //               <Title style={styles.title}>{item.DateAndTime}</Title>
    //               <Title style={styles.title}>{item.Id}</Title>
    //               </View>
    
    //               <TouchableOpacity style={styles.EditIconStyle}
    //                 // onPress={()=>setDaleteModal({
    //                 //   ...DeleteModal,
    //                 //   IsVisible:true,
    //                 //   Name:item.Name,
    //                 //   Id:item.CategoryId
    //                 // })}
    //                 >
    //                 <Image 
    //                     source={require('../assets/DeleteIconRed.png')}
    //                     style={styles.Delete}
    //                     />
    //               </TouchableOpacity>
    //           </View>
    //         </Card>
    //     )
    //   });
    return(
        <View style={styles.container}>
            <View style={{flexDirection:Platform.OS === 'android' &&
                      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
                      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ?
                      'row':'row-reverse',justifyContent:'space-between'}}>
                <TouchableOpacity onPress={()=>setAlertVisible(true)}>
                    <Title style={[styles.text,{fontWeight: 'bold'}]}>طلب جديد</Title>
                </TouchableOpacity>
                <Title style={styles.text}>عدد الطلبات</Title>
                <TouchableOpacity style={{margin:10}}
                    //  onPress={()=>DeleteRequest(item)}
                     >
                     <Image 
                        source={require('../assets/HistoryOfRequests.png')}
                        style={styles.HistoryOfRequestsIcon}
                        />
                    </TouchableOpacity>
            </View>
            <Image
                style={{width:'100%'}}
                source={require('../assets/line.png')}
                />

            {alertVisible? 
                <NewRequestModal setAlertVisible={setAlertVisible} ></NewRequestModal>

                :  
                null
            }
                {/* <FlatList
                data={RequestList}
                renderItem={({item})=>{
                return renderList(item)}}
                keyExtractor={item=>`${item.Id}`}
                style={{flex:8}}
                
                onRefresh={()=>fetchData()}
                refreshing={loading}
              />  */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    text: {
        color: '#b2860e',
        fontSize: 18,
        textAlign: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
        marginRight:10,
        marginLeft:10,
        marginTop:10
    },
    HistoryOfRequestsIcon:{
        width:30,
        height:30,
    }
});

export default RequestsPage;