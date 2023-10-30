import { View, StyleSheet } from 'react-native';
import React from 'react';
import { COLORS } from '../Configration';
import { Wave } from 'react-native-animated-spinkit'
const Loader = () => {

    return <View style={styles.container}>
        <Wave size={100} color={COLORS.BOTTOM_COLOR} />
    </View>
};
export default Loader
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});
