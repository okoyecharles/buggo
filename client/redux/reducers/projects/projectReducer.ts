import { ActionType } from "../../types";
import * as types from "../../constants/projectConstants";
import * as userTypes from "../../constants/userConstants";
import { Project } from "./types";

type ProjectsState = {
  project: Project | null;
  loading: boolean;
  error: { messsage: string } | null;
};

const initialState = {
  project: null,
  loading: false,
  error: null,
};

const projectReducer = (state: ProjectsState = initialState, action: ActionType): ProjectsState => {
  const { type, payload } = action;

  switch (type) {
    // Get details of a project
    case types.PROJECT_DETAILS_REQUEST:
      return { ...initialState, loading: true };
    case types.PROJECT_DETAILS_SUCCESS:
      return { ...state, loading: false, ...payload };
    case types.PROJECT_DETAILS_FAIL:
      return { ...state, loading: false, error: payload };

    // Delete a project
    case types.PROJECT_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.PROJECT_DELETE_SUCCESS:
      return { ...initialState };
    case types.PROJECT_DELETE_FAIL:
      return { ...state, loading: false, error: payload };
    
    // Update a project
    // Assign team members to a project and Change title of a project
    case types.PROJECT_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.PROJECT_UPDATE_SUCCESS:
      return { ...state, loading: false, ...payload, error: null };
    case types.PROJECT_UPDATE_FAIL:
      return { ...state, loading: false, error: payload };
    
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default projectReducer;