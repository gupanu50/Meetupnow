import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NavHeader from '../../ReuableComponent/NavHeader';
import { Images } from '../../Assets';
import { COLORS, FONT_FAMILIES } from '../../Configration';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import withConnect from './withConnect';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import Network from '../../Network';
import ModalLoader from '../../ReuableComponent/ModalLoader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../Constant';
import {
  useRooms,
  useUsers,
} from '@flyerhq/react-native-firebase-chat-core';
const { CHAT } = SCREENS;
const meetUp = () => {
  const [meetupSend, setmeetupSend] = useState([]);
  const [meetupRecieved, setmeetupRecieved] = useState([]);
  const [Active, setActive] = useState(0);
  const [Delete, setDelete] = useState(false);
  const [idpassreject, setidpassreject] = useState('');
  const [idpassaccept, setidpassaccept] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [selectedOtp, setSelectedOtp] = useState('');
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const navigation:any = useNavigation();
  const isFocused = useIsFocused();
  useEffect(() => {
    sendMeetup();
    recievedMeetup();
  }, [idpassreject, idpassaccept, isFocused, isRefresh]);

  // ********************** SendMeetup *****************
  const sendMeetup = async () => {
    setLoading(true);
    const result: any = await Network.createApiClient().send_meetup();

    if (result.status && result.data.success === true) {
      setLoading(false);
      console.log('sendrequest', result.data.data.data);
      setmeetupSend(result.data.data.data);
      setIsRefresh(false);
    } else {
      showMessage({ message: result.data.message, type: 'danger' });
      setIsRefresh(false);
    }
  };
  const onRefresh = () => {
    setIsRefresh(true);
  };

  // ********************** RecievedMeetup *****************
  const recievedMeetup = async () => {
    setLoading(true);
    const result: any = await Network.createApiClient().recieve_meetup();
    if (result?.status && result?.data?.success === true) {
      setLoading(false);
      console.log('====recieverequest====>', result.data.data.data);
      setmeetupRecieved(result?.data?.data?.data);
      setIsRefresh(false);
    } else {
      showMessage({ message: result?.data?.message, type: 'danger' });
      setIsRefresh(false);
    }
  };

  // ********************** reject Meetup ********************
  const rejectMeetup = async () => {
    setLoading(true);
    const body = new FormData();
    body.append('request_id', idpassreject);
    const result: any = await Network.createApiClient().reject_meetup(body);
    if (result.data && result.data.success === true) {
      setLoading(false);
      showMessage({ message: result.data.message, type: 'success' });
      console.log('reject', result);
      recievedMeetup();
    } else {
      setLoading(false);
      showMessage({ message: result.data.message, type: 'danger' });
    }
  };

  const { users } = useUsers();
  const { createRoom } = useRooms();

  const acceptMeetup = async (userId: any, uid: any) => {
    setLoading(true);
    const otherUser: any = users.find(item => item?.id === uid);
    console.log('======otherUSer=====>>>', otherUser);
    try {
      const roomResult = await createRoom(otherUser);
      console.log('=======roomResult=====>>>', roomResult);
      if (roomResult) {
        const body = new FormData();
        body.append('request_id', userId);
        body.append('firebase_room_id', roomResult?.id);
        console.log('rejectbodyyyy', body);
        const result: any = await Network.createApiClient().accept_meetup(body);
        if (result?.data?.success === true) {
          showMessage({ message: result?.data?.message, type: 'success' });
          navigation.navigate(CHAT);
          recievedMeetup();
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      showMessage({ message: error.toString(), type: 'danger' });
    }
  };

  const renderRecieve = (item: any) => {
    const {
      name,
      msg,
      profile_image,
      id,
      date,
      description,
      cb_user,
      cb_id,
      firebase_userid,
    } = item.item;

    const isMatch = users.some(item => item.id === firebase_userid);

    return (
      isMatch && (
        <TouchableWithoutFeedback>
          <View style={styles.insideflatlist}>
            <View style={styles.imageview}>
              <View style={styles.sendcircle}>
                <Image style={styles.image} source={{ uri: profile_image }} />
              </View>
            </View>
            <View style={styles.centerview}>
              <View style={styles.insidecenterview}>
                <View
                  style={[
                    styles.name,
                    { justifyContent: 'space-between', flexDirection: 'row' },
                  ]}>
                  <Text
                    style={[
                      styles.txt,
                      { fontFamily: FONT_FAMILIES.INTER_REGULAR },
                    ]}>
                    {name}
                  </Text>
                  <Text
                    style={[
                      styles.txt,
                      {
                        color: COLORS.GRAY,
                        fontSize: responsiveFontSize(1.3),
                        fontFamily: FONT_FAMILIES.INTER_LIGHT,
                      },
                    ]}>
                    {moment(date, 'YYYYMMDD, h:mm:ss a').fromNow()}
                  </Text>
                </View>
                <View style={styles.msg}>
                  <Text style={styles.msgtxt}>{description}</Text>
                </View>
                <View style={styles.date}>
                  <View style={styles.insidedate}>
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        { backgroundColor: COLORS.WHITESHADOW },
                      ]}
                      onPress={() => {
                        setDelete(!Delete), setidpassreject(id);
                      }}>
                      <Text
                        style={[
                          styles.txt,
                          { fontSize: responsiveFontSize(1.5) },
                        ]}>
                        {'Reject'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => acceptMeetup(id, firebase_userid)}>
                      <Text
                        style={[
                          styles.txt,
                          {
                            fontSize: responsiveFontSize(1.5),
                            color: COLORS.WHITESHADOW,
                          },
                        ]}>
                        {'Accept'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    );
  };

  const renderSender = (item: any) => {
    const { name, msg, img, otp, profile_image, status, date } = item.item;
    const openModal = () => {
      setSelectedOtp(otp); // Set the selected OTP
      setOtpVisible(true); // Open the modal
    };
    return (
      <View style={styles.insideflatlist}>
        <View style={styles.under}>
          <View style={styles.left}>
            <View style={styles.sendcircle}>
              <Image source={{ uri: profile_image }} style={styles.image} />
            </View>
          </View>
          <View style={styles.sendcenterview}>
            <View
              style={[
                styles.sendname,
                { justifyContent: 'space-between', flexDirection: 'row' },
              ]}>
              <Text
                style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>
                {name}
              </Text>
              <Text
                style={[
                  styles.txt,
                  {
                    color: COLORS.GRAY,
                    fontSize: responsiveFontSize(1.3),
                    fontFamily: FONT_FAMILIES.INTER_LIGHT,
                  },
                ]}>
                {moment(date, 'YYYYMMDD, h:mm:ss a').fromNow()}
              </Text>
            </View>
            <View
              style={[styles.sendname, { height: hp(4), flexDirection: 'row' }]}>
              <View
                style={[
                  styles.responsebtn,
                  {
                    borderColor:
                      status == '0'
                        ? COLORS.BOTTOM_COLOR
                        : status == '1'
                          ? COLORS.ACCEPT
                          : status == '2'
                            ? COLORS.ALERT
                            : 'white',
                    borderWidth: 1,
                  },
                ]}>
                <Text
                  style={[
                    styles.txt,
                    {
                      fontFamily: FONT_FAMILIES.INTER_REGULAR,
                      color: 'red',
                      fontSize: responsiveFontSize(1.6),
                    },
                  ]}>
                  {status == '0' ? (
                    <Text
                      style={{
                        color: COLORS.BOTTOM_COLOR,
                        fontSize: responsiveFontSize(1.8),
                        fontWeight: '500',
                      }}>
                      {"didn't Respond"}
                    </Text>
                  ) : status == '1' ? (
                    <Text
                      style={{
                        color: COLORS.ACCEPT,
                        fontSize: responsiveFontSize(1.6),
                        fontWeight: '500',
                      }}>
                      {'Request Accepted'}
                    </Text>
                  ) : status == '2' ? (
                    <Text
                      style={{
                        color: COLORS.ALERT,
                        fontSize: responsiveFontSize(1.8),
                        fontWeight: '500',
                      }}>
                      {'Rejected'}
                    </Text>
                  ) : null}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.sendname,
                { flex: 1, justifyContent: 'center', width: wp(65) },
              ]}>
              <Text
                style={[
                  styles.txt,
                  {
                    fontFamily: FONT_FAMILIES.INTER_REGULAR,
                    color: 'red',
                    fontSize: wp(2.5),
                  },
                ]}>
                {status == '0' ? (
                  <Text
                    style={{
                      color: COLORS.BOTTOM_COLOR,
                      fontSize: responsiveFontSize(1.3),
                      fontWeight: '500',
                    }}>
                    {"didn't Respond to your meet-up Request"}
                  </Text>
                ) : status == '1' ? (
                  <Text
                    style={{
                      color: COLORS.ACCEPT,
                      fontSize: responsiveFontSize(1.3),
                      fontWeight: '500',
                    }}>
                    {'Your request accepted do conversation'}
                  </Text>
                ) : status == '2' ? (
                  <Text
                    style={{
                      color: COLORS.ALERT,
                      fontSize: responsiveFontSize(1.3),
                      fontWeight: '500',
                    }}>
                    {'Your request rejected'}
                  </Text>
                ) : null}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.LOGINBACKGROUND }}>
      {/* @ts-ignore */}
      <NavHeader title={'meet'} isRightAction={true} right />
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.work}>
            <View style={styles.buttons}>
              <View style={styles.insidebutton}>
                <TouchableOpacity
                  style={[
                    styles.recieve,
                    {
                      backgroundColor:
                        Active == 0 ? COLORS.BOTTOM_COLOR : COLORS.WHITESHADOW,
                    },
                  ]}
                  onPress={() => setActive(0)}>
                  <Text
                    style={[
                      styles.txt,
                      { color: Active == 0 ? COLORS.WHITESHADOW : COLORS.BLACK },
                    ]}>
                    {'Received Meetup'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.recieve,
                    {
                      backgroundColor:
                        Active == 0 ? COLORS.WHITESHADOW : COLORS.BOTTOM_COLOR,
                      width: wp(33),
                    },
                  ]}
                  onPress={() => setActive(1)}>
                  <Text
                    style={[
                      styles.txt,
                      { color: Active == 0 ? COLORS.BLACK : COLORS.WHITESHADOW },
                    ]}>
                    {'Send Meetup'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.flatlist}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
              }
              data={Active == 0 ? meetupRecieved : meetupSend}
              showsVerticalScrollIndicator={false}
              // @ts-ignore
              renderItem={Active == 0 ? renderRecieve : renderSender}
            />
          </View>
          <View>
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={Delete}
              style={styles.modalview}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#00000050',
                }}>
                <View style={styles.modal}>
                  <View style={styles.cross}>
                    <TouchableOpacity onPress={() => setDelete(false)}>
                      <View
                        style={{
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          width: wp(6),
                          height: hp(2.5),
                        }}>
                        <Image
                          style={styles.close}
                          source={Images.close_button}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.first}>
                    <Image source={Images.alert} />
                  </View>
                  <View style={styles.second}>
                    <View style={styles.insidesecond}>
                      <View style={styles.up}>
                        <Text
                          style={[
                            styles.txt,
                            {
                              fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
                              fontSize: responsiveFontSize(1.6),
                            },
                          ]}>
                          {'Meetup Request'}
                        </Text>
                      </View>
                      <View style={styles.down}>
                        <Text
                          style={[
                            styles.txt,
                            {
                              fontSize: responsiveFontSize(1.6),
                              color: COLORS.MOBILENUMBER,
                              fontFamily: FONT_FAMILIES.INTER_REGULAR,
                            },
                          ]}>
                          {'Do you want to reject the request.'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.third}>
                    <View style={styles.insidethird}>
                      <View style={{ height: hp(1.5) }}></View>
                      <View
                        style={[
                          styles.insidedate,
                          {
                            height: hp(4),
                            width: wp(60),
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                          },
                        ]}>
                        <TouchableOpacity
                          style={[
                            styles.btn,
                            { width: wp(25), elevation: 6, height: hp(4) },
                          ]}
                          onPress={() => {
                            setDelete(false), rejectMeetup();
                          }}>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.8),
                                color: COLORS.WHITE,
                              },
                            ]}>
                            {'Ok'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.btn,
                            {
                              backgroundColor: COLORS.WHITESHADOW,
                              width: wp(25),
                              elevation: 6,
                              height: hp(4),
                            },
                          ]}
                          onPress={() => setDelete(false)}>
                          <Text
                            style={[
                              styles.txt,
                              { fontSize: responsiveFontSize(1.8) },
                            ]}>
                            {'Cancel'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={otpVisible}
              style={styles.modalview}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#00000050',
                }}>
                <View style={styles.modal}>
                  <View style={styles.cross}>
                    <TouchableOpacity onPress={() => setOtpVisible(false)}>
                      <View
                        style={{
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          width: wp(6),
                          height: hp(2.5),
                        }}>
                        <Image style={styles.close} source={Images.close_button} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.otpView}>
                    <Text style={styles.otpTxt}>Your OTP for meet up is</Text>
                    <Text style={styles.otpMainText}>{selectedOtp}</Text>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
      <ModalLoader loading={isLoading} />
    </View>
  );
};

