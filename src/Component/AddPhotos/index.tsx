import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useState } from 'react'
import NavHeader from '../../ReuableComponent/NavHeader'
import { COLORS, FONT_FAMILIES } from '../../Configration'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import { Images } from '../../Assets'
import { FlatList } from 'react-native-gesture-handler'

export default function AddPhotos() {
    const [Active, setActive] = useState(true);

    const IMG = [
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },
        { img: Images.dummyImage },

    ]

    const VID = [
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
        { vid: Images.dummyVideo },
    ]

    const renderImages = (item: any) => {
        const { img } = item.item
        return (
            <View style={styles.insideflatlist}>
                <View style={styles.box}>
                    <TouchableOpacity>
                        <Image source={img} />
                    </TouchableOpacity>
                    <View style={styles.insidebox}>
                        <Text style={{ color: COLORS.WHITESHADOW }}>{'+'}</Text>
                    </View>
                </View>
            </View >
        )
    }

    const renderVideo = (item: any) => {
        const { vid } = item.item
        return (
            <View style={styles.insideflatlist}>
                <View style={styles.box}>
                    <TouchableOpacity>
                        <Image source={vid} />
                    </TouchableOpacity>
                    <View style={styles.insidebox}>
                        <Text style={{ color: COLORS.WHITESHADOW }}>{'+'}</Text>
                    </View>
                </View>
            </View >
        )
    }

    return (
        <View style={styles.container}>
            <NavHeader title={'hb'} isBack={true} isRightAction={true} coinicon={'h'} />
            <View style={styles.topview}>
                <View style={styles.first}>
                    <Text style={styles.txt}>{'Add Photos'}</Text>
                    <Text style={[styles.txt, { color: '#444444', fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2) }]}>{'Add at least 2 photos to continue'}</Text>
                </View>
                <View style={styles.buttons}>
                    <View style={styles.insidebutton}>
                        <TouchableOpacity style={[styles.recieve, { backgroundColor: Active ? COLORS.BOTTOM_COLOR : COLORS.WHITESHADOW }]} onPress={() => setActive(!Active)}>
                            <Image source={Images.imgIcon} style={{ tintColor: Active ? COLORS.WHITESHADOW : COLORS.BLACK }} />
                            <Text style={[styles.txt, { color: Active ? COLORS.WHITESHADOW : COLORS.BLACK, fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2) }]}>{'Images'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.recieve, { backgroundColor: Active ? COLORS.WHITESHADOW : COLORS.BOTTOM_COLOR }]} onPress={() => setActive(!Active)}>
                            <Image source={Images.vidIcon} style={{ tintColor: Active ? COLORS.BLACK : COLORS.WHITESHADOW }} />
                            <Text style={[styles.txt, { color: Active ? COLORS.BLACK : COLORS.WHITESHADOW, fontFamily: FONT_FAMILIES.INTER_REGULAR, fontSize: responsiveFontSize(2) }]}>{'Videos'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.flatlist}>
                    <FlatList
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                        data={Active ? IMG : VID}
                        renderItem={Active ? renderImages : renderVideo}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.LOGINBACKGROUND,
        flex: 1
    },
    topview: {
        backgroundColor: COLORS.WHITESHADOW,
        margin: 15,
        borderRadius: 25,
        height: Platform.OS === 'ios' ? 670 : 700,
        top: -20,
        elevation: 10
    },
    first: {
        // backgroundColor:'green',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt: {
        color: COLORS.BLACK,
        fontSize: responsiveFontSize(3),
        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
    },
    buttons: {
        height: '10%',
        justifyContent: 'center'
    },
    insidebutton: {
        backgroundColor: COLORS.LOGINBACKGROUND,
        height: '70%',
        margin: 15,
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    recieve: {
        backgroundColor: COLORS.BOTTOM_COLOR,
        height: '80%',
        width: '40%',
        borderRadius: 8,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
    flatlist: {
        height: '79%'
    },
    insideflatlist: {
        height: 150,
        width: 108,
        marginVertical: 5,
        marginHorizontal: 5
    },
    box: {
        backgroundColor: '#F4F3F3',
        height: '90%',
        width: '90%',
        borderColor: COLORS.BORDER_COLOR,
        borderWidth: 1,
        borderStyle: 'dotted',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginVertical: 1
    },
    insidebox: {
        backgroundColor: COLORS.BOTTOM_COLOR,
        height: '15%',
        width: '22%',
        top: '32%',
        left: '45%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
})