import { AxiosRequestConfig } from "axios";

/*
 * Auth rides entirely on the httpOnly cookie, which the browser attaches
 * itself -- withCredentials is the only thing needed to ask for it.
 */
export const generateConfig = (): AxiosRequestConfig<any> => ({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default generateConfig;
