import { ActionType } from "../../types";
import * as types from "../../constants/ticketConstants";
import * as userTypes from "../../constants/userConstants";
import Ticket from "./types";

interface TicketState {
  ticket: Ticket | null;
  loading: boolean;
  error: { messsage: string } | null;
};

const initialState = {
  ticket: null,
  loading: false,
  error: null,
};

const ticketReducer = (state: TicketState = initialState, action: ActionType): TicketState => {
  const { type, payload } = action;

  switch (type) {
    // Get details of a ticket
    case types.TICKET_DETAILS_REQUEST:
      return { ...initialState, loading: true, error: null };
    case types.TICKET_DETAILS_SUCCESS:
      return { ...state, loading: false, error: null, ...payload };
    case types.TICKET_DETAILS_FAIL:
      return { ...state, loading: false, error: payload };
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}


export default ticketReducer;