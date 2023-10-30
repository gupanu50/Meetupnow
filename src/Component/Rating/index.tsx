import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NavHeader from '../../ReuableComponent/NavHeader';
import { Images } from '../../Assets';
import { COLORS, FONT_FAMILIES } from '../../Configration';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Network from '../../Network';
import ModalLoader from '../../ReuableComponent/ModalLoader';
import { showMessage } from 'react-native-flash-message';
import { SCREENS, VALIDATE_FORM } from '../../Constant';
const { RECENTMEETUP } = SCREENS;
export default function Rating(props: any) {
    const { route, navigation } = props;
    const { id } = route.params;
    const [Star, setStar] = useState(false);
    const [Star1, setStar1] = useState(false);
    const [Star2, setStar2] = useState(false);
    const [Star3, setStar3] = useState(false);
    const [Star4, setStar4] = useState(false);
    const [starValue, setStarvalue] = useState<any>(0);
    const [reviewTextField, setReviewTextField] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorReview, setErrorReview] = useState('');
    const [errorStar, setErrorStar] = useState('');
    const starRate = (
        <>
            <TouchableOpacity
                onPress={() => {
                    setStar(!Star),
                        setStar1(false),
                        setStar2(false),
                        setStar3(false),
                        setStar4(false);
                    setStarvalue(1);
                    setErrorStar('');
                }}>
                <Image
                // @ts-ignore
                    style={[styles.star, { tintColor: Star ? null : COLORS.GRAY_BACKGROUND }]}
                    source={Images.star}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setStar1(!Star1),
                        setStar(true),
                        setStar2(false),
                        setStar3(false),
                        setStar4(false),
                        setStarvalue(2);
                    setErrorStar('');
                }}>
                <Image
                // @ts-ignore
                    style={[styles.star, { tintColor: Star1 ? null : COLORS.GRAY_BACKGROUND }]}
                    source={Images.star}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setStar2(!Star2),
                        setStar1(true),
                        setStar(true),
                        setStar3(false),
                        setStar4(false),
                        setStarvalue(3);
                    setErrorStar('');
                }}>
                <Image
                // @ts-ignore
                    style={[styles.star, { tintColor: Star2 ? null : COLORS.GRAY_BACKGROUND }]}
                    source={Images.star}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setStar3(!Star3),
                        setStar2(true),
                        setStar1(true),
                        setStar(true),
                        setStar4(false),
                        setStarvalue(4);
                    setErrorStar('');
                }}>
                <Image
                // @ts-ignore
                    style={[styles.star, { tintColor: Star3 ? null : COLORS.GRAY_BACKGROUND }]}
                    source={Images.star}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setStar4(!Star4),
                        setStar3(true),
                        setStar2(true),
                        setStar1(true),
                        setStar(true),
                        setStarvalue(5);
                    setErrorStar('');
                }}>
                <Image
                // @ts-ignore
                    style={[styles.star, { tintColor: Star4 ? null : COLORS.GRAY_BACKGROUND }]}
                    source={Images.star}
                />
            </TouchableOpacity>
        </>
    )
    const saveRatingApi = async () => {
        if (validate()) {
            setLoading(true);
            const body = new FormData();
            body.append('id', id);
            body.append('ratting', starValue);
            body.append('review', reviewTextField);
            const result: any = await Network.createApiClient().saveRating(body);
            console.log('resultofsaveratting', result)
            if (result.status && result.data.success) {
                const DATA = result.data.message
                console.log('resultofsaverattingdata', DATA)
                showMessage({ message: DATA, type: 'success' });
                navigation.navigate(RECENTMEETUP);
            } else {
                console.log('api not working')
            }
            setLoading(false);
        }
    }
    const validate = () => {
        let flag = true;
        if (starValue === 0) {
            setErrorStar(VALIDATE_FORM.RATING_STAR);
            flag = false;
        } else if (reviewTextField === '') {
            setErrorReview(VALIDATE_FORM.RATING_TEXTFIELD);
            flag = false;
        }
        else {
            return flag
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.LOGINBACKGROUND }}>
            {/* @ts-ignore */}
            <NavHeader isBack={true} title={'meet'} isRightAction={true} coinicon={'hb'} />
            <View style={styles.container}>
                <View style={styles.main}>
                    <View style={styles.insidemain}>
                        <View style={styles.work}>
                            <Text style={styles.txt}>{'Rate Your Meetup'}</Text>
                        </View>
                        <View style={styles.rating}>
                            <View style={styles.insiderating}>
                                {starRate}
                            </View>
                        </View>
                        {errorStar !== null ? (
                            <View style={{ alignItems: 'center', height: (errorStar === '') ? hp(0) : hp(3) }}>
                                <Text style={styles.errortxt}>{errorStar}</Text>
                            </View>
                        ) : null}
                        <View style={styles.share}>
                            <Text style={[styles.txt, { fontSize: responsiveFontSize(2), color: '#444444', fontFamily: FONT_FAMILIES.POPPINS_REGULAR }]}>{'Share your review'}</Text>
                        </View>
                        <View style={styles.review}>
                            <View style={styles.reviewbox}>
                                <View style={styles.writereview}>
                                    <View style={styles.write}>
                                        <Text style={[styles.txt, { fontSize: responsiveFontSize(2), color: '#444444', fontFamily: FONT_FAMILIES.INTER_LIGHT }]}>{'Share Your Review Write Something'}</Text>
                                    </View>
                                </View>
                                <View style={styles.inputbox}>
                                    <TextInput
                                        placeholder='Write Something'
                                        placeholderTextColor={'#444444'}
                                        style={styles.input}
                                        maxLength={40}
                                        numberOfLines={5}
                                        multiline={true}
                                        onChangeText={(txt) => setReviewTextField(txt)}
                                    />
                                </View>
                            </View>
                            {errorReview !== null ? (
                                <View style={{ height: (errorReview === '' ? hp(0) : hp(3)) }}>
                                    <Text style={styles.errortxt}>{errorReview}</Text>
                                </View>
                            ) : null}
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity style={styles.submit} onPress={() => saveRatingApi()}>
                                <Text style={[styles.txt, { color: COLORS.WHITE, fontSize: responsiveFontSize(2), fontFamily: FONT_FAMILIES.INTER_BOLD }]}>{'Submit'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <ModalLoader loading={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: -20,
    },
    main: {
        backgroundColor: COLORS.WHITESHADOW,
        height: hp('80'),
        width: wp('90'),
        borderRadius: 30,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    insidemain: {
        height: hp(75),
        width: wp(80)
    },
    work: {
        height: hp('8'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt: {
        fontSize: responsiveFontSize(3),
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
    },
    rating: {
        height: hp(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    insiderating: {
        width: wp(40),
        height: hp(3.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    share: {
        height: hp(5),
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    review: {
        height: hp(25),
        justifyContent: 'center',
    },
    reviewbox: {
        backgroundColor: '#F6F6F6',
        height: hp(22),
        width: wp(80),
        borderRadius: hp(1),
        borderColor: '#D7D7D7',
        borderWidth: 1,
        alignItems: 'center',
        elevation: 3
    },
    writereview: {
        height: hp(4),
        width: wp(77)
    },
    write: {
        height: hp(3.5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputbox: {
        backgroundColor: COLORS.WHITESHADOW,
        height: hp(17),
        width: wp(77),
        borderRadius: hp(1),
        borderColor: '#ABABAB',
        borderWidth: 1,
        alignItems: 'center',
    },
    input: {
        width: wp(70),
        color: '#444444',
        fontSize: responsiveFontSize(2),
        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
        textAlignVertical: 'top'
    },
    button: {
        height: hp(10),
        justifyContent: 'center'
    },
    submit: {
        backgroundColor: COLORS.LOGINBUTTON,
        height: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(10)
    },
    star: {
    },
    errortxt: {
        color: 'red',
        fontSize: responsiveFontSize(1.8),
        fontFamily: FONT_FAMILIES.INTER_REGULAR
    },
});
