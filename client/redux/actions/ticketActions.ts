import { storeType } from "./../configureStore";
import SERVER_URL from "@/core/data/backend";
import * as types from "../types/ticket";
import axios from "axios";
import { DispatchType } from "@/redux/types";
import generateConfig from "./config/axios";

export const fetchTickets = () => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.TICKET_LIST_REQUEST,
    });
    const { data } = await axios.get(`${SERVER_URL}/tickets`, generateConfig());
    dispatch({
      type: types.TICKET_LIST_SUCCESS,
      payload: data,
    });
    return true;
  } catch (error: any) {
    dispatch({
      type: types.TICKET_LIST_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
    return false;
  }
};

export const fetchTicketById =
  (id: string) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.TICKET_DETAILS_REQUEST,
      });
      const { data } = await axios.get(
        `${SERVER_URL}/tickets/${id}`,
        generateConfig(),
      );
      dispatch({
        type: types.TICKET_DETAILS_SUCCESS,
        payload: data,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.TICKET_DETAILS_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const createTicket =
  (ticket: any, projectId: string) =>
  async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.TICKET_CREATE_REQUEST,
      });
      const { data } = await axios.post(
        `${SERVER_URL}/projects/${projectId}/tickets`,
        ticket,
        generateConfig(),
      );
      dispatch({
        type: types.TICKET_CREATE_SUCCESS,
        // my-tickets holds only the user's own tickets, so the reducer has to
        // know who they are before deciding this one belongs there.
        // i.e. This is called when other project members create a ticket by websocket
        payload: { ...data, userId: getState().currentUser.user?._id },
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.TICKET_CREATE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const updateTicket =
  (id: string, ticket: any) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.TICKET_UPDATE_REQUEST,
      });
      const { data } = await axios.put(
        `${SERVER_URL}/tickets/${id}`,
        ticket,
        generateConfig(),
      );
      dispatch({
        type: types.TICKET_UPDATE_SUCCESS,
        payload: data,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.TICKET_UPDATE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const commentOnTicket =
  (id: string, text: string) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.TICKET_COMMENT_REQUEST,
      });
      const { data } = await axios.post(
        `${SERVER_URL}/tickets/${id}/comments`,
        { text },
        generateConfig(),
      );
      dispatch({
        type: types.TICKET_COMMENT_SUCCESS,
        payload: data,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.TICKET_COMMENT_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const deleteTicket = (id: string) => async (dispatch: DispatchType) => {
  try {
    dispatch({
      type: types.TICKET_DELETE_REQUEST,
    });
    await axios.delete(`${SERVER_URL}/tickets/${id}`, generateConfig());
    dispatch({
      type: types.TICKET_DELETE_SUCCESS,
      payload: {
        ticketId: id,
      },
    });
    return true;
  } catch (error: any) {
    dispatch({
      type: types.TICKET_DELETE_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
    return false;
  }
};
