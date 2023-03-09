import * as types from "../../constants/pusherConstants";
import { ActionType } from "../../types";

interface PusherState {
  socket: string | null;
}

const initialState: PusherState = {
  socket: null,
};

export default function pusherReducer(
  state = initialState,
  action: ActionType
): PusherState {
  const { payload, type } = action;

  switch (type) {
    case types.PUSHER_CONNECT_SUCCESS:
      return payload;
    case types.PUSHER_DISCONNECTED:
      return initialState;
    default:
      return state;
  }
}