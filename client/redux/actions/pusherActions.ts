import * as types from '../constants/pusherConstants';

export const connectPusher = (socket_id: string) => ({
  type: types.PUSHER_CONNECT_SUCCESS,
  payload: {
    socket: socket_id,
  }
});

export const disconnectPusher = () => {
  return {
    type: types.PUSHER_DISCONNECTED,
    payload: null
  }
}