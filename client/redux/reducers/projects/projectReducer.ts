import { ActionType } from "../../types";
import * as types from "../../constants/projectConstants";
import * as userTypes from "../../constants/userConstants";
import * as ticketTypes from "../../constants/ticketConstants";
import { Project } from "../../../src/types/models";

type ProjectsState = {
  project: Project | null;
  loading: boolean;
  error: { messsage: string } | null;
  method: {
    createTicket: boolean;
    details: boolean;
    update: boolean;
    delete: boolean;
    acceptInvite: boolean;
  };
};

const initialState = {
  project: null,
  loading: false,
  error: null,
  method: {
    createTicket: false,
    details: false,
    update: false,
    delete: false,
    acceptInvite: false
  },
};

const projectReducer = (state: ProjectsState = initialState, action: ActionType): ProjectsState => {
  const { type, payload } = action;

  switch (type) {
    // Get details of a project
    case types.PROJECT_DETAILS_REQUEST:
      return { ...initialState, loading: true, method: { ...state.method, details: true } };
    case types.PROJECT_DETAILS_SUCCESS:
      return { ...state, loading: false, method: { ...state.method, details: false }, ...payload };
    case types.PROJECT_DETAILS_FAIL:
      return { ...state, loading: false, error: payload, method: { ...state.method, details: false } };







    // Delete a project
    case types.PROJECT_DELETE_REQUEST:
      return {
        ...state, loading: true, error: null, method: {
          ...state.method,
          delete: true
        }
      };
    case types.PROJECT_DELETE_SUCCESS:
      return { ...initialState };
    case types.PROJECT_DELETE_FAIL:
      return {
        ...state, loading: false, error: payload, method: {
          ...state.method,
          delete: false
        }
      };






    case types.PROJECT_INVITE_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, update: true } };
    case types.PROJECT_INVITE_SUCCESS:
      {
        const project = payload.project._id === state.project?._id ? payload.project : state.project;

        return {
          ...state, loading: false, error: null, method: { ...state.method, update: false }, project
        };
      }
    case types.PROJECT_INVITE_FAIL:
      return { ...state, loading: false, error: payload, method: { ...state.method, update: false } };







    case types.PROJECT_ACCEPT_INVITE_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, acceptInvite: true } };
    case types.PROJECT_ACCEPT_INVITE_SUCCESS:
      const project = payload.project._id === state.project?._id ? payload.project : state.project;

      return {
        ...state, loading: false, error: null, method: { ...state.method, acceptInvite: false }, project
      };
    case types.PROJECT_ACCEPT_INVITE_FAIL:
      return { ...state, loading: false, error: payload, method: { ...state.method, acceptInvite: false } };






    case types.PROJECT_UPDATE_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, update: true } };
    case types.PROJECT_UPDATE_SUCCESS:
      {
        const project = payload.project._id === state.project?._id ? payload.project : state.project;

        return {
          ...state, loading: false, error: null, method: { ...state.method, update: false }, project
        };
      }
    case types.PROJECT_UPDATE_FAIL:
      return { ...state, loading: false, error: payload, method: { ...state.method, update: false } };



    
    



    case ticketTypes.TICKET_CREATE_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, createTicket: true } };
    case ticketTypes.TICKET_CREATE_SUCCESS:
      if (!state.project || state.project._id !== payload.ticket.project) return state;
      return {
        project: {
          ...state.project,
          tickets: [payload.ticket, ...state.project?.tickets],
        }, loading: false, error: null, method: { ...state.method, createTicket: false }
      };
    case ticketTypes.TICKET_CREATE_FAIL:
      return { ...state, loading: false, error: payload, method: { ...state.method, createTicket: false } };

      


      

    case ticketTypes.TICKET_UPDATE_SUCCESS:
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          tickets: state.project.tickets.map(ticket => {
            if (ticket._id === payload.ticket._id) {
              return {
                ...payload.ticket,
                author: payload.ticket.author._id
              };
            }
            return ticket;
          })
        }
      }

    case ticketTypes.TICKET_COMMENT_SUCCESS:
      if (!state.project) return state;

      return {
        ...state,
        project: {
          ...state.project,
          tickets: state.project.tickets.map(ticket => {
            if (ticket._id === payload.comment.ticket) {
              return {
                ...ticket,
                comments: [payload.comment._id, ...ticket.comments]
              }
            }
            return ticket;
          })
        }
      };

    case ticketTypes.TICKET_DELETE_SUCCESS:
      if (!state.project) return state;

      return {
        ...state,
        project: {
          ...state.project,
          tickets: state.project.tickets.filter(ticket => ticket._id !== payload.ticketId)
        }
      };

    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default projectReducer;