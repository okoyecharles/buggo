import { storeType } from './../configureStore';
import SERVER_URL from '../../config/Backend';
import * as types from './../constants/ticketConstants';
import axios from 'axios';
import { DispatchType } from '../types';
import generateConfig from './config/axios';
import { toast } from 'react-toastify';

export const fetchTickets = () => async (dispatch: DispatchType, getState: () => storeType) => {
  try {
    dispatch({
      type: types.TICKET_LIST_REQUEST,
    });
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
    toast.success('Ticket created successfully');

    socket?.emit('create-project-ticket', {
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

export const pusherCreateTicket = (ticketId: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await axios.get(
      `${SERVER_URL}/tickets/${ticketId}`,
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

export const pusherUpdateTicket = (ticketId: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await axios.get(
      `${SERVER_URL}/tickets/${ticketId}`,
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
}

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

export const pusherCommentOnTicket = (ticketId: string, commentId: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await axios.get(
      `${SERVER_URL}/tickets/${ticketId}/comments/${commentId}`,
      generateConfig()
    );

    dispatch({
      type: types.TICKET_COMMENT_SUCCESS,
      payload: {
        ticketId,
        comment: data.comment
      },
    });
  } catch (error: any) {
    dispatch({
      type: types.TICKET_COMMENT_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
}

export const deleteTicket = (id: string, projectId: any, socket: any) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.TICKET_DELETE_REQUEST,
    });
    await axios.delete(
      `${SERVER_URL}/tickets/${id}`,
      generateConfig()
    );
    toast.success("Ticket deleted successfully");

    socket?.emit("delete-project-ticket", {
      projectId,
      ticketId: id,
    });

    dispatch({
      type: types.TICKET_DELETE_SUCCESS,
      payload: {
        ticketId: id
      },
    });
  } catch (error: any) {
    dispatch({
      type: types.TICKET_DELETE_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};

export const pusherDeleteTicket = (ticketId: string) => {
  return {
    type: types.TICKET_DELETE_SUCCESS,
    payload: { ticketId },
  };
}