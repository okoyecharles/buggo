import * as types from "@/redux/constants/userConstants";
import { ActionType } from "@/redux/types";

export type RegisterState = {
  loading: boolean;
  error: null | { message: string };
};
const initialState: RegisterState = {
  loading: false,
  error: null,
};

const registerReducer = (
  state: RegisterState = initialState,
  action: ActionType,
): RegisterState => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_REGISTER_REQUEST:
      return { ...state, loading: true, error: null };
    case types.USER_REGISTER_SUCCESS:
      return { ...state, loading: false, error: null };
    case types.USER_REGISTER_FAIL:
      return { ...state, loading: false, error: payload };
    case types.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default registerReducer;
