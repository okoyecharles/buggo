import { toast } from 'react-toastify';
import SERVER_URL from '@/core/data/backend';
import * as types from '@/redux/constants/userConstants';
import axios, { AxiosResponse } from 'axios';
import { DispatchType } from '@/redux/types';
import store, { storeType } from '@/redux/configureStore';
import generateConfig from './config/axios';
import { User } from '@/core/types/models';

/*
 * Shared by every "you are signed in" notice: a real sign in and the auth
 * pages' redirect notice can both fire in the same tick, and reusing one
 * toast id lets react-toastify drop the second.
 */
export const AUTH_TOAST_ID = 'auth-session';

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

      dispatch({
        type: types.USER_LOGIN_SUCCESS,
        payload: data,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.USER_LOGIN_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
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

    dispatch({
      type: types.USER_REGISTER_SUCCESS,
      payload: data,
    });
    return true;
  } catch (error: any) {
    dispatch({
      type: types.USER_REGISTER_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
    return false;
  }
};

const logout = (auto = false) => async (dispatch: DispatchType) => {
  dispatch({
    type: types.USER_LOGOUT,
  });
  // The local session is already gone, so a failed signout only leaves a
  // cookie the server rejects anyway -- never block or throw on it.
  try {
    await axios.post(`${SERVER_URL}/users/signout`, {}, generateConfig());
  } catch {}
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

    dispatch({
      type: types.USER_VALIDATE_SUCCESS,
      payload: data,
    });
    return true;
  } catch (error: any) {
    dispatch({
      type: types.USER_VALIDATE_FAIL,
    });
    // `auto` keeps this quiet: a dead session is not a deliberate sign out.
    store.dispatch(logout(true));
    return false;
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

    dispatch({
      type: types.USER_PROFILE_UPDATE_SUCCESS,
      payload: data,
    });
    return true;
  } catch (error: any) {
    dispatch({
      type: types.USER_PROFILE_UPDATE_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
    return false;
  }
};

const getUsers = async () => {
  const { data } = await axios.get(`${SERVER_URL}/users`, generateConfig());
  return data;
};

const deleteUser = async (id: string) => {
  try {
    const { data } = await axios.delete(
      `${SERVER_URL}/users/${id}`,
      generateConfig()
    ) as AxiosResponse<{ users: User[] }>;
    toast.success("User deleted successfully");
    return data.users;
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || 'Something went wrong... Please try again'
    );
  }
};

const handleAccountDeleted = (id: string) => {
  const userId = store.getState().currentUser.user?._id;
  if (userId === id) {
    toast.warn("Due to policy violation, This account has been deleted");
    store.dispatch(logout(true));
  }
};

export { validateUserSession, login, register, logout, updateUser, getUsers, deleteUser, handleAccountDeleted };
