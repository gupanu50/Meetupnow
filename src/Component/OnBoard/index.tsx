import React from 'react';
import {
    View,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Images } from '../../Assets';
import { COLORS, FONT_FAMILIES } from '../../Configration';
import * as Constant from '../../Constant';
const { REGISTER } = Constant.SCREENS


const slides = [
    {
        key: 1,
        image: Images.splash,
    },
    {
        key: 2,
        image: Images.splash2,
    },
    {
        key: 3,
        image: Images.splash3,
        start: 'Getting Started'
    },
];

const Onboard = props => {
    const _onDone = () => {
        props.navigation.navigate(REGISTER);
    };

    const _renderItem = (item: any) => {
        const { image, start, key } = item.item
        return (
            <View>
                <Image source={image} style={styles.img} />
                <View style={styles.start}>
                    {key === 3 && <TouchableOpacity style={styles.btn} onPress={() => props.navigation.navigate(REGISTER)}>
                        <Text style={{ color: COLORS.WHITESHADOW,fontFamily:FONT_FAMILIES.INTER_MEDIUM }}>{start}</Text>
                    </TouchableOpacity>}
                </View>
            </View>
        );
    };

    const _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Image style={{ tintColor: 'white' }} source={Images.arrow_right} />
            </View>
        );
    };


    return (
      
            <View style={styles.mainContainer}>
                <AppIntroSlider
                    renderItem={_renderItem}
                    data={slides}
                    onDone={_onDone}
                    showSkipButton={false}
                    showNextButton={false}
                    showDoneButton={false}
                    renderDoneButton={_renderNextButton}
                />
            </View>
     
    );
};

export default Onboard;

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
    },
    img: {
        height: '100%',
        width: '100%'
    },
    start: {
        position: 'absolute',
        height: '97%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    btn: {
        backgroundColor: COLORS.LOGINBUTTON,
        height: '5%',
        width: 190,
        top: Platform.OS === 'ios' ? -50 : -30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.LOGINBUTTON,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
