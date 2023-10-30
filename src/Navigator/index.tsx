import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, View, Alert, BackHandler, StyleSheet } from 'react-native';
import Splash from '../Component/Splash';
import Login from '../Component/Auth/Login';
import Register from '../Component/Auth/Register';
import Dashboard from '../Component/Dashboard';
import LeftMenu from '../Component/LeftMenu';
import * as Constnt from '../Constant';
import Account from '../Component/Account';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../Configration';
import Otp from '../Component/Auth/Otp';
import MeetUp from '../Component/MeetUp';
import { Images } from '../Assets';
import Mobileinput from '../Component/Auth/Mobileinput';
import Faq from '../Component/Drawer_Screens/Faq';
import Refer from '../Component/Drawer_Screens/ReferEarn';
import Work from './../Component/Drawer_Screens/HowItWork';
import About from './../Component/Drawer_Screens/AboutUs';
import Condition from './../Component/Drawer_Screens/TermsCondition';
import Notification from './../Component/Notification/index';
import Rating from '../Component/Rating';
import recentMeetup from '../Component/Drawer_Screens/RecentMeetUp';
import Profile from '../Component/Profile';
import forgototp from "../Component/Auth/forgototp";
import forgotpassword from '../Component/Auth/forgotpassword';
import Resetpassword from '../Component/Auth/Resetpassword';
import Receiverprofile from '../Component/Receiverprofile';
import Interaction from '../Component/Interaction';
import registerProfile from '../Component/Auth/RegisterProfile';
import AddPhotos from '../Component/AddPhotos';
import OnBoard from '../Component/OnBoard';
import Wallet from '../Component/Drawer_Screens/Wallet';
import PerfectMatch from '../Component/PerfectMatch';
import ChatList from '../Component/FirestoreChat/ChatList';
import Chat from '../Component/FirestoreChat/Chat';
import RatingHistory from '../Component/Drawer_Screens/RatingHistory';
export const navigationRef: any = React.createRef();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const {
  SPLASH,
  LOGIN,
  DASHBOARD,
  MAIN,
  TABS,
  ACCOUNT,
  REGISTER,
  MOBILENUMBER,
  OTP,
  CHAT,
  MEETUP,
  WORK,
  ABOUT,
  CONDITION,
  FAQ,
  REFER,
  NOTIFICATION,
  RATING,
  RECENTMEETUP,
  FORGET_PASSWORD,
  RESETPASSWORD,
  FORGOTOTP,
  RECEIVERPROFILE,
  PROFILE,
  WALLET,
  INTERACTION,
  ADDPHOTOS,
  ONBOARD,
  PERFECTMATCH,
  REGISTERPROFILE,
  FIRESTORE_CHAT,
  RATINGHISTORY
} = Constnt.SCREENS;
const Navigator = () => {
  //=======================================Use Effect =======================//
  React.useEffect(() => {
    function handleBackButton() {
      // @ts-ignore
      const routeInfo = navigationRef.current.getCurrentRoute();
      if (routeInfo.name.toLowerCase() === LOGIN) {
        exitApp();
      } else {
        // @ts-ignore
        if (navigationRef.current.canGoBack()) {
          // @ts-ignore
          navigationRef.current.goBack();
        }
      }
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => backHandler.remove();
  }, []);

  const exitApp = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  //========================Drawer Navigator ====================================//
  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        // @ts-ignore
        screenOptions={{ headerShown: false, gestureEnabled: true }}
        initialRouteName={TABS}
        drawerType={'back'}
        drawerContent={(props: any) => <LeftMenu {...props} />}>
        <Drawer.Screen
          name={TABS}
          component={Tabs}
          options={{
            headerShown: false,
            swipeEnabled: true,
            drawerLabel: 'Home',
          }}
        />
      </Drawer.Navigator>
    );
  };

  //=====================Tab Navigator =====================================//
  const tabScreenOptions = ({ route }: any) => ({
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: COLORS.BOTTOM_COLOR,
      borderColor: 'transparent',
    },
    tabBarHideOnKeyboard: true,
    tabBarIcon: (data: any) => {
      const { focused } = data;
      let iconName;
      if (route.name === DASHBOARD) {
        iconName = Images.home;
      } else if (route.name === ACCOUNT) {
        iconName = Images.profile;
      } else if (route.name === CHAT) {
        iconName = Images.chat;
      } else if (route.name === MEETUP) {
        iconName = Images.meetup;
      }
      return (
        <View style={[styles.tabcontainer, { backgroundColor: focused ? COLORS.LOGINBUTTON : '' }]}>
          <Image
            source={iconName}
            style={{
              height: hp('2.5%'),
              tintColor: focused ? COLORS.WHITE : COLORS.WHITE,
            }}
            resizeMode={'contain'}
          />
        </View>
      );
    },
  });

  const Tabs = () => {
    return (
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen name={DASHBOARD} component={Dashboard} />
        <Tab.Screen name={CHAT} component={ChatList} />
        <Tab.Screen name={MEETUP} component={MeetUp} />
        <Tab.Screen name={ACCOUNT} component={Account} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={SPLASH}>
        <MainStack.Screen name={SPLASH} component={Splash} />
        <MainStack.Screen name={PERFECTMATCH} component={PerfectMatch} />
        <MainStack.Screen name={LOGIN} component={Login} />
        <MainStack.Screen name={REGISTER} component={Register} />
        <MainStack.Screen name={OTP} component={Otp} />
        <MainStack.Screen name={PROFILE} component={Profile} />
        <MainStack.Screen name={FORGOTOTP} component={forgototp} />
        <MainStack.Screen name={RESETPASSWORD} component={Resetpassword} />
        <MainStack.Screen name={FORGET_PASSWORD} component={forgotpassword} />
        <MainStack.Screen name={MOBILENUMBER} component={Mobileinput} />
        <MainStack.Screen name={MAIN} component={DrawerNavigator} />
        <MainStack.Screen name={WORK} component={Work} />
        <MainStack.Screen name={ABOUT} component={About} />
        <MainStack.Screen name={CONDITION} component={Condition} />
        <MainStack.Screen name={FAQ} component={Faq} />
        <MainStack.Screen name={REFER} component={Refer} />
        <MainStack.Screen name={NOTIFICATION} component={Notification} />
        <MainStack.Screen name={RATING} component={Rating} />
        <MainStack.Screen name={RECENTMEETUP} component={recentMeetup} />
        <MainStack.Screen name={RATINGHISTORY} component={RatingHistory} />
        <MainStack.Screen name={WALLET} component={Wallet} />
        <MainStack.Screen name={INTERACTION} component={Interaction} />
        <MainStack.Screen name={ADDPHOTOS} component={AddPhotos} />
        <MainStack.Screen name={ONBOARD} component={OnBoard} />
        <MainStack.Screen name={RECEIVERPROFILE} component={Receiverprofile} />
        <MainStack.Screen name={REGISTERPROFILE} component={registerProfile} />
        <MainStack.Screen name={FIRESTORE_CHAT} component={Chat} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};
export default Navigator;
const styles = StyleSheet.create({
  tabcontainer: {
    alignItems: 'center',
    height: responsiveHeight(5),
    width: responsiveWidth(24),
    justifyContent: 'center'
  }
})