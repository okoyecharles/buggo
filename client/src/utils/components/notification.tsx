import { Notification } from "../../types/models";
import { BsPersonPlusFill } from "react-icons/bs";
import Link from "next/link";

export const getNotificationDescription = (notification: Notification) => {
  const { type, subject } = notification;
  const action = `${type} ${subject}`;

  switch (action) {
    case "project invite":
      return (
        <span className="font-noto">
          You have been invited to join the project{" "}
          <Link
            href={`/project/${notification.ref.project._id}`}
            className="text-blue-400 underline"
          >
            {notification.ref.project.title}
          </Link>{" "}
          by {notification.ref.project.author.name}
        </span>
      );
    default:
      return "";
  }
};

export const getNotificationIcon = (notification: Notification) => {
  const { type, subject } = notification;
  const action = `${type} ${subject}`;

  switch (action) {
    case "project invite":
      return <BsPersonPlusFill className="text-blue-400" />;
    default:
      return "";
  }
};
