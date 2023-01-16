import { AxiosRequestConfig } from "axios";

const generateConfig = (): AxiosRequestConfig<any> => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
}

export default generateConfig;
