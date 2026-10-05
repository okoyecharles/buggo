import * as types from '@/redux/constants/userConstants';
import { ActionType } from '@/redux/types';

export type LoginState = {
  pending: boolean;
  error: null | { message: string };
};
const initialState: LoginState = {
  pending: false,
  error: null,
};

const loginReducer = (
  state: LoginState = initialState,
  action: ActionType
): LoginState => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_LOGIN_REQUEST:
      return { ...state, pending: true, error: null };
		case types.USER_LOGIN_SUCCESS:
      return { ...state, pending: false, error: null };
    case types.USER_LOGIN_FAIL:
      return { ...state, pending: false, error: payload };
    case types.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default loginReducer;
