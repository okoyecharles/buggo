import { AxiosRequestConfig } from "axios";
import store from "@/redux/configureStore";

// config with option to include pusher socket id in headers
export const generateConfig = (socket_id?: string): AxiosRequestConfig<any> => {
  const { token } = store.getState().currentUser;

  return {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...(socket_id && { "X-Pusher-Socket-ID": socket_id }),
    },
    withCredentials: true,
  };
};

export default generateConfig;
