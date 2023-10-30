import { ActionType } from '../../Type';
const { USER_LOGIN } = ActionType;
//================== USER LOGIN ACTION ============================================//
export const loginAction = (data: any) => ({
    type: USER_LOGIN,
    payload: data,
});
