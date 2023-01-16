import BACKEND_URL from '../../config/Backend';
import * as types from '../constants/userConstants';
import axios, { AxiosRequestConfig } from 'axios';
import { DispatchType } from '../types';
import { storeType } from '../configureStore';
import generateConfig from './config/axios';

const login =
  (email: string, password: string) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.USER_LOGIN_REQUEST,
      });

      const { data } = await axios.post(
        `${BACKEND_URL}/users/signin`,
        { email, password },
        generateConfig()
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
    const { data } = await axios.post(
      `${BACKEND_URL}/users/signup`,
      formData,
      generateConfig()
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

const logout = () => async (dispatch: DispatchType) => {
  dispatch({
    type: types.USER_LOGOUT,
  });
  await axios.post(`${BACKEND_URL}/users/signout`, {}, generateConfig());
};

const validateUserSession = () => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.USER_VALIDATE_REQUEST,
    });
  
    const { data } = await axios.post(
      `${BACKEND_URL}/users/validate`,
      {},
      generateConfig()
    );

    dispatch({
      type: types.USER_VALIDATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.USER_VALIDATE_FAIL,
    });
    logout();
  }
};

const updateUser = (formData: {
  name: string;
  image: string;
}) => async (dispatch: DispatchType, getState: () => storeType) => {
  try {
    dispatch({
      type: types.USER_PROFILE_UPDATE_REQUEST,
    });
    const currentUser = getState().currentUser;
    const { data } = await axios.put(
      `${BACKEND_URL}/users/${currentUser.user?._id}`,
      formData,
      generateConfig()
    );

    dispatch({
      type: types.USER_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.USER_PROFILE_UPDATE_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};

const getUsers = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/users`, generateConfig());

  return data;
};



export { validateUserSession, login, register, logout, updateUser, getUsers };
