import * as types from "@/redux/constants/userConstants";
import { ActionType } from "@/redux/types";

export type RegisterState = {
  pending: boolean;
  error: null | { message: string };
};
const initialState: RegisterState = {
  pending: false,
  error: null,
};

const registerReducer = (
  state: RegisterState = initialState,
  action: ActionType,
): RegisterState => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_REGISTER_REQUEST:
      return { ...state, pending: true, error: null };
    case types.USER_REGISTER_SUCCESS:
      return { ...state, pending: false, error: null };
    case types.USER_REGISTER_FAIL:
      return { ...state, pending: false, error: payload };
    case types.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default registerReducer;
