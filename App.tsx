/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *564409 4  `1221`  qa98resa  11  q j
 //
 
 * @format
 * @flow strict-local
 */
 import 'react-native-gesture-handler';
 import React, { useEffect, useRef, useState } from 'react';
 import { Provider } from 'react-redux';
 import store from '../meetupnow/src/Redux/Store';
 import Navigator from '../meetupnow/src/Navigator';
 import { withIAPContext } from 'react-native-iap'
 import {
   Platform,
   StatusBar,
   StyleSheet,
   View,
   LogBox,
   Alert,
   AppState,
 } from 'react-native';
 import FlashMessage from 'react-native-flash-message';
 import SplashScreen from 'react-native-splash-screen';
 import messaging from '@react-native-firebase/messaging';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import Network from './src/Network';
 LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
 LogBox.ignoreAllLogs(); //Ignore all log notifications
 const App = (props: any) => {
   const appState = useRef(AppState.currentState);
   let onlineStatus;
   const [appStateVisible, setAppStateVisible] = useState(appState.current);
   const requestUserPermission = async () => {
     await messaging().requestPermission();
     await messaging().registerDeviceForRemoteMessages();
     messaging()
       .getToken()
       .then(async fcmToken => {
         if (fcmToken) {
           console.log('FCM Token ===>', fcmToken);
           await AsyncStorage.setItem('fcmToken', fcmToken);
         } else {
           console.log('[FCMService] user does not have a device token');
         }
       })
       .catch(error => {
         console.log('[FCMService] getToken rejected ', error);
       });
   };
   const getStatus = async () => {
     const userDeatils: any = await AsyncStorage.getItem('user');
     if (JSON.parse(userDeatils)) {
       const body: any = new FormData();
       body.append("id", JSON.parse(userDeatils).id);
       body.append("status", onlineStatus);
       const response = await Network.createApiClient().onlineStatus(body);
       console.log('onloneofflineapi', body,response);
     }
   }
   useEffect(() => {
     const subscription = AppState.addEventListener('change', nextAppState => {
       appState.current = nextAppState;
       setAppStateVisible(appState.current);
       console.log('AppState', appState.current);
       if (appState.current === 'active') {
         onlineStatus = 1
       } else {
         onlineStatus = 0
       }
       getStatus();
     });
 
     return () => {
       subscription.remove();
     };
   }, []);
   useEffect(() => {
     requestUserPermission();
     messaging().onMessage(async remoteMessage => {
       // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
     });
   }, []);
 
 
   useEffect(() => {
     SplashScreen.hide();
   }, []);
   return (
     <Provider store={store}>
       <View style={styles.container}>
         <Navigator />
         <FlashMessage
           type={'danger'}
           duration={5000}
           position={
             Platform.OS === 'ios'
               ? 'top'
               : { top: StatusBar.currentHeight, left: 0, right: 0 }
           }
           floating={Platform.OS !== 'ios'}
         />
       </View>
     </Provider>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
 });
 
 export default withIAPContext(App);
 