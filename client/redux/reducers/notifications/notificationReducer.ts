import { Notification, NotificationType } from "@/core/types/models";
import { ActionType } from "@/redux/types";
import * as types from "@/redux/types/notification";
import * as projectTypes from "@/redux/types/project";
import * as userTypes from "@/redux/types/user";

export interface NotificationsState {
  notifications: Notification[];
  error: { message: string } | null;
  pending: {
    list: boolean;
    read: boolean;
    readAll: boolean;
    delete: boolean;
  };
};

const initialState: NotificationsState = {
  notifications: [],
  error: null,
  pending: {
    list: false,
    read: false,
    readAll: false,
    delete: false
  }
};

const notificationReducer = (state: NotificationsState = initialState, action: ActionType): NotificationsState => {
  const { type, payload } = action;

  switch (type) {
    // Get all notifications
    case types.NOTIFICATION_LIST_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, list: true } };
    case types.NOTIFICATION_LIST_SUCCESS:
      return { ...state, error: null, pending: { ...state.pending, list: false }, notifications: payload.notifications };
    case types.NOTIFICATION_LIST_FAIL:
      return { ...state, pending: { ...state.pending, list: false }, error: payload };

    // Pushed rather than requested: the server announces each one it writes
    case types.NOTIFICATION_RECEIVE:
      return {
        ...state,
        notifications: [
          payload.notification,
          ...state.notifications.filter(
            (notification) => notification._id !== payload.notification._id
          )
        ]
      };

    // Mark a single notification as read
    case types.NOTIFICATION_READ_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, read: true } };
    case types.NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        error: null,
        notifications: state.notifications.map((notification) => {
          if (notification._id === payload.notification._id) {
            return payload.notification;
          }
          return notification;
        }),
        pending: { ...state.pending, read: false }
      };
    case types.NOTIFICATION_READ_FAIL:
      return { ...state, pending: { ...state.pending, read: false }, error: payload };

    // Mark every notification as read
    case types.NOTIFICATION_READ_ALL_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, readAll: true } };
    case types.NOTIFICATION_READ_ALL_SUCCESS:
      return {
        ...state,
        error: null,
        notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
        pending: { ...state.pending, readAll: false }
      };
    case types.NOTIFICATION_READ_ALL_FAIL:
      return { ...state, pending: { ...state.pending, readAll: false }, error: payload };

    // Dismiss a notification
    case types.NOTIFICATION_DELETE_REQUEST:
      return { ...state, error: null, pending: { ...state.pending, delete: true } };
    case types.NOTIFICATION_DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        notifications: state.notifications.filter(
          (notification) => notification._id !== payload.notificationId
        ),
        pending: { ...state.pending, delete: false }
      };
    case types.NOTIFICATION_DELETE_FAIL:
      return { ...state, pending: { ...state.pending, delete: false }, error: payload };

    // Acting on an invite resolves it server side, so drop its notification
    case projectTypes.PROJECT_ACCEPT_INVITE_SUCCESS:
    case projectTypes.PROJECT_DECLINE_INVITE_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) =>
            !(
              notification.type === NotificationType.PROJECT_INVITE &&
              notification.snapshot.project._id === payload.projectId
            )
        )
      };

    // Clear state on logout
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default notificationReducer;
