import { Notification, Project } from './../../../types/models';
import { ActionType } from "../../types";
import * as projectTypes from "../../constants/projectConstants";

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
      const { projects, userId }: { projects: Project[], userId: string } = payload;
      const projectNotifications: Notification[] = [];

      projects.forEach((project) => {
        if (project.invitees.length) {
          const invite = project.invitees.find((invitee) => invitee.user === userId);

          if (invite) {
            projectNotifications.push({
              type: 'project',
              subject: 'invite',
              ref: {
                project: project._id
              },
              message: `You were invited to the project '${project.title}' by ${project.author.name}`,
              date: invite.createdAt,
            });
          }
        }
      });

      const newNotifications = [
        ...state.notifications.filter(n => n.type !== 'project'),
        ...projectNotifications
      ];

      return {
        ...state,
        notifications: newNotifications
      }
    default:
      return state;
  }
}

export default notificationReducer;