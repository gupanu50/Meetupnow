import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Linking, Share, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import NavHeader from './../../../ReuableComponent/NavHeader';
import { Images } from '../../../Assets';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Clipboard from "@react-native-clipboard/clipboard";
import Network from '../../../Network';
import { showMessage } from 'react-native-flash-message';

export default function Refer() {

  const [code, setCode] = useState<any>();

  useEffect(() => {
    getCode();
  }, [])

  // ********************** referalCode ********************************************
  const getCode = async () => {
    const result: any = await Network.createApiClient().referalCode();
    let DATA: any = result.data.data;
    if (result.status && result.data.success === true) {
      setCode(DATA.code);
    } else {
      setCode('');
    }
  }

  var shareUrl = `Please install MEETUPNOW app and use my referral code: ${code}`;

  // ********************** check whatsapp function ********************************************
  const postOnFacebook = () => {
    let facebookParameters = [];
    if (shareUrl) {
      // @ts-ignore
      facebookParameters.push('href=' + encodeURI(shareUrl));
    }
    const url =
      'https://www.facebook.com/sharer/sharer.php?'
      + facebookParameters.join('&');

    Linking.openURL(url)
  };

  // ********************** Copy function ********************************************
  const copy = async () => {
    Clipboard.setString(code);
    showMessage({ message: 'Code Copied to Clipboard!', type: 'info', duration: 600 });
  }

  // ********************** WhatsApp onShare function ********************************************
  const onShare = async (social: string) => {
    if (social == 'fb') {
      postOnFacebook()
    }
    else {
      try {
        await Linking.openURL(`whatsapp://send?text=${shareUrl}`)
      } catch (error) {
        Alert.alert('', 'Please install WhatsApp first', actions, {
          cancelable: false,
        });
      }
    }
  };

  // ********************** _onShare function ********************************************
  const _onShare = async () => {
    try {
      const result = await Share.share({
        title: 'App link',
        message: shareUrl,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const actions = [
    {
      text: 'No',
      onPress: () => console.log('cancel Pressed'),
    },
    {
      text: 'Yes',
      onPress: () => {
        Linking.openURL(
          Platform.OS === 'ios' ? `https://apps.apple.com/in/app/whatsapp-messenger/id310633997` : `https://play.google.com/store/apps/details?id=com.whatsapp`
        );
      },
    },
  ];


  return (
    <View style={{ flex: 1, backgroundColor: COLORS.LOGINBACKGROUND, alignItems: 'center' }}>
      {/* @ts-ignore */}
      <NavHeader isBack={true} title={'meet'} isRightAction={true} coinicon={'jh'} right />
      <View style={styles.main}>
        <View style={{ height: Platform.OS === 'android' ? hp(85) : hp(79) }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.mainview}>
              <View style={styles.insidemain}>
                <View style={styles.banner}>
                  <Image source={Images.refer_banner} />
                </View>
                <View style={styles.work}>
                  <Text style={styles.txt}>{'Refer and Earn'}</Text>
                </View>
                <View style={styles.first}>
                  <Text style={[styles.txt, {
                    fontSize: responsiveFontSize(2.3),
                    fontFamily: FONT_FAMILIES.POPPINS_REGULAR, fontWeight: '500'
                  }]}>
                    {'Invite your friends to Meetup Now'}
                  </Text>
                </View>
                <View style={styles.gift}>
                  <Image source={Images.giftgif} style={{ height: hp(15), width: wp(30) }} />
                </View>
                <TouchableOpacity style={styles.getcoin} disabled={true}>
                  <View style={styles.insidegetcoin}>
                    <View style={styles.left}>
                      <Image source={Images.getcoins} />
                    </View>
                    <View style={styles.right}>
                      <Image style={styles.coin} source={Images.coin} />
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.purchase}>
                  <View style={styles.insidepurchase}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          color: COLORS.GRAY,
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.POPPINS_REGULAR,
                          fontWeight: '700',
                        },
                      ]}>
                      When your referred person will install the application using your referral code or link
                      They will get <Text style={styles.bold}>50 Meetup coins</Text> and When they will make their first 
                      purchase on app, you will <Text style={styles.bold}>Get 50 Reward coins,</Text> you will be able to use your reward coins for sending
                      Meetup requests or you can also withdraw them in your paytm Wallet
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.up}>
                <View style={styles.insideup}>
                  <View style={styles.referal}>
                    <Text
                      style={[styles.txt, { fontSize: responsiveFontSize(2.3), fontFamily: FONT_FAMILIES.POPPINS_REGULAR }]}>
                      {'Your referral code'}
                    </Text>
                  </View>
                  <View style={[styles.getcoin, { height: hp(7) }]}>
                    <View
                      style={[
                        styles.insidegetcoin,
                        { borderWidth: 0, backgroundColor: '', height: hp(6) },
                      ]}>
                      <View style={[styles.left, { width: wp(60), height: hp(6) }]}>
                        <View style={styles.referalbtn}>
                          <Text
                            style={[
                              styles.txt,
                              {
                                color: COLORS.WHITE,
                                fontSize: responsiveFontSize(2),
                                fontFamily: FONT_FAMILIES.POPPINS_REGULAR
                              },
                            ]}>
                            {code ? code : 'No code available now'}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.right,
                          { alignItems: 'flex-start', width: wp(19) },
                        ]}>
                        <TouchableOpacity style={styles.copybtn} disabled={code ? false : true} onPress={copy} >
                          <Image style={styles.copyimg} source={Images.copy} />
                          <Text
                            style={[
                              styles.txt,
                              { fontSize: responsiveFontSize(1.7), fontFamily: FONT_FAMILIES.POPPINS_REGULAR },
                            ]}>
                            {'COPY'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.down, {}]}>
                <View style={[styles.insidedown, {}]}>
                  <Text style={[styles.txt, { fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.POPPINS_REGULAR }]}>
                    {'Share your Referral Code via'}
                  </Text>
                  <TouchableOpacity style={styles.copybtn} disabled={code ? false : true} onPress={_onShare}>
                    <Text style={[styles.txt, { fontSize: responsiveFontSize(1.7), fontFamily: FONT_FAMILIES.POPPINS_REGULAR }]}>
                      {'SHARE'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.social}>
              <View style={styles.insidesocial}>
                <TouchableOpacity style={styles.fb} disabled={code ? false : true} onPress={() => onShare('fb')}>
                  <Text
                    style={[
                      styles.txt,
                      {
                        color: COLORS.WHITE,
                        fontSize: responsiveFontSize(2),
                        fontFamily: FONT_FAMILIES.INTER_BOLD,
                        fontWeight: '600',
                      },
                    ]}>
                    {'Facebook'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.fb, { backgroundColor: '#58AD49' }]} disabled={code ? false : true} onPress={() =>
                    onShare('wp')
                  }>
                  <Text
                    style={[
                      styles.txt,
                      { color: COLORS.WHITE, fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_BOLD },
                    ]}>
                    {'WhatsApp'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    borderRadius: 30,
    height: Platform.OS === 'android' ? hp(86) : hp(80),
    width: wp(95),
  },
  mainview: {
    alignItems: 'center',
    height: Platform.OS === 'android' ? hp(85) : hp(65)
  },
  insidemain: {
    height: hp(87),
    width: wp(80)
  },
  banner: {
    height: Platform.OS === 'android' ? hp('23') : hp(22),
    justifyContent: 'center',
    alignItems: 'center'
  },
  work: {
    height: hp('4'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  txt: {
    fontSize: responsiveFontSize(3),
    fontWeight: '400',
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
  },
  first: {
    height: hp(3.5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  gift: {
    height: hp(18),
    width: wp(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  getcoin: {
    height: hp(9),
    justifyContent: 'center'
  },
  insidegetcoin: {
    backgroundColor: '#F6F3F3',
    height: hp(8),
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
  },
  left: {
    height: hp(7.8),
    width: wp(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  coin: {
    height: hp(6),
    width: wp(12),
  },
  purchase: {
    height: hp(26),
    justifyContent: 'center'
  },
  insidepurchase: {
    height: hp(24)
  },
  box: {
    backgroundColor: '#D8E8FC',
    height: hp(25),
  },
  up: {
    height: hp(18),
    justifyContent: 'center',
    alignItems: 'center'
  },
  insideup: {
    backgroundColor: '#F6F3F3',
    height: hp(14),
    width: wp(80.3),
    borderRadius: 5,
    borderColor: COLORS.BLACK,
    borderWidth: 1,
    borderStyle: 'dotted',
    justifyContent: 'center',
  },
  referal: {
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  referalbtn: {
    backgroundColor: COLORS.LOGINBUTTON,
    height: hp(5),
    width: wp(55),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copybtn: {
    backgroundColor: '#FFAC2F',
    width: wp(18),
    height: hp(5),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  copyimg: {
    height: hp(2.1),
    width: wp(3.5),
  },
  down: {
    flex: 1,
    alignItems: 'center'
  },
  insidedown: {
    height: hp(6),
    width: wp(80.3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  social: {
    height: hp(18),
    justifyContent: 'center',
    alignItems: 'center'
  },
  insidesocial: {
    height: hp(16),
    width: wp(80.3),
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  fb: {
    backgroundColor: '#085DF1',
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.POPPINS_EXTRABOLD
  }
});
