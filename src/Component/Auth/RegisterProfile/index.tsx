import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import withConnect from './withConnect';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SCREENS, VALIDATE_FORM } from '../../../Constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'react-native-image-picker';
import { Images } from '../../../Assets';
import NavHeader from '../../../ReuableComponent/NavHeader';
import { showMessage } from 'react-native-flash-message';
import Network from '../../../Network';
import moment from 'moment';
import CardView from 'react-native-cardview';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ModalLoader from '../../../ReuableComponent/ModalLoader';
import { useBackHandler } from '@react-native-community/hooks';
import { Dropdown } from 'react-native-element-dropdown';
import { createUserInFirestore } from '@flyerhq/react-native-firebase-chat-core';
import auth from '@react-native-firebase/auth';
const { REGISTERPROFILE } = SCREENS;
const registerProfile = (props: any) => {
  const { navigation, userData, route, loginAction } = props;
  const { naviName } = route.params;
  const [userInf] = useState(naviName === 'login' ? userData : userData[0]);
  const [Name, setName] = useState('');
  const [checkName, setcheckName] = useState(false);
  const [errorName, seterrorName] = useState('');
  const [name1, setName1] = useState('');
  const [checkName1, setcheckName1] = useState(false);
  const [errorName1, seterrorName1] = useState('');
  const [phone, setPhone] = useState('');
  const [checkPhone, setcheckPhone] = useState(false);
  const [errorPhone, seterrorPhone] = useState('');
  const [Visible, setVisible] = useState(false);
  const [Visible1, setVisible1] = useState(false);
  const [Visible2, setVisible2] = useState(false);
  const [Visible3, setVisible3] = useState(false);
  const [Interest, setInterest] = useState('');
  const [errorInterest, seterrorInterest] = useState('');
  const [Gender, setGender] = useState('');
  const [errorGender, seterrorGender] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [Personality, setPersonality] = useState('');
  const [errorPersonality, seterrorPersonality] = useState('');
  const [Description, setDescription] = useState('');
  const [errorDesc, seterrorDesc] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraIdModal, setCameraIdModal] = useState(0);
  const camera: any = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front;
  const [errorPhoto, seterrorPhoto] = useState('');
  const [selectCountry, setSelectCountry] = useState('');
  const [selectState, setSelectState] = useState('');
  const [selectCity, setSelectCity] = useState('');
  const [selectErrorCountry, setSelectErrorCountry] = useState<string | null>(
    '',
  );
  const scrollViewRef: any = useRef();
  const [checkDesc, setCheckDesc] = useState(false);
  const nameInputRef: any = useRef(null);
  const descInputRef: any = useRef(null);
  const userInputRef: any = useRef(null);
  const [selectErrorState, setSelectErrorState] = useState<string | null>('');
  const [selectErrorCity, setSelectErrorCity] = useState<string | null>('');
  const [countryListData, setCountryListData] = useState([]);
  const [stateListData, setStateListData] = useState([]);
  const [cityListData, setCityListData] = useState([]);
  const [referral, setReferral] = useState<any>();

  const dob = new Date();
  const year1 = dob.getFullYear();
  const month1 = dob.getMonth();
  const day = dob.getDate();

  const [date, setDate] = useState<any>('DD');
  const [month, setMonth] = useState<any>('MM');
  const [year, setYear] = useState<any>('YYYY');
  const [errorDob, seterrorDob] = useState('');

  const [loading, setLoading] = useState(false);
  useBackHandler(() => {
    if (showCamera) {
      navigation.replace(REGISTERPROFILE, { naviName: 'register' });
    } else {
      navigation.goBack();
    }
    return true;
  });
  const updateDate = selectedDate => {
    setDate(moment(selectedDate).format('DD'));
    setMonth(moment(selectedDate).format('MMM'));
    setYear(moment(selectedDate).format('YYYY'));
  };

  const [fileData, setfileData] = useState<any>({
    name: '',
    type: '',
    uri: '',
  });

  const [fileData1, setfileData1] = useState<any>({
    name: '',
    type: '',
    uri: '',
  });

  const [fileData2, setfileData2] = useState<any>({
    name: '',
    type: '',
    uri: '',
  });

  const [fileData3, setfileData3] = useState<any>({
    name: '',
    type: '',
    uri: '',
  });

  const PHOTO = [
    { key: 1, img: Images.dummyImage, VIS: setVisible1, DATA: fileData1 },
    { key: 2, img: Images.dummyImage, VIS: setVisible2, DATA: fileData2 },
    { key: 3, img: Images.dummyImage, VIS: setVisible3, DATA: fileData3 },
  ];

  // **************************************************

  const renderPhoto = (item: any) => {
    const { key, img, VIS, DATA } = item.item;
    if (
      key == 1 &&
      DATA.uri !== null &&
      key == 2 &&
      DATA.uri !== null &&
      key == 3 &&
      DATA.uri !== null
    ) {
      console.log('inside');
    }

    return (
      <TouchableOpacity onPress={() => VIS(true)}>
        <View style={[styles.slide, {}]}>
          <Image
            source={DATA.uri ? { uri: DATA.uri } : img}
            style={
              DATA.uri
                ? {
                  height: hp(15),
                  width: wp(25),
                  borderRadius: 8,
                }
                : { height: 30, width: 30 }
            }
          />
          <View style={[styles.insidebox, {}]}>
            <View style={styles.circlebtn}>
              <Text
                style={[
                  styles.txt,
                  {
                    color: COLORS.WHITE,
                    fontSize: responsiveFontSize(1.5),
                    textAlign: 'left',
                  },
                ]}>
                {'+'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const SORT = [
    { key: 1, img: Images.camera, name: 'Take A Selfie' },
    { key: 2, img: Images.upload_img, name: 'From Gallery' },
  ];
  useEffect(() => {
    getCountry();
  }, []);
  useEffect(() => {
    getState();
  }, [selectCountry]);
  useEffect(() => {
    getCity();
  }, [selectState]);
  //***************************Get country */

  const getCountry = async () => {
    try {
      const result: any = await Network.createApiClient().getCountry();
      const countries: any[] = result?.data?.data?.countries;
      if (Array.isArray(countries)) {
        setCountryListData(
          // @ts-ignore
          countries.map(country => ({
            label: country?.name,
            value: country?.name,
          })),
        );
      } else {
        console.error(
          'Invalid API response format. Expected an array of countries.',
        );
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  //***************************Get country */
  const getState = async () => {
    if (selectCountry !== '') {
      const body = new FormData();
      body.append('country_id', selectCountry);
      try {
        const result: any = await Network.createApiClient().getState(body);
        const states: any[] = result?.data?.states;
        if (Array.isArray(states)) {
          setStateListData(
            // @ts-ignore
            states.map(states => ({
              label: states?.name,
              value: states?.name,
            })),
          );
        } else {
          console.error(
            'Invalid API response format. Expected an array of states.',
          );
        }
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    }
  };

  //***************************Get city */
  const getCity = async () => {
    if (selectState !== '') {
      const body = new FormData();
      body.append('state_id', selectState);
      try {
        const result: any = await Network.createApiClient().getCity(body);
        const cities: any[] = result?.data?.states;
        if (Array.isArray(cities)) {
          setCityListData(
            // @ts-ignore
            cities.map(states => ({
              label: states?.name,
              value: states?.name,
            })),
          );
        } else {
          console.error(
            'Invalid API response format. Expected an array of cities.',
          );
        }
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    }
  };

  const renderSort = (item: any) => {
    const { key, img, name } = item.item;
    const Id = 1;
    return (
      <TouchableOpacity
        onPress={() =>
          key == 1 ? launchRNCamera(Id) : launchImageLibrary(Id)
        }>
        <View style={styles.sortcontainer}>
          <View style={styles.left}>
            <Image source={img} />
          </View>
          <View style={styles.right}>
            <Text
              style={[
                styles.txt,
                { fontSize: responsiveFontSize(2), textAlign: 'left' },
              ]}>
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSort1 = (item: any) => {
    const { key, img, name } = item.item;
    const Id = 2;
    return (
      <TouchableOpacity
        onPress={() =>
          key == 1 ? launchRNCamera(Id) : launchImageLibrary(Id)
        }>
        <View style={styles.sortcontainer}>
          <View style={styles.left}>
            <Image source={img} />
          </View>
          <View style={styles.right}>
            <Text
              style={[
                styles.txt,
                { fontSize: responsiveFontSize(2), textAlign: 'left' },
              ]}>
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSort2 = (item: any) => {
    const { key, img, name } = item.item;
    const Id = 3;
    return (
      <TouchableOpacity
        onPress={() =>
          key == 1 ? launchRNCamera(Id) : launchImageLibrary(Id)
        }>
        <View style={styles.sortcontainer}>
          <View style={styles.left}>
            <Image source={img} />
          </View>
          <View style={styles.right}>
            <Text
              style={[
                styles.txt,
                { fontSize: responsiveFontSize(2), textAlign: 'left' },
              ]}>
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSort3 = (item: any) => {
    const { key, img, name } = item.item;
    const Id = 4;
    return (
      <TouchableOpacity
        onPress={() =>
          key == 1 ? launchRNCamera(Id) : launchImageLibrary(Id)
        }>
        <View style={styles.sortcontainer}>
          <View style={styles.left}>
            <Image source={img} />
          </View>
          <View style={styles.right}>
            <Text
              style={[
                styles.txt,
                { fontSize: responsiveFontSize(2), textAlign: 'left' },
              ]}>
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  // *********************************_namevalidate**********************************************

  const _namevalidate = (name: any) => {
    var nameRegex =
      /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,29}$/;
    if (name === '') {
      seterrorName(VALIDATE_FORM.USER);
      setcheckName(true);
    } else {
      seterrorName('');
      setcheckName(false);
    }
  };
  // *******************Mobile Number Validator**************
  const _mobileValidate = (PhoneNumber: number) => {
    var phoneNumberRegex = /^[6-9]\d{9}$/;
    // @ts-ignore
    if (PhoneNumber === '') {
      seterrorPhone(VALIDATE_FORM.PHONE);
      setcheckPhone(true);
      // @ts-ignore
    } else if (!phoneNumberRegex.test(PhoneNumber)) {
      seterrorPhone(VALIDATE_FORM.VALID_PHONE);
      setcheckPhone(true);
    } else {
      seterrorPhone('');
      setcheckPhone(false);
    }
  };
  // *********************************_emailvalidate**********************************************

  const _namevalidate1 = (name: any) => {
    var nameRegex = /^[a-z ,.'-]+$/i;
    if (name === '') {
      seterrorName1(VALIDATE_FORM.FIRST_NAME);
      setcheckName1(true);
    } else if (!nameRegex.test(name)) {
      seterrorName1(VALIDATE_FORM.VALID_NAME);
      setcheckName1(true);
    } else {
      seterrorName1('');
      setcheckName1(false);
    }
  };
  const _descvalidate = mail => {
    var emailRegex = /^[^0-9]*$/;
    if (mail === '') {
      seterrorDesc('Please Enter description');
      setCheckDesc(true);
    } else if (!emailRegex.test(mail)) {
      seterrorDesc('Please do not enter mobile number');
      setCheckDesc(true);
    } else {
      seterrorDesc('');
      setCheckDesc(false);
    }
  };
  // ************************************validate function************************************************

  const validate = () => {
    let flag = true;
    if (Name === '' || checkName) {
      if (userInputRef.current) {
        userInputRef.current.focus();
      }
      seterrorName(VALIDATE_FORM.USER);
      flag = false;
    }
    if (name1 === '' || checkName1) {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
      seterrorName1(VALIDATE_FORM.FIRST_NAME);
      flag = false;
    }
    if (Gender === '') {
      seterrorGender(VALIDATE_FORM.GENDER);
      flag = false;
    }
    if (Interest === '') {
      seterrorInterest(VALIDATE_FORM.INTEREST);
      flag = false;
    }
    if (Personality === '') {
      seterrorPersonality(VALIDATE_FORM.PERSONALITY);
      flag = false;
    }
    if (date == 'DD') {
      seterrorDob(VALIDATE_FORM.DOB);
      flag = false;
    }
    if (Description === '') {
      if (descInputRef.current) {
        descInputRef.current.focus();
      }
      // @ts-ignore
      seterrorDesc('Please tell us about yourself');
      flag = false;
    }
    if (Description === '' || checkDesc) {
      seterrorDesc('Please Enter Description');
      flag = false;
    }
    if (fileData1.uri == '' || fileData2.uri == '' || fileData3.uri == '') {
      // @ts-ignore
      seterrorPhoto('Please enter atleast 3 Photos');
      flag = false;
    }
    if (fileData.uri == '') {
      showMessage({
        message: 'Please upload your Profile Picture',
        type: 'danger',
      });
      flag = false;
    }
    if (selectCountry === '') {
      setSelectErrorCountry('Please select country');
      flag = false;
    }
    if (selectState === '') {
      setSelectErrorState('Please select state');
      flag = false;
    }
    if (selectCity === '') {
      setSelectErrorCity('Please select city');
      flag = false;
    } else {
      return flag;
    }
  };

  // **********************launchImageLibrary******************************************
  const launchImageLibrary = Id => {
    var SET;
    if (Id === 1) {
      setVisible(false);
      SET = setfileData;
    } else if (Id === 2) {
      setVisible1(false);
      SET = setfileData1;
    } else if (Id === 3) {
      setVisible2(false);
      SET = setfileData2;
    } else {
      setVisible3(false);
      SET = setfileData3;
    }
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.assets[0].uri };
        console.log('response', JSON.stringify(response));
        seterrorPhoto('');
        SET({
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        });
      }
    });
  };

  const cameraPermissions = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log(newCameraPermission);
  };
  const launchRNCamera = Id => {
    var SET;
    if (Id === 1) {
      setVisible(false);
      setCameraIdModal(1);
      SET = setfileData;
    } else if (Id === 2) {
      setVisible1(false);
      setCameraIdModal(2);
      SET = setfileData1;
    } else if (Id === 3) {
      setVisible2(false);
      setCameraIdModal(3);
      SET = setfileData2;
    } else {
      setVisible3(false);
      setCameraIdModal(4);
      SET = setfileData3;
    }
    cameraPermissions();
    setShowCamera(true);
  };
  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      setShowCamera(false);
      console.log('photo', photo);
      console.log(
        'photoaftersplit',
        photo.path.slice(-3),
        `image/${photo.path.slice(-3)}`,
      );
      seterrorPhoto('');
      if (cameraIdModal === 1) {
        setfileData({
          uri: `file://'${photo.path}`,
          name: photo.path,
          type: `image/${photo.path.slice(-3)}`,
        });
      } else if (cameraIdModal === 2) {
        setfileData1({
          uri: `file://'${photo.path}`,
          name: photo.path,
          type: `image/${photo.path.slice(-3)}`,
        });
      } else if (cameraIdModal === 3) {
        setfileData2({
          uri: `file://'${photo.path}`,
          name: photo.path,
          type: `image/${photo.path.slice(-3)}`,
        });
      } else {
        setfileData3({
          uri: `file://'${photo.path}`,
          name: photo.path,
          type: `image/${photo.path.slice(-3)}`,
        });
      }
    }
  };


  // anonymous authentication
  async function anonymousAuth() {
    try {
      await auth().signInAnonymously();
      console.log('User signed in anonymously');
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  }

  //save user to firestore
  async function createFirestore(user: any, userId: string) {
    console.log('====user===>', user);
    const nameParts = user?.name.split(' ');
    try {
      await createUserInFirestore({
        firstName: nameParts[0],
        id: userId,
        imageUrl: user?.profile_image,
        lastName: nameParts.slice(1).join(' ')
          ? nameParts.slice(1).join(' ')
          : '',
      });
      naviName === 'login' ? logoutApi() : logoutApi();
    } catch (error) {
      deleteFirebaseUser();
      console.log('====errorInCreatingFirestore====>', error);
    }
  }

  const [uid, setUid] = useState<string>('');

  // registeruserFirebase
  async function registerUser() {
    if (validate()) {
      setLoading(true);
      try {
        const credential: any = await auth().createUserWithEmailAndPassword(
          userInf?.email,
          userInf?.password,
        );
        const userId: string = credential?.user?.uid;
        if (userId) {
          console.log('====userId===>', userId);
          userLogin(userId);
        }
      } catch (error) {
        setLoading(false);
        console.log('====errorOccuredRegisterUSer===>', error);
        showMessage({
          message: JSON.stringify(error),
          type: 'danger'
        })
      }
    }
  }
  //

  const deleteFirebaseUser = () => {
    const user = auth().currentUser;
    console.log('=======deleteFirebase=====>>>', user);
    if (user) {
      user
        .delete()
        .then(() => {
          // User deleted successfully
          console.log('User deleted successfully');
        })
        .catch(error => {
          // An error occurred while deleting the user
          console.error('Error deleting user:', error);
          setUid('');
        });
    }
  };

  const logoutApi = () => {
    console.log('userDta', userInf);
    console.log('userDtaEmailPAss', userInf.email, userInf.password);
    const body = {
      email: userInf.email,
      password: naviName === 'registerSocial' ? 'Google@123' : userInf.password,
    };
    console.log('newdata123', body);
    loginAction({ body: body, isLogin: true, navigation: navigation });

  };

  // **********************************userLogin******************************************
  const userLogin = async (userId: string) => {
    // if (validate()) {
    setLoading(true);
    const body = new FormData();
    body.append('email', userInf.email);
    body.append('username', Name);
    body.append('description', Description);
    body.append('dob', `${date}/${month}/${year}`);
    body.append('interest', Interest);
    body.append('country', selectCountry);
    body.append('state', selectState);
    body.append('city', selectCity);
    body.append('personality', Personality);
    body.append('image', fileData);
    body.append('image1', fileData1);
    body.append('image2', fileData2);
    body.append('image3', fileData3);
    body.append('name', name1);
    body.append('gender', Gender);
    body.append('user_id', userInf.user_id);
    body.append('password', userInf.password);
    body.append('c_password', userInf.password);
    body.append('firebase_userid', userId);
    {
      referral ? body.append('reffrel_code', referral) : null;
    }
    {
      phone ? body.append('mobile', phone) : null;
    }
    console.log('mobile', body);
    try {
      const result: any = await Network.createApiClient().userprofile(body);
      console.log('newbodylog', result);
      if (result?.data && result?.data?.success === true) {
        setLoading(false);
        showMessage({ message: result?.data?.message, type: 'success' });
        createFirestore(result?.data?.data, userId);
      } else {
        deleteFirebaseUser();
        if (result?.data === null) {
          registerUser();
        } else {
          setLoading(false);
          showMessage({ message: result?.data?.message, type: 'danger' });
        }

      }
    } catch (error) {
      setLoading(false);
      console.log('====errorOccured===>', error);
      deleteFirebaseUser();
    }
    // }
  };

  // *********************************DatePicker***********************************************
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    updateDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      {naviName === 'login' ? (
        // @ts-ignore
        <NavHeader isBack={true} title={'g'} coinicon={'jbh'} isBackHide />
      ) : (
        // @ts-ignore
        <NavHeader isBack={true} title={'g'} coinicon={'jbh'} />
      )}
      <View style={styles.topview}>
        <View style={styles.circle}>
          <View
            style={[
              styles.circ,
              { borderColor: fileData.uri ? 'white' : '#085DF1', borderWidth: fileData.uri ? 11 : 5, backgroundColor: 'lightgray' },
            ]}>
            <Image
              source={
                fileData.uri ? { uri: fileData.uri } : Images.dummyImage
              }
              // @ts-ignore
              style={fileData.uri ? styles.profileimg : styles.profileimg1}
            />
            <TouchableOpacity onPress={() => setVisible(!Visible)}>
              <View style={styles.edit}>
                <Image source={Images.edit} style={{ opacity: 1 }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: Platform.OS === 'ios' ? hp(64) : hp(67), marginTop: hp(2) }}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}>
            <View style={[styles.first1, { height: hp(86) }]}>
              <View style={[styles.insidefirst, { height: hp(85) }]}>
                <View
                  style={[
                    styles.mobile,
                    { justifyContent: 'flex-start', height: hp(12) },
                  ]}>
                  <View style={[styles.label, {}]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Mobile No.'}
                    </Text>
                  </View>
                  <View style={[styles.label, { height: hp(9) }]}>
                    <CardView
                      style={[styles.textInput, { flexDirection: 'row' }]}
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={5}>
                      <TextInput
                        style={styles.textinput}
                        placeholder="Enter Your Mobile Number"
                        keyboardType="phone-pad"
                        maxLength={10}
                        placeholderTextColor={COLORS.BORDER_COLOR}
                        onChangeText={(txt: any) => {
                          setPhone(txt), _mobileValidate(txt);
                        }}
                      />
                    </CardView>
                  </View>
                </View>
                <View
                  style={[
                    styles.mobile,
                    { justifyContent: 'flex-start', height: hp(12) },
                  ]}>
                  <View style={[styles.label, {}]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Username'}
                    </Text>
                  </View>
                  <View style={[styles.label, { height: hp(9) }]}>
                    <CardView
                      style={[styles.textInput]}
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={5}>
                      <TextInput
                        style={styles.textinput}
                        ref={userInputRef}
                        placeholder="Enter Your UserName"
                        placeholderTextColor={COLORS.BORDER_COLOR}
                        onChangeText={txt => {
                          setName(txt), _namevalidate(txt);
                        }}
                      />
                    </CardView>
                    {errorName !== null ? (
                      <Text style={styles.errortxt}>{errorName}</Text>
                    ) : null}
                  </View>
                </View>
                <View
                  style={[
                    styles.mobile,
                    { justifyContent: 'flex-start', height: hp(12) },
                  ]}>
                  <View style={styles.label}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Name'}
                    </Text>
                  </View>
                  <View style={[styles.label, { height: hp(9) }]}>
                    <CardView
                      style={styles.textInput}
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={5}>
                      <TextInput
                        style={styles.textinput}
                        ref={nameInputRef}
                        placeholder="Enter Your Name"
                        placeholderTextColor={COLORS.BORDER_COLOR}
                        autoCapitalize="none"
                        onChangeText={txt => {
                          setName1(txt), _namevalidate1(txt);
                        }}
                      />
                    </CardView>
                    {errorName1 !== null ? (
                      <Text style={styles.errortxt}>{errorName1}</Text>
                    ) : null}
                  </View>
                </View>
                <View
                  style={[
                    styles.mobile,
                    { justifyContent: 'flex-start', height: hp(15) },
                  ]}>
                  <View style={styles.label}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Description'}
                    </Text>
                  </View>
                  <View style={[styles.label, { height: hp(9) }]}>
                    <CardView
                      style={[
                        styles.textInput,
                        {
                          height: hp(9),
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                        },
                      ]}
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={5}>
                      <TextInput
                        style={styles.textinput}
                        placeholder="Tell us about yourself"
                        multiline={true}
                        ref={descInputRef}
                        placeholderTextColor={COLORS.BORDER_COLOR}
                        onChangeText={txt => {
                          setDescription(txt), seterrorDesc(''), _descvalidate(txt);
                        }}
                      />
                    </CardView>
                    {errorDesc !== null ? (
                      <Text style={styles.errortxt}>{errorDesc}</Text>
                    ) : null}
                  </View>
                </View>
                <View
                  style={[
                    styles.mobile,
                    { height: hp(22), justifyContent: 'flex-start' },
                  ]}>
                  <View style={[styles.label, { height: hp(3) }]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Add Photo'}
                    </Text>
                  </View>
                  {/* @ts-ignore */}
                  <View style={styles.addphoto}>
                    <FlatList
                      horizontal={true}
                      scrollEnabled={false}
                      data={PHOTO}
                      renderItem={renderPhoto}
                    />
                  </View>
                  {errorPhoto !== null ? (
                    <Text style={styles.errortxt}>{errorPhoto}</Text>
                  ) : null}
                </View>
                <View
                  style={[
                    styles.mobile,
                    { justifyContent: 'flex-start', height: hp(13) },
                  ]}>
                  <View style={[styles.label, { height: hp(3.5) }]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Date Of Birth'}
                    </Text>
                  </View>
                  <View style={[styles.label, { height: hp(8.8) }]}>
                    <TouchableOpacity
                      onPress={() => {
                        showDatePicker(), seterrorDob('');
                      }}>
                      <View style={styles.dob}>
                        <View
                          style={[
                            styles.userInput,
                            {
                              width: '25%',
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <Text style={styles.textStyle}>{date}</Text>
                        </View>
                        <View
                          style={[
                            styles.userInput,
                            {
                              width: '25%',
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <Text style={styles.textStyle}>{month}</Text>
                        </View>
                        <View
                          style={[
                            styles.userInput,
                            {
                              width: '40%',
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <Text style={styles.textStyle}>{year}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.error}>
                      {errorDob !== null ? (
                        <Text style={styles.errortxt}>{errorDob}</Text>
                      ) : null}
                    </View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                      maximumDate={new Date(year1 - 18, month1, day)}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.second, {}]}>
              <View style={[styles.insidesecond, {}]}>
                <View style={[styles.mobile, { height: hp(16) }]}>
                  <View
                    style={[
                      styles.interest,
                      { height: hp(13), alignItems: 'center' },
                    ]}>
                    <View style={styles.insideinterest}>
                      <View style={[styles.label, {}]}>
                        <Text
                          style={[
                            styles.txt,
                            {
                              textAlign: 'left',
                              fontSize: responsiveFontSize(2),
                              fontFamily: FONT_FAMILIES.INTER_REGULAR,
                            },
                          ]}>
                          {'Gender'}
                        </Text>
                      </View>
                      <View style={styles.insidegender}>
                        <View style={styles.gender}>
                          <TouchableOpacity
                            onPress={() => {
                              setGender('male'), seterrorGender('');
                            }}>
                            <View
                              style={[
                                styles.terms,
                                {
                                  backgroundColor:
                                    Gender === 'male'
                                      ? COLORS.LOGINBUTTON
                                      : COLORS.SHADOW,
                                },
                              ]}></View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color: '#444444',
                              },
                            ]}>
                            {'Male'}
                          </Text>
                        </View>
                        <View style={[styles.gender, { width: '23%' }]}>
                          <TouchableOpacity
                            onPress={() => {
                              setGender('female'), seterrorGender('');
                            }}>
                            <View
                              style={[
                                styles.terms,
                                {
                                  backgroundColor:
                                    Gender === 'female'
                                      ? COLORS.LOGINBUTTON
                                      : COLORS.SHADOW,
                                },
                              ]}></View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color: '#444444',
                              },
                            ]}>
                            {'Female'}
                          </Text>
                        </View>
                        <View style={[styles.gender, { width: '33%' }]}>
                          <TouchableOpacity
                            onPress={() => {
                              setGender('transgender'), seterrorGender('');
                            }}>
                            <View
                              style={[
                                styles.terms,
                                {
                                  backgroundColor:
                                    Gender === 'transgender'
                                      ? COLORS.LOGINBUTTON
                                      : COLORS.SHADOW,
                                },
                              ]}></View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color: '#444444',
                              },
                            ]}>
                            {'Transgender'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {errorGender !== null ? (
                    <Text style={styles.errortxt}>{errorGender}</Text>
                  ) : null}
                </View>
                <View style={[styles.mobile, { height: hp(16) }]}>
                  <View
                    style={[
                      styles.interest,
                      { height: hp(13), alignItems: 'center' },
                    ]}>
                    <View style={styles.insideinterest}>
                      <View style={[styles.label, {}]}>
                        <Text
                          style={[
                            styles.txt,
                            {
                              textAlign: 'left',
                              fontSize: responsiveFontSize(2),
                              fontFamily: FONT_FAMILIES.INTER_REGULAR,
                            },
                          ]}>
                          {'Interest'}
                        </Text>
                      </View>
                      <View style={styles.insidegender}>
                        <View style={styles.gender}>
                          <TouchableOpacity
                            onPress={() => {
                              setInterest('male'), seterrorInterest('');
                            }}>
                            <View
                              style={[
                                styles.terms,
                                {
                                  backgroundColor:
                                    Interest === 'male'
                                      ? COLORS.LOGINBUTTON
                                      : COLORS.SHADOW,
                                },
                              ]}></View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color: '#444444',
                              },
                            ]}>
                            {'Male'}
                          </Text>
                        </View>
                        <View style={[styles.gender, { width: '23%' }]}>
                          <TouchableOpacity
                            onPress={() => {
                              setInterest('female'), seterrorInterest('');
                            }}>
                            <View
                              style={[
                                styles.terms,
                                {
                                  backgroundColor:
                                    Interest === 'female'
                                      ? COLORS.LOGINBUTTON
                                      : COLORS.SHADOW,
                                },
                              ]}></View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color: '#444444',
                              },
                            ]}>
                            {'Female'}
                          </Text>
                        </View>
                        <View style={[styles.gender, { width: '18%' }]}>
                          <TouchableOpacity
                            onPress={() => {
                              setInterest('both'), seterrorInterest('');
                            }}>
                            <View
                              style={[
                                styles.terms,
                                {
                                  backgroundColor:
                                    Interest === 'both'
                                      ? COLORS.LOGINBUTTON
                                      : COLORS.SHADOW,
                                },
                              ]}></View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color: '#444444',
                              },
                            ]}>
                            {'Both'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {errorInterest !== null ? (
                    <Text style={styles.errortxt}>{errorInterest}</Text>
                  ) : null}
                </View>
                <View style={[styles.mobile, { height: hp(16) }]}>
                  <View
                    style={[
                      styles.interest,
                      { height: hp(13), alignItems: 'center' },
                    ]}>
                    <View style={styles.insideinterest}>
                      <View style={[styles.label, {}]}>
                        <Text
                          style={[
                            styles.txt,
                            {
                              textAlign: 'left',
                              fontSize: responsiveFontSize(2),
                              fontFamily: FONT_FAMILIES.INTER_REGULAR,
                            },
                          ]}>
                          {'Personality'}
                        </Text>
                      </View>
                      <View
                        style={[styles.insidegender, { alignItems: 'center' }]}>
                        <TouchableOpacity
                          style={[
                            styles.btn,
                            {
                              backgroundColor:
                                Personality === 'introvert'
                                  ? COLORS.LOGINBUTTON
                                  : COLORS.SHADOW,
                            },
                          ]}
                          onPress={() => {
                            setPersonality('introvert'),
                              seterrorPersonality('');
                          }}>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color:
                                  Personality === 'introvert'
                                    ? COLORS.WHITE
                                    : '#444444',
                              },
                            ]}>
                            {'Introvert'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.btn,
                            {
                              backgroundColor:
                                Personality === 'extrovert'
                                  ? COLORS.LOGINBUTTON
                                  : COLORS.SHADOW,
                            },
                          ]}
                          onPress={() => {
                            setPersonality('extrovert'),
                              seterrorPersonality('');
                          }}>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color:
                                  Personality === 'extrovert'
                                    ? COLORS.WHITE
                                    : '#444444',
                              },
                            ]}>
                            {'Extrovert'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.btn,
                            {
                              backgroundColor:
                                Personality === 'ambivert'
                                  ? COLORS.LOGINBUTTON
                                  : COLORS.SHADOW,
                            },
                          ]}
                          onPress={() => {
                            setPersonality('ambivert'), seterrorPersonality('');
                          }}>
                          <Text
                            style={[
                              styles.txt,
                              {
                                fontSize: responsiveFontSize(1.5),
                                color:
                                  Personality === 'ambivert'
                                    ? COLORS.WHITE
                                    : '#444444',
                              },
                            ]}>
                            {'Ambivert'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  {errorPersonality !== null ? (
                    <Text style={styles.errortxt}>{errorPersonality}</Text>
                  ) : null}
                </View>
              </View>
            </View>
            <View style={[styles.first1, { height: hp(60) }]}>
              <View style={[styles.insidefirst, { height: hp(43) }]}>
                <View
                  style={[
                    styles.mobile,
                    { justifyContent: 'flex-start', height: hp(31.5) },
                  ]}>
                  <View style={[styles.label, {}]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Country'}
                    </Text>
                  </View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={countryListData}
                    placeholder={'Select Country'}
                    labelField="label"
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={styles.itemTextColor}
                    valueField="value"
                    value={selectCountry}
                    search
                    searchPlaceholder="Search your country here"
                    onChange={(item: any) => {
                      setSelectCountry(item.value);
                      setSelectErrorCountry(null);
                    }}
                  />
                  {selectErrorCountry !== null ? (
                    <Text style={styles.errortxt}>{selectErrorCountry}</Text>
                  ) : null}
                  <View style={[styles.label, {}]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'State'}
                    </Text>
                  </View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={stateListData}
                    placeholder={'Select State'}
                    labelField="label"
                    valueField="value"
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={styles.itemTextColor}
                    value={selectState}
                    search
                    searchPlaceholder="Search your state here"
                    onChange={(item: any) => {
                      setSelectState(item.value), setSelectErrorState(null);
                    }}
                  />
                  {selectErrorState !== null ? (
                    <Text style={styles.errortxt}>{selectErrorState}</Text>
                  ) : null}
                  <View style={[styles.label, {}]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'City'}
                    </Text>
                  </View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={cityListData}
                    placeholder={'Select City'}
                    inputSearchStyle={styles.inputSearchStyle}
                    labelField="label"
                    valueField="value"
                    itemTextStyle={styles.itemTextColor}
                    value={selectCity}
                    search
                    searchPlaceholder="Search your city here"
                    onChange={(item: any) => {
                      setSelectCity(item.value), setSelectErrorCity(null);
                    }}
                  />
                  {selectErrorCity !== null ? (
                    <Text style={styles.errortxt}>{selectErrorCity}</Text>
                  ) : null}
                </View>
                <View
                  style={[
                    styles.mobile,
                    {
                      justifyContent: 'flex-start',
                      height: hp(7),
                      marginTop: hp(5),
                    },
                  ]}>
                  <View style={[styles.label, {}]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          textAlign: 'left',
                          fontSize: responsiveFontSize(2),
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Referral Code (Optional)'}
                    </Text>
                  </View>
                  <View style={[styles.label, { height: hp(8.4) }]}>
                    <CardView
                      style={[styles.textInput]}
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={5}>
                      <TextInput
                        style={styles.textinput}
                        placeholder="Enter Referral Code"
                        placeholderTextColor={COLORS.BORDER_COLOR}
                        onChangeText={txt => {
                          setReferral(txt);
                        }}
                      />
                    </CardView>
                  </View>
                </View>
                <View style={[styles.buttonview, {}]}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => registerUser()}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          color: COLORS.WHITESHADOW,
                          fontFamily: FONT_FAMILIES.INTER_BOLD,
                          fontSize: responsiveFontSize(2),
                          fontWeight: '600',
                        },
                      ]}>
                      {'Meetup Now'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Modal animationType={'slide'} transparent={true} visible={Visible}>
              <TouchableWithoutFeedback
                style={styles.modalview}
                onPress={() => setVisible(false)}>
                <View style={[styles.modal, {}]}>
                  <View style={styles.cross}>
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      style={styles.crossbtn}>
                      <Image
                        // @ts-ignore
                        style={styles.close}
                        source={Images.close_button}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.upload}>
                    <Image source={Images.upload} />
                    <Text
                      style={[styles.txt, { fontSize: responsiveFontSize(2) }]}>
                      {'Upload Photos'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sortflatlist,
                      { height: hp(13), justifyContent: 'center' },
                    ]}>
                    <FlatList
                      data={SORT}
                      renderItem={renderSort}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={Visible1}>
              <TouchableWithoutFeedback
                style={styles.modalview}
                onPress={() => setVisible1(false)}>
                <View style={[styles.modal, {}]}>
                  <View style={styles.cross}>
                    <TouchableOpacity
                      onPress={() => setVisible1(false)}
                      style={styles.crossbtn}>
                      <Image
                        // @ts-ignore
                        style={styles.close}
                        source={Images.close_button}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.upload}>
                    <Image source={Images.upload} />
                    <Text
                      style={[styles.txt, { fontSize: responsiveFontSize(2) }]}>
                      {'Upload Photos'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sortflatlist,
                      { height: hp(13), justifyContent: 'center' },
                    ]}>
                    <FlatList
                      data={SORT}
                      renderItem={renderSort1}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={Visible2}>
              <TouchableWithoutFeedback
                style={styles.modalview}
                onPress={() => setVisible2(false)}>
                <View style={[styles.modal, {}]}>
                  <View style={styles.cross}>
                    <TouchableOpacity
                      onPress={() => setVisible2(false)}
                      style={styles.crossbtn}>
                      <Image
                        // @ts-ignore
                        style={styles.close}
                        source={Images.close_button}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.upload}>
                    <Image source={Images.upload} />
                    <Text
                      style={[styles.txt, { fontSize: responsiveFontSize(2) }]}>
                      {'Upload Photos'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sortflatlist,
                      { height: hp(13), justifyContent: 'center' },
                    ]}>
                    <FlatList
                      data={SORT}
                      renderItem={renderSort2}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={Visible3}>
              <TouchableWithoutFeedback
                style={styles.modalview}
                onPress={() => setVisible3(false)}>
                <View style={[styles.modal, {}]}>
                  <View style={styles.cross}>
                    <TouchableOpacity
                      onPress={() => setVisible3(false)}
                      style={styles.crossbtn}>
                      <Image
                        // @ts-ignore
                        style={styles.close}
                        source={Images.close_button}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.upload}>
                    <Image source={Images.upload} />
                    <Text
                      style={[styles.txt, { fontSize: responsiveFontSize(2) }]}>
                      {'Upload Photos'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sortflatlist,
                      { height: hp(13), justifyContent: 'center' },
                    ]}>
                    <FlatList
                      data={SORT}
                      renderItem={renderSort3}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <ModalLoader loading={loading} />
      {showCamera && (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            // @ts-ignore
            device={device}
            isActive={showCamera}
            photo={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.camButton}
              onPress={() => capturePhoto()}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default withConnect(registerProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND,
  },
  profileimg: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    borderRadius: 100 / 2,
  },
  profileimg1: {
    flex: 1,
    width: wp(13),
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 100 / 2,
  },
  topview: {
    backgroundColor: COLORS.WHITESHADOW,
    margin: 10,
    borderRadius: 25,
    height: Platform.OS === 'ios' ? hp(75) : hp(78),
    marginTop: '13%',
    // top:42,
    elevation: 6,
  },
  insidebox: {
    height: hp(15.7),
    width: wp(28),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
  },
  edit: {
    backgroundColor: '#3487E1',
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35 / 2,
    top: -40,
    left: 78,
    position: 'absolute',
  },
  userInput: {
    backgroundColor: COLORS.SHADOW,
    borderRadius: 5,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    color: COLORS.BLACK,
    height: hp(6.5),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  dob: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insideinterest: {
    height: hp(10),
    width: wp(83),
  },
  terms: {
    height: hp(2.5),
    width: wp(5),
    borderColor: '#EEEDED',
    borderWidth: 2,
    backgroundColor: COLORS.SHADOW,
  },
  gender: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '18%',
    alignItems: 'center',
  },
  interest: {
    height: hp(15),
    borderColor: '#EEEDED',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: COLORS.WHITESHADOW,
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: COLORS.SHADOW,
    borderColor: '#EEEDED',
    borderWidth: 1,
    height: '70%',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  modalview: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(25),
    width: wp(80),
    borderRadius: 8,
    elevation: 10,
    borderColor: '#E2E2E2',
    borderWidth: 1,
  },
  cross: {
    height: hp(3),
    width: wp(79),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  crossbtn: {
    height: hp(3),
    width: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    tintColor: 'black',
  },
  sortflatlist: {
    height: hp(16.5),
    alignItems: 'center',
  },
  sortcontainer: {
    height: hp(5.7),
    width: wp(75),
    marginVertical: 3,
    borderRadius: 8,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    flexDirection: 'row',
  },
  left: {
    width: wp(17),
    height: hp(5.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    height: hp(5.5),
    width: wp(40),
    justifyContent: 'center',
  },
  upload: {
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  insidephoto: {
    height: '80%',
    width: '100%',
    justifyContent: 'center',
  },
  slide: {
    backgroundColor: '#F4F3F3',
    height: hp(15),
    width: wp(25),
    marginHorizontal: 5,
    borderRadius: 8,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    left: wp(-1),
  },
  textStyle: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  circle: {
    height: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-15%',
  },
  circ: {
    height: 120,
    width: 120,
    borderRadius: 120 / 2,
    borderColor: COLORS.WHITESHADOW,
    borderWidth: 6,
  },
  first: {
    height: hp(75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  first1: {
    height: hp(75),
    alignItems: 'center',
  },
  insidefirst: {
    height: hp(74),
    width: wp(83),
  },
  mobile: {
    height: hp(15),
    justifyContent: 'center',
  },
  txt: {
    fontSize: responsiveFontSize(3),
    textAlign: 'center',
    color: COLORS.LOGINTEXT,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontWeight: '400',
  },
  insidemobile: {
    height: hp(60),
    width: wp(83),
  },
  label: {
    height: hp(3),
  },
  textInput: {
    backgroundColor: COLORS.SHADOW,
    height: hp(6),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.TEXTBORDER,
    borderWidth: 1,
  },
  textinput: {
    width: wp(80),
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    // @ts-ignore
    paddingLeft: Platform.OS === 'ios' ? 5 : null,
  },
  button: {
    backgroundColor: COLORS.LOGINBUTTON,
    height: hp(6),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errortxt: {
    color: 'red',
    fontSize: responsiveFontSize(1.5),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  second: {
    height: hp(49),
    alignItems: 'center',
  },
  insidesecond: {
    height: hp(48.4),
    width: wp(87),
  },
  insidegender: {
    flexDirection: 'row',
    height: hp(7),
    justifyContent: 'space-between',
  },
  buttonview: {
    height: hp(12),
    justifyContent: 'flex-end',
  },
  circlebtn: {
    backgroundColor: '#3487E1',
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    padding: 20,
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#B2BEB5',
  },
  dropdown: {
    height: hp(7),
    backgroundColor: COLORS.SHADOW,
    borderRadius: 8,
    paddingHorizontal: hp(2),
    borderColor: COLORS.WHITE,
    borderWidth: 1.4,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(2),
    color: 'grey',
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(2),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontWeight: '400',
  },
  itemTextColor: {
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  inputSearchStyle: {
    color: COLORS.BLACK,
  },
});
