import React, { useState, useEffect, useRef } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Platform,
    Keyboard
} from "react-native";
import _ from 'lodash';
import { COLORS, FONT_FAMILIES } from "../../../Configration";
import { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import withConnect from "./withConnect";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { SCREENS, VALIDATE_FORM } from '../../../Constant';
import Network from '../../../Network';
import OTPTextView from 'react-native-otp-textinput';
import ModalLoader from "../../../ReuableComponent/ModalLoader";
import { Images } from "../../../Assets";
import { SafeAreaView } from "react-native-safe-area-context";
const { REGISTERPROFILE } = SCREENS;
const otp = (props: any) => {
    const { navigation, route } = props;
    const { params } = route;

    const [otp, setOtp] = useState("");
    const [emailId] = useState(params.emailId);

    const [count, setCount] = useState(true);
    const [Time, setTime] = useState();
    const [loading, setLoading] = useState(false);

    // *********************Ref***************************
    const inputRef:any = useRef(null);

    // *********************clear***************************
    const clear = () => {
        inputRef.current.clear();
    };


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

    //*************** validation message *************/
    const validation = () => {
        var message = "";
        if (_.isEmpty(otp)) {
            message = VALIDATE_FORM.OTP;
        }
        else if (otp.length < 6) {
            message = VALIDATE_FORM.VALID_OTP;
        }
        if (!_.isEmpty(message)) {
            showMessage({ message: message, type: 'danger' });
            return false;
        }
        return true;
    };

    //*************** verify otp **************/
    const verifyOtp = async () => {
        Keyboard.dismiss();
        if (validation()) {
            setLoading(true);
            const body = new FormData();
            body.append('user_id', params.userId);
            body.append('otp', otp);
            const result: any = await Network.createApiClient().otpVerify(body);
            console.log('==body==', body);
            console.log('==result==', result);
            if (result.data && result.data.success === true) {
                clear();
                setLoading(false);
                showMessage({ message: result.data.message, type: 'success' });
                navigation.navigate(REGISTERPROFILE, { naviName: "register" });
            } else {
                setLoading(false);
                showMessage({ message: result.data.message, type: 'danger' });
            }
        }
    };

    //********************************** Resend Otp ********************************/
    const resendOtp = async () => {
        clear();
        setLoading(true)
        const body = new FormData();
        body.append('user_id', params.userId);
        const result: any = await Network.createApiClient().resendOtp(body);
        if (result.data && result.data.success === true) {
            setLoading(false);
            showMessage({ message: result.data.message, type: 'success' });
            timer();
        } else {
            setLoading(false);
            showMessage({ message: result.data.message, type: 'danger' });
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
                            <View style={styles.mobile}>
                                <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.ROBOTO_REGULAR }]}>{'My Code Is'}</Text>
                                <Text style={[styles.txt, { fontSize: responsiveFontSize(1.8), fontWeight: '500', marginTop: '2%' }]}>{emailId} {'\n'}is</Text>
                            </View>
                            <View style={[styles.mobile, { height: hp(40), alignItems: 'center' }]}>
                                <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(16), width: wp(87), alignItems: 'center' }]}>
                                    <OTPTextView
                                        handleTextChange={(txt) => setOtp(txt)}
                                        containerStyle={styles.otpinput}
                                        textInputStyle={styles.otp}
                                        inputCount={6}
                                        autoFocus={true}
                                        ref={inputRef}
                                        tintColor={COLORS.BORDER_COLOR}
                                    />
                                    <View style={styles.resend}>
                                        <View style={styles.resendcount}>
                                            <Text style={[styles.resendtxt, { color: count ? COLORS.LOGINBUTTON : COLORS.BORDER_COLOR, fontWeight: '600' }]}>{Time}</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.resendbtn, { borderColor: count ? COLORS.BORDER_COLOR : COLORS.LOGINBUTTON }]} disabled={count} onPress={() => resendOtp() }>
                                            <Text style={[styles.resendtxt, { color: count ? COLORS.BORDER_COLOR : COLORS.LOGINBUTTON, fontWeight: '400' }]}>{'Resend'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.insidemobile, {}]}>
                                    <View style={[styles.mobile, { height: hp(13) }]}>
                                        <TouchableOpacity style={styles.button} onPress={() => verifyOtp()}>
                                            <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Continue'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <ModalLoader loading={loading} />
                    </View>
                </ImageBackground>
            </View>
        </SafeAreaView>
    )
}

export default withConnect(otp);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.LOGINBACKGROUND
    },
    bgimg: {
        // aspectRatio: 1.3,
        height: hp(35)
    },
    main: {
        // aspectRatio: .48,
        height: hp(85),
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    topview: {
        backgroundColor: COLORS.WHITESHADOW,
        height: hp(70),
        width: wp(93),
        borderRadius: 30,
        elevation:6
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
    }, back: {
        height: Platform.OS === 'ios' ? hp(13) : hp(13),
        width: wp(95),
    },
    backarrow: {
        height: hp(3),
        width: wp(4),
        tintColor: COLORS.BOTTOM_COLOR
        // marginTop: Platform.OS === 'ios' ? 50 : -90,
        // backgroundColor: 'red'
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
        width: wp(90)
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
