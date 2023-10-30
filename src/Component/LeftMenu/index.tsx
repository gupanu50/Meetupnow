import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Platform,
  Linking,
} from 'react-native';
import {Divider, Image} from 'react-native-elements';
import {COLORS, FONT_FAMILIES, FONT_SIZES, METRICS} from '../../Configration';
import {Images} from '../../Assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Constant from '../../Constant';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import withConnect from './withConnect';
import {navigationRef} from '../../Navigator';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import { useSignInViaSocialHook } from '../Auth/Register/useLoginHook';
const {
  LOGIN,
  WORK,
  CONDITION,
  ABOUT,
  FAQ,
  REFER,
  RECENTMEETUP,
  WALLET,
  DASHBOARD,
  RATINGHISTORY,
  ACCOUNT
} = Constant.SCREENS;

const menuArray = [
  {
    name: 'Your Wallet',
    image: Images.wallet,
    isActive: true,
    screen: WALLET,
    arrow: Images.right_arrow,
  },
  {
    name: `How it works`,
    image: Images.work,
    isActive: true,
    screen: WORK,
    arrow: Images.right_arrow,
  },
  {
    name: 'Recent Meetups',
    image: Images.recentmeet,
    isActive: true,
    screen: RECENTMEETUP,
    arrow: Images.right_arrow,
  },
  {
    name: 'Rating History',
    image: Images.meetupHistory,
    isActive: true,
    screen: RATINGHISTORY,
    arrow: Images.right_arrow,
  },
  {
    name: 'Refer & Earn',
    image: Images.refer,
    isActive: true,
    screen: REFER,
    arrow: Images.right_arrow,
  },
  {
    name: "Support & FAQ's",
    image: Images.support,
    isActive: true,
    screen: FAQ,
    arrow: Images.right_arrow,
  },
  {
    name: 'Terms & Conditions',
    image: Images.terms,
    isActive: true,
    screen: CONDITION,
    arrow: Images.right_arrow,
  },
  {
    name: 'About us',
    image: Images.about,
    isActive: true,
    screen: ABOUT,
    arrow: Images.right_arrow,
  },
  {
    name: 'Logout',
    image: Images.drawer_logout,
    isActive: true,
    screen: LOGIN,
    arrow: Images.red_arrow,
  },
];

