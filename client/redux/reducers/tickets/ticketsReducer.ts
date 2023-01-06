import { ActionType } from "../../types";
import { TICKET_LIST_FAIL, TICKET_LIST_REQUEST, TICKET_LIST_SUCCESS } from "../../constants/ticketConstants";

type Ticket = {
  _id: string;
  title: string;
  description: string; 
  status: string;
  priority: string;
  type: string;
  time_estimate: number;
  project: string;
};

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
    case TICKET_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case TICKET_LIST_SUCCESS:
      return { ...state, loading: false, ...payload, error: null };
    case TICKET_LIST_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
}

export default ticketsReducer;