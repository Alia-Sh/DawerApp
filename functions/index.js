const functions = require('firebase-functions');
const admin =require('firebase-admin');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
const tz=require('moment-timezone');
var fetch = require('node-fetch');
admin.initializeApp(functions.config().firebase);
var database = admin.database();

exports.newNodeDetected = functions.database.ref('User/{userId}/Name')
.onWrite((change,context)=>{
    var oldName=change.before.val();
    var newName=change.after.val();
    var userId=context.params.userId;
    console.log(userId + " change his/her name from "+oldName+" to "+newName);

    return null;
});
//1 1 * * *
exports.pushDataEveryMinute = functions.pubsub.schedule('1 00 * * *')
.timeZone('Asia/Riyadh').onRun((context)=>{
    // var currentDate = new Date();
    // sendNotifications("ExponentPushToken[HLODp9Ac03jIiXoQoFPmKP]",' تم رفض الطلب ','قبول الطلب','NotificationsPage')
    database.ref('PickupRequest/').on('value',snapshot=>{
        const Data = snapshot.val();
        if(Data){        
            snapshot.forEach(function(snapshot){
                var userId=snapshot.key;        
                database.ref('PickupRequest/'+userId).on('value',snapshot=>{
                    snapshot.forEach(function(snapshot){
                        var requestId=snapshot.key;
                        database.ref('PickupRequest/'+userId+"/"+requestId).on('value',snapshot=>{
                            // var currentDate2 = moment(currentDate).format('Y/M/D HH:mm');
                            var date=snapshot.val().DateAndTime;
                            // var INDEX=date.indexOf(" ");
                            // var INDEX2=currentDate2.indexOf(" ");
                            // var reqDate=moment(date.substring(0,INDEX)).format('Y/M/D');
                            // var curDate=moment(currentDate2.substring(0,INDEX2)).format('Y/M/D')
                            // console.log("date ",date);
                            // console.log("date2 ",moment(date).format('Y/M/D'));
                            // console.log("cuurent Date ",moment().tz('Asia/Riyadh').format('Y/M/D'));
                            // console.log("Time ",moment(date).format('LT'));
                            // console.log("isSameOrBefore ",moment(moment(date).format('Y/M/D')).isSameOrBefore(moment().tz('Asia/Riyadh').format('Y/M/D')));
                            if(moment(moment(date).format('Y/M/D')).isSameOrBefore(moment().tz('Asia/Riyadh').format('Y/M/D'))){
                                if(snapshot.val().Status==="Pending"){
                                    database.ref('PickupRequest/'+userId+"/"+requestId).update({
                                        Status:"Rejected" 
                                    })
                                    database.ref("User/"+userId).on('value',snapshot=>{
                                        if(snapshot.val().expoToken){
                                            database.ref('Notification/'+userId+"/").push({
                                                RequestId: requestId,
                                                DateAndTime:moment().tz('Asia/Riyadh').format('llll'),
                                                Status:'Rejected'
                                            })
                                            return sendNotifications(snapshot.val().expoToken,'نعتذر عن قبول طلبك','تم رفض طلبك','NotificationsPage')
                                        }
                                    })
                                }
                            }
                        })
                    })
                })
            })
        }
    })
    database.ref("metadata/lastUpdate/").set(moment().tz('Asia/Riyadh').format('LT'));
    return null;
});
// 'every 5 minutes'
exports.pushDataEveryDay= functions.pubsub.schedule('1 6 * * *')
.timeZone('Asia/Riyadh').onRun((context)=>{
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    database.ref('PickupRequest/').on('value',snapshot=>{
        const Data = snapshot.val();
        if(Data){        
            snapshot.forEach(function(snapshot){
                var userId=snapshot.key;        
                database.ref('PickupRequest/'+userId).on('value',snapshot=>{
                    snapshot.forEach(function(snapshot){
                        var requestId=snapshot.key;
                        database.ref('PickupRequest/'+userId+"/"+requestId).on('value',snapshot=>{
                            // var currentDate2 = moment(tomorrow).format('Y/M/D HH:mm');
                            var date=snapshot.val().DateAndTime;
                            // var INDEX=date.indexOf(" ");
                            // var INDEX2=currentDate2.indexOf(" ");
                            // var reqDate=moment(date.substring(0,INDEX)).format('Y/M/D');
                            // var curDate=moment(currentDate2.substring(0,INDEX2)).format('Y/M/D')
                            if(moment(moment(date).format('Y/M/D')).isSame(moment().add(1, 'days').tz('Asia/Riyadh').format('Y/M/D'))){
                                if(snapshot.val().Status==="Accepted"){
                                    database.ref("User/"+userId).on('value',snapshot=>{
                                        console.log("before token",snapshot.val().expoToken);
                                        if(snapshot.val().expoToken){
                                            console.log("token",snapshot.val().expoToken);
                                            database.ref('Notification/'+userId+"/").push({
                                                RequestId: requestId,
                                                DateAndTime:moment().tz('Asia/Riyadh').format('llll'),
                                                Status:'Remember'
                                            })
                                            return sendNotifications(snapshot.val().expoToken,'نود تذكيرك بموعد استلام طلبك غداً الساعة '+moment(date).format('LT'),'تذكير','NotificationsPage')
                                        }
                                    })
                                }
                            }
                        })
                    })
                })
            })
        }
    })
    database.ref("metadata2/lastUpdate/").set(moment().add(1, 'days').tz('Asia/Riyadh').format('Y/M/D hh:mm'));
    return null;
});




const sendNotifications=async(token,msg,title,screen,param)=>{
    if(token!==""){
      const message = {
        to: token,
        sound: 'default',
        title: title,
        body: msg,
        data: { screen: screen,param:param},
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }
  };