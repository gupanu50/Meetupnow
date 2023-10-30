import { StyleSheet, Text, View, Image, FlatList, ScrollView, TouchableOpacity, LogBox, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import NavHeader from '../../ReuableComponent/NavHeader';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, FONT_FAMILIES } from '../../Configration';
import { Images } from '../../Assets';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SCREENS } from '../../Constant';
import Network from '../../Network';
import { showMessage } from 'react-native-flash-message';
const { MAIN } = SCREENS;

export default function Interaction(props: any) {

    const { navigation } = props;
    const [isLoading,setLoading] = useState(false)
    const [Datavalues,setDataValues] = useState([])


    useEffect(()=>{
        interactionMeetup()
    },[])
      // ********************** Meetup Interaction********************
      const interactionMeetup = async () => {
        setLoading(true)
        const result: any = await Network.createApiClient().meetup_Interaction();
        if (result?.data?.success === true) {
          setLoading(false)
          console.log("Interaction meetup succes message", result.data.message)
          console.log("Interaction meetup succes", result.data.data)
         let Data :any = result.data.data
         setDataValues(Data)
          
        } else {
          setLoading(false)
          showMessage({ message: result.data.message, type: 'danger' });
        }
      }

    const renderData = (item: any) => {

        
        return (
            <View style={styles.slide}>
                <View style={styles.left}>
                    <Image source={Images.arrow_right} />
                </View>
                <View style={styles.right}>
                    <Text style={styles.txt}>{item.item}</Text>
                </View>
            </View>
        )
    }

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);

    return (
        <View style={styles.container}>
            {/* @ts-ignore */}
            <NavHeader isBack={true} title={'bh'} isRightAction={true} coinicon={'bh'} right/>
            <View style={styles.main}>
                <View style={{ height: Platform.OS === 'ios' ? hp(75.4) : hp(80) }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.banner}>
                            <Image source={Images.interaction} />
                        </View>
                        <View style={[styles.first, {}]}>
                            <View style={styles.insidefirst}>
                                <Text style={styles.interaction}>{'Enjoy Your Interaction!'}</Text>
                            </View>
                            <View style={[styles.insidefirst, { alignItems: 'center', justifyContent: 'flex-start' }]}>
                                <View style={[styles.insidefirst, { width: wp(87), justifyContent: 'flex-start' }]}>
                                    <View style={[styles.insidefirst, { alignItems: 'center' }]}>
                                        <Text style={styles.authenticated}>{'Your Meetup has been authenticated.'}</Text>
                                    </View>
                                    <View style={[styles.insidefirst, {  alignItems: 'center' }]}>
                                        <Text style={styles.memorable}>{'Here are few tips to make the meetup exciting and memorable'}</Text>
                                    </View>
                                </View>
                            </View>
                            </View>
                        <View style={styles.flatlist}>
                            <View style={styles.insideflatlist}>
                                <FlatList
                                    data={Datavalues}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={renderData}
                                />
                            </View>
                        </View>
                        <View style={styles.button}>
                            <View style={styles.insidebutton}>
                                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(MAIN)}>
                                    <Text style={[styles.txt, { color: COLORS.WHITESHADOW, fontFamily: FONT_FAMILIES.INTER_SEMIBOLD,fontWeight:'600' }]}>{'Roger That!'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.LOGINBACKGROUND
    },
    main: {
        backgroundColor: COLORS.WHITESHADOW,
        margin: 15,
        borderRadius: 30,
        height: Platform.OS === 'ios' ? hp(79) : hp(82)
    },
    banner: {
        height: hp(22),
        justifyContent: 'center',
        alignItems: 'center'
    },
    first: {
        height: hp(17)
    },
    txt: {
        fontSize: hp(2),
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
        fontWeight:'400'
    },
    interaction: {
        fontSize: responsiveFontSize(3),
        color: COLORS.BLACK,
        textAlign: 'center',
        fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
       
        fontWeight: '500'
    },
    authenticated: {
        fontSize: responsiveFontSize(2),
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILIES.POPPINS_REGULAR,
        fontWeight: '400'
    },
    memorable: {
        fontSize: responsiveFontSize(2),
        color: '#444444',
        fontFamily: FONT_FAMILIES.POPPINS_REGULAR,
      
    },
    flatlist: {
        alignItems: 'center'
    },
    slide: {
        backgroundColor: '#EDF4FC',
        borderColor: '#085DF1',
        height: hp(8),
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row'
    },
    left: {
        width: wp(20),
        height: hp(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    right: {
        flex: 1,
        justifyContent: 'center'
    },
    button: {
        alignItems: 'center',
        height: hp(10),
        justifyContent: 'center'
    },
    btn: {
        backgroundColor: COLORS.LOGINBUTTON,
        height: hp(6),
        borderRadius: hp(35),
        justifyContent: 'center',
        alignItems: 'center'
    },
    insidefirst: {
        justifyContent: 'center'
    },
    insideflatlist: {
        width: wp(87)
    },
    insidebutton: {
        width: wp(87)
    }

})
