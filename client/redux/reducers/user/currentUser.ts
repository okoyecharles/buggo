import { User } from '@/core/types/models';
import * as types from '@/redux/constants/userConstants';
import { ActionType } from '@/redux/types';

export type CurrentUserState = {
  user: User | null,
  pending: {
    update: boolean;
    validate: boolean;
  };
};
const initialState: CurrentUserState = {
  user: null,
  pending: {
    update: false,
    validate: true
  }
};

const currentUserReducer = (
  state: CurrentUserState = initialState,
  action: ActionType
): CurrentUserState => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_LOGIN_SUCCESS:
      return {
        ...payload,
        pending: { ...state.pending, update: false }
      };
    case types.USER_REGISTER_SUCCESS:
      return {
        ...payload,
        pending: { ...state.pending, update: false }
      };
    case types.USER_LOGOUT:
      return {
        ...initialState,
        pending: { ...state.pending, validate: false }
      };

    case types.USER_PROFILE_UPDATE_REQUEST:
      return {
        ...state,
        pending: { ...state.pending, update: true }
      };
    case types.USER_PROFILE_UPDATE_SUCCESS:
      return {
        ...payload,
        pending: { ...state.pending, update: false }
      };
    case types.USER_PROFILE_UPDATE_FAIL:
      return {
        ...state,
        pending: { ...state.pending, update: false }
      };

    case types.USER_VALIDATE_REQUEST:
      return {
        ...state,
        pending: { ...state.pending, validate: true }
      };
    case types.USER_VALIDATE_SUCCESS:
      return {
        ...payload,
        pending: { ...state.pending, validate: false }
      };
    case types.USER_VALIDATE_FAIL:
      return {
        ...state,
        pending: { ...state.pending, validate: false }
      };
    default:
      return state;
  }
};

export default currentUserReducer;
