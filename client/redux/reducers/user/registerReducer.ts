import * as types from '../../constants/userConstants';
import { ActionType } from '../../types';

type State = {
  loading: boolean;
  error: null | { message: string };
};
const initialState = {
  loading: false,
  error: null,
};

const registerReducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_REGISTER_REQUEST:
      return { ...state, loading: true, error: null };
    case types.USER_REGISTER_FAIL:
      return { ...state, loading: false, error: payload };
    case types.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default registerReducer;
