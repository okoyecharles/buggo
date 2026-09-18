import { Notification, NotificationType } from "../../../src/types/models";
import { ActionType } from "../../types";
import * as types from "../../constants/notificationConstants";
import * as projectTypes from "../../constants/projectConstants";
import * as userTypes from "../../constants/userConstants";

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: { message: string } | null;
  method: {
    list: boolean;
    read: boolean;
    readAll: boolean;
    delete: boolean;
  };
};

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  method: {
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
      return { ...state, loading: true, error: null, method: { ...state.method, list: true } };
    case types.NOTIFICATION_LIST_SUCCESS:
      return { ...state, error: null, loading: false, method: { ...state.method, list: false }, notifications: payload.notifications };
    case types.NOTIFICATION_LIST_FAIL:
      return { ...state, loading: false, method: { ...state.method, list: false }, error: payload };

    // Mark a single notification as read
    case types.NOTIFICATION_READ_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, read: true } };
    case types.NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        notifications: state.notifications.map((notification) => {
          if (notification._id === payload.notification._id) {
            return payload.notification;
          }
          return notification;
        }),
        method: { ...state.method, read: false }
      };
    case types.NOTIFICATION_READ_FAIL:
      return { ...state, loading: false, method: { ...state.method, read: false }, error: payload };

    // Mark every notification as read
    case types.NOTIFICATION_READ_ALL_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, readAll: true } };
    case types.NOTIFICATION_READ_ALL_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
        method: { ...state.method, readAll: false }
      };
    case types.NOTIFICATION_READ_ALL_FAIL:
      return { ...state, loading: false, method: { ...state.method, readAll: false }, error: payload };

    // Dismiss a notification
    case types.NOTIFICATION_DELETE_REQUEST:
      return { ...state, loading: true, error: null, method: { ...state.method, delete: true } };
    case types.NOTIFICATION_DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        notifications: state.notifications.filter(
          (notification) => notification._id !== payload.notificationId
        ),
        method: { ...state.method, delete: false }
      };
    case types.NOTIFICATION_DELETE_FAIL:
      return { ...state, loading: false, method: { ...state.method, delete: false }, error: payload };

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
