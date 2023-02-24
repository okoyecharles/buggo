import { useRef, useState } from "react";
import { ThreeDotsLoader } from "../features/loader";
import { acceptInvite } from "../../redux/actions/projectActions";
import store from "../../redux/configureStore";
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
