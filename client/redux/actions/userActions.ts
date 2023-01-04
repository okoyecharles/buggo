import BACKEND_URL from '../../config/Backend';
import * as types from '../constants/userConstants';
import axios, { AxiosRequestConfig } from 'axios';
import { DispatchType } from '../types';

const login =
  (email: string, password: string) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.USER_LOGIN_REQUEST,
      });

      const config: AxiosRequestConfig<any> = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `${BACKEND_URL}/users/signin`,
        { email, password },
        config
      );

      dispatch({
        type: types.USER_LOGIN_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: types.USER_LOGIN_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
    }
  };

const register = (formData: any) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.USER_REGISTER_REQUEST,
    });
    const config: AxiosRequestConfig<any> = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      `${BACKEND_URL}/users/signup`,
      formData,
      config
    );

    dispatch({
      type: types.USER_REGISTER_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.USER_REGISTER_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};

const logout = () => (dispatch: DispatchType) => {
  dispatch({
    type: types.USER_LOGOUT,
  });
};

export { login, register, logout };
