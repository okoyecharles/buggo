import { Project } from '../../types/models';
import store, { storeType } from './../configureStore';
import BACKEND_URL from '../../config/Backend';
import * as types from '../constants/projectConstants';
import axios, { AxiosRequestConfig } from 'axios';
import { DispatchType } from '../types';
import generateConfig from './config/axios';

export const fetchProjects =
  () => async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_LIST_REQUEST,
      });

      const { data } = await axios.get(
        `${BACKEND_URL}/projects`,
        generateConfig()
      );

      dispatch({
        type: types.PROJECT_LIST_SUCCESS,
        payload: data,
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

      const { data } = await axios.get(`${BACKEND_URL}/projects/${id}`, generateConfig());

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
        const { data } = await axios.post(
          `${BACKEND_URL}/projects`,
          project,
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
        const { data } = await axios.put(
          `${BACKEND_URL}/projects/${id}`,
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
  const currentUser = store.getState().currentUser;

  const { data } = await axios.get(
    `${BACKEND_URL}/projects/${project._id}/team`,
    generateConfig()
  );
  return data.team;
};

export const deleteProject =
  (id: string) => async (dispatch: DispatchType, getState: () => storeType) => {
    try {
      dispatch({
        type: types.PROJECT_DELETE_REQUEST,
      });
      await axios.delete(`${BACKEND_URL}/projects/${id}`, generateConfig());

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
