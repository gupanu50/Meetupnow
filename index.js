/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useEffect } from 'react';
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    PushNotification.localNotification({
      channelId: '9876543210',
      title: remoteMessage.data.title,
      message: remoteMessage.data.body,
      playSound: true,
      soundName: 'default',
      messageId: remoteMessage.messageId
    });
  });
  if (Text.defaultProps) {
    Text.defaultProps.allowFontScaling = false;
  } else {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  } // Override Text scaling in input fields
  if (TextInput.defaultProps) {
    TextInput.defaultProps.allowFontScaling = false;
  } else {
    TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
  }
  const  AppNew =()=> {
    useEffect(()=>{
      PushNotification.createChannel(
        {
          channelId: '9876543210', // (required)
          channelName: 'Meetup channel', // (required)
          channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
          playSound: true, // (optional) default: true
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
        (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
      PushNotification.configure({
        // onNotification is called when a notification is to be emitted
        onNotification: notification => console.log(notification),
  
        // Permissions to register for iOS
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
      });
    },[])
      return <App/>;
    }
AppRegistry.registerComponent(appName, () => AppNew);