const LeftMenu = (props: any) => {
  const {navigation, loginAction, updName, updProfile} = props;
  const {logoutFromGoogle} = useSignInViaSocialHook(loginAction);
  const youtubeLink = 'https://youtube.com/@MeetupNow';
  const facebookLink = 'https://www.facebook.com/MeetupNowIndia';
  const instLink = 'https://www.instagram.com/meetupnowindia/';
  useEffect(() => {}, []);

  const logoutApi = async () => {
    try {
      AsyncStorage.removeItem('credentials');
      AsyncStorage.removeItem('user');
      await logoutFromGoogle();
      await auth().signOut();
      navigation.navigate(LOGIN);
      resetToDashboard();
    } catch (error) {
      console.log('=====error in logout======>>>>', error);
    }
  };

  const onSelectMenu = (data: any) => {
    const {screen, name} = data;
    navigation.closeDrawer();
    //============ Logout ===============//
    if (name === 'Logout') {
      const actions = [
        {
          text: 'No',
          onPress: () => console.log('cancel Pressed'),
        },
        {
          text: 'Yes',
          onPress: () => {
            logoutApi();
          },
        },
      ];
      Alert.alert('Logout', Constant.VALIDATE_FORM.LOGOUT, actions, {
        cancelable: false,
      });
    } else {
      navigation.navigate(screen);
    }
  };

  const renderProfile = () => {
    return (
      <ImageBackground style={{flex: 1}} source={Images.drawer_bg}>
        <View style={styles.profile}>
          <View style={{width: wp(65), alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={() => navigation.closeDrawer()}>
              <View style={{width: wp(6), alignItems: 'flex-end'}}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>
                  X
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=> navigation.navigate(ACCOUNT)}>
          <View style={{width: wp(23), flexDirection: 'row'}}>
            <Image
              source={{uri: updProfile}}
              style={styles.profileImage}
            />
            <View style={{justifyContent: 'flex-end', right: '25%'}}>
              <Image source={Images.online} style={{height: 20, width: 20}} />
            </View>
          </View>
          </TouchableOpacity>
          <Text style={styles.title}>{updName}</Text>
        </View>
      </ImageBackground>
    );
  };

  const renderMenu = (item: any) => {
    const {image, name, arrow} = item.item;
    return (
      <>
        <TouchableOpacity
          key={name}
          onPress={() => onSelectMenu(item.item)}
          style={styles.menuItem}>
          <View style={styles.listview}>
            <View style={styles.left}>
              <Image source={image}
              style={styles.menuIcon}
              />
            </View>
            <View style={styles.center}>
              <Text
                style={[
                  styles.drawer_txt,
                  {color: name === 'Logout' ? '#EB4273' : 'black'},
                ]}>
                {name}
              </Text>
            </View>
            <View style={styles.left}>
              <Image source={arrow} style={styles.arrowicon} />
            </View>
          </View>
        </TouchableOpacity>
        <Divider orientation={'horizontal'} color={'#000000'} />
      </>
    );
  };
  const resetToDashboard = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: DASHBOARD}], // Replace DASHBOARD with the actual route name
    });

    navigationRef.current.dispatch(resetAction);
  };

  return (
    <View style={styles.container}>
      <View style={styles.up}>{renderProfile()}</View>
      <LinearGradient
        useAngle={true}
        angle={40}
        // angleCenter={{x: 1, y: 1}}
        colors={['#AEAFB000', '#AEAFB0']}
        style={styles.linearGradient}>
        <FlatList
          style={styles.list}
          data={menuArray}
          renderItem={renderMenu}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
      <View style={styles.footer}>
        <View style={styles.insidefooter}>
          <View style={styles.follow}>
            <Text style={styles.txt}>{'Follow Us On'}</Text>
          </View>
          <View style={styles.social}>
            <View style={styles.insidesocial}>
              <View style={styles.insta}>
                <View style={styles.socialbtn}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={() => Linking.openURL(instLink)}>
                    <Image
                      style={styles.socialicon}
                      source={Images.instagram}
                    />
                    <Text style={styles.drawer_txt}>{'  Instagram'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.fb}>
                <View style={styles.socialbtn}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={() => Linking.openURL(facebookLink)}>
                    <Image style={styles.socialicon} source={Images.fb} />
                    <Text style={styles.drawer_txt}>{'  Facebook'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.youtube}>
                <View style={styles.socialbtn}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={() => Linking.openURL(youtubeLink)}>
                    <Image style={styles.socialicon} source={Images.youtube} />
                    <Text style={styles.drawer_txt}>{'  Youtube'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default withConnect(LeftMenu);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  up: {
    height: hp('25%'),
  },
  linearGradient: {
    flex: Platform.OS === 'android' ? 0.9 : 0.94,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  menuIcon: {
    height: 20,
    width: 20,
    resizeMode:'contain',
  },
  profileImage: {
    height: 90,
    borderRadius: 80,
    borderColor: COLORS.WHITE,
    borderWidth: 8,
    width: 90,
    resizeMode: 'cover',
  },
  title: {
    marginTop: METRICS.MAR_10,
    color: COLORS.WHITE,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.ROBOTO_BLACK,
  },
  subtitle: {
    color: COLORS.WHITE,
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: METRICS.MAR_55,
    paddingBottom: METRICS.MAR_60,
  },
  list: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  drawer_txt: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONT_FAMILIES.ROBOTO_LIGHT,
    fontWeight: Platform.OS === 'ios' ? '400' : 'bold',
  },
  arrowicon: {
    height: hp('1.5%'),
    width: wp('2%'),
    resizeMode:'contain'
  },
  listview: {
    height: hp('7%'),
    flexDirection: 'row',
  },
  left: {
    height: hp('6%'),
    width: wp('15%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    height: hp('6%'),
    width: wp('40%'),
    justifyContent: 'center',
  },
  footer: {
    height: hp('15%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  insidefooter: {
    height: hp('12%'),
    width: wp('65%'),
  },
  follow: {
    height: hp('5%'),
    justifyContent: 'center',
  },
  txt: {
    fontSize: FONT_SIZES.H5,
    fontWeight: 'bold',
    color: COLORS.GRAY,
    fontFamily: FONT_FAMILIES.ROBOTO_BLACK,
  },
  social: {
    height: hp('6%'),
    justifyContent: 'center',
  },
  insta: {
    width: wp('22%'),
    justifyContent: 'center',
  },
  fb: {
    width: wp('21.5%'),
    justifyContent: 'center',
  },
  youtube: {
    width: wp('21%'),
    justifyContent: 'center',
  },
  socialicon: {
    height: 15,
    width: 15,
  },
  socialbtn: {
    flexDirection: 'row',
    width: wp('20%'),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insidesocial: {
    flexDirection: 'row',
    height: hp(4),
  },
});
