import { ActionType } from "@/redux/types";
import * as types from "@/redux/constants/ticketConstants";
import * as userTypes from "@/redux/constants/userConstants";
import { Comment, Ticket } from "@/core/types/models";

export interface TicketState {
  ticket: Ticket | null;
  error: { messsage: string } | null;
  pending: {
    details: boolean;
    update: boolean;
    comment: boolean;
    delete: boolean;
  }
};

const initialState: TicketState = {
  ticket: null,
  error: null,
  pending: {
    details: false,
    update: false,
    comment: false,
    delete: false,
  }
};

const ticketReducer = (state: TicketState = initialState, action: ActionType): TicketState => {
  const { type, payload } = action;

  switch (type) {
    // Get details of a ticket
    case types.TICKET_DETAILS_REQUEST:
      return {
        ...initialState, error: null, pending: {
          ...initialState.pending,
          details: true,
        }
      };
    case types.TICKET_DETAILS_SUCCESS:
      return {
        ...state, error: null, pending: {
          ...state.pending,
          details: false,
        }, ...payload
      };
    case types.TICKET_DETAILS_FAIL:
      return {
        ...state, error: payload, pending: {
          ...state.pending,
          details: false,
        }
      };

    case types.TICKET_UPDATE_REQUEST:
      return {
        ...state, error: null, pending: {
          ...state.pending,
          update: true
        }
      };
    case types.TICKET_UPDATE_SUCCESS:
      return {
        ...state, error: null, pending: {
          ...state.pending,
          update: false,
        },
        // Updates to other tickets (from the list or a socket) must not
        // replace the open one.
        ticket: state.ticket?._id === payload.ticket._id ? payload.ticket : state.ticket
      };
    case types.TICKET_UPDATE_FAIL:
      return {
        ...state, error: payload, pending: {
          ...state.pending,
          update: false,
        }
      };

    case types.TICKET_COMMENT_REQUEST:
      return {
        ...state, error: null, pending: {
          ...state.pending,
          comment: true
        }
      };
    case types.TICKET_COMMENT_SUCCESS:
      if (!state.ticket) return state;
      if (payload.ticketId && state.ticket._id !== payload.ticketId) return state;

      return {
        ...state, error: null, pending: {
          ...state.pending,
          comment: false,
        }, ticket: {
          ...state.ticket,
          // Socket delivery can repeat what the request already applied.
          comments: [
            ...(state.ticket.comments as Comment[]).filter(
              (comment) => comment._id !== payload.comment._id
            ),
            payload.comment,
          ].sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          })
        }
      };
    case types.TICKET_COMMENT_FAIL:
      return {
        ...state, error: payload, pending: {
          ...state.pending,
          comment: false,
        }
      };

    case types.TICKET_DELETE_REQUEST:
      return {
        ...state, error: null, pending: {
          ...state.pending,
          delete: true
        }
      };
    case types.TICKET_DELETE_SUCCESS:
      // A member deleting some other ticket must not clear the open one.
      if (state.ticket && state.ticket._id !== payload.ticketId)
        return { ...state, pending: { ...state.pending, delete: false } };
      return initialState;
    case types.TICKET_DELETE_FAIL:
      return {
        ...state, error: payload, pending: {
          ...state.pending,
          delete: false,
        }
      };

    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}


export default ticketReducer;
