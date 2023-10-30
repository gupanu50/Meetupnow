import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  Text,
  ImageBackground,
  Modal
} from 'react-native';
import { Header } from 'react-native-elements';
import { Images } from '../Assets';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILIES } from '../Configration';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Constant from '../Constant';
import { useDispatch } from 'react-redux';
import { ActionType } from '../Redux/Type';
import withConnect from './withConnect';
import ApiClient from '../Network';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFirebaseUser } from '@flyerhq/react-native-firebase-chat-core';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const { NOTIFICATION, LOGIN, WALLET } = Constant.SCREENS;
const { SEARCH_DATA, REDVISIBLE } = ActionType;

const NavHeader = (props: any) => {
  const { dashboardHeader, isBack, isBackHide, title, isRightAction, searchBar, coinicon, loginRightAction, deleteModalVisibilityControl, saveCoin, right, redVisible } = props;
  const navigation: any = useNavigation();
  const [Search, setSearch] = useState('');
  const [threeDotsModal, setThreeDotsModal] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const { firebaseUser } = useFirebaseUser();
  console.log('=====firebase====>>>', firebaseUser?.uid);
  const dispatch = useDispatch();
  const uid: string = firebaseUser?.uid!;

  useEffect(() => {
  }, [])
  const checkVisibility = () => {
    deleteModalVisibilityControl ? setThreeDotsModal(true) : setThreeDotsModal(false)
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

  const deleteFirebaseUser = () => {
    const user = auth().currentUser;
    console.log('=======deleteFirebase=====>>>', user);
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

  async function deleteFirestoreUser() {
    const user = auth().currentUser;
    console.log('========>>>', user?.uid);
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

  const deleteButton = () => {
    return (
      <Modal animationType={'fade'} transparent={true} visible={threeDotsModal}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setThreeDotsModal(false)}>
          <View style={{ flex: 1, backgroundColor: '#00000050' }}>
            <View style={styles.deleteButtonMainView}>
              <TouchableOpacity onPress={() => { setThreeDotsModal(false), setDeleteModalVisibility(true) }}>
                <View style={styles.deleteButtonTouchView}>
                  <View style={styles.deleteButtonTouchView1}>
                    <Text style={styles.deleteButtonTouchText}>Delete Account</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    )
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
  const openDrawer = () => {
    if (isBack) {
      navigation.goBack();
      return;
    }
    navigation.openDrawer();
  };

  const leftComponent = () => {
    if (isBack && !isBackHide) {
      return (
        <View style={dashboardHeader ? styles.leftComponent : styles.leftDrawerComponent}>
          <TouchableOpacity onPress={openDrawer} style={styles.back}>
            <Image
              source={Images.back}
              style={[
                styles.menubar,
                { height: 20, width: 20, tintColor: COLORS.BLACK },
              ]}
            />
          </TouchableOpacity>
        </View>
      );
    } else if (isBackHide) {
      return <View style={styles.leftDrawerComponent}></View>;
    } else {
      return (
        <View style={dashboardHeader ? styles.leftComponent : styles.leftDrawerComponent}>
          <TouchableOpacity onPress={openDrawer}>
            <Image source={Images.vector} style={styles.menubar} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const rightComponent = () => {
    return (
      <View style={styles.coins}>
        {coinicon ? (<View style={styles.left}></View>) : (<View style={styles.left}>
          <TouchableOpacity style={styles.rightComponentTouch} onPress={() => navigation.navigate(WALLET)} >
            <Image source={Images.coin} style={styles.coinicon} />
            <Text style={[styles.txt, { color: COLORS.WHITE, fontSize: responsiveFontSize(1.5) }]}> {saveCoin}</Text>
          </TouchableOpacity>
        </View>)}
        {isRightAction ? (<View style={styles.right}>
          <TouchableOpacity onPress={() => { dispatch({ type: REDVISIBLE, payload: false }), navigation.navigate(NOTIFICATION) }}
            style={styles.redMainView}
          >
            <Image source={Images.notification} style={styles.coinicon} />
            {redVisible && <View style={styles.redView}></View>}
          </TouchableOpacity>
        </View>) :
          loginRightAction ? <View></View> :
            (<TouchableOpacity onPress={() => checkVisibility()}>
              <View style={styles.right}>
                <Image source={Images.threedots} style={{ tintColor: "white", marginLeft: 0, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>
            )}
      </View>
    );
  };

  const centerComponent = () => {
    return (
      <>
        <View style={styles.centercontainer}>
          <Image source={Images.meet_logo} style={{ resizeMode: 'contain' }} />
        </View>
        {searchBar ? (
          <View style={styles.centerComponent}>
            <View style={styles.searchbar}>
              <View style={styles.textin}>
                <View style={styles.input}>
                  <TextInput
                    value={Search}
                    style={styles.txt}
                    onChangeText={(txt: any) => { setSearch(txt), searchData(txt) }}
                  />
                </View>
                <Image source={Images.search} style={styles.searchicon} />
              </View>
            </View>
          </View>
        ) : null}
      </>
    );
  };

  const searchData = (txt) => {
    const search = { 'search': txt }
    dispatch({ type: SEARCH_DATA, payload: search })
  }

  return (
    <>
      {dashboardHeader ?
        <View style={styles.mainConatiner}>
          <ImageBackground source={Images.loginbackground}
            style={{ height: hp(5) }}
          >
            {/* @ts-ignore */}
            <Header
              statusBarProps={{
                backgroundColor: COLORS.BOTTOM_COLOR
              }}
              containerStyle={styles.container}
              placement={'center'}
              centerComponent={title ? centerComponent : null}
              leftComponent={leftComponent}
              rightComponent={rightComponent}
              backgroundImage={Images.small_header}
              backgroundImageStyle={{ resizeMode: 'contain', height: hp(25) }}
            />
          </ImageBackground>
        </View> :
        <View style={styles.secondHeaderMainContainer}>
          {/* @ts-ignore */}
          <Header
            statusBarProps={{
              backgroundColor: COLORS.BOTTOM_COLOR
            }}
            containerStyle={styles.secondHeaderContainer}
            placement={'center'}
            centerComponent={title ? centerComponent : null}
            leftComponent={leftComponent}
            rightComponent={right ? rightComponent : null}
            backgroundImage={Images.small_header}
          />
        </View>
      }
      {deleteButton()}
      {deleteModal()}
    </>
  );
};
export default withConnect(NavHeader);
const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'android' ? hp('16.6%') : hp('14'),
    width: wp('100%'),
    backgroundColor: 'transparent',
  },
  secondHeaderContainer: {
    height: Platform.OS === 'android' ? hp('15%') : hp('13.5'),
    width: wp('100%'),
    backgroundColor: 'transparent',
  },
  secondHeaderMainContainer: {
    marginTop: Platform.OS === 'ios' ? hp(4.2) : hp(3.9),
    height: hp(13),
  },
  mainConatiner: {
    marginTop: Platform.OS === 'ios' ? hp(4.2) : hp(3.5),
    backgroundColor: COLORS.BOTTOM_COLOR,
    height: hp(13),
    width: wp(100),
  },
  leftComponent: {
    height: hp(16),
    width: wp('10%'),
  },
  leftDrawerComponent: {
    height: hp(13),
    width: wp('10%'),
  },
  centerComponent: {
    height: hp('9%'),
    width: wp('95%'),
    justifyContent: 'center',
  },
  menuImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  profileImage: {
    height: 30,
    width: 40,
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 3,
  },
  backbar: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  menubar: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  rightComponent: {
    height: hp('5%'),
    width: wp('30%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: -8,
    left: 12,
  },
  subTitle: {
    fontSize: responsiveHeight(1.5),
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  searchbar: {
    backgroundColor: COLORS.WHITE,
    height: hp('5%'),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textin: {
    height: hp('4.2%'),
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: hp('6%'),
    width: wp('80%'),
    justifyContent: 'center'
  },
  txt: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_MEDIUM,
    fontWeight: '400',
  },
  centercontainer: {
    height: hp('3.5%'),
    width: wp('50%'),
    resizeMode: 'contain',
  },
  searchicon: {
    left: 15,
    resizeMode: 'contain'
  },
  back: {
    backgroundColor: COLORS.WHITESHADOW,
    borderRadius: 50,
    height: hp(3.5),
    width: wp(7.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  coins: {
    height: hp(10),
    width: wp(25),
    flexDirection: 'row',
  },
  left: {
    width: wp(17),
    height: hp(3.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: wp(8),
    height: hp(3.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinicon: {
    height: hp(2.3),
    width: wp(4.1),
    resizeMode: 'contain'
  },
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
  deleteButtonMainView: {
    left: '58%', top: Platform.OS === 'android' ? '3%' : '7%'
  },
  deleteButtonTouchView: {
    backgroundColor: "white", width: wp(33), borderRadius: 8, height: hp(4), justifyContent: 'center'
  },
  deleteButtonTouchView1: {
    alignItems: 'center'
  },
  deleteButtonTouchText: {
    color: COLORS.BLACK,
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
  },
  rightComponentTouch: {
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'
  },
  redMainView: {
    flexDirection: 'row'
  },
  redView: {
    backgroundColor: 'red', height: hp(1.2), width: wp(2.5), borderRadius: 100 / 2, position: 'absolute', left: '25%', top: '-20%'
  }
})
