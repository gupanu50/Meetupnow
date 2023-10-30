import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NavHeader from '../../ReuableComponent/NavHeader';
import { Images } from '../../Assets';
import { COLORS, FONT_FAMILIES } from '../../Configration';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Network from '../../Network';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { SCREENS } from '../../Constant';
import { useNavigation } from '@react-navigation/native';
const { CHAT, MEETUP } = SCREENS;
export default function Notification() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const navigation: any = useNavigation();
  useEffect(() => {
    notiApi();
  }, [])
  const notiApi = async () => {
    setLoading(true);
    const result: any = await Network.createApiClient().getNotification();
    if (result?.status && result?.data?.success === true) {
      setLoading(false);
      console.log('====notiresponse====>', result.data.data);
      setData(result.data.data)
    } else {
      showMessage({ message: result?.data?.message, type: 'danger' });
    }
  }
  const renderData = (item: any) => {
    const { name, message, created_at, profile_image, dot, redirect_flag } = item.item;
    const pageNavigation = () => {
      if (redirect_flag === 'request_recived_list') {
        navigation.navigate(MEETUP)
      } else {
        navigation.navigate(CHAT)
      }
    }
    return (
      <TouchableOpacity onPress={()=> pageNavigation()}>
        <View style={styles.insideflatlist}>
          <View style={styles.imageview}>
            <Image style={styles.profile} source={{ uri: profile_image }} />
          </View>
          <View style={styles.centerview}>
            <View style={styles.name}>
              <Text style={styles.nametxt}>{name}</Text>
            </View>
            <View style={styles.msg}>
              <Text style={styles.msgtxt}>{message}</Text>
            </View>
            <View style={styles.date}>
              <Text style={styles.datetxt}>{moment(created_at).calendar()}</Text>
            </View>
          </View>
          <View style={styles.rightview}>
            <View>
              <TouchableOpacity>
                <Image style={styles.dot} source={dot} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.LOGINBACKGROUND }}>
      {/* @ts-ignore */}
      <NavHeader isBack={true} title={'meet'} coinicon={'hj'} right />
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.insidemain}>
            <View style={styles.banner}>
              <Image source={Images.notification_banner} style={styles.bannerImage} />
            </View>
            <View style={styles.work}>
              <Text style={styles.txt}>{'Notification'}</Text>
            </View>
            <View style={styles.flatlist}>
              <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={renderData}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    height: Platform.OS === 'android' ? hp('85') : hp('80'),
    width: wp('90'),
    borderRadius: 30,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  insidemain: {
    height: Platform.OS === 'android' ? hp(84) : hp(80),
    width: wp(80.5)
  },
  banner: {
    flex: 1,
    alignSelf: 'center',
    aspectRatio: 1 * 2.1,
  },
  bannerImage: {
    marginTop: '2%',
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  work: {
    marginTop: '1%',
    height: hp('5'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  txt: {
    fontSize: responsiveFontSize(3),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
  },
  flatlist: {
    height: Platform.OS === 'android' ? hp(60) : hp(50)
  },
  insideflatlist: {
    backgroundColor: '#F4F7FA',
    height: hp(12),
    marginVertical: 5,
    width: wp(80),
    borderRadius: 8,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageview: {
    height: hp(10),
    width: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerview: {
    height: hp(10),
    width: wp(55),
  },
  rightview: {
    width: wp(4),
    height: hp(9),
    alignItems: 'center',
  },
  name: {
    height: hp(3)
  },
  msg: {
    height: hp(5),
  },
  date: {
    flex: 1,
  },
  nametxt: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  msgtxt: {
    color: '#444444',
    fontSize: responsiveFontSize(1.5),
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  datetxt: {
    color: '#828282',
    fontSize: responsiveFontSize(1.2),
    fontFamily: FONT_FAMILIES.INTER_LIGHT
  },
  profile: {
    height: hp(8),
    width: wp(17.1),
    borderRadius: 100 / 2,
    borderWidth: 5,
    borderColor: '#BBE0B4'
  },
  dot: {
    tintColor: COLORS.BLACK,
    height: 16,
    width: 3.8,
  }
});
