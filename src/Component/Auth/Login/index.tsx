import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import _ from 'lodash';
import { COLORS, METRICS, FONT_FAMILIES } from '../../../Configration';
import CardView from 'react-native-cardview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import withConnect from './withConnect';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SCREENS, VALIDATE_FORM } from '../../../Constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Images } from '../../../Assets';
import ModalLoader from '../../../ReuableComponent/ModalLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSignInViaSocialHook } from '../Register/useLoginHook';

const { REGISTER, FORGET_PASSWORD } = SCREENS;
const login = (props: any) => {
  const { navigation, loginAction } = props;
  const [Email, setEmail] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');

  const [Password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [hidePassword, sethidePassword] = useState(true);

  const [loading, setLoading] = useState(false);
  const [fixLength, setfixLength] = useState(Number);
  const { loginWithGoogle1 } = useSignInViaSocialHook(loginAction);
  const _emailvalidate = (mail: any) => {
    var emailRegex = /^[A-Za-z0-9]+[\w.-]*@[A-Za-z0-9]+\.[A-Za-z]{2,}$/i;
    var phoneRegex = /^[6-9]\d{9}$/;
    // @ts-ignore
    setfixLength('');
    if (mail === '') {
      setErrorEmail(VALIDATE_FORM.EMAIL);
      setCheckEmail(true);
    } else if (!emailRegex.test(mail) && !phoneRegex.test(mail)) {
      setErrorEmail(VALIDATE_FORM.EMAIL_VALID);
      setCheckEmail(true);
    } else if (!emailRegex.test(mail) && phoneRegex.test(mail)) {
      setErrorEmail('');
      setCheckEmail(false);
      setfixLength(10);
    } else {
      setErrorEmail('');
      setCheckEmail(false);
    }
  };

  // *********************************_passwordvalidate**********************************************

  const _passwordvalidate = (pass: any) => {
    var passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-_=+{}\[\]:;"'<>,.?/\\|]{8,}$/;
    if (pass === '') {
      setErrorPassword(VALIDATE_FORM.PASSWORD);
      setCheckPassword(true);
    } else if (!passwordRegex.test(pass)) {
      setErrorPassword(VALIDATE_FORM.VALID_PASSWORD);
      setCheckPassword(true);
    } else {
      setErrorPassword('');
      setCheckPassword(false);
    }
  };

  // ********************************* validate **********************************************

  const validate = () => {
    let flag = true;
    if (Email === '' || checkEmail) {
      setErrorEmail(errorEmail ? errorEmail : VALIDATE_FORM.EMAILMOBILE);
      flag = false;
    }
    if (Password === '' || checkPassword) {
      setErrorPassword(errorPassword ? errorPassword : VALIDATE_FORM.PASSWORD);
      flag = false;
    } else {
      return flag;
    }
  };

  //***************Register function **************/
  const register = () => {
    navigation.navigate(REGISTER);
  };

  //***************autoLoader function **************
  const autoLoader = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1100);
  };

  //***************userLogin function **************
  const userLogin = async () => {
    Keyboard.dismiss();
    if (validate()) {
      setLoading(true);
      const fcTo: any = await AsyncStorage.getItem('fcmToken');
      const body = {
        email: Email,
        password: Password,
        fcm_token: fcTo
      };
      console.log('newdata123', body);
      loginAction({ body: body, isLogin: true, navigation: navigation });
      autoLoader();
      setEmail('');
      setPassword('');
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <ImageBackground source={Images.loginbackground} style={styles.bgimg}>
          <View style={styles.main}>
            <View style={styles.topview}>
              <View style={styles.logo}>
                <Image source={Images.logo} />
              </View>
              <View style={[styles.mobile, { height: hp(8) }]}>
                <Text
                  style={[
                    styles.txt,
                    { fontFamily: FONT_FAMILIES.ROBOTO_REGULAR },
                  ]}>
                  {'Login'}
                </Text>
              </View>
              <View
                style={[styles.mobile, { height: hp(65), alignItems: 'center' }]}>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                  <View style={styles.insidemobile}>
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
                          {'Email Id'}
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
                            placeholder={'Enter Your Email Id'}
                            value={Email}
                            placeholderTextColor={COLORS.GRAY}
                            maxLength={fixLength ? fixLength : 50}
                            keyboardType={'email-address'}
                            autoCapitalize="none"
                            onChangeText={txt => {
                              setEmail(txt), _emailvalidate(txt);
                            }}
                          />
                        </CardView>
                        {errorEmail !== null ? (
                          <Text style={styles.errortxt}>{errorEmail}</Text>
                        ) : null}
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
                          {'Password'}
                        </Text>
                      </View>
                      <View style={[styles.label, { height: hp(9) }]}>
                        <CardView
                          style={[styles.textInput, { flexDirection: 'row' }]}
                          cardElevation={2}
                          cardMaxElevation={2}
                          cornerRadius={5}>
                          <TextInput
                            style={[
                              styles.textinput,
                              { width: wp(72), height: hp(5.5) },
                            ]}
                            placeholder={'Please Enter Your Password'}
                            value={Password}
                            secureTextEntry={hidePassword}
                            placeholderTextColor={COLORS.GRAY}
                            onChangeText={txt => {
                              setPassword(txt), _passwordvalidate(txt);
                            }}
                          />
                          <View style={styles.hide}>
                            <TouchableOpacity
                              onPress={() => sethidePassword(!hidePassword)}
                              style={styles.hidebtn}>
                              <Image
                                source={
                                  hidePassword
                                    ? Images.password1
                                    : Images.password
                                }
                                // @ts-ignore
                                style={styles.pass}
                              />
                            </TouchableOpacity>
                          </View>
                        </CardView>
                        {errorPassword !== null ? (
                          <Text style={styles.errortxt}>{errorPassword}</Text>
                        ) : null}
                      </View>
                    </View>
                    <View style={styles.forget}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate(FORGET_PASSWORD)}>
                        <Text style={styles.forgettxt}>
                          {'Forgot Password ?'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.mobile, { height: hp(12) }]}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => userLogin()}>
                        <Text
                          style={[
                            styles.txt,
                            {
                              fontSize: responsiveFontSize(2),
                              textAlign: 'left',
                              color: COLORS.WHITE,
                              fontFamily: FONT_FAMILIES.INTER_SEMIBOLD,
                            },
                          ]}>
                          {'Login'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.socialView}>
                      <Text style={[styles.account, { fontFamily: FONT_FAMILIES.INTER_MEDIUM }]}>You can login By Social account</Text>
                      <View style={styles.socialView1}>
                        <TouchableOpacity onPress={() => loginWithGoogle1()}>
                          {/* @ts-ignore */}
                          <Image source={Images.google} style={styles.googleImage} />
                        </TouchableOpacity>
                        {Platform.OS === 'ios' && <TouchableOpacity>
                          <Image source={Images.facebook} />
                        </TouchableOpacity>}
                      </View>
                    </View>
                    <View style={styles.footer}>
                      <Text
                        style={styles.account}>{`Don't Have An account?`}</Text>
                      <TouchableOpacity onPress={() => register()}>
                        <Text style={styles.signup}>{`Sign Up`}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
      <ModalLoader loading={loading} />
    </SafeAreaView>
  );
};

