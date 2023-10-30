//@ts-ignore

import { combineReducers } from 'redux';
import * as loginSagaReducer from './LoginReducer';



// eslint-disable-next-line no-import-assign
export default combineReducers(
    {
        ...Object.assign(loginSagaReducer),
    });

