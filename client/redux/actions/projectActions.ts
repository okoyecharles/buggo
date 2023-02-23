import { toast } from 'react-toastify';
import { Project } from '../../types/models';
import { storeType } from './../configureStore';
import SERVER_URL from '../../config/Backend';
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

      const currentUser = getState().currentUser;
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

export const updateProject =
  ({ id, project }: { id: string; project: any }) =>
    async (dispatch: DispatchType) => {
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
      } catch (error: any) {
        dispatch({
          type: types.PROJECT_UPDATE_FAIL,
          payload: error.response?.data ? error.response.data : error.error,
        });
      }
    };


export const getProjectTeamIds = async (project: Project) => {
  const { data } = await axios.get(
    `${SERVER_URL}/projects/${project._id}/team`,
    generateConfig()
  );
  return data.team;
};

export const deleteProject =
  (id: string) => async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.PROJECT_DELETE_REQUEST,
      });
      await axios.delete(`${SERVER_URL}/projects/${id}`, generateConfig());
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

export const inviteToProject = (id: string, invitees: {
  _id: string;
  email: string;
}[]) =>
  async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.PROJECT_INVITE_REQUEST,
      });
      const { data } = await axios.put(
        `${SERVER_URL}/projects/${id}/invite`,
        { invitees },
        generateConfig()
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
  async (dispatch: DispatchType) => {
    try {
      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_REQUEST,
      });
      const { data } = await axios.put(
        `${SERVER_URL}/projects/${id}/accept-invite`,
        {},
        generateConfig()
      );
      toast.success("Invitation accepted successfully");

      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_SUCCESS,
        payload: data
      });
    } catch (error: any) {
      console.log('Errrrrrooooorrrr!!!!! =?', error)
      toast.error("Error accepting invite");
      dispatch({
        type: types.PROJECT_ACCEPT_INVITE_FAIL,
        payload: error.response?.data ? error.response.data : error.error,
      });
    }
  };
