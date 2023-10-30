import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  Keyboard
} from "react-native";
import _ from "lodash";
import { showMessage } from "react-native-flash-message";
import { COLORS, FONT_FAMILIES } from "../../../Configration";
import CardView from "react-native-cardview";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import withConnect from "./withConnect";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { SCREENS, VALIDATE_FORM } from "../../../Constant";
import { Images } from "../../../Assets";
import ModalLoader from "../../../ReuableComponent/ModalLoader";
import { SafeAreaView } from "react-native-safe-area-context";
import Network from "../../../Network";
const { LOGIN } = SCREENS;
const resetPassword = (props: any) => {
  const { navigation, route } = props;
  const { params } = route;
  const [user_id] = useState(params.userValue);
  const [Password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [hidePassword, sethidePassword] = useState(true);

  const [confirmPassword, setconfirmPassword] = useState('');
  const [checkconfirmPassword, setcheckconfirmPassword] = useState(false);
  const [errorconfirmPassword, seterrorconfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  // *********************************_confirmpasswordvalidate**********************************************

  const _confirmpasswordvalidate = (pass: any) => {
    if (pass === '') {
      seterrorconfirmPassword('');
      setcheckconfirmPassword(true);
    } else if (pass !== Password) {
      seterrorconfirmPassword(VALIDATE_FORM.MISMATCH);
      setcheckconfirmPassword(true);
    } else {
      seterrorconfirmPassword('');
      setcheckconfirmPassword(false);
    }
  };

  // ********************************* validate ************************************************************

  const validate = () => {
    let flag = true;
    if (Password === '' || checkPassword) {
      setErrorPassword(errorPassword ? errorPassword : VALIDATE_FORM.PASSWORD);
      flag = false;
    }
    if (confirmPassword === '' || checkconfirmPassword) {
      seterrorconfirmPassword(errorconfirmPassword ? errorconfirmPassword : VALIDATE_FORM.C_PASSWORD);
      flag = false;
    }
    else {
      return flag;
    }
  };

  // *************************************userLogin**************************************************
  const userLogin = async () => {
    Keyboard.dismiss();
    if (validate()) {
      setLoading(true);
      const body = new FormData();
      body.append('user_id', user_id);
      body.append('password', confirmPassword);
      const result: any = await Network.createApiClient().resetPassword(body);
      if (result.data && result.data.success === true) {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'success' });
        //@ts-ignore
        navigation.navigate(LOGIN);
      } else {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'danger' });
      }
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ImageBackground source={Images.loginbackground} style={styles.bgimg}>
          <View style={styles.main}>
            <View style={styles.topview}>
              <View style={styles.logo}>
                <Image source={Images.logo} />
              </View>
              <View style={[styles.mobile, { height: hp(12) }]}>
                <Text style={styles.txt}>{'New Password'}</Text>
              </View>
              <View style={[styles.mobile, { height: hp(45), alignItems: 'center' }]}>
                <View style={[styles.insidemobile, {}]}>
                  <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(13) }]}>
                    <View style={[styles.label, {}]}>
                      <Text style={[styles.txt, { textAlign: 'left', fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Enter Your New Password'}</Text>
                    </View>
                    <View style={[styles.label, { height: hp(6.5), justifyContent: 'center' }]}>
                      <CardView
                        style={[styles.textInput]}
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={5}
                      >
                        <TextInput
                          style={styles.textinput}
                          maxLength={20}
                          placeholderTextColor={COLORS.BLURTEXT}
                          placeholder={'Enter 8 Characters Minimum'}
                          keyboardType='default'
                          onChangeText={(txt) => { setPassword(txt), _passwordvalidate(txt) }}
                        />
                      </CardView>
                    </View>
                    <View style={[styles.error, {}]}>
                      {errorPassword !== null ? (<Text style={styles.errortxt}>{errorPassword}</Text>) : null}
                    </View>
                  </View>
                  <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(13) }]}>
                    <View style={[styles.label, {}]}>
                      <Text style={[styles.txt, { textAlign: 'left', fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Confirm Password'}</Text>
                    </View>
                    <View style={[styles.label, { height: hp(6.5), justifyContent: 'center' }]}>
                      <CardView
                        style={[styles.textInput, { flexDirection: 'row' }]}
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={5}
                      >
                        <TextInput
                          style={[styles.textinput, { width: wp(72), height: hp(5.5) }]}
                          maxLength={20}
                          placeholderTextColor={COLORS.BLURTEXT}
                          placeholder={'Enter 8 Characters Minimum'}
                          keyboardType='default'
                          secureTextEntry={hidePassword}
                          onChangeText={(txt) => { setconfirmPassword(txt), _confirmpasswordvalidate(txt) }}
                        />
                        <View style={styles.hide}>
                          <TouchableOpacity onPress={() => sethidePassword(!hidePassword)} style={styles.hidebtn}>
                            {/* @ts-ignore */}
                            <Image source={hidePassword ? Images.password1 : Images.password} style={styles.pass} />
                          </TouchableOpacity>
                        </View>
                      </CardView>
                    </View>
                    <View style={[styles.error, {}]}>
                      {errorconfirmPassword !== null ? (<Text style={styles.errortxt}>{errorconfirmPassword}</Text>) : null}
                    </View>
                  </View>
                  <View style={[styles.mobile, { height: hp(12) }]}>
                    <TouchableOpacity style={styles.button} onPress={() => userLogin()}>
                      <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Submit'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.error, { flex: .5, justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={styles.last}>
                      <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>Existing User?</Text><TouchableOpacity onPress={() => navigation.navigate(LOGIN)}><Text style={[styles.txt, { color: 'red', textDecorationLine: 'underline', fontSize: responsiveFontSize(2), textAlign: 'left', fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Login'}</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <ModalLoader loading={loading} />
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  )
}

export default withConnect(resetPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND
  },
  bgimg: {
    // aspectRatio: 1.2,
    height: hp(38)
  },
  main: {
    height: hp(84),
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  topview: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(70),
    width: wp(93),
    borderRadius: 30,
    elevation: 6
  },
  logo: {
    alignItems: 'center',
    marginTop: -50
  },
  mobile: {
    height: hp(15),
    justifyContent: 'center',
  },
  txt: {
    fontSize: responsiveFontSize(3),
    textAlign: 'center',
    color: COLORS.LOGINTEXT,
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
    fontWeight: '400'
  },
  insidemobile: {
    height: hp(45),
    width: wp(83)
  },
  label: {
    height: hp(3),
    justifyContent: 'flex-start'
  },
  textInput: {
    backgroundColor: COLORS.SHADOW,
    height: hp(6),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.TEXTBORDER,
    borderWidth: 1,
    flexDirection: 'row'
  },
  textinput: {
    // width: wp(80),
    width: wp(79),
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    // @ts-ignore
    paddingLeft: Platform.OS === 'ios' ? 5 : null,
    // backgroundColor:'orange'
  },
  error: {
    height: hp(2.5),
  },
  button: {
    backgroundColor: COLORS.LOGINBUTTON,
    height: hp(6),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errortxt: {
    color: 'red',
    fontSize: responsiveFontSize(1.5),
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  country: {
    width: wp(13),
    height: hp(5),
    borderRightColor: 'gray',
    borderRightWidth: 1,
    // backgroundColor:'green',
    // justifyContent:'center'
  },
  countrytxt: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    marginTop: Platform.OS === 'ios' ? '25%' : '15%',
    color: COLORS.LOGINTEXT,
  },
  hide: {
    aspectRatio: .95,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  hidebtn: {
    height: hp(5.5),
    width: wp(8),
    justifyContent: 'center',
    alignItems: 'center'
  },
  back: {
    height: Platform.OS === 'ios' ? hp(13) : hp(13),
    width: wp(95),
  },
  backarrow: {
    height: hp(3),
    width: wp(4),
    tintColor: COLORS.BOTTOM_COLOR
  },
  backbtn: {
    backgroundColor: COLORS.WHITE,
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  last: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: wp(45)
  },
  pass: {
    height: hp(3),
    width: wp(7)
  }
})
