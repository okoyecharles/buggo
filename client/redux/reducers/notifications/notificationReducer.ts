import { Notification, Project } from './../../../types/models';
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
  action: ActionType
): NotificationsState => {
  const { type, payload } = action;


  switch (type) {
    case projectTypes.PROJECT_LIST_SUCCESS:
      // Update / Populate all project notifications
      const { projects, userId }: { projects: Project[], userId: string } = payload;
      const projectNotifications: Notification[] = [];

      projects.forEach((project) => {
        if (project.invitees.length) {
          const invite = project.invitees.find((invitee) => invitee.user._id === userId);

          if (invite) {
            projectNotifications.push({
              _id: invite._id,
              type: 'project',
              subject: 'invite',
              ref: {
                project
              },
              date: invite.createdAt,
            });
          }
        }
      });
      const newNotifications = [
        ...projectNotifications,
        ...state.notifications.filter(n => n.type !== 'project')
      ];

      return {
        ...state,
        notifications: newNotifications
      }
    case projectTypes.PROJECT_ACCEPT_INVITE_SUCCESS:
      // Remove project invite notification

      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => {
            return notification.ref.project._id !== payload.project._id;
          }
        )
      }
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default notificationReducer;