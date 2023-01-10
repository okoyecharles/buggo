import { ActionType } from "../../types";
import * as types from "../../constants/projectConstants";
import * as userTypes from "../../constants/userConstants";
import { Project } from "./types";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: { messsage: string } | null;
};

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectsReducer = (state: ProjectsState = initialState, action: ActionType): ProjectsState => {
  const { type, payload } = action;

  switch (type) {
    // Get all projects
    case types.PROJECT_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case types.PROJECT_LIST_SUCCESS:
      return { ...state, error: null, loading: false, ...payload };
    case types.PROJECT_LIST_FAIL:
      return { ...state, loading: false, error: payload };

    // Create a new project
    case types.PROJECT_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.PROJECT_CREATE_SUCCESS:
      return { ...state, error: null, loading: false, projects: [payload.project, ...state.projects] };
    case types.PROJECT_CREATE_FAIL:
      return { ...state, loading: false, error: payload };

    // Delete a project
    case types.PROJECT_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        projects: state.projects.filter((project) => project._id !== payload)
      };
    case types.PROJECT_DELETE_FAIL:
      return { ...state, loading: false, error: payload };

    // Update a project
    // Assign team members to a project and Change title of a project
    case types.PROJECT_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.PROJECT_UPDATE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        projects: state.projects.map((project) => {
          if (project._id === payload._id) {
            return payload;
          }
          return project;
        })
      };
    case types.PROJECT_UPDATE_FAIL:
      return { ...state, loading: false, error: payload };
    
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default projectsReducer;
