import { ActionType } from "@/redux/types";
import * as types from "@/redux/types/project";
import * as userTypes from "@/redux/types/user";
import * as ticketTypes from "@/redux/types/ticket";
import { Project } from "@/core/types/models";

export type ProjectState = {
  project: Project | null;
  error: { messsage: string } | null;
  pending: {
    createTicket: boolean;
    details: boolean;
    update: boolean;
    delete: boolean;
    acceptInvite: boolean;
    declineInvite: boolean;
  };
};

const initialState: ProjectState = {
  project: null,
  error: null,
  pending: {
    createTicket: false,
    details: false,
    update: false,
    delete: false,
    acceptInvite: false,
    declineInvite: false
  },
};

const projectReducer = (state: ProjectState = initialState, action: ActionType): ProjectState => {
  const { type, payload } = action;

  switch (type) {
    // Get details of a project
    case types.PROJECT_DETAILS_REQUEST:
      return { ...initialState, pending: { ...initialState.pending, details: true } };
    case types.PROJECT_DETAILS_SUCCESS:
      return { ...state, pending: { ...state.pending, details: false }, ...payload };
    case types.PROJECT_DETAILS_FAIL:
      return { ...state, error: payload, pending: { ...state.pending, details: false } };







    // Delete a project
    case types.PROJECT_DELETE_REQUEST:
      return {
        ...state, error: null, pending: {
          ...state.pending,
          delete: true
        }
      };
    case types.PROJECT_DELETE_SUCCESS:
      // A member deleting some other project must not clear the open one.
      if (state.project && state.project._id !== payload)
        return { ...state, pending: { ...state.pending, delete: false } };
      return { ...initialState };
    case types.PROJECT_DELETE_FAIL:
      return {
        ...state, error: payload, pending: {
          ...state.pending,
          delete: false
        }
      };






    case types.PROJECT_INVITE_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, update: true } };
    case types.PROJECT_INVITE_SUCCESS:
      {
        const project = payload.project._id === state.project?._id ? payload.project : state.project;

        return {
          ...state, error: null, pending: { ...state.pending, update: false }, project
        };
      }
    case types.PROJECT_INVITE_FAIL:
      return { ...state, error: payload, pending: { ...state.pending, update: false } };







    case types.PROJECT_ACCEPT_INVITE_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, acceptInvite: true } };
    case types.PROJECT_ACCEPT_INVITE_SUCCESS:
      {
        const project = payload.project._id === state.project?._id ? payload.project : state.project;

        return {
          ...state, error: null, pending: { ...state.pending, acceptInvite: false }, project
        };
      }
    case types.PROJECT_ACCEPT_INVITE_FAIL:
      return { ...state, error: payload, pending: { ...state.pending, acceptInvite: false } };

    case types.PROJECT_DECLINE_INVITE_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, declineInvite: true } };
    case types.PROJECT_DECLINE_INVITE_SUCCESS:
      return {
        ...state, error: null, pending: { ...state.pending, declineInvite: false },
        project: payload.projectId === state.project?._id ? null : state.project
      };
    case types.PROJECT_DECLINE_INVITE_FAIL:
      return { ...state, error: payload, pending: { ...state.pending, declineInvite: false } };






    case types.PROJECT_UPDATE_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, update: true } };
    case types.PROJECT_UPDATE_SUCCESS:
      {
        const project = payload.project._id === state.project?._id ? payload.project : state.project;

        return {
          ...state, error: null, pending: { ...state.pending, update: false }, project
        };
      }
    case types.PROJECT_UPDATE_FAIL:
      return { ...state, error: payload, pending: { ...state.pending, update: false } };



    
    



    case ticketTypes.TICKET_CREATE_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, createTicket: true } };
    case ticketTypes.TICKET_CREATE_SUCCESS:
      if (!state.project || state.project._id !== payload.ticket.project._id)
        return state;
      return {
        ...state,
        project: {
          ...state.project,
          // Socket delivery can repeat what the request already applied.
          tickets: [
            payload.ticket,
            ...state.project.tickets.filter(
              (ticket) => ticket._id !== payload.ticket._id
            )
          ],
        }, error: null, pending: { ...state.pending, createTicket: false }
      };
    case ticketTypes.TICKET_CREATE_FAIL:
      return { ...state, error: payload, pending: { ...state.pending, createTicket: false } };

      


      

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
                // Socket delivery can repeat what the request already applied.
                comments: [
                  payload.comment._id,
                  ...(ticket.comments as string[]).filter(
                    (commentId) => commentId !== payload.comment._id
                  )
                ]
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

    case types.PROJECT_REMOVED:
      // Only clears the view if it is the project being left behind.
      if (state.project && state.project._id !== payload.projectId) return state;
      return initialState;

    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default projectReducer;
