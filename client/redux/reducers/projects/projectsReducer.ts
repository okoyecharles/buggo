import { ActionType } from "../../types";
import * as types from "../../constants/projectConstants";
import * as userTypes from "../../constants/userConstants";
import { Project } from "./types";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: { messsage: string } | null;
  method: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
};

const initialState = {
  projects: [],
  loading: false,
  error: null,
  method: {
    list: false,
    create: false,
    update: false,
    delete: false
  }
};

const projectsReducer = (state: ProjectsState = initialState, action: ActionType): ProjectsState => {
  const { type, payload } = action;

  switch (type) {
    // Get all projects
    case types.PROJECT_LIST_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, list: true } };
    case types.PROJECT_LIST_SUCCESS:
      return { ...state, error: null, loading: false, method: { ...state.method, list: false }, ...payload };
    case types.PROJECT_LIST_FAIL:
      return { ...state, loading: false, method: { ...state.method, list: false }, error: payload };

    // Create a new project
    case types.PROJECT_CREATE_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, create: true } };
    case types.PROJECT_CREATE_SUCCESS:
      return { ...state, error: null, loading: false, method: { ...state.method, create: false }, projects: [payload.project, ...state.projects] };
    case types.PROJECT_CREATE_FAIL:
      return { ...state, loading: false, method: { ...state.method, create: false }, error: payload };

    // Delete a project
    case types.PROJECT_DELETE_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, delete: true } };
    case types.PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        projects: state.projects.filter((project) => project._id !== payload),
        method: { ...state.method, delete: false }
      };
    case types.PROJECT_DELETE_FAIL:
      return { ...state, loading: false, error: payload, method: { ...state.method, delete: false } };

    // Update a project
    // Assign team members to a project and Change title of a project
    case types.PROJECT_UPDATE_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, update: true } };
    case types.PROJECT_UPDATE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        projects: state.projects.map((project) => {
          if (project._id === payload.project._id) {
            return payload.project;
          }
          return project;
        }),
        method: { ...state.method, update: false }
      };
    case types.PROJECT_UPDATE_FAIL:
      return { ...state, loading: false, error: payload, method: { ...state.method, update: false } };

    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default projectsReducer;
