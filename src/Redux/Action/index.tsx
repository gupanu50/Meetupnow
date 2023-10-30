//============
import { fork } from 'redux-saga/effects';
import loginSagaAsync from './LoginAction/loginSaga';
// import { resetCurrentUser, setCurrentUser, updateCurrentUser
//  } from '../../Component/Chat/actions/currentUser';
export function* rootSaga() {
    yield fork(loginSagaAsync);
    // yield fork(setCurrentUser);
    // yield fork(updateCurrentUser)
    // yield fork(resetCurrentUser)
    
}