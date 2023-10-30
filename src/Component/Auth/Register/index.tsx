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
  Modal,
  ScrollView,
} from "react-native";
import _ from "lodash";
import { COLORS, METRICS, FONT_FAMILIES } from "../../../Configration";
import CardView from "react-native-cardview";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import withConnect from "./withConnect";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { SCREENS, VALIDATE_FORM } from "../../../Constant";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Images } from "../../../Assets";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import { ActionType } from "../../../Redux/Type";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackHandler } from "@react-native-community/hooks";
import ModalLoader from '../../../ReuableComponent/ModalLoader';
import Network from "../../../Network";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignInViaSocialHook } from "./useLoginHook";
const { USER_DATA } = ActionType;
const { LOGIN, OTP } = SCREENS;
const register = (props: any) => {
  const dispatch = useDispatch();
  const { navigation, loginAction } = props;
  const [Check, setCheck] = useState(false);
  const [errorCheck, seterrorCheck] = useState('');

  const [email, setEmail] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [hidePassword, sethidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState('');
  const [checkconfirmPassword, setcheckconfirmPassword] = useState(false);
  const [errorconfirmPassword, seterrorconfirmPassword] = useState('');
  const [hideCPassword, sethideCPassword] = useState(true);
  const [modalVisibleTerms, setModalVisibleTerms] = useState(false);
  const { loginWithGoogle } = useSignInViaSocialHook(loginAction);
  // *********************************_namevalidate**********************************************
  useBackHandler(() => {
    return true
  });
  const _emailvalidate = mail => {
    var emailRegex = /^[A-Za-z0-9]+[\w.-]*@[A-Za-z0-9]+\.[A-Za-z]{2,}$/i;
    if (mail === '') {
      setErrorEmail(VALIDATE_FORM.EMAIL);
      setCheckEmail(true);
    } else if (!emailRegex.test(mail)) {
      setErrorEmail(VALIDATE_FORM.EMAIL_VALID);
      setCheckEmail(true);
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

  // ********************************* validate **********************************************

  const validate = () => {
    let flag = true;
    if (email === '' || checkEmail) {
      setErrorEmail(VALIDATE_FORM.EMAIL);
      flag = false;
    }
    if (Password === '' || checkPassword) {
      setErrorPassword(errorPassword ? errorPassword : VALIDATE_FORM.PASSWORD);
      flag = false;
    }
    if (confirmPassword === '' || checkconfirmPassword) {
      seterrorconfirmPassword(errorconfirmPassword ? errorconfirmPassword : VALIDATE_FORM.C_PASSWORD);
      flag = false;
    }
    if (!Check) {
      seterrorCheck(errorCheck ? errorCheck : VALIDATE_FORM.CHECK);
      flag = false;
    }
    else {
      return flag;
    }
  };


  // ********************************* submit **********************************************
  const submit = async () => {
    if (validate()) {
      const fcTo: any = await AsyncStorage.getItem('fcmToken');
      setLoading(true);
      const body = new FormData();
      body.append("email", email);
      body.append("password", Password);
      body.append("c_password", confirmPassword);
      body.append("fcm_token", fcTo);
      console.log("bodyOfCreateAccount", body);
      const result: any = await Network.createApiClient().create_account(body);
      console.log('createAccountapiresult', result);
      if (result.data && result.data.success === true) {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'success' });
        console.log('user_id', result.data.data.user_id);
        const DATA = [{ email: email, password: Password, user_id: result.data.data.user_id }];
        dispatch({ type: USER_DATA, payload: DATA });
        setEmail("");
        setPassword("");
        setconfirmPassword("");
        setCheck(false);
        navigation.navigate(OTP, { emailId: email, userId: result.data.data.user_id });
      } else {
        setLoading(false);
        showMessage({ message: result?.data?.message, type: 'danger' });
      }
    }
  };

  // ********************************* login **********************************************
  const login = () => {
    navigation.navigate(LOGIN)
  }
  const modalTerms = () => {
    return (
      <Modal animationType={'slide'} transparent={true} visible={modalVisibleTerms}>
        <View style={styles.modalview}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.innerModal}>
                <Text style={styles.modalHeadingText}>Terms and Conditions</Text>
                <Text style={styles.modalSubHeadingText}>1- Introduction</Text>
                <Text style={styles.modalSubHeadingValueText}>1.1- Welcome to "Meetup Now," a dating app
                  designed to help individuals meet and connect with potential partners.
                  By using this app, you agree to comply with these terms and conditions.</Text>
                <Text style={styles.modalSubHeadingText}>2- Eligibility</Text>
                <Text style={styles.modalSubHeadingValueText}>2.1- Users must be at least 18 years old to
                  use "Meetup Now." By using the app, you confirm that you are of legal age to enter
                  into agreements.</Text>
                <Text style={styles.modalSubHeadingText}>3- User Accounts</Text>
                <Text style={styles.modalSubHeadingValueText}>3.1- Users must provide accurate information when
                  creating an account.</Text>
                <Text style={styles.modalSubHeadingValueText}>3.2- Protect your account and password;
                  you are responsible for any activity that occurs under your account.</Text>
                <Text style={styles.modalSubHeadingValueText}>3.3- You may not share your account
                  or impersonate others. </Text>
                <Text style={styles.modalSubHeadingText}>4- Privacy</Text>
                <Text style={styles.modalSubHeadingValueText}>4.1- We respect your privacy.
                  Our Privacy Policy outlines how your data is collected, used,
                  and protected. By using the app, you consent to our privacy practices.</Text>
                <Text style={styles.modalSubHeadingText}>5- User Content</Text>
                <Text style={styles.modalSubHeadingValueText}>5.1- Users are responsible for the content they
                  post.</Text>
                <Text style={styles.modalSubHeadingValueText}>5.2- Content must not violate our
                  community guidelines or be unlawful, obscene, or harmful.</Text>
                <Text style={styles.modalSubHeadingText}>6- Safety</Text>
                <Text style={styles.modalSubHeadingValueText}>6.1- "Meetup Now" encourages safe online and offline
                  interactions.</Text>
                <Text style={styles.modalSubHeadingValueText}>6.2- Report any suspicious or harmful behavior immediately.</Text>
                <Text style={styles.modalSubHeadingText}>7- Termination</Text>
                <Text style={styles.modalSubHeadingValueText}>7.1- We reserve the right to terminate or suspend accounts that
                  violate these terms and conditions.</Text>
                <Text style={styles.modalSubHeadingText}>8- Disclaimers</Text>
                <Text style={styles.modalSubHeadingValueText}>8.1- "Meetup Now" is not responsible for the
                  actions of its users.</Text>
                <Text style={styles.modalSubHeadingValueText}>8.2- We do not guarantee the accuracy of user
                  profiles or the success of any connections made.</Text>
                <Text style={styles.modalSubHeadingText}>9- Intellectual Property</Text>
                <Text style={styles.modalSubHeadingValueText}>9.1- "Meetup Now" retains all rights
                  to the app and its content.</Text>
                <Text style={styles.modalSubHeadingValueText}>9.2- Users may not use our branding
                  or content without permission. </Text>
                <Text style={styles.modalSubHeadingText}>10- Limitation of Liability</Text>
                <Text style={styles.modalSubHeadingValueText}>10.1- "Meetup Now" is not liable for any indirect,
                  incidental, or consequential damages.</Text>
                <Text style={styles.modalSubHeadingText}>11- Governing Law</Text>
                <Text style={styles.modalSubHeadingValueText}>11.1- These terms are governed by the
                  laws of [Your jurisdiction].</Text>
                <Text style={styles.modalSubHeadingText}>12- Changes to Terms</Text>
                <Text style={styles.modalSubHeadingValueText}>12.1- We may update these terms and conditions.
                  Users will be notified of any changes. </Text>
                <Text style={styles.modalSubHeadingText}>13- Contact Information</Text>
                <Text style={styles.modalSubHeadingValueText}>13.1- If you have questions or concerns,
                  contact us at [Your contact information].</Text>
                <Text style={styles.modalSubHeadingText}>14- User Content</Text>
                <Text style={styles.modalSubHeadingValueText}>14.1- Users can share personal information like their
                  name, age, location, hobbies, and interests to create an informative profile.</Text>
                <Text style={styles.modalSubHeadingValueText}>14.2- Users may upload photos, videos, and
                  other media to enhance their profiles.</Text>
                <Text style={styles.modalSubHeadingValueText}>14.3- Content shared must adhere to the following guidelines</Text>
                <Text style={styles.modalSubHeadingValueText}>14.3.1- Users are prohibited from sharing
                  personal contact information (phone numbers, email addresses, residential addresses, etc.) directly within
                  their profiles or in any public areas of the app. </Text>
                <Text style={styles.modalSubHeadingValueText}>14.3.2- Users are not allowed to share external platform
                  account details, including but not limited to Instagram, Facebook, WhatsApp, and other social media accounts,
                  as it goes against the terms and conditions of the app.</Text>
                <Text style={styles.modalSubHeadingText}>15- User Interactions and Meet-ups</Text>
                <Text style={styles.modalSubHeadingValueText}>15.1- "Meetup Now" provides a platform for users to connect
                  and decide to meet in person at their own discretion and interest.</Text>
                <Text style={styles.modalSubHeadingValueText}>15.2- Users are solely responsible for their interactions and
                  meet-ups arranged through the app.</Text>
                <Text style={styles.modalSubHeadingValueText}>15.3- "Meetup Now" does not endorse or support any
                  sexual activities or explicit content, and such activities are strictly prohibited.</Text>
                <Text style={styles.modalSubHeadingValueText}>15.4- Any user found engaging in inappropriate, spammy,
                  or suspicious activities may have their account banned or suspended by the app. We maintain a zero-tolerance
                  policy for such behaviors.</Text>
                <Text style={styles.modalSubHeadingText}>16- Reward Coins and Conditions</Text>
                <Text style={styles.modalSubHeadingValueText}>16.1- "Meetup Now" may offer reward coins to users for successful
                  referrals or meet-ups with other users, subject to specific terms and conditions outlined in the app.</Text>
                <Text style={styles.modalSubHeadingValueText}>16.2- Users have the option to either use these reward coins
                  within the app for various features or to withdraw them to their accounts, subject to withdrawal policies and
                  limitations provided by the app.</Text>
                <Text style={styles.modalSubHeadingValueText}>16.3- "Meetup Now" reserves the right to change the conditions,
                  policies, or terms related to reward coins at any time and in any manner. Users will be informed of such changes
                  as they occur.</Text>
                <Text style={styles.modalSubHeadingText}>17- User Meet-up Guidelines</Text>
                <Text style={styles.modalSubHeadingValueText}>17.1- Users are encouraged to arrange meet-ups in public,
                  well-lit, and safe locations where they feel comfortable.</Text>
                <Text style={styles.modalSubHeadingValueText}>17.2- "Meetup Now" is not responsible for any incidents, accidents,
                  or outcomes resulting from user meet-ups. Meet-ups are solely at the discretion and responsibility of the users
                  involved. Users should exercise caution and use their best judgment when arranging and attending meet-ups.</Text>
                <Text style={styles.modalSubHeadingValueText}>17.3- Users are advised to share their meet-up plans with a
                  trusted friend or family member, and consider notifying them of their whereabouts during the meet-up.</Text>
                <Text style={styles.modalSubHeadingText}>18- Modification of in app Coin Policies</Text>
                <Text style={styles.modalSubHeadingValueText}>18.1- "Meetup Now" reserves the right to modify the use, value,
                  or expiration duration of coins and reward coins in the app at its discretion.</Text>
                <Text style={styles.modalSubHeadingValueText}>18.2- Users will be notified of any changes to the reward coin
                  policies within the app.</Text>
                <Text style={styles.modalSubHeadingValueText}>18.3- Users agree to abide by the updated reward coin
                  policies as and when they are modified by "Meetup Now."</Text>
                <Text style={styles.modalSubHeadingText}>19- Meet-up Verification</Text>
                <Text style={styles.modalSubHeadingValueText}>19.1- "Meetup Now" allows users to send and accept meet-up
                  to connect with nearby users for meetings or dates.</Text>
                <Text style={styles.modalSubHeadingValueText}>19.2- When a user accepts a meet-up request and decides to meet,
                  they will be provided with a unique meet-up code generated on the other user's mobile device, the one who
                  initiated the request.</Text>
                <Text style={styles.modalSubHeadingValueText}>19.3- The user who accepted the meet-up request must enter the
                  meet-up code in the app to verify the meet-up</Text>
                <Text style={styles.modalSubHeadingValueText}>19.4-  Verification of the meet-up is a mandatory step to ensure
                  the safety and authenticity of the encounter.</Text>
                <Text style={styles.modalSubHeadingValueText}>19.5- Failure to verify a meet-up may result in a violation of
                  our terms and conditions and could lead to account suspension or other appropriate actions by "Meetup Now."</Text>
                <Text style={styles.modalHeadingText}>Privacy Policy</Text>
                <Text style={styles.modalSubHeadingText}>1- Introduction</Text>
                <Text style={styles.modalSubHeadingValueText}>1.1- "Meetup Now" is committed to protecting your privacy.
                  This Privacy Policy outlines how your data is collected, used, and safeguarded. By using the app, you consent
                  to the practices described in this policy.</Text>
                <Text style={styles.modalSubHeadingText}>2- Information We Collect</Text>
                <Text style={styles.modalSubHeadingValueText}>2.1- User Profile Data: We collect data provided by users,
                  such as name, age, location, hobbies, interests, and photos.</Text>
                <Text style={styles.modalSubHeadingValueText}>2.2- Communication Data: We store messages and interactions
                  within the app to enhance the user experience and facilitate successful connections.</Text>
                <Text style={styles.modalSubHeadingValueText}>2.3- Location Data: With user consent, we collect location
                  information to provide proximity-based matching.</Text>
                <Text style={styles.modalSubHeadingValueText}>2.4- Device Information: We gather data about the device used
                  to access the app, such as device type, operating system, and browser.</Text>
                <Text style={styles.modalSubHeadingText}>3- How We Use Your Information</Text>
                <Text style={styles.modalSubHeadingValueText}>3.1- Matching: We use the information provided to match
                  users with potential partners.</Text>
                <Text style={styles.modalSubHeadingValueText}>3.2- Communication: Your data helps facilitate communication
                  between users.</Text>
                <Text style={styles.modalSubHeadingValueText}>3.3- App Improvement: We may use data for app analysis, research,
                  and improvement.</Text>
                <Text style={styles.modalSubHeadingValueText}>3.4- Security: Information is used to maintain a secure
                  environment and prevent fraudulent activity.</Text>
                <Text style={styles.modalSubHeadingText}>4- Data Security</Text>
                <Text style={styles.modalSubHeadingValueText}>4.1- We implement security measures to protect user data from
                  unauthorized access, disclosure, alteration, or destruction.</Text>
                <Text style={styles.modalSubHeadingValueText}>4.2- "Meetup Now" uses encryption to secure data transmission.</Text>
                <Text style={styles.modalSubHeadingText}>5- Data Sharing</Text>
                <Text style={styles.modalSubHeadingValueText}>5.1- We do not share personal data with third parties for
                  marketing purposes</Text>
                <Text style={styles.modalSubHeadingValueText}>5.2- We may share data with service providers, partners, or as
                  required by law.</Text>
                <Text style={styles.modalSubHeadingText}>6- User Choices</Text>
                <Text style={styles.modalSubHeadingValueText}>6.1- Users have control over the data they provide, and they
                  can delete their accounts or data at any time.</Text>
                <Text style={styles.modalSubHeadingValueText}>6.2- Location services can be turned on/off based on user
                  preference.</Text>
                <Text style={styles.modalSubHeadingText}>7- Third-Party Links</Text>
                <Text style={styles.modalSubHeadingValueText}>7.1- "Meetup Now" may include links to third-party websites or
                  services. We are not responsible for their privacy practices.</Text>
                <Text style={styles.modalSubHeadingText}>8- Changes to Privacy Policy</Text>
                <Text style={styles.modalSubHeadingValueText}>8.1- We reserve the right to update this Privacy Policy.
                  Users will be notified of any changes.</Text>
                <Text style={styles.modalSubHeadingText}>9- Contact Information</Text>
                <Text style={styles.modalSubHeadingValueText}>9.1- For any questions or concerns regarding this Privacy Policy
                  or your data, please contact us at [Your contact information].</Text>
                <View style={[styles.mobile, { height: hp(8) }]}>
                  <TouchableOpacity style={styles.button} onPress={() => { setCheck(true), seterrorCheck(''), setModalVisibleTerms(false)}}>
                    <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Accept'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ImageBackground source={Images.loginbackground} style={styles.bgimg}>
          <View style={styles.main}>
            <View style={styles.topview}>
              <View style={styles.logo}>
                <Image source={Images.logo} />
              </View>
              <View style={[styles.mobile, { height: hp(8) }]}>
                <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.ROBOTO_REGULAR }]}>{'Register Now'}</Text>
              </View>
              <KeyboardAwareScrollView enableOnAndroid={false}>
                <View style={[styles.mobile, { height: hp(70), alignItems: 'center', justifyContent: 'flex-start' }]}>
                  <View style={[styles.insidemobile, {}]}>
                    <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(12) }]}>
                      <View style={[styles.label, { justifyContent: 'flex-start' }]}>
                        <Text style={[styles.txt, { textAlign: 'left', fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Email Id'}</Text>
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
                            value={email}
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
                    <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(12) }]}>
                      <View style={[styles.label, {}]}>
                        <Text style={[styles.txt, { textAlign: 'left', fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Set Password'}</Text>
                      </View>
                      <View style={[styles.label, { height: hp(9) }]}>
                        <CardView
                          style={[styles.textInput, { flexDirection: 'row' }]}
                          cardElevation={2}
                          cardMaxElevation={2}
                          cornerRadius={5}
                        >
                          <TextInput
                            style={[styles.textinput, { width: wp(72), height: hp(5.5) }]}
                            placeholder={"Please Enter Your Password"}
                            maxLength={20}
                            value={Password}
                            secureTextEntry={hidePassword}
                            placeholderTextColor={COLORS.GRAY}
                            onChangeText={(txt) => { setPassword(txt), _passwordvalidate(txt) }}
                          />
                          <View style={styles.hide}>
                            <TouchableOpacity onPress={() => sethidePassword(!hidePassword)} style={styles.hidebtn}>
                              {/* @ts-ignore */}
                              <Image source={hidePassword ? Images.password1 : Images.password} style={styles.pass} />
                            </TouchableOpacity>
                          </View>
                        </CardView>
                        {errorPassword !== null ? (
                          <Text style={styles.errortxt}>{errorPassword}</Text>
                        ) : null}
                      </View>
                    </View>
                    <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(12) }]}>
                      <View style={[styles.label, {}]}>
                        <Text style={[styles.txt, { textAlign: 'left', fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Confirm Password'}</Text>
                      </View>
                      <View style={[styles.label, { height: hp(9) }]}>
                        <CardView
                          style={[styles.textInput, { flexDirection: 'row' }]}
                          cardElevation={2}
                          cardMaxElevation={2}
                          cornerRadius={5}
                        >
                          <TextInput
                            style={[styles.textinput, { width: wp(72), height: hp(5.5) }]}
                            placeholder={"Please Enter Your Password Again"}
                            maxLength={20}
                            value={confirmPassword}
                            secureTextEntry={hideCPassword}
                            placeholderTextColor={COLORS.GRAY}
                            onChangeText={(txt) => { setconfirmPassword(txt), _confirmpasswordvalidate(txt) }}
                          />
                          <View style={styles.hide}>
                            <TouchableOpacity onPress={() => sethideCPassword(!hideCPassword)} style={styles.hidebtn}>
                              {/* @ts-ignore */}
                              <Image source={hideCPassword ? Images.password1 : Images.password} style={styles.pass} />
                            </TouchableOpacity>
                          </View>
                        </CardView>
                        {errorconfirmPassword !== null ? (
                          <Text style={styles.errortxt}>{errorconfirmPassword}</Text>
                        ) : null}
                      </View>
                    </View>
                    <View style={[styles.label, { flexDirection: 'row', alignItems: 'center' }]}>
                      <TouchableOpacity onPress={() => { setModalVisibleTerms(true) }}>
                        <View style={[styles.terms, { backgroundColor: Check ? COLORS.LOGINBUTTON : COLORS.SHADOW }]}></View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setModalVisibleTerms(true) }}>
                        <Text style={styles.checkbox}>
                          {'   Follow Terms & Conditions'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.label, { height: errorCheck ? hp(3.2) : 0 }]}>
                      {errorCheck !== null ? <Text style={styles.errortxt}>{errorCheck}</Text> : null}
                    </View>
                    <View style={[styles.mobile, { height: hp(8) }]}>
                      <TouchableOpacity style={styles.button} onPress={() => submit()}>
                        <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Submit'}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.socialView}>
                      <Text style={[styles.account, { fontFamily: FONT_FAMILIES.INTER_MEDIUM }]}>You can signin By Social account</Text>
                      <View style={styles.socialView1}>
                        <TouchableOpacity onPress={() => loginWithGoogle()}>
                          {/* @ts-ignore */}
                          <Image source={Images.google} style={styles.googleImage} />
                        </TouchableOpacity>
                        {Platform.OS === 'ios' && <TouchableOpacity>
                          <Image source={Images.facebook} />
                        </TouchableOpacity>}
                      </View>
                    </View>
                    <View style={styles.footer}>
                      <Text style={styles.account}>{`Do You Have An account?`}</Text>
                      <TouchableOpacity onPress={() => login()}>
                        <Text style={styles.signup}>{`Login`}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
            <ModalLoader loading={loading} />
          </View>
        </ImageBackground>
      </View>
      {modalTerms()}
    </SafeAreaView>
  )
}

