import createReducer from '../CreateReducers';
import { ActionType } from '../../Type';


const { USER_LOGIN_FAILURE, USER_LOGIN,
    USER_LOGIN_LOADING, USER_LOGIN_SUCCESS, USER_DATA, 
    SEARCH_DATA, SAVE_COIN, REDVISIBLE, UPDATENAME, UPDATEPIC } = ActionType

let initialState = {
    loading: false,
    error: '',
    user: {},
    userData: [],
    search: {},
    saveCoin: {},
    redVisible: {},
    updName: {},
    updProfile: {}
};

export const userReducer = createReducer(initialState, {
    // [SET_CURRENT_USER](state, action) {
    //     console.log("saga",state)
    //     console.log("console",action)
    //     return Object.assign({}, state, {
    //         currentUser: action.payload,
    //     });
    // },
    [USER_LOGIN_LOADING](state, action) {
        return Object.assign({}, state, {
            loading: action.payload,
        });
    },
    [USER_LOGIN_SUCCESS](state, action) {
        return Object.assign({}, state, {
            loading: false,
            user: action.payload,
            saveCoin: action.payload.coins,
            updName: action.payload.name,
            updProfile: action.payload.profile_image,
        });
    },
    [USER_LOGIN_FAILURE](state, action) {
        return Object.assign({}, state, {
            error: action.payload,
            loading: false
        });
    },
    [USER_LOGIN](state, action) {
        return Object.assign({}, state, {
            loading: false,
            error: ''
        });
    },
    [USER_DATA](state, action) {
        return Object.assign({}, state, {
            userData: action.payload,
        });
    },
    [SEARCH_DATA](state, action) {
        return Object.assign({}, state, {
            searchData: action.payload,
        });
    },
    [SAVE_COIN](state, action) {
        return Object.assign({}, state, {
            saveCoin: action.payload,
        });
    },
    [REDVISIBLE](state, action) {
        return Object.assign({}, state, {
            redVisible: action.payload,
        });
    },
    [UPDATENAME](state, action) {
        return Object.assign({}, state, {
            updName: action.payload,
        });
    },
    [UPDATEPIC](state, action) {
        return Object.assign({}, state, {
            updProfile: action.payload,
        });
    },       
});
