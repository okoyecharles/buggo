import * as types from '../../constants/userConstants';
import { ActionType } from '../../types';

interface User {
  name: string;
  image: string;
  email: string;
  password: string;
  admin: boolean;
  googleId?: string | undefined;
};

type State = {
  user: User,
  token: string
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
