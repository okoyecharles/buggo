import { AxiosRequestConfig } from "axios";
import store from "../../configureStore";

// config with option to include pusher socket id in headers
export const generateConfig = (socket_id?: string): AxiosRequestConfig<any> => {
  const { user, token } = store.getState().currentUser;

  return {
    headers: {
      "Content-Type": "application/json",
      ...(user && { "Authorization": `Bearer ${token}` }),
      ...(socket_id && { "X-Pusher-Socket-ID": socket_id }),
    },
    withCredentials: true,
  };
};

export default generateConfig;
