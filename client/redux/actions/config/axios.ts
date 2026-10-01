import { AxiosRequestConfig } from "axios";

/*
 * Auth rides entirely on the httpOnly cookie, which the browser attaches
 * itself -- withCredentials is the only thing needed to ask for it.
 */
export const generateConfig = (socket_id?: string): AxiosRequestConfig<any> => ({
  headers: {
    "Content-Type": "application/json",
    ...(socket_id && { "X-Pusher-Socket-ID": socket_id }),
  },
  withCredentials: true,
});

export default generateConfig;
