import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import * as Constant from '../../../Constant';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import NavHeader from '../../../ReuableComponent/NavHeader';
import { Images } from '../../../Assets';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import Network from '../../../Network';
import ModalLoader from '../../../ReuableComponent/ModalLoader';
const { RATING } = Constant.SCREENS;

export default function RecentMeetup() {

  const navigation: any = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    callingApi();
  }, [isFocused]);
  const callingApi = async () => {
    setLoading(true);
    const result: any = await Network.createApiClient().ratingList();
    if (result.status && result.data.success) {
      const DATA = result.data
      setData(DATA.data)
    } else {
      console.log('api not working')
      setData([])
    }
    setLoading(false);
  }
  const renderData = (item: any) => {
    const { name, rating, photo, id } = item.item;
    return (
      <TouchableOpacity>
        <View style={styles.insideflatlist}>
          <View style={styles.imageview}>
            <Image style={styles.profile} source={{ uri: photo }} />
          </View>
          <View style={styles.centerview}>
            <View style={styles.name}>
              <Text style={styles.nametxt}>{name}</Text>
            </View>
            <View style={styles.date}>
              <View style={styles.left}>
                <Image source={Images.star} style={styles.star} />
              </View>
              <View style={styles.right}>
                <Text style={[styles.ratetxt, { color: '#444444', fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{rating}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rightview}>
            <TouchableOpacity style={styles.ratebtn} onPress={() => navigation.navigate(RATING, { id: id })}>
              <Text style={styles.ratetxt}>{'Rate'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.LOGINBACKGROUND }}>
      {/* @ts-ignore */}
      <NavHeader isBack={true} title={'meet'} isRightAction={true} coinicon={'hn'} right/>
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.insidemain}>
            <View style={styles.work}>
              <Text style={styles.txt}>{'MeetUp Rating'}</Text>
            </View>
            <View style={styles.flatlist}>
              {data.length > 0 ?
              <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={renderData}
              /> : 
              <View style={styles.dataNotFoundView}>
                <Text style={styles.dataNotFoundText}>No Rating found</Text>
              </View>
              }
            </View>
          </View>
        </View>
      </View>
      <ModalLoader loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    height: Platform.OS === 'android' ? hp('84') : hp(79),
    width: wp('90'),
    borderRadius: 30,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  insidemain: {
    height: hp(75),
    width: wp(80.3)
  },
  work: {
    height: hp('8'),
    justifyContent: 'center'
  },
  txt: {
    fontSize: responsiveFontSize(3),
    color: COLORS.BLACK,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
  },
  flatlist: {
    flex: 1,
    alignItems: 'center',
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
    alignItems: 'center'
  },
  centerview: {
    height: hp(10),
    width: wp(40)
  },
  rightview: {
    width: wp(19),
    height: hp(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    height: hp(4),
    justifyContent: 'flex-end'
  },
  msg: {
    height: hp(2.5),
  },
  date: {
    flex: 1,
    flexDirection: 'row'
  },
  nametxt: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  msgtxt: {
    color: '#444444',
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  profile: {
    height: hp(8),
    width: wp(17.1),
    borderRadius: 100 / 2,
  },
  ratebtn: {
    backgroundColor: COLORS.LOGINBUTTON,
    height: hp(3),
    width: wp(14),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(10)
  },
  ratetxt: {
    fontSize: responsiveFontSize(1.7),
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.INTER_SEMIBOLD
  },
  left: {
    width: wp(6),
    height: hp(3),
    justifyContent: 'center'
  },
  right: {
    height: hp(3),
    width: wp(7),
    justifyContent: 'center',
  },
  star: {
    height: hp(2),
    width: wp(4.5)
  },
  dataNotFoundView: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  dataNotFoundText: {
    color: COLORS.BLACK, fontWeight: '500',
    fontSize: responsiveFontSize(3), fontFamily: FONT_FAMILIES.INTER_BOLD
  },
});
