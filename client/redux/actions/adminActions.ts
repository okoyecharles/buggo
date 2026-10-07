import SERVER_URL from '@/core/data/backend';
import * as types from '@/redux/types/admin';
import axios from 'axios';
import { DispatchType } from "../types";
import generateConfig from './config/axios';

const deleteUser = (id: string) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.ADMIN_DELETE_USER_REQUEST,
    });
    await axios.delete(`${SERVER_URL}/users/${id}`, generateConfig());
    dispatch({
      type: types.ADMIN_DELETE_USER_SUCCESS,
      payload: id,
    });
    return true;
	} catch (error: any) {
    dispatch({
      type: types.ADMIN_DELETE_USER_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
    return false;
  }
};

const getAllUsers = () => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.ADMIN_USER_LIST_REQUEST,
    });
    const { data } = await axios.get(`${SERVER_URL}/users`, generateConfig());
    dispatch({
      type: types.ADMIN_USER_LIST_SUCCESS,
      payload: data,
    });
    return true;
  } catch (error: any) {
    dispatch({
      type: types.ADMIN_USER_LIST_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
    return false;
  }
};

export { deleteUser, getAllUsers };
