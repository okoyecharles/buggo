import { useRef, useState } from "react";
import { ThreeDotsLoader } from "../components/loader";
import { acceptInvite } from "../redux/actions/projectActions";
import store from "../redux/configureStore";
import { Notification } from "../types/models";
import { BsCheck, BsPersonPlusFill } from "react-icons/bs";
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
          className="rounded flex justify-center font-open font-semibold py-2 px-2 lg:px-3 lg:w-32 text-ss bg-blue-600 text-white hover:text-blue-100 active:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          disabled={processing && method.update}
          onClick={() => {
            store.dispatch(acceptInvite(ref.project._id));
            setCurrentAction(id);
          }}
        >
          {processing && method.update && currentAction === id ? (
            <ThreeDotsLoader />
          ) : (
            <>
              <span className="hidden lg:inline">Accept Invite</span>
              <BsCheck className="lg:hidden text-2xl" />
            </>
          )}
        </button>
      );
    default:
      return "";
  }
};
