import { GoogleSignin, statusCodes, User, NativeModuleError } from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
// import { appleAuth } from '@invertase/react-native-apple-authentication';
// import { AppleButton,AndroidResponseType } from "@invertase/react-native-apple-authentication";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Network from "../../../Network";
import { showMessage } from "react-native-flash-message";
import { SCREENS } from "../../../Constant";
import { ActionType } from "../../../Redux/Type";
const { REGISTERPROFILE } = SCREENS
const {USER_DATA} = ActionType;
export const useSignInViaSocialHook = (callback) => {
  const navigation: any = useNavigation();
  const [userInfo, setUserInfo] = useState<User | undefined>()
  const [error, setError] = useState<NativeModuleError | any>()
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const dispatch = useDispatch();
  // const  onAppleButtonPress = async () =>{
  //     // Start the sign-in request
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //     });

  //     // Ensure Apple returned a user identityToken
  //     if (!appleAuthRequestResponse.identityToken) {
  //       throw new Error('Apple Sign-In failed - no identify token returned');
  //     }

  //     // Create a Firebase credential from the response
  //     const { identityToken, nonce } = appleAuthRequestResponse;
  //     console.log("identy token");
  //    // call api here for server register

  //     // Sign the user in with the credential
  //     return identityToken
  //   }
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:  "863380586183-d3g42n5nvpa52qs4sv8v8q8f24n007rd.apps.googleusercontent.com",
      offlineAccess: false,
      hostedDomain: "",
    });
  }, [])
  /**
   * @method loginWithGoogle
   */
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userinfo = await GoogleSignin.signIn();
      console.log('googlesignindetails', userInfo);
      setUserInfo(userinfo);
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      const body = { email: userinfo?.user?.email, fcm_token: fcmToken }
      try {
        console.log('socialbody', body);
        const result : any= await Network.createApiClient().socialLogin(body);
        console.log("responsesocialLogin", result);
        if (result.data && result.data.success === true) {
          showMessage({ message: result.data.message, type: 'success' });
          console.log('user_id', result.data.data.id, result.data.data.email);
          const DATA = [{ email: result.data.data.email, password: 'Google@123' ,user_id: result.data.data.id }];
          const body1 = {email: result.data.data.email, password: 'Google@123', fcm_token: fcmToken}
          dispatch({ type: USER_DATA, payload: DATA });
          if(result.data.data.profile_status === 0) {
            navigation.navigate(REGISTERPROFILE, { naviName: "registerSocial" });
          } else {
            callback({ body: body1, isLogin: true, navigation: navigation })
          }
          
        } else {
          showMessage({ message: result?.data?.message, type: 'danger' });
        }
      } catch (error: any) {
        const err = JSON.stringify(error?.error);
        alert(err);
        setIsLoading(false)
      }
    }
    catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError(error)
        Alert.alert("User Cancelled the Login Flow");
      }
      else if (error.code === statusCodes.IN_PROGRESS) {
        setError(error)
      }
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play Services Not Available or Outdated");
        setError(error)
      }
      else {
        Alert.alert(error.toString());
        console.log('error', error)
        setError(error)
      }
    }
  }
  const loginWithGoogle1 = async () => {
    // setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userinfo = await GoogleSignin.signIn();
      console.log('googlesignindetails', userInfo);
      setUserInfo(userinfo);
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      const body = { email: userinfo?.user?.email, password: 'Google@123' ,fcm_token: fcmToken }
      try {
        console.log('socialbody', body);
        callback({ body: body, isLogin: true, navigation: navigation })
      } catch (error: any) {
        const err = JSON.stringify(error?.error);
        alert(err);
        setIsLoading(false)
      }
    }
    catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError(error)
        Alert.alert("User Cancelled the Login Flow");
      }
      else if (error.code === statusCodes.IN_PROGRESS) {
        setError(error)
      }
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play Services Not Available or Outdated");
        setError(error)
      }
      else {
        Alert.alert(error.toString());
        console.log('error', error)
        setError(error)
      }
    }
  }
  /**
   * @method loginWithApple
   */
  // const loginWithApple  = () =>{
  //  onAppleButtonPress()
  // }
  /**
   * @method logoutFromGoogle
   */
  const logoutFromGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      //setUserInfo(null);
    }
    catch (error) {
      console.error("errorinlogoutgoogle",error);
    }
  }

  return {
    userInfo,
    error,
    // loginWithApple, 
    loginWithGoogle,
    loginWithGoogle1,
    logoutFromGoogle,
    isLoading
  };
};








