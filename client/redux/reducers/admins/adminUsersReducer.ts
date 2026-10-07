import { User } from "@/core/types/models";
import { ActionType } from "@/redux/types";
import * as types from "@/redux/types/admin";
import * as userTypes from "@/redux/types/user";

export type AdminUsersState = {
  users: Array<User>;
  pending: {
    list: boolean;
    delete: boolean;
  };
};

const initialState: AdminUsersState = {
  users: [],
  pending: {
    list: false,
    delete: false,
  },
};

const adminUsersReducer = (
  state: AdminUsersState = initialState,
  action: ActionType,
): AdminUsersState => {
  const { type, payload } = action;
  switch (type) {
    case types.ADMIN_USER_LIST_REQUEST:
      return { ...state, pending: { ...state.pending, list: true } };
    case types.ADMIN_USER_LIST_SUCCESS:
      return {
        ...state,
        ...payload,
        users: payload.users,
        pending: { ...state.pending, list: false },
      };
    case types.ADMIN_USER_LIST_FAIL:
      return { ...state, pending: { ...state.pending, list: false } };
    case types.ADMIN_DELETE_USER_REQUEST:
      return { ...state, pending: { ...state.pending, delete: true } };
    case types.ADMIN_DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== payload),
        pending: { ...state.pending, delete: false },
      };
    case types.ADMIN_DELETE_USER_FAIL:
      return { ...state, pending: { ...state.pending, delete: false } };
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default adminUsersReducer;