export default withConnect(login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND,
  },
  bgimg: {
    height: hp(38),
  },
  main: {
    height: hp(110),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topview: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(85),
    width: wp(93),
    borderRadius: 30,
    elevation: 6,
  },
  logo: {
    alignItems: 'center',
    marginTop: -50,
  },
  back: {
    height: Platform.OS === 'ios' ? hp(15) : hp(15),
    width: wp(95),
  },
  backarrow: {
    height: hp(3),
    width: wp(4),
    tintColor: COLORS.BOTTOM_COLOR
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
  },
  insidemobile: {
    height: hp(60),
    width: wp(83),
  },
  label: {
    height: Platform.OS === 'ios' ? hp(3.2) : hp(3.3),
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
  error: {
    flex: 1,
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
  footer: {
    marginTop: hp(2),
    flexDirection: 'row',
    alignSelf: 'center',
  },
  account: {
    color: COLORS.LOGINTEXT,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  signup: {
    color: COLORS.SIGNUP,
    fontSize: responsiveFontSize(1.8),
    marginHorizontal: METRICS.MAR_5,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    textDecorationLine: 'underline',
  },
  hide: {
    height: hp(5.5),
    width: wp(8),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  forget: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  forgettxt: {
    color: '#FF0000',
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontSize: responsiveFontSize(2),
  },
  hidebtn: {
    height: hp(5.5),
    width: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backbtn: {
    backgroundColor: COLORS.WHITE,
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pass: {
    height: hp(2),
    width: wp(5),
  },
  socialView: {
    // backgroundColor: 'red',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(16),
    borderColor: COLORS.BORDER_COLOR
  },
  socialView1: {
    width: '80%',
    // backgroundColor:'red',
    flexDirection: 'row',
    marginTop: hp(2),
    justifyContent: 'space-evenly'
  },
  googleImage: {
    height: hp(8),
    width: wp(80),
    resizeMode: 'contain'
  },
  safeView: {
    flex: 1, backgroundColor: 'white'
  }
});
