import { Notification, NotificationType } from "../../types/models";
import { BsPersonPlusFill } from "react-icons/bs";
import store from "../../../redux/configureStore";
import { acceptInvite } from "../../../redux/actions/projectActions";

export const getNotificationDescription = (notification: Notification) => {
  const { type } = notification;

  switch (type) {
    case NotificationType.PROJECT_INVITE:
      return (
        <span className="font-noto">
          You have been invited to join the project{" "}
          <span className="text-blue-400 font-semibold">
            {notification.data.project.title}
          </span>{" "}
          by {notification.data.project.author.name}
        </span>
      );
    default:
      return "New notification.";
  }
};

export const getNotificationIcon = (notification: Notification) => {
  const { type } = notification;

  switch (type) {
    case NotificationType.PROJECT_INVITE:
      return <BsPersonPlusFill className="text-blue-400" />;
    default:
      return "";
  }
};

type NotificationAction = {
	label: string;
	handler: () => void;
}

export const getNotificationAction = (
  notification: Notification,
	processedActions: Array<string>,
	setProcessedActions: React.Dispatch<React.SetStateAction<string[]>>
): NotificationAction => {
  const { type } = notification;

  switch (type) {
    case NotificationType.PROJECT_INVITE:
			return {
				label: "Accept Invite",
				handler: () => {
					store.dispatch(acceptInvite(notification.data.project._id));
					setProcessedActions([...processedActions, notification._id]);
				}
			};
    default:
			return {
        label: "...",
				handler: () => {}
			};
  }
};
