import { useRef, useState } from "react";
import { ThreeDotsLoader } from "../components/loader";
import { acceptInvite } from "../redux/actions/projectActions";
import store from "../redux/configureStore";
import { Notification } from "../types/models";
import { BsPersonPlusFill } from "react-icons/bs";
import { randomUUID } from "crypto";

export const getNotificationDescription = (notification: Notification) => {
  const { type, subject } = notification;
  const action = `${type} ${subject}`;

  switch (action) {
    case "project invite":
      return `You have been invited to join the project ${notification.ref.project.title} by ${notification.ref.project.author.name}`;
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

export const getNotificationActionButton = (
  notification: Notification,
  processing: boolean,
  method: {
    [key: string]: boolean;
  },
  ref: {
    [key: string]: any;
  },
  currentAction: string | null,
  setCurrentAction: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const { type, subject, _id: id } = notification;
  const action = `${type} ${subject}`;

  switch (action) {
    case "project invite":
      return (
        <button
          className="font-open font-semibold py-2 px-3 w-32 text-ss bg-blue-600 text-white rounded hover:text-blue-100 active:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed  transition-all flex justify-center"
          disabled={processing && method.update}
          onClick={() => {
            store.dispatch(acceptInvite(ref.project._id));
            setCurrentAction(id);
          }}
        >
          {processing && method.update && currentAction === id ? (
            <ThreeDotsLoader />
          ) : (
            "Accept Invite"
          )}
        </button>
      );
    default:
      return "";
  }
};
