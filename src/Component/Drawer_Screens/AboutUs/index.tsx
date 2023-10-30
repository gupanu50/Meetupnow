import { StyleSheet, Text, View, Image, Platform, FlatList, LogBox } from 'react-native';
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
import Network from '../../../Network';
import ViewMoreText from 'react-native-view-more-text';

export default function About() {
  const [data, setData] = useState([]);
  const dummyTxt1 =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    callApi()
  }, [])

  // *************************************API CALL***********************************************
  const callApi = async () => {
    const id: number = 2;
    const body: any = new FormData();
    body.append('page_id', id);
    const result: any = await Network.createApiClient().staticContent(body);
    const DATA: any = result.data.data;
    if (result.data && result.data.success === true) {
      setData(DATA)
    }
  }

  const renderViewMore = onPress => {
    return (
      <Text style={{color: 'red'}} onPress={onPress}>
        Read more
      </Text>
    );
  };
  const renderViewLess = onPress => {
    return (
      <Text style={{color: 'red'}} onPress={onPress}>
        Read less
      </Text>
    );
  };

  // *************************************renderItem*************************************************
  const renderItem = ({item,index}: any) => {
    return (
      <View style={[styles.box, {}]}>
        <View style={[styles.insidebox, {   flexDirection:
                index % 2 === 0 || index === 0 ? 'row' : 'row-reverse',}]}>
          <View style={[styles.left, {}]}>
            <Image source={item.image ? { uri: item.image } : Images.about_banner2} style={styles.bannerimg} />
          </View>
          <View style={styles.right}>
            <View style={styles.insideright}>
              <View
                style={[
                  styles.first,
                  {
                    height: hp('5.6'),
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                  },
                ]}>
                <Text
                  style={[
                    styles.txt,
                    {
                      fontSize: responsiveFontSize(1.6),
                      fontFamily: FONT_FAMILIES.POPPINS_SEMIBOLD,
                      fontWeight: '500',
                      textTransform:"capitalize"
                    },
                  ]}>
                  {item.heading}
                </Text>
              </View>
              <View
                style={[
                  styles.first,
                  {
                    height: hp('14'),
                    alignItems: 'center'
                  },
                ]}>
                      <ScrollView>
                <ViewMoreText
                  numberOfLines={5}
                  renderViewMore={renderViewMore}
                  renderViewLess={renderViewLess}
                >
                  <Text
                    style={[
                      styles.txt,
                      {
                        fontSize: responsiveFontSize(1.6),
                        color: COLORS.GRAY,
                        fontFamily: FONT_FAMILIES.POPPINS_REGULAR,
                      },
                    ]}>
                    {item.description}
                  </Text>
                </ViewMoreText>
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.conatiner}>
      {/* @ts-ignore */}
      <NavHeader isBack={true} title={'meet'} isRightAction={true} coinicon={'jh'} right/>
      <View style={styles.main}>
        <View style={styles.scrollingView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.banner}>
              <Image source={Images.about_banner} style={styles.perfectMatchImage} />
            </View>
            <View style={styles.work}>
              <Text style={styles.txt}>{'About Us'}</Text>
            </View>
            <View style={[styles.first, {}]}>
              <Text style={[styles.txt, {
                fontSize: responsiveFontSize(2.1),
                fontFamily: FONT_FAMILIES.POPPINS_SEMIBOLD, fontWeight: '500'
              }]}>
                {'Your Meetup has been authenticated.'}
              </Text>
            </View>
            <View
              style={styles.dummyTextView}>
              <Text
                style={[
                  styles.txt,
                  {
                    fontSize: responsiveFontSize(2),
                    color: COLORS.GRAY,
                    fontFamily: FONT_FAMILIES.POPPINS_LIGHT,
                    marginLeft: 14,
                  },
                ]}>
                {dummyTxt1}
              </Text>
            </View>
            <View style={styles.flatlistcontainer}>
              <View style={styles.flatlist}>
                <FlatList
                scrollEnabled={false}                
                  data={data}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderItem}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1, backgroundColor: COLORS.LOGINBACKGROUND, alignItems: 'center'
  },
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    borderRadius: 30,
    flex: 0.99,
    width: wp(95),
  },
  banner: {
    height: Platform.OS === 'android' ? hp('26') : hp(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  work: {
    height: hp(4),
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
    height: hp('4'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  insidefirst: {
    width: wp('80 '),
    alignItems: 'center',
    height: hp(10)
  },
  box: {
    height: hp('25 '),
    alignItems: 'center',
    justifyContent: 'center'
  },
  insidebox: {
    backgroundColor: COLORS.INSIDE_COLOR,
    height: hp('23'),
    width: wp('85 '),
    borderRadius: 10,
    flexDirection: 'row',
  },
  left: {
    width: wp(35),
    justifyContent: 'center',
    alignItems: 'center'
  },
  right: {
    flex: 1,
    width: wp('50'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  insideright: {
    width: wp(40),
    flex: 1,
  },
  perfectMatchImage: {
    width: wp(88),
    height: Platform.OS === 'android' ? hp(20) : hp(20)
  },
  girlImage: {
    width: wp(85),
    height: Platform.OS === 'android' ? hp(19.5) : hp(17.5),
  },
  girlImage1: {
    width: wp(85),
    height: Platform.OS === 'android' ? hp(15) : hp(13.6),
  },
  bannerimg: {
    height: '80%',
    width: '90%',
    borderRadius: 8
  },
  flatlistcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlist: {
    width: wp('85 ')
  },
  scrollingView: {
    height: Platform.OS === 'android' ? hp(82) : hp(80)
  },
  dummyTextView: {
    justifyContent: 'center', alignItems: 'center'
  }
});
