import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TextInput, Platform, Dimensions, Keyboard, Modal } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Images } from '../../../Assets';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import CardView from "react-native-cardview";
import withConnect from './withConnect';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import { VALIDATE_FORM, SCREENS } from "../../../Constant";
import Network from '../../../Network';
import CountryPicker, {
    CountryCode,
    Country,
} from 'react-native-country-picker-modal';
import ModalLoader from '../../../ReuableComponent/ModalLoader';
const { OTP, LOGIN } = SCREENS;
const { height, width } = Dimensions.get('screen');

const mobilenumber = (props: any) => {

    const { navigation } = props;

    const [Phone, setPhone] = useState('');
    const [checkPhone, setcheckPhone] = useState(false);
    const [errorPhone, seterrorPhone] = useState('');
    const [loading, setLoading] = useState(false)
    // const [phoneotp, setPhoneOtp] = useState("");

    // const [country, setCountry] = useState<Country>(null);
    // const [countryCode, setCountryCode] = useState<CountryCode | undefined>();
    // const [withCountryNameButton, setWithCountryNameButton] =
    //     useState<boolean>(false);
    // const [withCurrencyButton, setWithCurrencyButton] = useState<boolean>(false);
    // const [withFlagButton, setWithFlagButton] = useState<boolean>(true);
    // const [withCallingCodeButton, setWithCallingCodeButton] =
    //     useState<boolean>(false);
    // const [withFlag, setWithFlag] = useState<boolean>(true);
    // const [withEmoji, setWithEmoji] = useState<boolean>(true);
    // const [withFilter, setWithFilter] = useState<boolean>(true);
    // const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false);
    // const [withCallingCode, setWithCallingCode] = useState<boolean>(false);
    // const [withCurrency, setWithCurrency] = useState<boolean>(false);
    // const [withModal, setWithModal] = useState<boolean>(true);
    // const [disableNativeModal, setDisableNativeModal] = useState<boolean>(false);
    // const onSelect = (country: Country) => {
    //     // @ts-ignore
    //     setCountry(country.callingCode[0]);
    // };
    // const [visible, setVisible] = useState<boolean>(false);
    // const switchVisible = () => setVisible(!visible);

    // *********************************_mobilevalidate**********************************************
    const _mobileValidate = (PhoneNumber: number) => {
        var phoneNumberRegex = /^[6-9]\d{9}$/
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


    // ***********************************validate***************************************************
    const validate = () => {
        let flag = true;
        if (Phone === '' || checkPhone) {
            seterrorPhone(errorPhone ? errorPhone : VALIDATE_FORM.PHONE);
            flag = false;
        } else {
            return flag;
        }
    }

    //***************otp navigate function **************/
    const otp = async () => {
        Keyboard.dismiss()
        if (validate()) {
            setLoading(true)
            const body = new FormData();
            body.append('mobile', Phone);
            console.log("mobile", body);
            const result: any = await Network.createApiClient().mobileInput(body);
            // console.log("newbodylog", result.data.data);
            if (result.data && result.data.success === true) {
                showMessage({ message: result.data.message, type: 'success' });
                //@ts-ignore
                setLoading(false);
                navigation.navigate(OTP, { userValue: result.data.data, mobilenumber: Phone });
                setPhone('')
            } else {
                showMessage({ message: result.data.message, type: 'danger' });
                setLoading(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={Images.loginbackground} style={styles.bgimg}>
                <View style={styles.main}>
                    <View style={styles.topview}>
                        <View style={styles.logo}>
                            <Image source={Images.logo} />
                        </View>
                        <View style={styles.mobile}>
                            <Text style={styles.txt}>{'Mobile Number'}</Text>
                            <Text style={[styles.txt, { marginTop: '2%' }]}>{'Verification'}</Text>
                        </View>
                        <View style={[styles.mobile, { height: hp(45), alignItems: 'center' }]}>
                            <View style={styles.insidemobile}>
                                <View style={[styles.mobile, { justifyContent: 'flex-start', height: hp(14) }]}>
                                    <View style={styles.label}>
                                        <Text style={[styles.txt, { textAlign: 'left', fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Mobile No.'}</Text>
                                    </View>
                                    <View style={[styles.label, { height: hp(8), justifyContent: 'center' }]}>
                                        <View style={styles.textInput}>
                                            <View style={styles.country}>
                                                <TextInput editable={false} style={[styles.txt, { fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'+91'}</TextInput>
                                            </View>
                                            <View style={styles.input}>
                                                <TextInput
                                                    style={styles.textinput}
                                                    value={Phone}
                                                    maxLength={10}
                                                    onChangeText={(txt: any) => { setPhone(txt), _mobileValidate(txt) }}
                                                    keyboardType="phone-pad"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.error}>
                                        {errorPhone !== null ? <Text style={styles.errortxt}>{errorPhone}</Text> : null}
                                    </View>
                                </View>
                                <View style={[styles.mobile, { height: hp(10) }]}>
                                    <TouchableOpacity style={styles.button} onPress={() => otp()}>
                                        <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', color: COLORS.WHITE, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD, fontWeight: '600' }]}>{'Get OTP'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.error, { flex: .2, justifyContent: 'center', alignItems: 'center' }]}>
                                    <View style={styles.last}>
                                        <Text style={[styles.txt, { fontSize: responsiveFontSize(2), textAlign: 'left', fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>Existing User?</Text><TouchableOpacity onPress={() => navigation.navigate(LOGIN)}><Text style={[styles.txt, { color: 'red', textDecorationLine: 'underline', fontSize: responsiveFontSize(2), textAlign: 'left', fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>{'Login'}</Text></TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <ModalLoader loading={loading} />
                </View >
            </ImageBackground >
        </View >
    )
}

export default withConnect(mobilenumber);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.LOGINBACKGROUND
    },
    bgimg: {
        // aspectRatio: 1.3,
        // flex:0.4,
        height: hp(38)
    },
    main: {
        // aspectRatio: .48,
        // aspectRatio: .57,
        height: hp(90),
        justifyContent: 'flex-end',
        alignItems: 'center',
        // backgroundColor:'green'
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
        fontWeight: '400',
        color: COLORS.LOGINTEXT,
        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
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
        fontSize: responsiveFontSize(2),
        color: "black",
        fontFamily: FONT_FAMILIES.INTER_REGULAR,
        fontWeight: '400',
        textAlignVertical: 'center'
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
        // marginTop: Platform.OS === 'ios' ? '25%' : '15%',
        color: COLORS.LOGINTEXT,
    },
    last: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: wp(45)
    },
    modalview: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    input: {
        width: wp(65),
        height: hp(5.8),
        justifyContent: "center"
    }
})
