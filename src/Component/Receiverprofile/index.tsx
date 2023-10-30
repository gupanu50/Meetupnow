import React, { Modal, Platform } from 'react-native';
import { COLORS, FONT_FAMILIES, METRICS } from '../../Configration';
import NavHeader from '../../ReuableComponent/NavHeader';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import withConnect from './withConnect';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Images } from '../../Assets';
import Network from '../../Network';
import { useEffect, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { showMessage } from 'react-native-flash-message';
import { useDispatch } from 'react-redux';
import { ActionType } from '../../Redux/Type';
import Swiper from 'react-native-swiper';
const { SAVE_COIN } = ActionType;
const receiverProfile = (props: any) => {
  const { route } = props;
  const { id } = route.params;
  const dispatch = useDispatch();
  useEffect(() => {
    receiverProfileApi();
  }, []);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [interest, setInterest] = useState();
  const [city, setCity] = useState();
  const [username, setUsername] = useState();
  const [personality, setPersonality] = useState();
  const [description, setDescription] = useState('');
  const [mobile, setMobile] = useState();
  const [emailId, setEmailId] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [image, setImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const receiverProfileApi = async () => {
    const body = new FormData();
    body.append('user_id', id);
    const result: any = await Network.createApiClient().receiverProfile(body);
    console.log('======receiverProfile=======>', result);
    if (result.status && result.data.success) {
      const data = result.data;
      setName(data.data.name);
      setAge(data.data.age);
      setInterest(data.data.interest);
      setCity(data.data.city);
      setPersonality(data.data.personality);
      setDescription(data.data.description);
      setMobile(data.data.mobile);
      setEmailId(data.data.email);
      setProfilePic(data.data.profile_image);
      setImage(data.data.image1);
      setImage1(data.data.image2);
      setImage2(data.data.image3);
      setUsername(data.data.username);
    } else {
      console.log('api not working');
    }
  };
  const meetUpReceiverProfileApi = async () => {
    const body = new FormData();
    body.append('sentto', id);
    const result: any =
      await Network.createApiClient().sendMeetupReceiverProfile(body);
    if (result.status && result.data.success) {
      showMessage({ message: result.data.message, type: 'success' });
      dispatch({ type: SAVE_COIN, payload: result.data.data.coin_balance });
    } else if (result.status == null && result.data.success == false) {
      showMessage({ message: result.data.message, type: 'danger' });
    }
  };
  const picModal = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible}
        style={styles.modalview}>
        <View
          style={styles.modalView1}>
          <View style={styles.modal}>
            <View style={styles.cross}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <View
                  style={styles.modalView2}>
                  <Image
                    style={styles.close}
                    source={Images.close_button}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: profilePic }} style={styles.im1} />
          </View>
        </View>
      </Modal>
    )
  }
  const picModal1 = (
    
  ) => {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible1}
        style={styles.modalview}>
        <View
          style={styles.modalView1}>
          <View style={styles.modal}>
            <View style={styles.cross}>
              <TouchableOpacity onPress={() => setVisible1(false)}>
                <View
                  style={styles.modalView2}>
                  <Image
                    style={styles.close}
                    source={Images.close_button}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Swiper showsButtons>
                <Image source={{uri: image}} style={styles.im1} />
                <Image source={{uri: image1}} style={styles.im1} />
                <Image source={{uri: image2}} style={styles.im1} />
            </Swiper>
          </View>
        </View>
      </Modal>
    )
  }
  const picModal2 = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible2}
        style={styles.modalview}>
        <View
          style={styles.modalView1}>
          <View style={styles.modal}>
            <View style={styles.cross}>
              <TouchableOpacity onPress={() => setVisible2(false)}>
                <View
                  style={styles.modalView2}>
                  <Image
                    style={styles.close}
                    source={Images.close_button}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Swiper showsButtons index={1}>
                <Image source={{uri: image}} style={styles.im1} />
                <Image source={{uri: image1}} style={styles.im1} />
                <Image source={{uri: image2}} style={styles.im1} />
            </Swiper>
          </View>
        </View>
      </Modal>
    )
  }
  const picModal3 = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible3}
        style={styles.modalview}>
        <View
          style={styles.modalView1}>
          <View style={styles.modal}>
            <View style={styles.cross}>
              <TouchableOpacity onPress={() => setVisible3(false)}>
                <View
                  style={styles.modalView2}>
                  <Image
                    style={styles.close}
                    source={Images.close_button}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Swiper showsButtons index={2}>
                <Image source={{uri: image}} style={styles.im1} />
                <Image source={{uri: image1}} style={styles.im1} />
                <Image source={{uri: image2}} style={styles.im1} />
            </Swiper>
          </View>
        </View>
      </Modal>
    )
  }
  return (
    <View style={styles.container}>
      <NavHeader
        /* @ts-ignore */
        title={'Dashboard'}
        isBack={true}
        isRightAction={false}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollingView } removeClippedSubviews={true}>
        <View style={styles.topview}>
          <View style={styles.topview1}>
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
            </TouchableOpacity>
            <Text style={styles.umar}> {username}</Text>
            {/* <Image style={styles.online} source={Images.online} /> */}
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={[styles.mainview, { marginTop: '10%' }]}>
              <View style={styles.nameview}>
                <View style={{ height: hp(0.5) }}></View>
                <View style={{ flexDirection: 'row', top: 5 }}>
                  <Image source={Images.name} style={styles.imagename} />
                  <Text style={styles.nametext}>Name</Text>
                </View>
                <Text style={[styles.nametext1, { paddingLeft: '25%' }]}>
                  {name}
                </Text>
              </View>

              <View style={[styles.nameview, { marginLeft: '4%' }]}>
                <View style={{ height: hp(0.5) }}></View>
                <View style={{ flexDirection: 'row', top: 5 }}>
                  <Image source={Images.age} style={styles.imagename1} />
                  <Text style={styles.nametext}>Age</Text>
                </View>
                <Text style={[styles.nametext1, {}]}>{age} years</Text>
              </View>
            </View>

            <View style={[styles.mainview, { top: 15 }]}>
              <View style={styles.nameview}>
                <View style={{ height: hp(0.5) }}></View>
                <View style={{ flexDirection: 'row', top: 5 }}>
                  <Image source={Images.intrest} style={styles.imagename3} />
                  <Text style={styles.nametext}>Interest</Text>
                </View>
                <Text style={[styles.nametext1, { paddingLeft: '22%' }]}>
                  {interest}
                </Text>
              </View>
              <View style={[styles.nameview, { marginLeft: '4%' }]}>
                <View style={{ height: hp(0.5) }}></View>
                <View style={{ flexDirection: 'row', top: 5 }}>
                  <Image source={Images.city1} style={styles.imagename4} />
                  <Text style={styles.nametext}>City</Text>
                </View>
                <Text style={styles.nametext1}>{city}</Text>
              </View>
            </View>
          </View>
          <View style={styles.personview}>
            <View style={{ marginLeft: 10 }}>
              <View style={{ height: hp(0.5) }}></View>
              <View style={{ flexDirection: 'row', top: 5 }}>
                <Image source={Images.personality} style={styles.imagename1} />
                <Text style={styles.nametext}>Personality</Text>
              </View>
              <Text style={styles.nametext5}>{personality}</Text>
            </View>
          </View>
          <View style={{ height: hp(3) }}></View>
          <View style={styles.pictures}>
            <View style={styles.view1}>
              <Text style={[styles.descr, { marginLeft: 0 }]}>Pictures</Text>
            </View>
            <View style={styles.picview}>
              <TouchableOpacity onPress={() => setVisible1(true)}>
                <View style={styles.img1}>
                  <Image source={{ uri: image }} style={styles.im} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible2(true)}>
                <View style={styles.img1}>
                  <Image source={{ uri: image1 }} style={styles.im} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible3(true)}>
                <View style={styles.img1}>
                  <Image source={{ uri: image2 }} style={styles.im} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.description}>
            <View style={{ width: wp(75), height: hp(20) }}>
              <Text style={[styles.descr, { left: 0 }]}>Description</Text>
              <View>
                <Text style={styles.text}>{description}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => meetUpReceiverProfileApi()}
        style={styles.button}>
        <Text style={styles.buttonText}>{`Send Meet up Request`}</Text>
      </TouchableOpacity>
      {picModal()}
      {picModal1()}
      {picModal2()}
      {picModal3()}
    </View>
  );
};
export default withConnect(receiverProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND,
    alignItems: 'center',
  },
  number: {
    color: COLORS.LOGINTEXT,
    fontSize: responsiveFontSize(2),
    top: 5,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  nametext1: {
    color: COLORS.LOGINTEXT,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    paddingLeft: '19%',
    paddingVertical: '5%',
  },
  approveimage: {
    height: 20,
    width: 20,
    marginLeft: 10,
  },
  mobilenumber: {
    elevation: 7,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(10),
    width: wp(82),
    marginTop: '5%',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  button: {
    borderRadius: 10,
    padding: METRICS.MAR_10,
    marginBottom: Platform.OS === 'ios' ? hp(3) : 0,
    width: '96%',
    backgroundColor: COLORS.LOGINBUTTON,
    marginTop: '1%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    color: COLORS.WHITE,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.INTER_BOLD,
  },
  pictures: {
    height: hp(20),
    width: wp(82),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  description: {
    height: hp(22),
    width: wp(82),
    backgroundColor: COLORS.WHITESHADOW,
    borderColor: COLORS.BORDER_COLOR,
    elevation: 7,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '4%',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  text: {
    fontSize: responsiveFontSize(2),
    color: '#444444',
    padding: 5,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  text1: {
    fontSize: responsiveFontSize(2),
    color: '#444444',
    padding: 5,
    textDecorationLine: 'underline',
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  descr: {
    fontSize: responsiveFontSize(3),
    color: COLORS.LOGINTEXT,
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
  },
  topview: {
    backgroundColor: COLORS.WHITESHADOW,
    borderRadius: 20,
    width: wp(95),
    height: Platform.OS === 'android' ? hp(125) : hp(125),
    top: Platform.OS === 'android' ? '5%' : '5%',
  },
  nameview: {
    width: wp(40),
    backgroundColor: COLORS.WHITESHADOW,
    borderRadius: 5,
    elevation: 7,
    borderColor: COLORS.NAMECOLORBORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  nametext: {
    color: '#828282',
    fontSize: responsiveFontSize(2),
    paddingHorizontal: METRICS.MAR_10,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  mainview: {
    flexDirection: 'row',
  },
  personview: {
    height: hp(9),
    width: Platform.OS === 'android' ? wp(82) : wp(82),
    backgroundColor: COLORS.WHITESHADOW,
    elevation: 7,
    borderColor: COLORS.NAMECOLORBORDER,
    alignSelf: 'center',
    marginTop: '10%',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  profileImage: {
    height: 120,
    borderRadius: 80,
    borderColor: '#085DF1',
    borderWidth: 5,
    width: 120,
    resizeMode: 'cover',
  },
  topview1: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-12%',
  },
  nametext5: {
    color: COLORS.LOGINTEXT,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    paddingHorizontal: '10%',
    paddingTop: '2%',
  },
  umar: {
    color: COLORS.LOGINTEXT,
    fontSize: responsiveFontSize(3),
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
  },
  imagename: {
    marginLeft: 7,
    tintColor: '#444444',
    paddingVertical: METRICS.MAR_5,
  },
  imagename3: {
    marginLeft: 7,
    tintColor: '#444444',
    paddingVertical: METRICS.MAR_5,
  },
  imagename1: {
    marginLeft: 7,
    tintColor: '#444444',
    paddingVertical: METRICS.MAR_5,
    resizeMode: 'contain',
  },
  imagename4: {
    marginLeft: 7,
    tintColor: '#444444',
    paddingVertical: METRICS.MAR_5,
  },
  online: {
    position: 'absolute',
    left: 215,
    bottom: '20%',
  },
  mobiletext: {
    color: COLORS.BORDER_COLOR,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  picview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  view1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verify1: {
    backgroundColor: COLORS.WHITESHADOW,
    height: 25,
    width: 54,
    borderRadius: 20,
    top: 5,
    marginLeft: 5,
    borderColor: COLORS.BORDER_COLOR,
    elevation: 3,
    borderWidth: 0.5,
  },
  verify: {
    fontSize: responsiveFontSize(1.5),
    color: '#FF2222',
    textAlign: 'center',
    top: 3,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  img1: {
    height: hp(15),
    width: wp(25),
    borderColor: COLORS.BORDER_COLOR,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  im: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  im1: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 10
  },
  modalview: {
    backgroundColor: 'green',
    height: hp(10),
    width: wp(50),
  },
  modal: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(72),
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
  flatImageView: {
    // height: hp(72),
    // width: wp(80),
    // alignItems: 'center',
    // justifyContent:'center'
  },
  scrollingView: {
    marginTop: hp(2)
  }
});
