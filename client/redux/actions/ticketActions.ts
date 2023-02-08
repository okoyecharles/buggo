import { storeType } from './../configureStore';
import BACKEND_URL from '../../config/Backend';
import * as types from './../constants/ticketConstants';
import axios, { AxiosRequestConfig } from 'axios';
import { DispatchType } from '../types';
import generateConfig from './config/axios';

export const fetchTickets = () => async (dispatch: DispatchType, getState: () => storeType) => {
  try {
    dispatch({
      type: types.TICKET_LIST_REQUEST,
    });
    const currentUser = getState().currentUser;
    const { data } = await axios.get(
      `${BACKEND_URL}/tickets`,
      generateConfig()
    );

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
    const { data } = await axios.get(
      `${BACKEND_URL}/tickets/${id}`,
      generateConfig()
    );

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

export const createTicket = (ticket: any, projectId: string) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.TICKET_CREATE_REQUEST,
    });
    const { data } = await axios.post(
      `${BACKEND_URL}/projects/${projectId}/tickets`,
      ticket,
      generateConfig()
    );

    dispatch({
      type: types.TICKET_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.TICKET_CREATE_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};

export const updateTicket = (id: string, ticket: any) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.TICKET_UPDATE_REQUEST,
    });
    const { data } = await axios.put(
      `${BACKEND_URL}/tickets/${id}`,
      ticket,
      generateConfig()
    );

    dispatch({
      type: types.TICKET_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.TICKET_UPDATE_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};

export const commentOnTicket = (id: string, text: string) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.TICKET_COMMENT_REQUEST,
    });
    const { data } = await axios.post(
      `${BACKEND_URL}/tickets/${id}/comments`,
      { text },
      generateConfig()
    );

    dispatch({
      type: types.TICKET_COMMENT_SUCCESS,
      payload: data,
    });
  
  } catch (error: any) {
    dispatch({
      type: types.TICKET_COMMENT_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};