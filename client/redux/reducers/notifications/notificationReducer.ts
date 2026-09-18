import {
  Notification,
  NotificationType,
  Project,
} from "../../../src/types/models";
import { ActionType } from "../../types";
import * as projectTypes from "../../constants/projectConstants";
import * as userTypes from "../../constants/userConstants";

type NotificationsState = {
  notifications: Notification[];
};

const initialState = {
  notifications: [],
};

const notificationReducer = (
  state: NotificationsState = initialState,
  action: ActionType,
): NotificationsState => {
  const { type, payload } = action;

  switch (type) {
    case projectTypes.PROJECT_LIST_SUCCESS: {
      // Check for notifications in projects
      const { projects, userId }: { projects: Project[]; userId: string } =
        payload;
      const projectsNotifications: Notification[] = [];

      projects.forEach((project) => {
        // PROJECT_INVITE
        if (project.invitees.length) {
          const invitee = project.invitees.find((i) => i.user._id === userId);

          if (invitee) {
            projectsNotifications.push({
              _id: `${NotificationType.PROJECT_INVITE}-${invitee._id}`,
              type: NotificationType.PROJECT_INVITE,
              date: invitee.createdAt,
              data: { project },
            });
          }
        }
      });

      // Refresh list of notifications
      return {
        ...state,
        notifications: [
          ...projectsNotifications,
          ...state.notifications.filter((n) => !n.data.project),
        ],
      };
    }

    case projectTypes.PROJECT_UPDATE_SUCCESS: {
      // Check for notification in updated project
      const { project, userId }: { project: Project; userId: string } = payload;
      if (!userId) return state;

      // Clear related notifications
      const unrelatedNotifications: Notification[] = state.notifications.filter(
        (n) => n.data.project?._id !== project._id,
			);
      const projectNotifications: Notification[] = [];

      if (project.invitees.length) {
        // PROJECT_INVITE
        const invitee = project.invitees.find((i) => i.user._id === userId);
        if (invitee) {
          projectNotifications.push({
            _id: `${NotificationType.PROJECT_INVITE}-${invitee._id}`,
            type: NotificationType.PROJECT_INVITE,
            data: { project },
            date: invitee.createdAt,
          });
        }
      }

      return {
        ...state,
        notifications: [...projectNotifications, ...unrelatedNotifications],
      };
    }
    case projectTypes.PROJECT_ACCEPT_INVITE_SUCCESS:
      // Remove project invite notification
      return {
        ...state,
        notifications: state.notifications.filter((n) => {
          return (
            n.type !== NotificationType.PROJECT_INVITE ||
            n.data.project?._id !== payload.project._id
          );
        }),
      };
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default notificationReducer;

