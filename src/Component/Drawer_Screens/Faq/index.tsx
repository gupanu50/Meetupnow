import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  LogBox,
  Platform,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import NavHeader from '../../../ReuableComponent/NavHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import ApiClient from '../../../Network';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import { Images } from '../../../Assets';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import CardView from 'react-native-cardview';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCREENS, VALIDATE_FORM } from '../../../Constant';
import Network from '../../../Network';
import { showMessage } from 'react-native-flash-message';
import ModalLoader from '../../../ReuableComponent/ModalLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
const {LOGIN} = SCREENS
export default function Faq() {
  const navigation :any= useNavigation();
  const [Click, setClick] = useState(false);
  const [Id, setId] = useState();
  const [Name, setName] = useState('');
  const [checkName, setcheckName] = useState(false);
  const [errorName, seterrorName] = useState('');
  const [Message, setMessage] = useState<any>('');
  const [data, setData] = useState([]);
  const [errorMessage, seterrorMessage] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);

  // *****************************_nameValidate***************************************
  const _nameValidate = (name: string) => {
    var nameRegex = /^[a-z ,.'-]+$/i;
    if (name === '') {
      seterrorName(VALIDATE_FORM.FIRST_NAME);
      setcheckName(true);
    } else if (!nameRegex.test(name)) {
      seterrorName(VALIDATE_FORM.VALID_NAME);
      setcheckName(true);
    } else {
      seterrorName('');
      setcheckName(false);
    }
  };

  // *****************************_messageValidate***************************************
  const _messageValidate = (msg: any) => {
    console.log('[][][[', msg);
    if (msg === '') {
      console.log('error')
      seterrorMessage(VALIDATE_FORM.MESSAGE);
    } else {
      seterrorMessage('');
    }
  }

  // *****************************validate***************************************
  const validate = () => {
    let flag = true;
    if (Name === '' || checkName) {
      seterrorName(errorName ? errorName : VALIDATE_FORM.FIRST_NAME);
      console.log('fcgvg========j')
      flag = false;
    } if (Message === '') {
      seterrorMessage(VALIDATE_FORM.MESSAGE);
      flag = false;
      console.log('fcgvhbjnkjnbhgvhbj')
    }
    else {
      return flag;
    }
  };

  // *****************************submit***************************************
  const Submit = () => {
    if (validate()) {
      contactApi();
      setName('');
      setMessage('');
    }
  };

  // *****************************renderItem***************************************
  const renderItem = (item: any) => {
    const { id, faq_heading, faq_description } = item.item;
    return Click == true && Id === id ? (
      <View style={styles.mainbody}>
        <View style={styles.renderView}>
          <View style={[styles.headerViewContainer, {}]}>
            <Text style={[styles.questxt, { color: '#EB4273', left: 0 }]}>{faq_heading}</Text>
          </View>
          <View style={[styles.plus, { height: hp(3), justifyContent: 'flex-start', alignItems: 'flex-start', width: wp(11) }]}>
            <TouchableOpacity
              onPress={() => {
                setClick(false);
              }} style={styles.renderView1}>
              <Text style={[styles.questxt, { left: 0, fontSize: responsiveFontSize(3) }]}>{'-'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.ansview}>
          <Text style={[styles.Anstext, { margin: 5 }]}>{faq_description}</Text>
        </View>
      </View>
    ) : (
      <View>
        <View style={styles.flatlist}>
          <View style={[styles.ques, { width: wp(70) }]}>
            <Text style={styles.questxt}>{faq_heading}</Text>
          </View>
          <View style={[styles.plus, {}]}>
            <TouchableOpacity
              onPress={() => {
                setClick(true), setId(id);
              }} style={styles.renderView2}>
              <Text style={styles.questxt}>{'+'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    callApi();
  }, []);

  // *************************************API CALL***********************************************
  const callApi = async () => {
    const result: any = await Network.createApiClient().faq();
    if (result.data && result.data.success === true) {
      setData(result.data.data);
    }
  }
  const deleteFirebaseUser = () => {
    const user = auth().currentUser;
    console.log('=======deleteFirebase=====>>>',user);
    if (user) {
      user
        .delete()
        .then(() => {
          // User deleted successfully
          console.log('User deleted successfully');
          navigation.navigate(LOGIN)
        })
        .catch(error => {
          // An error occurred while deleting the user
          console.error('Error deleting user:', error);
        });
    }
  };
  async function deleteFirestoreUser(){
    const user = auth().currentUser;
    console.log('========>>>',user?.uid);
      const collection = 'users';
      const documentRef = firestore().collection(collection).doc(user?.uid);
      console.log('=====collectionRef====>>>', documentRef);
      await documentRef
        .delete()
        .then(() => {
          console.log('====deletedRoom====>>>');
          deleteFirebaseUser();
        })
        .catch(e => {
          console.log('===error==>>>', e);
        });
  }
  const deleteApi = async () => {
    const result: any = await ApiClient.createApiClient().deleteAccount();
    if (result.status && result.data.success === true) {
      deleteFirestoreUser();
      setDeleteModalVisibility(false)
      showMessage({ message: result.data.message, type: 'success' });
      AsyncStorage.removeItem('user');
    } else {
      console.log('api not working');
    }
  }
  // ************************************* contactApi ***********************************************
  const contactApi = async () => {
    setLoading(true)
    const body = new FormData();
    body.append('name', Name);
    body.append('message', Message);
    const result: any = await Network.createApiClient().contactUs(body);
    if (result.data && result.data.success === true) {
      showMessage({ message: 'Thanks for Contacting Us', type: 'success' });
      setLoading(false);
    } else {
      setLoading(false);
      showMessage({ message: result.data.message, type: 'danger' });
    }
  }
  const deleteModal = () => {
    return (
      <Modal animationType={'slide'} transparent={true} visible={deleteModalVisibility}>
        <View style={{
          flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000050"
        }}>
          <View style={styles.modal}>
            <View style={styles.cross}>
              <TouchableOpacity onPress={() => setDeleteModalVisibility(false)}>
                <View style={{ alignItems: 'flex-end', justifyContent: 'center', width: wp(6), height: hp(2.5) }}>
                  <Image style={styles.close} source={Images.close_button} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.first}>
              <Image source={Images.alert} />
            </View>
            <View style={styles.second}>
              <View style={styles.insidesecond}>
                <View style={styles.up}>
                  <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.ROBOTO_REGULAR, fontSize: responsiveFontSize(2) }]}>You're About To Delete Your Account</Text>
                </View>
                <View style={styles.down}>
                  <Text style={[styles.txt, { fontSize: responsiveFontSize(1.6), color: COLORS.MOBILENUMBER, fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>All Your Photos And Account Data Will Be Permanently Removed From Your Profile And You Won't Be Able To See Them Again.</Text>
                </View>
              </View>
            </View>
            <View style={styles.third}>
              <View style={styles.insidethird}>
                <View style={{ height: hp(1.5) }}></View>
                <View style={[styles.insidedate, { height: hp(4), width: wp(60), justifyContent: 'space-evenly', alignItems: 'center' }]}>
                  <TouchableOpacity style={[styles.btn, { width: wp(25), elevation: 6 }]} onPress={() => setDeleteModalVisibility(false)}>
                    <Text style={[styles.txt, { fontSize: responsiveFontSize(1.8), color: COLORS.WHITE }]}>{'Cancel'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.WHITESHADOW, width: wp(25), elevation: 6 }]} onPress={() => deleteApi()}>
                    <Text style={[styles.txt, { fontSize: responsiveFontSize(1.8) }]}>{'Delete'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.LOGINBACKGROUND, alignItems: 'center' }}>
      {/* @ts-ignore */}
      <NavHeader isBack={true} title={'meet'} isRightAction={false} coinicon={'jh'} />
      <KeyboardAwareScrollView enableOnAndroid={true} scrollEnabled={false}>
        <View style={styles.main}>
          <View style={styles.mainView}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
              <View style={styles.insidemain}>
                <View style={styles.banner}>
                  <Image source={Images.faq_banner} style={styles.faqImage} />
                </View>
                <View style={styles.work}>
                  <Text style={styles.txt}>{'FAQ'}</Text>
                </View>
                <View style={styles.flat}>
                  <View style={styles.insideflat}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={data}
                      renderItem={renderItem}
                    />
                  </View>
                </View>
                <View style={styles.contact}>
                  <View style={styles.con}>
                    <Text style={styles.txt}>{'Contact us'}</Text>
                  </View>
                  <View style={[styles.name, {}]}>
                    <View style={[styles.label, {}]}>
                      <Text style={[styles.questxt, {
                        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
                        fontSize: responsiveFontSize(2), left: 20, fontWeight: '400'
                      }]}>{'Full Name'}</Text>
                    </View>
                    <View style={[styles.input, {}]}>
                      <CardView
                        style={[styles.textInput]}
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={5}
                      >
                        <TextInput
                          style={styles.textinput}
                          value={Name}
                          placeholder='Enter Your Name'
                          placeholderTextColor={COLORS.BORDER_COLOR}
                          onChangeText={(txt) => { setName(txt), _nameValidate(txt) }}
                        />
                      </CardView>
                    </View>
                    {errorName !== null ? (
                      <Text style={styles.error}>{errorName}</Text>
                    ) : null}
                  </View>
                  <View style={[styles.name, { height: hp(18.1) }]}>
                    <View style={[styles.label, {}]}>
                      <Text style={[styles.questxt, {
                        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
                        fontSize: responsiveFontSize(2), left: 20, fontWeight: '400'
                      }]}>{'Message'}</Text>
                    </View>
                    <View style={[styles.input, { height: hp(12.5) }]}>
                      <CardView
                        style={[styles.textInput, { height: hp(12), justifyContent: 'flex-start', alignItems: 'flex-start' }]}
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={5}
                      >
                        <TextInput
                          style={styles.textinput}
                          placeholder='Enter your Message'
                          multiline={true}
                          value={Message}
                          placeholderTextColor={COLORS.BORDER_COLOR}
                          onChangeText={(txt) => { setMessage(txt), _messageValidate(txt) }}
                        />
                      </CardView>
                    </View>
                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                  </View>
                  <View style={styles.submit}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => Submit()}>
                      <Text
                        style={[styles.questxt, {
                          color: COLORS.WHITE, fontWeight: '600',
                          fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, left: 0
                        }]}>
                        {'Submit'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={styles.delTouch} onPress={()=> setDeleteModalVisibility(true)}>
                    <Text style={styles.Anstext}>Do you want to delete account</Text></TouchableOpacity>
                <ModalLoader loading={loading} />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {deleteModal()}
    </View>

  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    borderRadius: 30,
    alignItems: 'center',
    height: Platform.OS === 'ios' ? hp(81) : hp(85),
    width: wp(95),
    elevation: 2
  },
  insidemain: {
    width: wp(85.3),
    justifyContent: 'center'
  },
  banner: {
    height: Platform.OS === 'android' ? hp(23) : hp(23),
    justifyContent: 'center',
    alignItems: 'center',
  },
  work: {
    height: hp(5),
    justifyContent: 'center'
  },
  txt: {
    fontSize: responsiveFontSize(3),
    color: COLORS.BLACK,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
  },
  flat: {
  },
  insideflat: {
  },
  flatlist: {
    backgroundColor: '#F4F7FA',
    height: hp(8),
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: '#888888',
    borderWidth: 1,
  },
  ques: {
    height: hp(5),
    width: wp(70),
    justifyContent: 'center',
  },
  plus: {
    height: hp(5),
    width: wp(9),
    justifyContent: 'center',
    alignItems: 'center'
  },
  questxt: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    left: 13,
    fontFamily: FONT_FAMILIES.MONTSERRAT_REGULAR
  },
  contact: {
    backgroundColor: '#D8E8FC',
    height: hp(43),
    borderRadius: 8
  },
  mainbody: {
    backgroundColor: COLORS.WHITE,
    height: hp(24),
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#888888',
    alignItems: 'center',
  },
  headerViewContainer: {
    width: wp(64),
    justifyContent: 'center'
  },
  ansview: {
    backgroundColor: '#F4F4F4',
    width: wp(75),
    height: hp(16),
    borderColor: '#888888',
    borderWidth: 1,
    borderRadius: 5
  },
  Anstext: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONT_FAMILIES.POPPINS_REGULAR
  },
  con: {
    height: hp(6),
    justifyContent: 'center'
  },
  name: {
    height: hp(11.5),
  },
  label: {
    height: hp(3),
    justifyContent: 'center'
  },
  input: {
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  inp: {
    backgroundColor: COLORS.SHADOW,
    height: hp(5),
    width: wp(75),
    justifyContent: 'center',
    borderColor: COLORS.TEXTCOLOR,
    borderWidth: 1
  },
  submit: {
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: COLORS.LOGINBUTTON,
    height: hp(5.5),
    width: wp(75),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    left: 20,
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  faqImage: {
    width: Platform.OS === 'android' ? wp(80) : wp(80),
    height: Platform.OS === 'android' ? hp(19.4) : hp(17.7),
  },
  textInput: {
    backgroundColor: COLORS.SHADOW,
    height: hp(5.5),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textinput: {
    width: wp(75),
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    // @ts-ignore
    paddingLeft: Platform.OS === 'ios' ? 7 : 4
  },
  delTouch: {backgroundColor:'transparent',height: hp(7), justifyContent:'center', alignItems:'center'},
  modal: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(28),
    width: wp(80),
    borderRadius: hp(1.2),
    elevation: 10,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    alignItems: 'center'
  },
  cross: {
    height: hp(2.6),
    width: wp(75),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  close: {
    tintColor: 'black',
  },
  first: {
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center'
  },
  second: {
    height: hp(5)
  },
  insidesecond: {
    height: hp(12),
    justifyContent: 'center'
  },
  up: {
    height: hp(2.4),
    width: wp(85),
    alignItems: "center"
  },
  down: {
    flex: 1,
    height: hp(9),
    width: wp(69),
    left: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  third: {
    flex: 0.9,
    justifyContent: 'flex-end'
  },
  insidethird: {
    height: hp(5),
    width: wp(79),
    borderColor: COLORS.BORDER,
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insidedate: {
    height: hp(3),
    width: wp(42),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btn: {
    height: hp(4),
    width: wp(20),
    borderRadius: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.LOGINBUTTON,
    borderWidth: 1,
    backgroundColor: COLORS.LOGINBUTTON
  },
  renderView: {
    flexDirection: 'row', height: hp(5)
  },
  renderView1: {
    height: hp(5), width: wp(8.7), justifyContent: 'center', alignItems: 'center'
  },
  renderView2: {
    height: hp(4), width: wp(9), justifyContent: 'center'
  },
  mainView: {
    height: Platform.OS === 'android' ? hp(81) : hp(78)
  }
});
