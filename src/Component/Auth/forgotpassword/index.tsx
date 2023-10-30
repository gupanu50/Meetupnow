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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import withConnect from "./withConnect";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { SCREENS, VALIDATE_FORM } from "../../../Constant";
import CardView from "react-native-cardview";
import { Images } from "../../../Assets";
import Network from '../../../Network';
import ModalLoader from "../../../ReuableComponent/ModalLoader";
import { SafeAreaView } from "react-native-safe-area-context";
const { FORGOTOTP } = SCREENS;
const forgetPassword = (props: any) => {
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fixLength, setfixLength] = useState(Number);
  const [visible, setVisible] = useState<boolean>(false);

  // *********************************_mobilevalidate**********************************************

  const _emailvalidate = (mail: any) => {
    var emailRegex = /^(?:\d{10}|\w+@\w+\.\w{2,3})$/i;
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

  // ***********************************validate***************************************************
  const validate = () => {
    let flag = true;
    if (email === '' || checkEmail) {
      setErrorEmail(errorEmail ? errorEmail : VALIDATE_FORM.EMAIL);
      flag = false;
    } else {
      return flag;
    }
  }

  //*********************************** Forgot APi function ************************************
  const forgotPassword = async () => {
    Keyboard.dismiss()
    if (validate()) {
      setLoading(true)
      const body = new FormData();
      body.append('username', email);
      const result: any = await Network.createApiClient().forget_password(body);
      if (result.data && result.data.success === true) {
        showMessage({ message: result.data.message, type: 'success' });
        setLoading(false);
        navigation.navigate(FORGOTOTP, { userValue: result.data.data, mobilenumber: email });
        setEmail('');
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
            <View style={styles.back}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbtn}>
                <Image style={styles.backarrow} source={Images.back} />
              </TouchableOpacity>
            </View>
            <View style={styles.topview}>
              <View style={styles.logo}>
                <Image source={Images.logo} />
              </View>
              <View style={styles.mobile}>
                <Text style={[styles.txt, {}]}>{'Forgot Password'}</Text>
                <Text style={[styles.txt, { color: COLORS.BLURTEXT, fontSize: responsiveFontSize(2), marginTop: '2%' }]}>{'Enter Email Id Verification'}</Text>
              </View>
              <View style={[styles.mobile, { height: hp(45), alignItems: 'center' }]}>
                <View style={styles.insidemobile}>
                  <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(14) }]}>
                    <View style={styles.label}>
                      <Text style={[styles.txt, { textAlign: 'left', fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Email Id'}</Text>
                    </View>
                    <View style={styles.input}>
                    <CardView
                          style={[styles.textInput]}
                          cardElevation={2}
                          cardMaxElevation={2}
                          cornerRadius={5}>
                          <TextInput
                            style={styles.textinput}
                            placeholder={'Enter Your Email Id'}
                            value={email}
                            maxLength={fixLength ? fixLength : 50}
                            placeholderTextColor={COLORS.GRAY}
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
                  <View style={[styles.mobile, { height: hp(10) }]}>
                    <TouchableOpacity style={styles.button} onPress={() => forgotPassword()}>
                      <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Get OTP'}</Text>
                    </TouchableOpacity>
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

export default withConnect(forgetPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND
  },
  bgimg: {
    height: hp(38)
  },
  main: {
    height: hp(90),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topview: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(74),
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
    height: hp(3)
  },
  textInput: {
    backgroundColor: COLORS.SHADOW,
    height: hp(6),
    borderRadius: 6,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.TEXTCOLOR,
    elevation: 5
  },
  textinput: {
    height: hp(5.8),
    width: '100%',
    fontSize: responsiveFontSize(2),
    color: "black",
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontWeight: '400'
  },
  error: {
    flex: 1
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
    height: hp(5.8),
    justifyContent: "center",
    alignItems: 'center'
  },
  countrytxt: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    color: COLORS.LOGINTEXT,
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
  backbtn: {
    backgroundColor: COLORS.WHITE,
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: hp(9),
  }
})

