
import { ActionType } from "../../types";
import * as types from "../../constants/ticketConstants";
import * as userTypes from "../../constants/userConstants";
import { Ticket } from "../../../types/models";

interface TicketState {
  ticket: Ticket | null;
  loading: boolean;
  error: { messsage: string } | null;
  method: {
    details: boolean;
    update: boolean;
    comment: boolean;
  }
};

const initialState = {
  ticket: null,
  loading: false,
  error: null,
  method: {
    details: false,
    update: false,
    comment: false,
  }
};

const ticketReducer = (state: TicketState = initialState, action: ActionType): TicketState => {
  const { type, payload } = action;

  switch (type) {
    // Get details of a ticket
    case types.TICKET_DETAILS_REQUEST:
      return {
        ...initialState, loading: true, error: null, method: {
          ...state.method,
          details: true,
        }
      };
    case types.TICKET_DETAILS_SUCCESS:
      return {
        ...state, loading: false, error: null, method: {
          ...state.method,
          details: false,
        }, ...payload
      };
    case types.TICKET_DETAILS_FAIL:
      return {
        ...state, loading: false, error: payload, method: {
          ...state.method,
          details: false,
        }
      };

    case types.TICKET_UPDATE_REQUEST:
      return {
        ...state, loading: true, error: null, method: {
          ...state.method,
          update: true
        }
      };
    case types.TICKET_UPDATE_SUCCESS:
      return {
        ...state, loading: false, error: null, method: {
          ...state.method,
          update: false,
        }, ...payload
      };
    case types.TICKET_UPDATE_FAIL:
      return {
        ...state, loading: false, error: payload, method: {
          ...state.method,
          update: false,
        }
      };
    
    case types.TICKET_COMMENT_REQUEST:
      return {
        ...state, loading: true, error: null, method: {
          ...state.method,
          comment: true
        }
      };
    case types.TICKET_COMMENT_SUCCESS:
      if (!state.ticket) return state;

      const createdComment = payload.comment.ticket === state.ticket?._id ? payload.comment : {};
      return {
        ...state, loading: false, error: null, method: {
          ...state.method,
          comment: false,
        }, ticket: {
          ...state.ticket,
          comments: [...state.ticket.comments, createdComment]
        }
      };
    case types.TICKET_COMMENT_FAIL:
      return {
        ...state, loading: false, error: payload, method: {
          ...state.method,
          comment: false,
        }
      };

    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}


export default ticketReducer;