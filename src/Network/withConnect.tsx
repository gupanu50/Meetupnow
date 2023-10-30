import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { loginAction } from '../Redux/Action/LoginAction';
import { connect } from 'react-redux';
//======================MAP STATE TO PROPS ================================//
const mapStateToProps = (state: any) => {

    return {
        error: state.userReducer.error,
        loading: state.userReducer.loading,
        user: state.userReducer.user,
    };
};
//==========================MAP DISPATCH TO PROPS ========================//
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return bindActionCreators({ loginAction }, dispatch);
};
//====================EXPORT WITH CONNECT WITH COMPONENT====================//
export default function withConnect(WrappedComponent: any) {
    return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}