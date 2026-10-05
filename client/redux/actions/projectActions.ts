import { storeType } from './../configureStore';
import SERVER_URL from '@/core/data/backend';
import * as types from '@/redux/constants/projectConstants';
import axios from 'axios';
import { DispatchType } from '@/redux/types';
import generateConfig from './config/axios';

export const fetchProjects =
  () => async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_LIST_REQUEST,
      });

      const { data } = await axios.get(
        `${SERVER_URL}/projects`,
        generateConfig()
      );

      dispatch({
        type: types.PROJECT_LIST_SUCCESS,
        payload: {
          ...data,
          userId: getState().currentUser.user?._id,
        },
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_LIST_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const fetchProjectById =
  (id: string) => async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_DETAILS_REQUEST,
      });

      const { data } = await axios.get(`${SERVER_URL}/projects/${id}`, generateConfig());

      dispatch({
        type: types.PROJECT_DETAILS_SUCCESS,
        payload: data,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_DETAILS_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const createProject =
  (project: any) =>
    async (dispatch: DispatchType) => {
      try {
        dispatch({
          type: types.PROJECT_CREATE_REQUEST,
        });

        const { data } = await axios.post(
          `${SERVER_URL}/projects`,
          project,
          generateConfig()
        );

        dispatch({
          type: types.PROJECT_CREATE_SUCCESS,
          payload: data,
        });
        return true;
      } catch (error: any) {
        dispatch({
          type: types.PROJECT_CREATE_FAIL,
          payload: error.response?.data ? error.response.data : error.error,
        });
        return false;
      }
    };

export const updateProject =
  ({ id, project }: { id: string; project: any }) =>
    async (dispatch: DispatchType, getState: () => storeType) => {
      try {
        dispatch({
          type: types.PROJECT_UPDATE_REQUEST,
        });

        const { data } = await axios.put(
          `${SERVER_URL}/projects/${id}`,
          project,
          generateConfig()
        );

        dispatch({
          type: types.PROJECT_UPDATE_SUCCESS,
          payload: data,
        });
        return true;
      } catch (error: any) {
        dispatch({
          type: types.PROJECT_UPDATE_FAIL,
          payload: error.response?.data ? error.response.data : error.error,
        });
        return false;
      }
    };

export const deleteProject =
  (id: string) => async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_DELETE_REQUEST,
      });
      await axios.delete(`${SERVER_URL}/projects/${id}`, generateConfig());

      dispatch({
        type: types.PROJECT_DELETE_SUCCESS,
        payload: id,
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_DELETE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const inviteToProject = (id: string, invitees: {
  _id: string;
  email: string;
}[]) =>
  async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_INVITE_REQUEST,
      });

      const { data } = await axios.put(
        `${SERVER_URL}/projects/${id}/invite`,
        { invitees },
        generateConfig()
      );

      dispatch({
        type: types.PROJECT_INVITE_SUCCESS,
        payload: data
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_INVITE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const acceptInvite = (id: string) =>
  async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_REQUEST,
      });

      const { data } = await axios.put(
        `${SERVER_URL}/projects/${id}/accept-invite`,
        {},
        generateConfig()
      );

      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_SUCCESS,
        payload: { ...data, projectId: id }
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };

export const declineInvite = (id: string) =>
  async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_DECLINE_INVITE_REQUEST,
      });

      await axios.put(
        `${SERVER_URL}/projects/${id}/decline-invite`,
        {},
        generateConfig()
      );

      dispatch({
        type: types.PROJECT_DECLINE_INVITE_SUCCESS,
        payload: { projectId: id }
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_DECLINE_INVITE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
      return false;
    }
  };
