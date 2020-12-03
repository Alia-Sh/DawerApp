const functions = require('firebase-functions');
const admin =require('firebase-admin');
const moment = require('moment');
var fetch = require('node-fetch');
admin.initializeApp(functions.config().firebase);
// import moment from 'moment';
// import firebase from '../Database/firebase';
var database = admin.database();

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exports.textToLength = functions.https.onRequest((request, response) => {
//     var text =request.query.text
//     var textLength=text.length
//     response.send(textLength+"");
//   });

exports.newNodeDetected = functions.database.ref('User/{userId}/Name')
.onWrite((change,context)=>{
    var oldName=change.before.val();
    var newName=change.after.val();
    var userId=context.params.userId;
    console.log(userId + " change his/her name from "+oldName+" to "+newName);

    return null;
});

exports.pushDataEveryMinute = functions.pubsub.schedule('every day 4:00').onRun((context)=>{
    var currentDate = new Date();
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
                            var currentDate2 = moment(currentDate).format('Y/M/D HH:mm');
                            var date=snapshot.val().DateAndTime;
                            var INDEX=date.indexOf(" ");
                            var INDEX2=currentDate2.indexOf(" ");
                            var reqDate=moment(date.substring(0,INDEX)).format('Y/M/D');
                            var curDate=moment(currentDate2.substring(0,INDEX2)).format('Y/M/D')
                            if(moment(reqDate).isSameOrBefore(curDate)){
                                if(snapshot.val().Status==="Pending"){
                                    database.ref('PickupRequest/'+userId+"/"+requestId).update({
                                        Status:"Rejected" 
                                    })
                                    database.ref("User/"+userId).on('value',snapshot=>{
                                        if(snapshot.val().expoToken){
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

    database.ref("metadata/lastUpdate/").set(moment(currentDate).format('Y/M/D HH:mm'));
    return null;
});
// 'every 5 minutes'
exports.pushDataEveryDay= functions.pubsub.schedule('every day 5:00').onRun((context)=>{
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
                            var currentDate2 = moment(tomorrow).format('Y/M/D HH:mm');
                            var date=snapshot.val().DateAndTime;
                            var INDEX=date.indexOf(" ");
                            var INDEX2=currentDate2.indexOf(" ");
                            var reqDate=moment(date.substring(0,INDEX)).format('Y/M/D');
                            var curDate=moment(currentDate2.substring(0,INDEX2)).format('Y/M/D')
                            if(moment(reqDate).isSame(curDate)){
                                if(snapshot.val().Status==="Accepted"){
                                    database.ref("User/"+userId).on('value',snapshot=>{
                                        console.log("before token",snapshot.val().expoToken);
                                        if(snapshot.val().expoToken){
                                            console.log("token",snapshot.val().expoToken);
                                            return sendNotifications(snapshot.val().expoToken,'نود تذكيرك بموعد استلام طلبك غداً الساعة'+date.substring(INDEX),'تذكير','NotificationsPage')
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
    database.ref("metadata2/lastUpdate/").set(moment(tomorrow).format('Y/M/D  HH:mm'));
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