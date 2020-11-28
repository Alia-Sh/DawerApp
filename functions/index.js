const functions = require('firebase-functions');
var fetch = require('node-fetch')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database.ref('PickupRequest/{id}').onCreate(event => {

    const root = event.data.ref.root
    var messages = []
    //return the main promise
    return root.child('/User').once('value').then(function (snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var expoToken = childSnapshot.val().expoToken

            if (expoToken) {

                messages.push({
                    "to": expoToken,
                    "body": "Hi you did it"
                })
            }
        })

        return Promise.all(messages)

    }).then(messages => {

        fetch('https://exp.host/--/api/v2/push/send', {

            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
        })
    })

}) 