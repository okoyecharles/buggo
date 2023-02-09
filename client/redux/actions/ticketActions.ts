import { storeType } from './../configureStore';
import SERVER_URL from '../../config/Backend';
import * as types from './../constants/ticketConstants';
import axios, { AxiosRequestConfig } from 'axios';
import { DispatchType } from '../types';
import generateConfig from './config/axios';
import { Comment } from '../../types/models';

export const fetchTickets = () => async (dispatch: DispatchType, getState: () => storeType) => {
  try {
    dispatch({
      type: types.TICKET_LIST_REQUEST,
    });
    const currentUser = getState().currentUser;
    const { data } = await axios.get(
      `${SERVER_URL}/tickets`,
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
      `${SERVER_URL}/tickets/${id}`,
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

export const createTicket = (ticket: any, projectId: string, socket: any) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.TICKET_CREATE_REQUEST,
    });
    const { data } = await axios.post(
      `${SERVER_URL}/projects/${projectId}/tickets`,
      ticket,
      generateConfig()
    );

    socket.emit('create-project-ticket', {
      projectId,
      ticket: data.ticket,
    });

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

export const socketCreateTicket = (ticket: any) => {
  console.log('socketCreateTicket: ', ticket);
  return {
    type: types.TICKET_CREATE_SUCCESS,
    payload: { ticket },
  }
}

export const updateTicket = (id: string, ticket: any) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.TICKET_UPDATE_REQUEST,
    });
    const { data } = await axios.put(
      `${SERVER_URL}/tickets/${id}`,
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
      `${SERVER_URL}/tickets/${id}/comments`,
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

export const socketCommentOnTicket = (comment: Comment) => {
  return {
    type: types.TICKET_COMMENT_SUCCESS,
    payload: { comment },
  };
}

