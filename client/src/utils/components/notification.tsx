import { Notification, NotificationType } from "../../types/models";
import { BsCheck } from "react-icons/bs";
import { TiUserAdd } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import store from "../../../redux/configureStore";
import {
  acceptInvite,
  declineInvite,
} from "../../../redux/actions/projectActions";

export const getNotificationDescription = (notification: Notification) => {
  switch (notification.type) {
    case NotificationType.PROJECT_INVITE:
      return (
        <>
          You have been invited to join the project{" "}
          <span className="text-blue-400 font-semibold">
            {notification.snapshot.project.title}
          </span>{" "}
          by {notification.snapshot.actor.name}
        </>
      );
    default:
      return "New notification.";
  }
};

export const getNotificationIcon = (notification: Notification) => {
  switch (notification.type) {
    case NotificationType.PROJECT_INVITE:
      return <TiUserAdd className="text-blue-400" size={40} />;
    default:
      return "";
  }
};

type NotificationAction = {
  key: string;
  label: string;
  icon: React.ReactNode;
  variant: "primary" | "danger";
  handler: () => void;
};

/*
 * Descriptors only — recording which action is pending belongs to whichever
 * component renders them
 */
export const getNotificationActions = (
  notification: Notification,
): NotificationAction[] => {
  switch (notification.type) {
    case NotificationType.PROJECT_INVITE:
      return [
        {
          key: "accept",
          label: "Accept Invite",
          icon: <BsCheck className="text-2xl" />,
          variant: "primary",
          handler: () =>
            store.dispatch(acceptInvite(notification.snapshot.project._id)),
        },
        {
          key: "decline",
          label: "Decline",
          icon: <IoClose className="text-xl" />,
          variant: "danger",
          handler: () =>
            store.dispatch(declineInvite(notification.snapshot.project._id)),
        },
      ];
    default:
      return [];
  }
};

export const getNotificationTitle = (notification: Notification): string => {
  switch (notification.type) {
    case NotificationType.PROJECT_INVITE:
      return "Project Invite";
    default:
      return "Notification";
  }
};
