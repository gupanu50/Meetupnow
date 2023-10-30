import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
NavHeader
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import NavHeader from '../../../ReuableComponent/NavHeader';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import Network from '../../../Network';

export default function Work() {
  const [img, setImg] = useState();
  const [heading, setHeading] = useState();
  const [content, setContent] = useState();
  const [img1, setImg1] = useState();
  const [heading1, setHeading1] = useState();
  const [content1, setContent1] = useState();

  useEffect(() => {
    callApi()
  }, [])

  // *************************************API CALL***********************************************
  const callApi = async () => {
    const id: number = 1;
    const body = new FormData();
    // @ts-ignore
    body.append('page_id', id);
    console.log('-=-=-=-=-=-body-=-=-=-=-=>', body);
    const result: any = await Network.createApiClient().staticContent(body);
    if (result.data && result.data.success === true) {
      const DATA: any = result.data.data[0];
      const DATA1: any = result.data.data[1];
      setImg(DATA.image);
      setHeading(DATA.heading);
      setContent(DATA.description);
      setImg1(DATA1.image);
      setHeading1(DATA1.heading);
      setContent1(DATA1.description);
    } else {

    }
  }

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <NavHeader isBack={true} title={'bh'} isRightAction={true} coinicon={'bh'} right/>
      <View style={styles.main}>
        <View style={{ height: hp(1.5) }}></View>
        <View style={[styles.banner, { height: Platform.OS === 'android' ? hp(25.5) : hp(23) }]}>
          <Image source={{ uri: img }} style={[styles.bannerImage,
          { height: Platform.OS === 'android' ? hp(20) : hp(19) }]} />
          <Text style={styles.interaction}>{'How it works?'}</Text>
        </View>
        <View style={[styles.first, {}]}>
          <Text style={styles.authenticated}>{heading}</Text>
          <Text style={styles.memorable}>{content}</Text>
        </View>
        <View style={[styles.banner, { height: hp(26) }]}>
          <Text style={[styles.authenticated, { margin: 0 }]}>{heading1}</Text>
          <Image source={{ uri: img1 }} style={[styles.bannerImage, {
            height: Platform.OS === 'android' ? hp(22) : hp(21)
          }]} />
        </View>
        <View style={styles.first}>
          <Text style={[styles.memorable, { margin: 0 }]}>{content1}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND,
    alignItems: 'center',
  },
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    height: Platform.OS === 'ios' ? hp(80) : hp(85),
    width: wp(95),
    borderRadius: 30,
  },
  banner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  first: {
    justifyContent: 'center',
    // margin: 15,
    alignItems: 'center'
  },
  txt: {
    fontSize: hp(2),
    color: COLORS.BLACK
  },
  interaction: {
    fontSize: responsiveFontSize(3),
    color: COLORS.BLACK,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
  },
  authenticated: {
    fontSize: responsiveFontSize(2),
    color: COLORS.BLACK,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.POPPINS_SEMIBOLD
  },
  memorable: {
    fontSize: Platform.OS === 'android' ? responsiveFontSize(2) : responsiveFontSize(2.1),
    color: '#444444',
    fontWeight: '400',
    marginLeft: 14,
    fontFamily: FONT_FAMILIES.POPPINS_LIGHT
  },
  flatlist: {
    margin: 10
  },
  slide: {
    backgroundColor: '#EDF4FC',
    borderColor: '#085DF1',
    height: hp(10),
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row'
  },
  left: {
    width: wp(20),
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  right: {
    flex: 1,
    justifyContent: 'center'
  },
  button: {
    flex: 1,
    justifyContent: 'center'
  },
  btn: {
    backgroundColor: COLORS.LOGINBUTTON,
    height: hp(6),
    margin: 10,
    borderRadius: hp(35),
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerImage: {
    width: Platform.OS === 'android' ? wp(86) : wp(89),
    borderRadius: 9,
    borderColor: '#D9D9D9',
    borderWidth: 4
  },
})
