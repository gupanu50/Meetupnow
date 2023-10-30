import {put, takeLatest, call} from 'redux-saga/effects';
import {ActionType} from '../../Type';
const {
  USER_LOGIN,
  USER_LOGIN_FAILURE,
  USER_LOGIN_LOADING,
  USER_LOGIN_SUCCESS,
  USER_DATA,
} = ActionType;
const {MAIN, REGISTERPROFILE, MOBILENUMBER} = SCREENS;
import {SCREENS, VALIDATE_FORM} from '../../../Constant';
import Api from '../../../Network/Api';
import * as Config from '../../../Configration';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedManager from '../../../Common/SharedManager.tsx';
import {createUserInFirestore} from '@flyerhq/react-native-firebase-chat-core';
import auth from '@react-native-firebase/auth';

var authUser: boolean = false;

async function firebaseLogin(user: any) {
  await auth()
    .signInWithEmailAndPassword(user?.email, user?.password)
    .then(() => {
      console.log('user Logged in successfully');
    })
    .catch(error => {
      authUser = false;
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      console.error(error);
    });
}

function* loginSaga(data: {payload: any}) {
  yield put({type: USER_LOGIN_LOADING, payload: true});
  try {
    //@ts-ignore
    console.log('Input', data.payload.body);
    const res = yield call(Api.loginApi, data.payload.body);
    console.log('return data ====>', res.data);
    if (res.data.success == true) {
      console.log('response111', res.data);
      let encData = res.data.data;
      let tokenValue = encData.token;
      let profileStatusValue = encData.profile_status;
      console.log('=====encData======>', encData);
      console.log('=======tokenValue========>', tokenValue);
      console.log('=======profileStatusValue========>', profileStatusValue);
      AsyncStorage.setItem('credentials', JSON.stringify(data.payload.body));
      yield AsyncStorage.setItem('user', JSON.stringify(encData));
      // @ts-ignore
      SharedManager.getInstance().setToken(tokenValue);
      console.log('detailssssssss==>>>', encData.coins);
      yield put({type: USER_LOGIN_SUCCESS, payload: res.data.data});
      yield put({type: USER_LOGIN_LOADING, payload: false});
      if (profileStatusValue == 1) {
        console.log('detailsssssssoffirebaselogins==>>>', data.payload.body);
        firebaseLogin(data.payload.body);
        data.payload.navigation.navigate(MAIN, {coins: encData.coins});
      } else {
        const DATA = {
          password: data.payload.body.password,
          user_id: encData.id,
          email: encData.email,
        };
        console.log('reduxsendData', DATA);
        yield put({type: USER_DATA, payload: DATA});
        data.payload.navigation.navigate(REGISTERPROFILE, {naviName: 'login'});
      }
    } else {
      showMessage({message: res.data.message, type: 'danger'});
      yield put({type: USER_LOGIN_FAILURE, payload: res.message});
      yield put({type: USER_LOGIN_LOADING, payload: false});
      AsyncStorage.removeItem('credentials');
    }
  } catch (error) {
    yield put({type: USER_LOGIN_FAILURE, payload: error.toString()});
    yield put({type: USER_LOGIN_LOADING, payload: false});
    showMessage({message: 'request failed try again.', type: 'danger'});
  }
}

function* LoginSagaAsync() {
  //@ts-ignore
  yield takeLatest(USER_LOGIN, loginSaga);
}

export default LoginSagaAsync;