export default withConnect(register);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LOGINBACKGROUND
  },
  bgimg: {
    height: hp(38)
  },
  main: {
    height: Platform.OS === 'ios' ? hp(106) : hp(108),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topview: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(89),
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
    height: hp(60),
    width: wp(83)
  },
  label: {
    height: Platform.OS === 'ios' ? hp(3.2) : hp(3.3)
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
    // fontSize: responsiveFontSize(2),
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
  terms: {
    height: 23,
    width: 23,
    borderColor: COLORS.CHECKBOXBORDER,
    borderWidth: 2,
    borderRadius: 5
  },
  checkbox: {
    color: COLORS.SIGNUP,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontWeight: '400'
  },
  footer: {
    marginTop: hp(2),
    flexDirection: "row",
    alignSelf: 'center'
  },
  account: {
    color: COLORS.LOGINTEXT,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  signup: {
    color: COLORS.SIGNUP,
    fontSize: responsiveFontSize(1.8),
    marginHorizontal: METRICS.MAR_5,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    textDecorationLine: 'underline'
  },
  hide: {
    height: hp(5.5),
    width: wp(8),
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
    height: Platform.OS === 'ios' ? hp(14) : hp(15),
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
  pass: {
    height: hp(2),
    width: wp(5)
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
  modalview: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(95),
    width: wp(93),
    borderRadius: 8,
    elevation: 10,
    borderColor: '#E2E2E2',
    borderWidth: 1,
  },
  innerModal: {
    margin: hp(2),
    // backgroundColor:'red',
    flex: 1
  },
  modalHeadingText: {
    textAlign: 'center',
    color: COLORS.LOGINTEXT,
    fontSize: responsiveFontSize(2.2),
    fontFamily: FONT_FAMILIES.INTER_BOLD,
    fontWeight: 'bold'
  },
  modalSubHeadingText: {
    color: COLORS.LOGINTEXT,
    marginTop: hp(1),
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONT_FAMILIES.INTER_BOLD,
    fontWeight: 'bold'
  },
  modalSubHeadingValueText: {
    color: COLORS.LOGINTEXT,
    marginTop: hp(0.5),
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
    fontWeight: '500'
  }
})
