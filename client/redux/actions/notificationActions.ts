import SERVER_URL from '@/core/data/backend';
import * as types from '@/redux/constants/notificationConstants';
import axios from 'axios';
import { DispatchType } from '@/redux/types';
import generateConfig from './config/axios';

export const fetchNotifications =
  () => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.NOTIFICATION_LIST_REQUEST,
      });

      const { data } = await axios.get(
        `${SERVER_URL}/notifications`,
        generateConfig()
      );

      dispatch({
        type: types.NOTIFICATION_LIST_SUCCESS,
        payload: data,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.NOTIFICATION_LIST_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const readNotification =
  (id: string) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.NOTIFICATION_READ_REQUEST,
      });

      const { data } = await axios.patch(
        `${SERVER_URL}/notifications/${id}/read`,
        {},
        generateConfig()
      );

      dispatch({
        type: types.NOTIFICATION_READ_SUCCESS,
        payload: data,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.NOTIFICATION_READ_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const readNotifications =
  () => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.NOTIFICATION_READ_ALL_REQUEST,
      });

      await axios.patch(
        `${SERVER_URL}/notifications/read`,
        {},
        generateConfig()
      );

      dispatch({
        type: types.NOTIFICATION_READ_ALL_SUCCESS,
        payload: null,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.NOTIFICATION_READ_ALL_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const deleteNotification =
  (id: string) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.NOTIFICATION_DELETE_REQUEST,
      });

      await axios.delete(
        `${SERVER_URL}/notifications/${id}`,
        generateConfig()
      );

      dispatch({
        type: types.NOTIFICATION_DELETE_SUCCESS,
        payload: { notificationId: id },
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.NOTIFICATION_DELETE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };
