import { Socket } from "socket.io-client";
import store from "@/redux/configureStore";
import * as projectTypes from "@/redux/constants/projectConstants";
import * as ticketTypes from "@/redux/constants/ticketConstants";
import * as notificationTypes from "@/redux/constants/notificationConstants";
import { handleAccountDeleted } from "@/redux/actions/userActions";

/*
 * Every event carries the record it changed, so these are plain dispatches --
 * the reducers already know how to fold them in and nothing is refetched.
 */
const bindSocketEvents = (socket: Socket) => {
  // Reaches admins only, who are sent every project whether they belong to
  // it or not. The author already has it from their own response.
  socket.on("project:create", (payload) => {
    store.dispatch({ type: projectTypes.PROJECT_CREATE_SUCCESS, payload });
  });

  socket.on("project:update", (payload) => {
    store.dispatch({ type: projectTypes.PROJECT_UPDATE_SUCCESS, payload });
  });

  socket.on("project:invite", (payload) => {
    store.dispatch({ type: projectTypes.PROJECT_INVITE_SUCCESS, payload });
  });

  socket.on("project:accept-invite", (payload) => {
    store.dispatch({
      type: projectTypes.PROJECT_ACCEPT_INVITE_SUCCESS,
      payload,
    });
  });

  // This is the one reducer keyed off a bare id rather than an object.
  socket.on("project:delete", (projectId) => {
    store.dispatch({
      type: projectTypes.PROJECT_DELETE_SUCCESS,
      payload: projectId,
    });
  });

  // Sent to the removed member's own room -- the project room no longer
  // reaches them by the time this arrives.
  socket.on("project:removed", (payload) => {
    store.dispatch({ type: projectTypes.PROJECT_REMOVED, payload });
  });

  socket.on("ticket:create", (payload) => {
    // The my-tickets list holds only the user's own tickets, so its reducer
    // has to be told who they are.
    store.dispatch({
      type: ticketTypes.TICKET_CREATE_SUCCESS,
      payload: { ...payload, userId: store.getState().currentUser.user?._id },
    });
  });

  socket.on("ticket:update", (payload) => {
    store.dispatch({ type: ticketTypes.TICKET_UPDATE_SUCCESS, payload });
  });

  socket.on("ticket:delete", (payload) => {
    store.dispatch({ type: ticketTypes.TICKET_DELETE_SUCCESS, payload });
  });

  socket.on("ticket:comment", (payload) => {
    store.dispatch({ type: ticketTypes.TICKET_COMMENT_SUCCESS, payload });
  });

  socket.on("notification:create", (payload) => {
    store.dispatch({
      type: notificationTypes.NOTIFICATION_RECEIVE,
      payload,
    });
  });

  // Sent to the deleted account's own room, so it only ever reaches them.
  socket.on("user:delete", ({ userId }) => {
    handleAccountDeleted(userId);
  });
};

export default bindSocketEvents;
