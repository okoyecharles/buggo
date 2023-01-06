import * as types from '../../constants/userConstants';
import { ActionType } from '../../types';

type State = {
  user?: {},
  token?: string
} | null;
const initialState = null;

const currentUserReducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_LOGIN_SUCCESS:
      return payload;
    case types.USER_REGISTER_SUCCESS:
      return payload;
    case types.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default currentUserReducer;
