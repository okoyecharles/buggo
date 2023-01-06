import { storeType } from './../configureStore';
import BACKEND_URL from '../../config/Backend';
import * as types from './../constants/ticketConstants';
import axios, { AxiosRequestConfig } from 'axios';
import { DispatchType } from '../types';

export const fetchTickets = () => async (dispatch: DispatchType, getState: () => storeType) => {
  try {
    dispatch({
      type: types.TICKET_LIST_REQUEST,
    });
    const currentUser = getState().currentUser;

    const config: AxiosRequestConfig<any> = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser?.token}`,
      },
    };
    const { data } = await axios.get(`${BACKEND_URL}/tickets`, config);

    dispatch({
      type: types.TICKET_LIST_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.TICKET_LIST_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};

export const fetchTicketById = (id: string) => async (dispatch: DispatchType, getState: () => storeType) => {
  try {
    dispatch({
      type: types.TICKET_DETAILS_REQUEST,
    });
    const currentUser = getState().currentUser;

    const config: AxiosRequestConfig<any> = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser?.token}`,
      },
    };
    const { data } = await axios.get(`${BACKEND_URL}/tickets/${id}`, config);

    dispatch({
      type: types.TICKET_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.TICKET_DETAILS_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};
