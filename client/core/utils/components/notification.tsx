import { Notification, NotificationType } from "@/core/types/models";
import { BsCheck } from "react-icons/bs";
import { FaTicketAlt } from "react-icons/fa";
import Link from "next/link";
import { TiUserAdd } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import store from "@/redux/configureStore";
import {
  acceptInvite,
  declineInvite,
} from "@/redux/actions/projectActions";
import { toast } from "react-toastify";

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
    case NotificationType.TICKET_ASSIGN:
      return (
        <>
          {notification.snapshot.actor.name} assigned you to the ticket{" "}
          <span className="text-blue-400 font-semibold">
            {notification.snapshot.ticket.title}
          </span>{" "}
          in{" "}
          <Link
            href={`/project/${notification.snapshot.ticket.project._id}`}
            className="text-blue-400 underline"
          >
            {notification.snapshot.ticket.project.title}
          </Link>
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
    case NotificationType.TICKET_ASSIGN:
      return <FaTicketAlt className="text-green-400" size={40} />;
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
          handler: async () => {
            const ok = await store.dispatch(
              acceptInvite(notification.snapshot.project._id),
            );
            if (ok) toast.success("Invitation accepted successfully");
          },
        },
        {
          key: "decline",
          label: "Decline",
          icon: <IoClose className="text-xl" />,
          variant: "danger",
          handler: async () => {
            const ok = await store.dispatch(
              declineInvite(notification.snapshot.project._id),
            );
            if (ok) toast.success("Invitation declined");
          },
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
    case NotificationType.TICKET_ASSIGN:
      return "Ticket Assignment";
    default:
      return "Notification";
  }
};
