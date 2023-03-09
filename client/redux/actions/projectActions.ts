import { toast } from 'react-toastify';
import { storeType } from './../configureStore';
import SERVER_URL from '../../src/data/backend-config';
import * as types from '../constants/projectConstants';
import axios from 'axios';
import { DispatchType } from '../types';
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
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_LIST_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
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
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_DETAILS_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
    }
  };

export const createProject =
  (project: any) =>
    async (dispatch: DispatchType, getState: () => storeType) => {
      try {
        dispatch({
          type: types.PROJECT_CREATE_REQUEST,
        });

        const socketId = getState().pusher.socket;
        const { data } = await axios.post(
          `${SERVER_URL}/projects`,
          project,
          generateConfig(socketId || '')
        );
        toast.success('Project created successfully');

        dispatch({
          type: types.PROJECT_CREATE_SUCCESS,
          payload: data,
        });
      } catch (error: any) {
        dispatch({
          type: types.PROJECT_CREATE_FAIL,
          payload: error.response?.data ? error.response.data : error.error,
        });
      }
    };

export const pusherCreateProject = (projectId: string) => async (
  dispatch: DispatchType
) => {
  try {
    const { data } = await axios.get(
      `${SERVER_URL}/projects/${projectId}`,
      generateConfig()
    );

    dispatch({
      type: types.PROJECT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.PROJECT_CREATE_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};

export const updateProject =
  ({ id, project }: { id: string; project: any }) =>
    async (dispatch: DispatchType, getState: () => storeType) => {
      try {
        dispatch({
          type: types.PROJECT_UPDATE_REQUEST,
        });

        const socketId = getState().pusher.socket;
        const { data } = await axios.put(
          `${SERVER_URL}/projects/${id}`,
          project,
          generateConfig(socketId || '')
        );

        dispatch({
          type: types.PROJECT_UPDATE_SUCCESS,
          payload: data,
        });
      } catch (error: any) {
        dispatch({
          type: types.PROJECT_UPDATE_FAIL,
          payload: error.response?.data ? error.response.data : error.error,
        });
      }
    };

export const pusherUpdateProject = (projectId: string) => async (
  dispatch: DispatchType, getState: () => storeType
) => {
  try {
    const { data } = await axios.get(
      `${SERVER_URL}/projects/${projectId}`,
      generateConfig()
    );

    dispatch({
      type: types.PROJECT_UPDATE_SUCCESS,
      payload: {
        ...data,
        userId: getState().currentUser.user?._id
      },
    });
  } catch (error: any) {
    dispatch({
      type: types.PROJECT_UPDATE_FAIL,
      payload: error.response?.data ? error.response.data : error.error,
    });
  }
};

export const deleteProject =
  (id: string) => async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_DELETE_REQUEST,
      });
      const socketId = getState().pusher.socket;
      await axios.delete(`${SERVER_URL}/projects/${id}`, generateConfig(socketId || ""));
      toast.success("Project deleted successfully");

      dispatch({
        type: types.PROJECT_DELETE_SUCCESS,
        payload: id,
      });
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_DELETE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
    }
  };

export const pusherDeleteProject = (projectId: string) => {
  return {
    type: types.PROJECT_DELETE_SUCCESS,
    payload: projectId,
  };
}

export const inviteToProject = (id: string, invitees: {
  _id: string;
  email: string;
}[]) =>
  async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_INVITE_REQUEST,
      });

      const socketId = getState().pusher.socket;
      const { data } = await axios.put(
        `${SERVER_URL}/projects/${id}/invite`,
        { invitees },
        generateConfig(socketId || '')
      );
      toast.success("Members invited successfully");

      dispatch({
        type: types.PROJECT_INVITE_SUCCESS,
        payload: data
      });
    } catch (error: any) {
      dispatch({
        type: types.PROJECT_INVITE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
    }
  };

export const acceptInvite = (id: string) =>
  async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_REQUEST,
      });

      const socketId = getState().pusher.socket;
      const { data } = await axios.put(
        `${SERVER_URL}/projects/${id}/accept-invite`,
        {},
        generateConfig(socketId || '')
      );
      toast.success("Invitation accepted successfully");

      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_SUCCESS,
        payload: data
      });
    } catch (error: any) {
      toast.error("Couldn't accept invite");
      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
    }
  };
