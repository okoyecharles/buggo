import { ActionType } from "../../types";
import * as types from "../../constants/ticketConstants";
import * as projectTypes from "../../constants/projectConstants";
import * as userTypes from "../../constants/userConstants";
import { Ticket } from "../../../src/types/models";

interface TicketsState {
  tickets: Ticket[];
  loading: boolean;
  error: { messsage: string } | null;
};

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const ticketsReducer = (state: TicketsState = initialState, action: ActionType): TicketsState => {
  const { type, payload } = action;

  switch (type) {
    case types.TICKET_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case types.TICKET_LIST_SUCCESS:
      return { ...state, loading: false, ...payload, error: null };
    case types.TICKET_LIST_FAIL:
      return { ...state, loading: false, error: payload };

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
  
    case projectTypes.PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        tickets: state.tickets.filter((ticket) => ticket.project._id !== payload),
      };
    
    case types.TICKET_COMMENT_SUCCESS:
      return {
        ...state,
        tickets: state.tickets.map((ticket) => {
          if (ticket._id === payload.comment.ticket) {
            return {
              ...ticket,
              comments: [...ticket.comments, payload.comment._id],
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