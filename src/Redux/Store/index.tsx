import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from '../Reducer';
import { rootSaga } from '../Action';
import reduxReset from 'redux-reset';
import { createLogger } from 'redux-logger';
import { currentUser, messages, app, dialogs, selectedDialog  } from '../../Component/Chat/reducers';
const logger = createLogger({
    // ...options
  })
// import from ''
const sagaMiddleware = createSagaMiddleware();
function configureStore(initialState: {}) {
    const enhancer = compose(
        applyMiddleware(
            sagaMiddleware,
            logger
        ),
        reduxReset(),
    );
    return createStore(reducers, initialState, enhancer);
}

const store = configureStore({});
sagaMiddleware.run(rootSaga);
export default store;