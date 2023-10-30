//====================== Creating Reducers =================================//
export default function createReducer(
    initialState: any,
    handlers: { [x: string]: (arg0: any, arg1: any) => any },
) {
    // eslint-disable-next-line no-undef
    return function reducer(state = initialState, action: { type: PropertyKey }) {
        if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
            // @ts-ignore
            return handlers[action.type](state, action);
        }
        return state;
    };
}
