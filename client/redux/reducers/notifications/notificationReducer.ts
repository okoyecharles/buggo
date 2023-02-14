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
              message: `You were invited to the project <a href='/project/${project._id}' className="bg-orange-500 font-semibold underline cursor-pointer">${project.title}</a> by ${project.author.name}`,
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
    case userTypes.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default notificationReducer;