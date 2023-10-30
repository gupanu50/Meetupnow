import { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Images } from '../../Assets';
import * as Constant from '../../Constant';
import withConnect from './withConnect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
const { ONBOARD } = Constant.SCREENS
const splash = (props: any) => {
 
  // ***************************************time out to navigate next screen************************************************
  const { navigation, loginAction } = props


  useEffect(() => {
    getUserData()
  }, []);
  const getUserData = async () => {
    try {
      let data: any = await AsyncStorage.getItem("credentials");
      console.log('===data====>', data);

      const dataBlob = JSON.parse(data);
      if (dataBlob) {
        loginAction({ body: dataBlob, isLogin: false, navigation: navigation });
      } else {
        navigation.navigate(ONBOARD);
      }
    }
    catch (error) {
      console.log('error', error)
      navigation.navigate(ONBOARD);
    }
  };
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Images.splash} />
    </View>
  );
}
export default withConnect(splash);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: '100%',
    width: '100%'
  }
});
