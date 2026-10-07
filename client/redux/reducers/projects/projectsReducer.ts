import { ActionType } from "@/redux/types";
import * as types from "@/redux/types/project";
import * as userTypes from "@/redux/types/user";
import * as ticketTypes from "@/redux/types/ticket";
import { Project } from "@/core/types/models";

export interface ProjectsState {
  projects: Project[];
  error: { messsage: string } | null;
  pending: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    acceptInvite: boolean;
    declineInvite: boolean;
  };
};

const initialState: ProjectsState = {
  projects: [],
  error: null,
  pending: {
    list: false,
    create: false,
    update: false,
    delete: false,
    acceptInvite: false,
    declineInvite: false,
  },
};

const projectsReducer = (
  state: ProjectsState = initialState,
  action: ActionType,
): ProjectsState => {
  const { type, payload } = action;

  switch (type) {
    // Get all projects
    case types.PROJECT_LIST_REQUEST:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, list: true },
      };
    case types.PROJECT_LIST_SUCCESS:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, list: false },
        projects: payload.projects,
      };
    case types.PROJECT_LIST_FAIL:
      return {
        ...state,
        pending: { ...state.pending, list: false },
        error: payload,
      };

    // Create a new project
    case types.PROJECT_CREATE_REQUEST:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, create: true },
      };
    case types.PROJECT_CREATE_SUCCESS:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, create: false },
        // Socket delivery can repeat what the request already applied.
        projects: [
          payload.project,
          ...state.projects.filter(
            (project) => project._id !== payload.project._id,
          ),
        ],
      };
    case types.PROJECT_CREATE_FAIL:
      return {
        ...state,
        pending: { ...state.pending, create: false },
        error: payload,
      };

    // Delete a project
    case types.PROJECT_DELETE_REQUEST:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, delete: true },
      };
    case types.PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        projects: state.projects.filter((project) => project._id !== payload),
        pending: { ...state.pending, delete: false },
      };
    case types.PROJECT_DELETE_FAIL:
      return {
        ...state,
        error: payload,
        pending: { ...state.pending, delete: false },
      };

    // Update a project
    case types.PROJECT_UPDATE_REQUEST:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, update: true },
      };
    case types.PROJECT_UPDATE_SUCCESS:
      return {
        ...state,
        error: null,
        projects: state.projects.map((project) => {
          if (project._id === payload.project._id) {
            return payload.project;
          }
          return project;
        }),
        pending: { ...state.pending, update: false },
      };
    case types.PROJECT_UPDATE_FAIL:
      return {
        ...state,
        error: payload,
        pending: { ...state.pending, update: false },
      };

    case types.PROJECT_INVITE_REQUEST:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, update: true },
      };
    case types.PROJECT_INVITE_SUCCESS:
      return {
        ...state,
        error: null,
        projects: state.projects.map((project) => {
          if (project._id === payload.project._id) {
            return payload.project;
          }
          return project;
        }),
        pending: { ...state.pending, update: false },
      };
    case types.PROJECT_INVITE_FAIL:
      return {
        ...state,
        error: payload,
        pending: { ...state.pending, update: false },
      };

    case types.PROJECT_ACCEPT_INVITE_REQUEST:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, acceptInvite: true },
      };
    case types.PROJECT_ACCEPT_INVITE_SUCCESS:
      return {
        ...state,
        error: null,
        // Accepting is usually the first time this project reaches the store,
        // since a user is only sent projects they are a part of. Admins are
        // sent every project, so guard against a second copy.
        projects: [
          payload.project,
          ...state.projects.filter(
            (project) => project._id !== payload.project._id,
          ),
        ],
        pending: { ...state.pending, acceptInvite: false },
      };
    case types.PROJECT_ACCEPT_INVITE_FAIL:
      return {
        ...state,
        error: payload,
        pending: { ...state.pending, acceptInvite: false },
      };

    case types.PROJECT_DECLINE_INVITE_REQUEST:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, declineInvite: true },
      };
    /*
     * Declining changes nothing here. An invitee is never sent the project in
     * the first place, and an admin is sent it whether they were invited or
     * not, so there is no copy to drop.
     */
    case types.PROJECT_DECLINE_INVITE_SUCCESS:
      return {
        ...state,
        error: null,
        pending: { ...state.pending, declineInvite: false },
      };
    case types.PROJECT_DECLINE_INVITE_FAIL:
      return {
        ...state,
        error: payload,
        pending: { ...state.pending, declineInvite: false },
      };

    /*
     * The cards show a ticket count, so the list has to track tickets too.
     * Every source populates them, so these are always documents.
     */
    case ticketTypes.TICKET_CREATE_SUCCESS:
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project._id !== payload.ticket.project._id) return project;
          return {
            ...project,
            tickets: [
              payload.ticket,
              ...project.tickets.filter(
                (ticket: any) => ticket._id !== payload.ticket._id,
              ),
            ],
          };
        }),
      };
    case ticketTypes.TICKET_DELETE_SUCCESS:
      return {
        ...state,
        // The payload carries no project, so find the one holding the ticket.
        projects: state.projects.map((project) => {
          const holdsTicket = project.tickets.some(
            (ticket: any) => ticket._id === payload.ticketId,
          );
          if (!holdsTicket) return project;

          return {
            ...project,
            tickets: project.tickets.filter(
              (ticket: any) => ticket._id !== payload.ticketId,
            ),
          };
        }),
      };

    // Losing access is not the project going away, so it only leaves the list
    case types.PROJECT_REMOVED:
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project._id !== payload.projectId
        )
      };

    // Clear state on logout
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default projectsReducer;
