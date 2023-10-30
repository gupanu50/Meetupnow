import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Image,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { Images } from '../../../Assets';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useIsFocused } from '@react-navigation/native';
import { SCREENS } from '../../../Constant';
import NavHeader from '../../../ReuableComponent/NavHeader';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import Network from '../../../Network';
import { useRooms } from '@flyerhq/react-native-firebase-chat-core';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import DialogUnreadCounter from '../Component/dialogUnreadCounter';
const { FIRESTORE_CHAT } = SCREENS;

export default function Dialogs(props) {
  const { navigation } = props;
  const isFocus = useIsFocused();
  const { rooms } = useRooms(true);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [chatActivate, setChatActivate] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState(false);
  let [userIdMain, setUserIdMain] = useState<any>();
  let [roomIdMain, setRoomIdMain] = useState<any>();
  useEffect(() => {
    activeChatUSer();
  }, [isFocus, isRefresh]);

  const [data, setData] = useState([]);
  console.log('=======rooms=====>>>', rooms);
  console.log('=======dataaa=====>>>', data);

  // ********************************activeChatUSer**************************************
  const activeChatUSer = async () => {
    try {
      const result: any = await Network.createApiClient().active_chats();
      if (result.status && result?.data?.success === true) {
        setIsRefresh(false);
        console.log('active chats', result?.data?.data);
        setData(result?.data?.data);
      }
    } catch (error) {
      console.log('=====error=====>', error);
      setIsRefresh(false);
    }
  };
  const chatStatusApi = async (chatId, item, user) => {
    const body = new FormData();
    body.append('chat_id', chatId)
    console.log('bodyOfchatStatus', body)
    const result: any = await Network.createApiClient().chatStatus(body);
    console.log('resultOfChatStatus', result)
    if (result.status && result?.data?.success === true) {
      console.log('resultOfChatStatusInsideif', result.data.data.chat_activate);
      if (result.data.data.chat_activate == 1) {
        navigation.navigate(FIRESTORE_CHAT, { room: item, user: user })
      }
      else {
        setChatActivate(true);
      }
    }
  }
  const keyExtractor = (item, index: any) => index.toString();
  const chatDeactivateModal = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={chatActivate}
        style={styles.modalview}>
        <View
          style={styles.modalView1}>
          <View style={styles.modal1}>
            <View style={styles.cross2}>
              <View style={styles.modalView}>
              </View>
              <TouchableOpacity onPress={() => setChatActivate(false)}>
                <View
                  style={styles.modalView2}>
                  <Image
                    style={styles.close}
                    source={Images.close_button}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.modalTextView}>
              <Text style={styles.modalText}>{`The Person is actively chat with someone else you can send them meetup request to chat with them.`}</Text>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  const _renderDialog = ({ item }) => {
    console.log('itemRenderdialog', item)
    let user: any;
    if (data?.length !== 0) {
      data?.filter((items: any) => {
        if (items?.firebase_room_id === item?.id) {
          user = items;
        }
      });
    }

    async function updateCount() {
      if (item.sender === user?.firebase_userid) {
        await firestore().collection(`rooms`).doc(item.id).update({
          count: 0,
        });
      } else return;
    }
    function updateValue(userId, roomId) {
      setUserIdMain(userId);
      setRoomIdMain(roomId);
    }
    console.log('=====user====>>>', user);
    console.log('======item======>>>', item);

    function timeAgo(timestamp) {
      const now: any = new Date();
      const timestampDate: any = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds

      const seconds = Math.floor((now - timestampDate) / 1000);

      if (seconds < 5) {
        return 'just now';
      } else if (seconds < 60) {
        return `${seconds} seconds ago`;
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      } else {
        const days = Math.floor(seconds / 86400);
        return `${days} day${days === 1 ? '' : 's'} ago`;
      }
    }

    function truncateMessage(message, maxLength, type: boolean) {
      if (type) {
        if (message.length >= 9 && message.includes('.')) {
          const start = message.slice(0, 7); // Get the first 7 characters
          const extension = message.slice(-6); // Get the last 6 characters (including the dot)

          return `${start}...${extension}`;
        }
      } else {
        if (message.length > maxLength) {
          return `${message.slice(0, 6)}...`;
        }

        // If the message has maxLength or fewer words, return the original message
        return message;
      }
    }
    async function deleteMain() {
      setDeleteModal(false);
      deleteChat(userIdMain, roomIdMain);
    }
    async function deleteChat(id: number, roomId) {
      try {
        const body: FormData = new FormData();
        body.append('chat_id', id.toString());
        console.log('====chatId===>>', body);
        const result: any = await Network.createApiClient().Delete_chats(body);
        console.log('====result===>>>', result);
        if (result.status && result?.data?.success === true) {
          deleteRoom(roomId);
          showMessage({
            message: result?.data?.message,
            type: result?.data?.status ? 'success' : 'danger',
          });
        }
      } catch (error) {
        console.log('=====error===>>>', error);
      }
    }

    async function deleteRoom(id) {
      console.log('=====roomid===>>>', id);
      const collection = 'rooms';
      const documentRef = firestore().collection(collection).doc(id);

      console.log('=====collectionRef====>>>', documentRef);

      await documentRef
        .delete()
        .then(() => {
          console.log('====deletedRoom====>>>');
        })
        .catch(e => {
          console.log('===error==>>>', e);
        });
    }

    return (
      user && (
        <TouchableOpacity
          style={[
            styles.innerflatlist,
          ]}
          onPress={() => {
            updateCount();
            chatStatusApi(user?.chat_id, item, user);
            // { balanceChat == true ? navigation.navigate(FIRESTORE_CHAT, { room: item, user: user }) : null}
          }}>
          <View
            style={{
              width: '25%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.circle}>
              <Image source={{ uri: user?.photo }} style={styles.img} />
            </View>
          </View>
          <View style={{ width: '60%', justifyContent: 'center' }}>
            <Text style={styles.nameTxt}>{item?.name}</Text>
            <Text style={[styles.nameTxt, { fontSize: responsiveFontSize(1.5) }]}>
              {item?.lastMessage?.text
                ? truncateMessage(item?.lastMessage?.text, 3, false)
                : item?.lastMessage?.name
                  ? truncateMessage(item?.lastMessage?.name, 3, true)
                  : 'No msg yet'}
            </Text>
            <Text style={[styles.nameTxt, { fontSize: responsiveFontSize(1.5) }]}>
              {item?.lastMessageTime ? timeAgo(item?.lastMessageTime) : '00:00'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.cross}>
              {user?.chat_status === 2 && <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  setDeleteModal(true);
                  updateValue(user?.chat_id, item?.id);
                }}>
                <Image source={Images.delete} />
              </TouchableOpacity>}
            </View>
            {item.sender === user?.firebase_userid && (
              <DialogUnreadCounter unreadMessagesCount={item?.count} />
            )}
          </View>
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={deleteModal}
            style={styles.modalview}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#00000050',
              }}>
              <View style={styles.modal}>
                <View style={styles.cross1}>
                  <TouchableOpacity onPress={() => setDeleteModal(false)}>
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
                        {'Chat Delete'}
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
                        {'Are you sure you want to delete this chat?'}
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
                          deleteMain();
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
                        onPress={() => setDeleteModal(false)}>
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
        </TouchableOpacity>
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      {/* @ts-ignore */}
      <NavHeader title={'meet'} isRightAction={true} right />
      {rooms?.length === 0 && data?.length === 0 ? (
        <View style={styles.nochatview}>
          <Text style={styles.txt}>{'No chats yet'}</Text>
        </View>
      ) : (
        <View style={styles.main}>
          <View style={styles.work}>
            <Text style={styles.txt}>{'Chats'}</Text>
          </View>
          <View style={{ height: hp(1.5) }}></View>
          <View style={styles.flatlist}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={isRefresh}
                  onRefresh={() => setIsRefresh(true)}
                />
              }
              data={rooms}
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={item => _renderDialog(item)}
            />
          </View>
        </View>
      )}
      {chatDeactivateModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND,
    alignItems: 'center',
  },
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    height: Platform.OS === 'ios' ? hp(72) : hp(79),
    width: wp('90'),
    borderRadius: 30,
    elevation: 7,
  },
  work: {
    height: hp('10'),
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BLACK,
    borderBottomEndRadius: 20,
    borderBottomLeftRadius: 20,
  },
  txt: {
    fontSize: responsiveFontSize(3),
    color: COLORS.BLACK,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.ROBOTO_MEDIUM,
  },
  flatlist: {
    alignItems: 'center',
    height: Platform.OS === 'ios' ? hp(57) : hp(64),
  },
  insideflatlist: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(12),
    width: wp(80),
    borderRadius: 8,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  circle: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    borderWidth: 4,
    borderColor: COLORS.GRAY_BACKGROUND,
  },
  img: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    borderRadius: 60 / 2,
  },
  dot: {
    height: hp(2),
    width: wp(3.7),
  },
  imageview: {
    height: hp(10),
    width: wp(21),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B4B4B4',
    borderRadius: 80,
    marginLeft: 5,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 4,
  },
  centerview: {
    height: hp(8.5),
    width: wp(52),
  },
  rightview: {
    width: wp(9),
    height: hp(8.5),
  },
  name: {
    height: hp(3.5),
    justifyContent: 'flex-end',
  },
  msg: {
    height: hp(2.3),
  },
  date: {
    flex: 1,
  },
  nochatview: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(70),
    width: wp(80),
  },
  innerflatlist: {
    height: hp(10),
    width: wp(83),
    marginVertical: 5,
    borderRadius: 8,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    backgroundColor: COLORS.WHITESHADOW,
    flexDirection: 'row',
  },
  nameTxt: {
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontWeight: '400',
    color: 'black',
    fontSize: responsiveFontSize(2),
  },
  cross: {
    height: heightPercentageToDP(4),
    width: widthPercentageToDP(15),
    alignItems: 'center',
  },
  cross2: {
    height: hp(2.6),
    flexDirection: 'row',
  },
  deleteBtn: {
    height: heightPercentageToDP(4),
    width: widthPercentageToDP(15),
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalview: {
    backgroundColor: 'green',
    height: hp(10),
    width: wp(50),
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
  modal1: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(20),
    width: wp(80),
    borderRadius: hp(1.2),
    alignItems:'center',
    elevation: 10,
    borderColor: '#E2E2E2',
    borderWidth: 1,
  },
  cross1: {
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
  insidedate: {
    height: hp(3),
    width: wp(42),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    height: hp(3),
    width: wp(20),
    borderRadius: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.LOGINBUTTON,
    borderWidth: 1,
    backgroundColor: COLORS.LOGINBUTTON,
  },
  txt1: {
    fontSize: responsiveFontSize(3),
    color: COLORS.BLACK,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.INTER_BOLD,
  },
  modalText: {
    fontSize: responsiveFontSize(1.7),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.POPPINS_REGULAR,
  },
  modalTextView: {
    marginTop: hp(6),
    margin: hp(2)
  },
  modalView1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050',
  },
  modalView2: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(6),
    height: hp(2.5),
  },
  modalView: {
    width: '90%',
    alignItems: 'center'
  },
});
