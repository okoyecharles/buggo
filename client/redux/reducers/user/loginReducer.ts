import * as types from '@/redux/constants/userConstants';
import { ActionType } from '@/redux/types';

export type LoginState = {
  loading: boolean;
  error: null | { message: string };
};
const initialState: LoginState = {
  loading: false,
  error: null,
};

const loginReducer = (
  state: LoginState = initialState,
  action: ActionType
): LoginState => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
		case types.USER_LOGIN_SUCCESS:
      return { ...state, loading: false, error: null };
    case types.USER_LOGIN_FAIL:
      return { ...state, loading: false, error: payload };
    case types.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default loginReducer;
