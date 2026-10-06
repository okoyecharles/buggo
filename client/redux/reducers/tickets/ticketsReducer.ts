import { ActionType } from "@/redux/types";
import * as types from "@/redux/constants/ticketConstants";
import * as projectTypes from "@/redux/constants/projectConstants";
import * as userTypes from "@/redux/constants/userConstants";
import { Ticket } from "@/core/types/models";

export interface TicketsState {
  tickets: Ticket[];
  pending: {
    list: boolean;
  };
  error: { messsage: string } | null;
};

const initialState: TicketsState = {
  tickets: [],
  pending: {
    list: false,
  },
  error: null,
};

const ticketsReducer = (state: TicketsState = initialState, action: ActionType): TicketsState => {
  const { type, payload } = action;

  switch (type) {
    case types.TICKET_LIST_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, list: true } };
    case types.TICKET_LIST_SUCCESS:
      return { ...state, ...payload, error: null, pending: { ...state.pending, list: false } };
    case types.TICKET_LIST_FAIL:
      return { ...state, error: payload, pending: { ...state.pending, list: false } };

    case types.TICKET_CREATE_SUCCESS:
      // Every project member is sent a creation, but this list is the user's
      // own tickets, so keep only the ones they authored.
      if (payload.ticket.author !== payload.userId) return state;
      return {
        ...state,
        tickets: [
          payload.ticket,
          ...state.tickets.filter((ticket) => ticket._id !== payload.ticket._id)
        ],
      };

    case types.TICKET_UPDATE_SUCCESS:
      return {
        ...state,
        tickets: state.tickets.map((ticket) => {
          if (ticket._id === payload.ticket._id) {
            return payload.ticket;
          }
          return ticket;
        }),
      };
    
    case types.TICKET_DELETE_SUCCESS:
      return {
        ...state,
        tickets: state.tickets.filter((ticket) => ticket._id !== payload.ticketId),
      };
  
    case projectTypes.PROJECT_REMOVED:
      return {
        ...state,
        tickets: state.tickets.filter(
          (ticket) => ticket.project._id !== payload.projectId
        ),
      };

    case projectTypes.PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        tickets: state.tickets.filter((ticket) => ticket.project && ticket.project._id !== payload),
      };
    
    case types.TICKET_COMMENT_SUCCESS:
      return {
        ...state,
        tickets: state.tickets.map((ticket) => {
          if (ticket._id === payload.comment.ticket) {
            return {
              ...ticket,
              // Socket delivery can repeat what the request already applied.
              comments: [
                ...ticket.comments.filter(
                  (commentId) => commentId !== payload.comment._id
                ),
                payload.comment._id,
              ],
            };
          }
          return ticket;
        }),
      };

    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default ticketsReducer;
