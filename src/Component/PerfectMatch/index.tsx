import React, { useState, useEffect } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Image,
    Platform,
    Modal,
} from "react-native";
import _ from "lodash";
import { COLORS, FONT_FAMILIES } from "../../Configration";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { SCREENS } from "../../Constant";
import { Images } from "../../Assets";
import NavHeader from "../../ReuableComponent/NavHeader";
import OTPTextView from 'react-native-otp-textinput';
import { showMessage } from "react-native-flash-message";
import Network from "../../Network";
const { INTERACTION } = SCREENS;
const PerfectMatch = (props: any) => {
    const { navigation, route } = props
    const { params } = route;
    const [visible, setVisible] = useState(false);
    const [chattng_idvalueeee, setchattng_idvalueeee] = useState(params.chattinguserid);
    const [otpcheck, setotpcheck] = useState(params.OTPcheck);
    const [user1imagee, setuser1imagee] = useState(params.user1imagevalue)
    const [user2imagee, setuser2imagee] = useState(params.user2imagevalue)
    const [sender, setSender] = useState(params.sender)
    const [count, setCount] = useState(true);
    const [Time, setTime] = useState();
    const [otp, setotp] = useState("");
    const [otpResend, setotpResend] = useState("")
    const [requiredid2, setrequiredid2] = useState("")
    const [loading, setLoading] = useState(false);



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
        }, 1500);
    }

    useEffect(() => {
        timer();
        sender ? null : setVisible(true)
    }, []);

    // ********************** Otp Meetup Confirm********************
    const otpconfirm = async () => {
        if (otp !== "") {
            const body = new FormData();
            setLoading(true)
            if (otpResend == "" && requiredid2 == "") {
                console.log("jfjasd")
                body.append('request_id', chattng_idvalueeee);
                body.append('otp', otp);
            }
            else {
                console.log("ammmm")
                body.append('request_id', requiredid2);
                body.append('otp', otpResend);
            }
            console.log("Bodyofotpverifymeetup", body)
            const result: any = await Network.createApiClient().Meetup_otp_confirm(body);
            if (result?.data && result?.data?.success === true) {
                setLoading(false)
                console.log("OTp meetup confirm", result.data)
                showMessage({ message: result.data.message, type: 'success' });
                //@ts-ignore
                navigation.navigate(INTERACTION)
            } else {
                setLoading(false)
                showMessage({ message: result.data.message, type: 'danger' });
            }
        }
        else {
            showMessage({ message: "Please enter the Otp", type: 'danger' });
        }
    }
    const senderNext = () => {
        navigation.navigate(INTERACTION)
    }
    const warMo = () => {
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={visible}
                style={styles.modalview}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#00000050',
                    }}>
                    <View style={styles.modal}>
                        <View style={styles.cross}>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <View
                                    style={{
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        width: wp(6.5),
                                        height: hp(3),
                                    }}>
                                        {/* @ts-ignore */}
                                    <Image style={styles.close}
                                        source={Images.close_button}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.first1}>
                            <Image source={Images.alert} />
                        </View>
                        <View style={styles.txtView}>
                            <Text style={styles.txt1}>Your chat will be disabled once you enter the OTP.</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    return (
        <View style={styles.container}>
            {/* @ts-ignore */}
            <NavHeader title={'jhb'} isBack={true} isRightAction={true} coinicon={'h'} right />
            <View style={styles.main}>
                <View style={styles.topview}>
                    <View style={styles.first}>
                        <Text style={styles.txt}>{'Verify Meetup'}</Text>
                    </View>
                    <View style={styles.match}>
                        <View style={[styles.left, {}]}>
                            {/* @ts-ignore */}
                            <Image style={styles.img} source={{ uri: user1imagee }} />
                            {/* @ts-ignore */}
                            <Image source={Images.online} style={styles.online} />
                        </View>
                        <View style={[styles.left, { width: wp(18), alignItems: 'center' }]}>
                            <Image source={Images.match} />
                        </View>
                        <View style={[styles.left, { alignItems: 'flex-start' }]}>
                            {/* @ts-ignore */}
                            <Image style={[styles.img, { borderColor: COLORS.LOGINBUTTON }]} source={{ uri: user2imagee }} />
                            {/* @ts-ignore */}
                            <Image source={Images.online} style={[styles.online, { left: wp(17), }]} />
                        </View>
                    </View>
                    {!sender ?
                        <>
                            <View style={[styles.first, { alignItems: 'center', height: hp(15), justifyContent: 'center' }]}>
                                <View style={styles.insidefirst}>
                                    <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.POPPINS_REGULAR, fontSize: responsiveFontSize(1.8) }]}>
                                        Please ask for verification code when you meet up with your partner,
                                        By entering this meetup code you will get reward coins
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.mobile, { height: hp(38), alignItems: 'center' }]}>
                                <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(16), width: wp(87), alignItems: 'center' }]}>
                                    <OTPTextView
                                        handleTextChange={(txt) => setotp(txt)}
                                        defaultValue={otp}
                                        containerStyle={styles.otpinput}
                                        textInputStyle={styles.otp}
                                        inputCount={6}
                                        tintColor={COLORS.BORDER_COLOR}
                                    />
                                </View>
                                <View style={[styles.insidemobile, { height: hp(25) }]}>
                                    <View style={[styles.mobile, { height: hp(8) }]}>
                                        <TouchableOpacity style={styles.button} onPress={() => { otpconfirm() }}>
                                            <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Submit'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.txt, { fontSize: responsiveFontSize(1.6), paddingHorizontal: 20 }]}>Note: Any inappropriate behaviour may result in your account being permanently banned. Let's keep Meet-Up Now a respectful and enjoyable community for all. Thank you for your cooperation.</Text>
                                </View>
                            </View>
                        </> :
                        <>
                            <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.POPPINS_REGULAR, fontSize: responsiveFontSize(1.8), textAlign: 'center', marginTop: hp(2), paddingHorizontal: 10 }]}>{[('When you go for meetup give this meetup code to your meetup partner for verification code And compilation of Meetup On Successful meetup you will stand a chance to win a thrilling trip to Goa 🚀/ latest iPhone! etc… Its all about the unexpected moments.'), <Text style={{ fontFamily: FONT_FAMILIES.POPPINS_BOLD }}>{'\n'}{otpcheck}</Text>]}</Text>
                            <View style={[styles.insidemobile, { alignSelf: 'center' }]}>
                                <View style={[styles.mobile, { height: hp(13) }]}>
                                    <TouchableOpacity style={styles.button} onPress={() => { senderNext() }}>
                                        <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Meetup Tips'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.txt, { fontSize: responsiveFontSize(1.6), paddingHorizontal: 20 }]}>Note: Any inappropriate behaviour may result in your account being permanently banned. Let's keep Meet-Up Now a respectful and enjoyable community for all. Thank you for your cooperation.</Text>
                            </View>
                        </>
                    }
                </View>
            </View>
            {warMo()}
        </View>
    )
}

