import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-virtualized-view';
import NavHeader from './../../../ReuableComponent/NavHeader';
import {Images} from '../../../Assets';
import {COLORS, FONT_FAMILIES} from '../../../Configration';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Network from '../../../Network';
import ViewMoreText from 'react-native-view-more-text';
const {height, width} = Dimensions.get('screen');
export default function Condition() {
  const [data, setData] = useState([]);
  let colors = [COLORS.INSIDE_COLOR, COLORS.WHITESHADOW];
  const dummyTxt1 =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

  useEffect(() => {
    callApi();
  }, []);

  // *************************************API CALL***********************************************
  const callApi = async () => {
    const id: number = 3;
    const body: any = new FormData();
    body.append('page_id', id);
    const result: any = await Network.createApiClient().staticContent(body);
    const DATA: any = result.data.data;
    console.log('terms====>?>', DATA);

    if (result.data && result.data.success === true) {
      setData(DATA);
    }
  };

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
  // *************************************renderItem***********************************************
  const renderItem = ({item, index}: any) => {
    return (
      <View
        style={[styles.box, {backgroundColor: colors[index % colors.length]}]}>
        <View
          style={[
            styles.insidebox,
            {
              flexDirection:
                index % 2 === 0 || index === 0 ? 'row' : 'row-reverse',
            },
          ]}>
          <View style={styles.left}>
            <Image
              source={item.image ? {uri: item.image} : Images.term_banner1}
              style={styles.bannerimg}
            />
          </View>
          <View style={styles.right}>
            <View style={styles.insideright}>
              <View
                style={[
                  {
                    flex: 0.5,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  },
                ]}>
                <Text
                  style={[
                    styles.txt,
                    {
                      fontSize: responsiveFontSize(1.7),
                      textAlign: 'left',
                      fontWeight: '600',
                      fontFamily: FONT_FAMILIES.POPPINS_SEMIBOLD,
                      textTransform: 'capitalize',
                    },
                  ]}>
                  {item.heading}
                </Text>
              </View>

              <View
                style={[
                  styles.insidefirst,
                  {height: hp(16), width: wp(52), alignItems: 'flex-start'},
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
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.LOGINBACKGROUND,
        alignItems: 'center',
      }}>
      {/* @ts-ignore */}
      <NavHeader isBack={true}
        title={'meet'}
        isRightAction={true}
        coinicon={'jh'}
        right
      />
      <View style={styles.main}>
        <View style={{height: Platform.OS == 'android' ? hp(83) : hp(78)}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.banner}>
              <Image source={Images.term_banner} style={styles.pencilImage} />
            </View>
            <View style={styles.work}>
              <Text style={styles.txt}>{'Terms & Condition'}</Text>
            </View>

            <View style={styles.first}>
              <Text
                style={[
                  styles.txt,
                  {
                    fontSize: responsiveFontSize(2.1),
                    fontFamily: FONT_FAMILIES.POPPINS_SEMIBOLD,
                    fontWeight: '500',
                  },
                ]}>
                {'Your Meetup has been authenticated.'}
              </Text>
            </View>
            <View
              style={[
                styles.first,
                {
                  height: hp('18'),
                  alignItems: 'center',
                },
              ]}>
              <View style={[styles.insidefirst, {height: hp(18)}]}>
                <Text
                  style={[
                    styles.txt,
                    {
                      fontSize: responsiveFontSize(2),
                      textAlign: 'left',
                      color: COLORS.GRAY,
                      fontFamily: FONT_FAMILIES.POPPINS_LIGHT,
                    },
                  ]}>
                  {dummyTxt1}
                </Text>
              </View>
            </View>
            <View style={styles.flatlist}>
              <FlatList
                scrollEnabled={false}
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('87'),
  },
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    borderRadius: 30,
    height: Platform.OS == 'android' ? hp(85) : hp(80),
    width: wp(95),
  },
  banner: {
    height: Platform.OS == 'android' ? hp('25') : hp(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  work: {
    height: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: responsiveFontSize(3),
    color: COLORS.BLACK,
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
  },
  first: {
    height: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  insidefirst: {
    width: wp(80),
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.INSIDE_COLOR,
  },
  insidebox: {
    height: hp('29'),
    width: wp('95'),
    flexDirection: 'row',
  },
  left: {
    width: wp(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    width: wp('50'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  insideright: {
    width: wp(52),
    flex: 1,
  },
  pencilImage: {
    width: Platform.OS === 'android' ? wp(85) : wp(85),
    height: Platform.OS === 'android' ? hp(20) : hp(20),
  },
  bannerimg: {
    height: height / 5,
    width: width / 3.7,
    borderRadius: 8,
  },
  flatlist: {
  },
});
