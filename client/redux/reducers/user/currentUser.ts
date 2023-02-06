import * as types from '../../constants/userConstants';
import { ActionType } from '../../types';
import User from '../../../types/types';

type State = {
  user: User | null,
  loading: boolean,
  method: {
    update: boolean;
    validate: boolean;
  };
};
const initialState: State = {
  user: null,
  loading: false,
  method: {
    update: false,
    validate: true
  }
};

const currentUserReducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_LOGIN_SUCCESS:
      return {
        ...payload,
        loading: false,
        method: { ...state.method, update: false }
      };
    case types.USER_REGISTER_SUCCESS:
      return {
        ...payload,
        loading: false,
        method: { ...state.method, update: false }
      };
    case types.USER_LOGOUT:
      return {
        ...initialState,
        method: { ...state.method, validate: false }
      };

    case types.USER_PROFILE_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        method: { ...state.method, update: true }
      };

    case types.USER_PROFILE_UPDATE_FAIL:
      return {
        ...state,
        loading: false,
        method: { ...state.method, update: false }
      };
    
    case types.USER_VALIDATE_REQUEST:
      return {
        ...state,
        loading: true,
        method: { ...state.method, validate: true }
      };
    case types.USER_VALIDATE_SUCCESS:
      return {
        ...payload,
        loading: false,
        method: { ...state.method, validate: false }
      };
    case types.USER_VALIDATE_FAIL:
      return {
        ...state,
        loading: false,
        method: { ...state.method, validate: false }
      };
    default:
      return state;
  }
};

export default currentUserReducer;