export default PerfectMatch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.LOGINBACKGROUND,
    },
    main: {
        height: hp(90),
        alignItems: 'center',
    },
    topview: {
        backgroundColor: COLORS.WHITESHADOW,
        height: hp(73),
        width: wp(93),
        borderRadius: 30
    },
    first: {
        height: hp(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    first1: {
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt: {
        fontSize: responsiveFontSize(3),
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
        fontWeight: '400'
    },
    txt1: {
        fontSize: responsiveFontSize(1.8),
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
        fontWeight: '400'
    },
    match: {
        flexDirection: 'row',
        height: hp(12),
        justifyContent: 'center',
        alignItems: 'center'
    },
    left: {
        width: wp(37),
        height: hp(12),
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    circle: {
        height: hp(9),
        width: wp(18),
        borderRadius: 40,
        borderColor: COLORS.BOTTOM_COLOR,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        height: 85,
        width: 85,
        borderColor: COLORS.BOTTOM_COLOR,
        borderWidth: 3,
        borderRadius: 85 / 2
    },
    online: {
        position: 'absolute',
        top: hp(2),
        left: wp(31.4),
        height: hp(2.5),
        width: wp(5)
    },
    mobile: {
        height: hp(15),
        justifyContent: 'center',
    },
    insidemobile: {
        height: hp(16),
        width: wp(83),
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
        height: 50,
        width: '12%',
        borderColor: COLORS.BORDER_COLOR,
        borderWidth: 0.5,
        backgroundColor: COLORS.SHADOW,
        borderRadius: 5,
        elevation: 10,
        fontFamily: FONT_FAMILIES.INTER_REGULAR
    }, back: {
        height: Platform.OS === 'ios' ? hp(12) : hp(14),
        width: wp(95)
    },
    backarrow: {
        height: hp(3),
        width: wp(8),
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
    insidefirst: {
        width: wp(80)
    },
    modal: {
        backgroundColor: COLORS.WHITESHADOW,
        height: hp(22),
        width: wp(70),
        borderRadius: hp(1.2),
        elevation: 10,
        borderColor: '#E2E2E2',
        borderWidth: 1,
    },
    cross: {
        height: hp(2.6),
        width: wp(68),
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    close: {
        tintColor: 'black',
    },
    modalview: {
        backgroundColor: 'green',
        height: hp(10),
        width: wp(50),
    },
    txtView: {
        margin: hp(2)
    },
    bold: {
        fontWeight: 'bold'
    }
})