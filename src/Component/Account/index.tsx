import React, { useEffect, useState } from 'react';
import { COLORS, FONT_FAMILIES } from '../../Configration';
import NavHeader from '../../ReuableComponent/NavHeader';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  LogBox,
  FlatList,
  Platform
} from 'react-native';
import withConnect from './withConnect';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Images } from '../../Assets';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Constant from '../../Constant';
import ApiClient from '../../Network';
import { showMessage } from 'react-native-flash-message';
import ModalLoader from '../../ReuableComponent/ModalLoader';
import { useIsFocused } from '@react-navigation/native';

const { PROFILE, DASHBOARD, WALLET } = Constant.SCREENS

const receiverProfile = (props: any) => {
  const isFocused = useIsFocused();
  const [Name, setName] = useState('');
  const [City, setCity] = useState('');
  const [Description, setDescription] = useState('');
  const [Email, setEmail] = useState('');
  const [Gender, setGender] = useState('');
  const [Interest, setInterest] = useState('');
  const [Personality, setPersonality] = useState('');
  const [Mobile, setMobile] = useState('');
  const [Username, setUsername] = useState('');
  const [Image1, setImage1] = useState('');
  const [Image2, setImage2] = useState('');
  const [Image3, setImage3] = useState('');
  const [Dob, setDob] = useState('');
  const [Coins, setCoins] = useState('');
  const [verifyButtonVisibility, setVerifyButtonVisibility] = useState(true);
  const [profileImg, setprofileImg] = useState('');
  const [loading, setLoading] = useState(false);

  // ********************** coinPlan *****************
  const getProfile = async () => {
    setLoading(true);
    const result: any = await ApiClient.createApiClient().getProfile();
    console.log('===accountresult===', result);
    let DATA: any = result.data.data;
    if (result.status && result.data.success === true) {
      setLoading(false)
      setName(DATA?.name);
      setCity(DATA?.city);
      setMobile(DATA?.mobile);
      setDescription(DATA?.description);
      setEmail(DATA?.email);
      setGender(DATA?.gender);
      setInterest(DATA?.interest);
      setPersonality(DATA?.personality);
      setUsername(DATA?.username);
      setprofileImg(DATA?.profile_image!);
      setImage1(DATA?.image1!);
      setImage2(DATA?.image2!);
      setImage3(DATA?.image3!);
      setDob(DATA?.dob),
      setCoins(DATA?.balance)
    } else {
      setLoading(false)
    }
  }
  const verifyEmail = async () => {
    const result: any = await ApiClient.createApiClient().verifyEmail();
    if (result.status && result.data.success === true) {
      showMessage({ message: result.data.message, type: 'success' });
      setVerifyButtonVisibility(false);
    } else {
      console.log('api not working');
    }
  }
  // ***************************Data source of uper flatlist*****************************************
  const DATA = [
    { img: Images.name, name: 'Name', value: Name, touchGes: false },
    { img: Images.coin1, name: Coins, value: 'Coins', touchGes: true },
    { img: Images.intrest, name: 'Interest', value: Interest, touchGes: false },
    { img: Images.calender, name: 'DOB', value: Dob, touchGes: false },
    { img: Images.personality, name: 'Personality', value: Personality, touchGes: false },
    { img: Images.city1, name: 'City', value: City, touchGes: false }
  ]

  // ***************************Data source of lower flatlist*****************************************
  const DATA1 = [
    { key: 1, name: 'Mobile Number ', value: Mobile, img: Images.approve },
    { key: 2, name: 'Email Id', value: Email }
  ]

  // ***************************Render function for uper flatlist*****************************************
  const renderData = (item: any) => {
    const { img, name, value, touchGes } = item.item
    return touchGes ? (
      <TouchableOpacity onPress={() => props.navigation.navigate(WALLET)}>
        <View style={[styles.insideflatlist, { elevation: touchGes ? 0 : 7 }]}>
          <View style={styles.up}>
            <View style={styles.left}>
              <Image source={img} />
            </View>
            <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2), color: COLORS.GRAY }]}>{name}</Text>
          </View>
          <View style={styles.renderView}>
            <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2), marginLeft: 30 }]}>{value}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <View style={[styles.insideflatlist, {}]}>
        <View style={styles.up}>
          <View style={styles.left}>
            <Image source={img} />
          </View>
          <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2), color: COLORS.GRAY }]}>{name}</Text>
        </View>
        <View style={styles.renderView}>
          <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2), marginLeft: 30 }]}>{value}</Text>
        </View>
      </View>
    )
  }

  // ***************************Render function for lower flatlist*****************************************
  const renderData1 = (item: any) => {
    const { key, name, value } = item.item
    return (
      <>
        {key == 1 && value === null ? null :
          <>
            <View style={[styles.insideflatlist1, { width: wp(85), height: hp(9), borderColor: key == 1 ? '#FFE2E2' : COLORS.NAMECOLORBORDER, elevation: 3 }]}>
              <View style={styles.renderDataView}>
                <View style={styles.renderDataView1}>
                  <View style={styles.up}>
                    <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2), color: COLORS.GRAY }]}>{name}</Text>
                  </View>
                  <View style={[styles.down, { flexDirection: key == 2 ? 'row' : 'column', justifyContent: key == 2 ? 'space-between' : undefined }]}>
                    <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2) }]}>{value}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.renderView4}></View></>}
      </>
    )
  }

  // ****************** useEffect ************************
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    getProfile();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <NavHeader title={'Dashboard'} isRightAction={true} right />
      <View style={styles.topview}>
        <View style={styles.topview1}>
          <View style={[styles.circle,{backgroundColor:'lightgray'}]}>
            <Image source={profileImg ? { uri: profileImg } : Images.dummyImage} style={ profileImg? styles.profileImage: styles.profileImag1} />
          </View>
          <Image source={Images.online} style={styles.online} />
        </View>
        <View style={styles.first}>
          <Text style={styles.txt}>{Username}</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate(PROFILE)} style={{}} >
            <Image source={Images.edit1} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.scrollingView}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <View style={[styles.first, { height: hp(30) }]}>
              <FlatList
                data={DATA}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                renderItem={renderData}
              />
            </View>
            <View style={styles.photoimage}>
              <View style={styles.pictures}>
                <View style={styles.picture}>
                  <Text style={styles.txt}>{'Pictures'}</Text>
                </View>
                <View style={styles.picview}>
                  <View style={styles.img1}>
                    <Image source={{ uri: Image1 }} style={styles.im} />
                  </View>
                  <View style={styles.img1}>
                    <Image source={{ uri: Image2 }} style={styles.im} />
                  </View>
                  <View style={styles.img1}>
                    <Image source={{ uri: Image3 }} style={styles.im} />
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.photoimage, { height: hp(23) }]}>
              <View style={styles.desc}>
                <View style={[styles.picture, { height: hp(5) }]}>
                  <Text style={[styles.txt, { left: 7 }]}>{'Description'}</Text>
                </View>
                <View style={styles.picview}>
                  <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2), left: 7 }]}>{Description}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.photoimage, { height: hp(22), alignItems: 'center' }]}>
              <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                data={DATA1}
                renderItem={renderData1}
              />
            </View>
            <View style={[styles.photoimage, { height: hp(15) }]}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate(DASHBOARD)}
                style={styles.button}
              >
                <Text style={styles.btntxt}>{`Meet up Now`}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
      <ModalLoader loading={loading} />
    </View>
  );
};
export default withConnect(receiverProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND,
    alignItems: 'center',
  },
  topview: {
    backgroundColor: COLORS.WHITESHADOW,
    borderRadius: 25,
    height: Platform.OS === 'android' ? hp(70) : hp(61),
    width: wp(95),
    top: Platform.OS === 'android' ? '8%' : '8%',
  },
  topview1: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-15%',
    // backgroundColor: 'green'
  },
  circle: {
    height: 120,
    width: 120,
    borderRadius: 100,
    borderColor: COLORS.WHITESHADOW,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 100,
    borderColor: '#085DF1',
    borderWidth: 5
  },
  profileImag1: {
    height: 50,
    width: 50,
    // borderRadius: 100,
    // borderColor: COLORS.WHITE,
    // borderWidth: 8
  },
  first: {
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  txt: {
    color: COLORS.LOGINTEXT,
    fontSize: responsiveFontSize(3),
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
  },
  insideflatlist: {
    backgroundColor: COLORS.WHITESHADOW,
    // height: hp(7),
    width: wp(39.5),
    marginHorizontal: 5,
    marginVertical: 5,
    borderColor: COLORS.NAMECOLORBORDER,
    borderWidth: 1,
    borderRadius: 5,
    elevation: 7,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  insideflatlist1: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(7),
    width: wp(39.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.NAMECOLORBORDER,
    borderWidth: 1,
    borderRadius: 5,
    elevation: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  up: {
    height: hp(3),
    flexDirection: 'row',
    alignItems: 'center'
  },
  left: {
    height: hp(3),
    width: wp(7.5),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'green'
  },
  photoimage: {
    height: hp(22),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  pictures: {
    height: hp(21),
    width: wp(85)
  },
  picture: {
    height: hp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  verifybtn: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(3),
    width: wp(15),
    borderRadius: 20,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  verify: {
    fontSize: responsiveFontSize(1.8),
    color: "#FF2222",
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  picview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desc: {
    height: hp(20),
    width: wp(85),
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 0, borderRadius: 6,
    backgroundColor: COLORS.WHITESHADOW,
    elevation: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  button: {
    borderRadius: 30,
    width: wp(85),
    backgroundColor: COLORS.LOGINBUTTON,
    justifyContent: "center",
    height: hp(6),
    alignItems: 'center'
  },
  btntxt: {
    fontFamily: FONT_FAMILIES.INTER_BOLD,
    fontSize: responsiveFontSize(2),
    color: COLORS.WHITE
  },
  img1: {
    height: hp(15),
    width: wp(25),
    borderColor: COLORS.BORDER_COLOR,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  im: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  online: {
    position: 'absolute',
    left: 215,
    bottom: 1
  },
  down: {
    flex: 1,
  },
  scrollingView: {
    height: Platform.OS === 'android' ? hp(52) : hp(45),
    borderTopColor: COLORS.BORDER, borderTopWidth: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25
  },
  renderView: {
    justifyContent: 'center', flex: 1
  },
  renderDataView: {
    height: hp(7), width: wp(80), justifyContent: 'center', alignItems: 'center'
  },
  renderDataView1: {
    width: wp(72), height: hp(7),
  },
  renderView2: {
    width: wp(20), alignItems: 'flex-end'
  },
  renderView3: {
    width: wp(17)
  },
  renderView4: {
    height: hp(2)
  }
});
