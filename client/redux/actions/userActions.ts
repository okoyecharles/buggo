import { toast } from 'react-toastify';
import SERVER_URL from '../../src/data/backend-config';
import * as types from '../constants/userConstants';
import axios from 'axios';
import { DispatchType } from '../types';
import store, { storeType } from '../configureStore';
import generateConfig from './config/axios';

const login =
  (email: string, password: string) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.USER_LOGIN_REQUEST,
      });

      const { data } = await axios.post(
        `${SERVER_URL}/users/signin`,
        { email, password },
        generateConfig()
      );
      toast.success("Logged In successfully");

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
      `${SERVER_URL}/users/signup`,
      formData,
      generateConfig()
    );
    toast.success("Signed Up successfully");

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

const logout = (auto = false) => async (dispatch: DispatchType) => {
  dispatch({
    type: types.USER_LOGOUT,
  });
  await axios.post(`${SERVER_URL}/users/signout`, {}, generateConfig());
  if (!auto)
    toast.success("Logged Out successfully");
};

const validateUserSession = () => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.USER_VALIDATE_REQUEST,
    });

    const { data } = await axios.post(
      `${SERVER_URL}/users/validate`,
      {},
      generateConfig()
    );
    toast.success("Logged In successfully");

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
    const user = getState().currentUser.user;
    const { data } = await axios.put(
      `${SERVER_URL}/users/${user?._id}`,
      formData,
      generateConfig()
    );
    toast.success("User updated successfully");

    dispatch({
      type: types.USER_PROFILE_UPDATE_SUCCESS,
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
  const { data } = await axios.get(`${SERVER_URL}/users`, generateConfig());

  return data;
};

const deleteUser = async (id: string) => {
  try {
    const socketId = store.getState().pusher.socket;
    const { data } = await axios.delete(
      `${SERVER_URL}/users/${id}`,
      generateConfig(socketId || '')
    );
    toast.success("User deleted successfully");
    return data.users;
  } catch (error: any) {
    toast.error(error.response?.data ? error.response.data : error.error);
  }
};

const pusherDeleteUser = (id: string) => {
  const userId = store.getState().currentUser.user?._id;
  if (userId === id) {
    toast.warn("Due to policy violation, This account has been deleted");
    store.dispatch(logout(true));
  }
};

export { validateUserSession, login, register, logout, updateUser, getUsers, deleteUser, pusherDeleteUser };
