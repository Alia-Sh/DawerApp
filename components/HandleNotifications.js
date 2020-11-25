import React, { Component } from "react";
import firebase from 'react-native-firebase';

class HandleNotifications extends Component {
    constructor(props) {
        super(props);
        this.getToken = this.getToken.bind(this);
        this.requestPermission = this.requestPermission.bind(this);
        this.checkNotificationPermission = this.checkNotificationPermission.bind(this);
    }

    componentDidMount() {
        this.checkNotificationPermission();

        // setting channel for notification
        const channel = new firebase.notifications.Android.Channel(
            'channelId',
            'Channel Name',
            firebase.notifications.Android.Importance.Max
        ).setDescription('A natural description of the channel');
        firebase.notifications().android.createChannel(channel);

        // showing notification when app is in foreground.
        this.foregroundStateListener = firebase.notifications().onNotification((notification) => {
            firebase.notifications().displayNotification(notification).catch(err => console.error(err));
        });
        
        // app tapped/opened in killed state
        this.appKilledStateListener = firebase.notifications().getInitialNotification()
        .then((notificationOpen: NotificationOpen) => {
            if (notificationOpen) {
                // anything you want to do with notification object.....
            }
        });
        
        // app tapped/opened in foreground and background state
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // ...anything you want to do with notification object.....
        });
    }

    componentWillUnmount() {
        this.appKilledStateListener();
        this.notificationOpenedListener();
        this.foregroundStateListener();
    }

    // firebase token for the user
    async getToken(){
        firebase.messaging().getToken().then((fcmToken) => console.log(fcmToken));
    }
  
    // request permission if permission diabled or not given
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
        } catch (error) {}
    }
  
    // if permission enabled get firebase token else request permission
    async checkNotificationPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken() // call function to get firebase token for personalized notifications.
        } else {
            this.requestPermission();
        }
    }
  
    render() {
        return null;
    }
}

export default HandleNotifications;