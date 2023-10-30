import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  Keyboard,
} from "react-native";
import _ from "lodash";
import { showMessage } from "react-native-flash-message";
import { COLORS, FONT_FAMILIES } from "../../../Configration";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import withConnect from "./withConnect";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import OTPTextView from 'react-native-otp-textinput';
import { SCREENS, VALIDATE_FORM } from "../../../Constant";
import { Images } from "../../../Assets";
import Network from '../../../Network';
import { EmailValidator } from "../../../Common/common";
import ModalLoader from "../../../ReuableComponent/ModalLoader";
import { SafeAreaView } from "react-native-safe-area-context";
const { RESETPASSWORD } = SCREENS;
const forgetOtp = (props: any) => {
  const { navigation, route } = props;
  const { params } = route;
  const [useridvalue] = useState(params.userValue.user_id);
  const [mobileinput] = useState(params.mobilenumber)
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // *********************Ref***************************
  const inputRef = useRef(null);

  const clear = () => {
    // @ts-ignore
    inputRef.current.clear();
  };

  {/************************Validation State's***************************/ }
  const validation = () => {
    var message = "";
    if (_.isEmpty(userid.trim())) {
      message = VALIDATE_FORM.EMAIL;
    }
    else if (!EmailValidator(userid)) {
      message = VALIDATE_FORM.EMAIL_VALID;
    }
    else if (_.isEmpty(password.trim())) {
      message = VALIDATE_FORM.PASSWORD;
    }
    if (!_.isEmpty(message)) {
      showMessage({ message: message, type: "danger" });
      return false;
    }
    return true;
  };
  const userLogin = async () => {
    if (validation()) {
      navigation.navigate(RESETPASSWORD);
    }
  };

  const [otp, setOtp] = useState("");

  const [count, setCount] = useState(true);
  const [Time, setTime] = useState();

  // *********************timer***************************
  const timer = () => {
    setCount(true)
    var sec = 30;
    var timer = setInterval(function () {
      // @ts-ignore
      setTime(`00:${(sec.toString().length < 2 ? '0' : '')}` + sec);
      sec--;
      if (sec < 0) {
        clearInterval(timer);
        setCount(false)
      }
    }, 1100);
  }

  useEffect(() => {
    timer();
  }, []);

  // *********************resend Otp***************************
  const resendOtp = async () => {
    clear();
    const body = new FormData();
    body.append('user_id', useridvalue);
    const result: any = await Network.createApiClient().resendOtp(body);
    if (result.data && result.data.success === true) {
      showMessage({ message: result.data.message, type: 'success' });
      timer();
    } else {
      showMessage({ message: result.data.message, type: 'danger' });
    }
  };

  // *********************Otp Verify***************************
  const otpVerified = async () => {
    Keyboard.dismiss();
    if (true) {
      setLoading(true);
      const body = new FormData();
      body.append('user_id', useridvalue);
      body.append('otp_code', otp);
      const result: any = await Network.createApiClient().forgot_otp_verify(body);
      if (result.data && result.data.success === true) {
        clear();
        setLoading(false);
        showMessage({ message: result.data.message, type: 'success' });
        navigation.navigate(RESETPASSWORD, { userValue: useridvalue });
      } else {
        showMessage({ message: result.data.message, type: 'danger' });
        setLoading(false);
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
                {/* @ts-ignore */}
                <Image style={styles.backarrow} source={Images.back} />
              </TouchableOpacity>
            </View>
            <View style={styles.topview}>
              <View style={styles.logo}>
                <Image source={Images.logo} />
              </View>
              <View style={[styles.mobile, {}]}>
                <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.ROBOTO_REGULAR }]}>{'Verification'}</Text>
                <Text style={[styles.txt, { fontSize: responsiveFontSize(1.8), color: COLORS.BLURTEXT, marginTop: '2%', fontFamily: FONT_FAMILIES.ROBOTO_REGULAR }]}>{'Enter Your Verification Code for number'}</Text>
                <Text style={[styles.txt, { fontSize: responsiveFontSize(1.8), fontWeight: '500', marginTop: '2%' }]}>{mobileinput} {'\n'}is</Text>
              </View>
              <View style={[styles.mobile, { height: hp(40), alignItems: 'center' }]}>
                <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(16), width: wp(87), alignItems: 'center' }]}>
                  <OTPTextView
                    handleTextChange={(txt) => setOtp(txt)}
                    defaultValue={otp}
                    containerStyle={styles.otpinput}
                    textInputStyle={styles.otp}
                    inputCount={6}
                    tintColor={COLORS.BORDER_COLOR}
                    ref={inputRef}
                  />
                  <View style={styles.resend}>
                    <View style={styles.resendcount}>
                      <Text style={[styles.resendtxt, { color: count ? COLORS.LOGINBUTTON : COLORS.BORDER_COLOR, fontWeight: '600' }]}>{Time}</Text>
                    </View>
                    <TouchableOpacity style={[styles.resendbtn, { borderColor: count ? COLORS.BORDER_COLOR : COLORS.LOGINBUTTON }]} disabled={count} onPress={() => resendOtp()}>
                      <Text style={[styles.resendtxt, { color: count ? COLORS.BORDER_COLOR : COLORS.LOGINBUTTON, fontWeight: '400' }]}>{'Resend'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.insidemobile, {}]}>
                  <View style={[styles.mobile, { height: hp(13) }]}>
                    <TouchableOpacity style={styles.button} onPress={() => otpVerified()}>
                      <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Continue'}</Text>
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

export default withConnect(forgetOtp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND
  },
  bgimg: {
    height: hp(38)
  },
  main: {
    height: hp(86),
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontWeight: '400'
  },
  insidemobile: {
    height: hp(24),
    width: wp(83)
  },
  label: {
    height: hp(3)
  },
  textInput: {
    backgroundColor: COLORS.SHADOW,
    height: hp(6),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.TEXTBORDER,
    borderWidth: 1
  },
  textinput: {
    width: wp(80),
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    // @ts-ignore
    paddingLeft: Platform.OS === 'ios' ? 5 : null
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
  otp: {
    color: COLORS.BLACK,
    borderBottomWidth: 0.5,
    height: 60,
    width: 47,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 0.5,
    backgroundColor: COLORS.SHADOW,
    borderRadius: 5,
    elevation: 10,
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  resend: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: wp(86)
  },
  resendbtn: {
    height: hp(4.5),
    width: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: COLORS.LOGINBUTTON,
    borderWidth: 1,
  },
  resendtxt: {
    color: COLORS.LOGINBUTTON,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontSize: responsiveFontSize(2)
  },
  resendcount: {
    height: hp(4.5),
    width: wp(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  otpinput: {
    height: hp(10),
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
  }
})

