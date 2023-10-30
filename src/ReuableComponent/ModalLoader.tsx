import { View, StyleSheet } from 'react-native';
import React from 'react';
import Spinner from 'react-native-spinkit';
import { COLORS } from '../Configration';
const Loader = (props: any) => {
    const { loading } = props;

    return (
        <>
            {loading && <View style={styles.container}>
                <Spinner
                    isVisible={true}
                    size={100}
                    type={'Circle'}
                    color={COLORS.BOTTOM_COLOR}
                />
            </View>}
        </>
    )
};
export default Loader;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
});