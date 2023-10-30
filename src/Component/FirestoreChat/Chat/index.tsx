import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { showMessage } from 'react-native-flash-message';
import NavHeader from '../../../ReuableComponent/NavHeader';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import { Images } from '../../../Assets';
import { SCREENS } from '../../../Constant';
import Network from '../../../Network';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import FileViewer from 'react-native-file-viewer';
import {
  useFirebaseUser,
  useMessages,
  useRoom,
} from '@flyerhq/react-native-firebase-chat-core';
import { utils } from '@react-native-firebase/app';
import moment from 'moment';
const { PERFECTMATCH, DASHBOARD } = SCREENS;
export default function ChatScreen({ route, navigation }) {
  const { firebaseUser } = useFirebaseUser();
  const { room } = useRoom(route?.params?.room);
  const user = route?.params?.user;
  console.log('user', user);
  const { messages, sendMessage, updateMessage } = useMessages(room);
  const [isAttachmentUploading, setAttachmentUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [showButton] = useState(user?.sender);
  const [loading, setLoading] = useState(false);
  let sender = false;
  const autoDirect = () => {
    setModalVisible1(true);
    setTimeout(() => {
      navigation.navigate(DASHBOARD)
    }, 10000)
  }
  useEffect(() => {
    user?.chat_status === 1 ? setModalVisible(true) : autoDirect();
  }, [])
  // ********************** OTP Real Meetup  Chat ********************
  const otprealMeetup = async () => {
    const body = new FormData();
    setLoading(true);
    body.append('chat_id', user?.chat_id);
    const result: any = await Network.createApiClient().Otp_real_meetup(body);
    // @ts-ignore
    if (result?.data && result?.data?.success === true) {
      setLoading(false);
      showMessage({ message: result.data.message, type: 'success' });
      console.log('Real Otp meet Success', result);
      let Data = result?.data?.data?.otp;
      let Data1 = result?.data?.data?.mobile;
      let requestid = result?.data?.data?.request_id;
      let user1image = result?.data?.data?.user_1;
      let user2image = result?.data?.data?.user_2;
      navigation.navigate(PERFECTMATCH, {
        OTPcheck: Data,
        chattinguserid: requestid,
        userMobile: Data1,
        chatiddd: user?.chat_id,
        user1imagevalue: user1image,
        user2imagevalue: user2image,
        sender: sender
      });
    } else {
      setLoading(false);
      showMessage({ message: result?.data?.message, type: 'danger' });
    }
  };

  const handleAttachmentPress = () => {
    handleImageSelection();
  };


  const handleImageSelection = async () => {
    try {
      launchImageLibrary(
        {
          maxWidth: 1440,
          mediaType: 'photo',
          quality: 0.7,
        },
        async ({ assets }) => {
          const response = assets?.[0];
          console.log('====res===?>', response);
          if (response?.uri) {
            setAttachmentUploading(true);
            const name = response.uri?.split('/').pop();
            console.log('===imgname===>', name);
            const reference = storage().ref(name);
            console.log('===imgref===>', reference);
            await reference.putFile(response.uri);
            const uri = await reference.getDownloadURL();
            const message: MessageType.PartialImage = {
              height: response.height,
              name: response.fileName ?? name ?? '🖼',
              size: response.fileSize ?? 0,
              type: 'image',
              uri,
              width: response.width,
            };
            console.log('===msg===>>?>>', message);
            sendMessage(message);
            setAttachmentUploading(false);
          }
        },
      );
    } catch (error) {
      console.log('=====errorInImage=====>', error);
    }
  };

  const handleMessagePress = async (message: MessageType.Any) => {
    if (message.type === 'file') {
      try {
        const uri = utils.FilePath.DOCUMENT_DIRECTORY + '/' + message.name;
        const reference = storage().ref(message.name);
        await reference.writeToFile(uri);
        const path =
          Platform.OS === 'android' ? uri.replace('file://', '') : uri;
        await FileViewer.open(path, { showOpenWithDialog: true });
      } catch { }
    }
  };

  const handlePreviewDataFetched = ({
    message,
    previewData,
  }: {
    message: MessageType.Text;
    previewData: any;
  }) => {
    const newMessage: MessageType.Text = { ...message, previewData };
    updateMessage(newMessage);
  };
  const deaModal = () => {
    // const now = moment(user?.expire_at);
    // const userCreatedAt = moment();
    // const diffInHours = now.diff(userCreatedAt, 'hours');
    const expireCon:any = new Date(user?.expire_at);
    const currentTime:any = new Date();
    const timeDiff = expireCon - currentTime; 
    const remainingHours = Math.floor(timeDiff/(1000*60*60))
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={modalVisible}
        style={styles.modalview}>
        <View
          style={styles.modalView1}>
          <View style={styles.modal}>
            <View style={styles.cross}>
              <View style={styles.modalView}>
                <Image source={Images.hurryUp} style={styles.hurryImage} />
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
              <Text style={styles.modalText}>
                You have <Text style={styles.bold}>{remainingHours} hours </Text>left before the chat window will get deactivated.
                You can schedule a Meetup (Coffee, Dinner… etc) according to mutual understanding.{'\n'}
                <Text style={styles.bold}> Every successful Meet-Up </Text>will stand a chance to win a thrilling
                <Text style={styles.bold}>trip to
                  Goa 🚀/ latest iPhone!</Text> It's all about the unexpected moments.{'\n'}
                Note : Any inappropriate behaviour may result in your account being permanently banned. Let's keep Meet-Up Now
                a respectful and enjoyable community for all. Thank you for your cooperation."
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  const deaChatModal = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={modalVisible1}
        style={styles.modalview}>
        <View
          style={styles.modalView1}>
          <View style={styles.modal}>
            <View style={styles.cross}>
              <View style={styles.modalView}>
              </View>
              <TouchableOpacity onPress={() => setModalVisible1(false)}>
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
              <Text style={styles.modalText}>
                This chat has been <Text style={styles.bold}>Deactivated</Text>, if you want to chat again with this user then 
                you will need to send Meetup request again if you have any questions, you can check or ask in "FAQ" section , 
                for more details please check " How it works " section of Meetup Now
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.LOGINBACKGROUND }}
      // @ts-ignore
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}>
      <NavHeader
        // @ts-ignore
        title={'meet'}
        isRightAction={true}
        right
        coinicon
        isBack={true}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITESHADOW,
          margin: '5%',
          borderRadius: 30,
        }}>
        <View style={styles.work}>
          <View style={styles.insidework}>
            <View style={styles.firstTop}>
              <View style={styles.imagev}>
                <View style={styles.circle}>
                  <Image
                    source={{ uri: user?.photo }}
                    style={styles.insideCircle}
                  />
                </View>
              </View>
              <View style={styles.userV}>
                <Text style={styles.txt}>{user?.name}</Text>
              </View>
            </View>
            {user?.chat_status == 2 ? null : !showButton ? (
              <View style={styles.buttonV}>
                <TouchableOpacity
                  onPress={() => otprealMeetup()}
                  style={styles.btn}>
                  <Text
                    style={[
                      styles.txt,
                      {
                        color: COLORS.WHITESHADOW,
                        fontFamily: FONT_FAMILIES.INTER_BOLD,
                        fontSize: responsiveFontSize(2),
                      },
                    ]}>
                    {'Enter Code to complete meet-up'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) :
              (
                <View style={styles.buttonV}>
                  <TouchableOpacity
                    onPress={() => { sender = true, otprealMeetup() }}
                    style={styles.btn}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          color: COLORS.WHITESHADOW,
                          fontFamily: FONT_FAMILIES.INTER_BOLD,
                          fontSize: responsiveFontSize(2),
                        },
                      ]}>
                      {'Generate Code to complete meet-up'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            }
          </View>
        </View>
        <Chat
          enableAnimation
          isAttachmentUploading={isAttachmentUploading}
          messages={messages}
          onAttachmentPress={handleAttachmentPress}
          onMessagePress={handleMessagePress}
          onPreviewDataFetched={handlePreviewDataFetched}
          onSendPress={sendMessage}
          sendButtonVisibilityMode='editing'
          user={{ id: firebaseUser?.uid ?? '' }}
          // @ts-ignore
          chatStatus={user?.chat_status}
        />
      </View>
      {deaModal()}
      {deaChatModal()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    paddingVertical: 12,
    paddingHorizontal: 35,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: 25,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '300',
    color: '#8c8c8c',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    paddingRight: 35,
    backgroundColor: 'whitesmoke',
  },
  button: {
    width: 40,
    height: 50,
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachment: {
    width: 40,
    height: 50,
    position: 'absolute',
    right: 5,
    bottom: 0,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    flexDirection: 'row',
  },
  work: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4D4',
  },
  insidework: {
    padding: '5%',
  },
  txt: {
    fontSize: responsiveFontSize(2.2),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.POPPINS_REGULAR,
  },
  firstTop: {
    flexDirection: 'row',
  },
  imagev: {
    height: hp(10),
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    borderColor: COLORS.SHADOW,
    borderWidth: 5,
  },
  insideCircle: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    borderRadius: 70 / 2,
  },
  userV: {
    height: hp(10),
    width: wp(60),
    justifyContent: 'center',
  },
  userName: { flex: 0.5, justifyContent: 'center' },
  activeV: { flex: 0.5, flexDirection: 'row', alignItems: 'flex-start' },
  onlineImg: { height: 15, width: 15, marginTop: 5, marginLeft: 5 },
  buttonV: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: COLORS.LOGINBUTTON,
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: wp(80),
  },
  imgIcon: {
    height: 20,
    width: 20,
  },
  modalview: {
    backgroundColor: 'green',
    height: hp(10),
    width: wp(50),
  },
  modal: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(50),
    width: wp(80),
    borderRadius: hp(1.2),
    elevation: 10,
    borderColor: '#E2E2E2',
    borderWidth: 1,
  },
  cross: {
    height: hp(2.6),
    flexDirection: 'row',
  },
  close: {
    tintColor: 'black',
  },
  hurryImage: {
    height: hp(10),
    width: wp(20)
  },
  modalView: {
    width: '90%',
    alignItems: 'center'
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: wp(6),
    height: hp(2.5),
  },
  bold: {
    fontWeight: 'bold'
  }
});