export default withConnect(meetUp);
const styles = StyleSheet.create({
  buttons: {
    backgroundColor: COLORS.LOGINBACKGROUND,
    height: hp(7),
    width: wp(80.5),
    borderRadius: hp(1),
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  insidebutton: {
    height: hp(6),
    width: wp(75),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recieve: {
    backgroundColor: COLORS.BOTTOM_COLOR,
    height: hp(5),
    width: wp(40),
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    alignItems: 'center',
    flex: 0.98,
  },
  insideflatlist: {
    backgroundColor: '#F4F7FA',
    height: hp(13),
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
  circle: {
    height: hp(8),
    width: wp(16),
    borderRadius: hp(5),
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerview: {
    height: hp(10),
    width: wp(55),
    justifyContent: 'center',
  },
  insidecenterview: {
    height: hp(9),
  },
  rightview: {
    width: wp(4),
    height: hp(9),
    alignItems: 'center',
  },
  name: {
    height: hp(3),
    justifyContent: 'flex-end',
  },
  msg: {
    height: hp(3),
    justifyContent: 'center',
  },
  date: {
    flex: 1,
  },
  insidedate: {
    height: hp(3),
    width: wp(47),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    height: hp(4),
    width: wp(22),
    borderRadius: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.LOGINBUTTON,
    borderWidth: 1,
    backgroundColor: COLORS.LOGINBUTTON,
  },
  msgtxt: {
    color: '#444444',
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  datetxt: {
    color: '#828282',
    fontSize: responsiveFontSize(1),
  },
  profile: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  responsemsg: {
    height: hp(1.9),
    width: wp(50),
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(22),
    width: wp(70),
    borderRadius: hp(1.2),
    elevation: 10,
    borderColor: '#E2E2E2',
    borderWidth: 1,
  },
  cross: {
    height: hp(2.6),
    width: wp(68),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  close: {
    tintColor: 'black',
  },
  first: {
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  second: {
    height: hp(5),
  },
  insidesecond: {
    height: hp(4.5),
  },
  up: {
    height: hp(2.4),
    alignItems: 'center',
  },
  down: {
    flex: 1,
    alignItems: 'center',
  },
  third: {
    flex: 0.8,
    justifyContent: 'flex-end',
  },
  insidethird: {
    height: hp(5),
    borderColor: COLORS.BORDER,
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    height: Platform.OS === 'ios' ? hp(72) : hp(78),
    width: wp('90'),
    borderRadius: 30,
    elevation: 7,
  },
  work: {
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: responsiveFontSize(2),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.INTER_SEMIBOLD,
  },
  otpView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpTxt: {
    fontSize: responsiveFontSize(2),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  otpMainText: {
    fontSize: responsiveFontSize(2),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.INTER_SEMIBOLD,
  },
  under: {
    height: hp(10),
    width: wp(80),
    flexDirection: 'row',
  },
  left: {
    width: wp(20),
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendcircle: {
    height: 65,
    width: 65,
    borderRadius: 65 / 2,
    borderWidth: 4,
    borderColor: COLORS.GRAY_BACKGROUND,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    borderRadius: 60 / 2,
  },
  sendcenterview: {
    height: hp(11.3),
    width: wp(54),
  },
  sendname: {
    height: hp(3.5),
  },
  responsebtn: {
    height: hp(4),
    width: wp(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  right: {
    flex: 1,
  },
  modalview: {
    backgroundColor: 'green',
    height: hp(10),
    width: wp(50),
  },
  touchIIcon: {
    marginLeft: '5%',
    width: wp(18),
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});
