import { AxiosRequestConfig } from "axios";

// config with option to include pusher socket id in headers
export const generateConfig = (socket_id?: string): AxiosRequestConfig<any> => {
  return {
    headers: {
      "Content-Type": "application/json",
      ...(socket_id && { "X-Pusher-Socket-ID": socket_id }),
    },
    withCredentials: true,
  };
};

export default generateConfig;
