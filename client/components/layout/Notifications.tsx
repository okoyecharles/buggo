import React from "react";
import Modal from "../modal";
import { User } from "../../types/models";
import { IoMdClose, IoMdNotificationsOff } from "react-icons/io";
import { useSelector } from "react-redux";
import { storeType } from "../../redux/configureStore";
import { BsPersonPlusFill } from "react-icons/bs";
import getDate from "../../utils/dateHelper";
import Portal from "../portal";
import { useSpring, a } from "@react-spring/web";
import {
  getNotificationActionButton,
  getNotificationDescription,
  getNotificationIcon,
} from "../../utils/notificationHelper";

interface NotificationModalProps {
  open: boolean;
  setOpen: any;
  user: User | null;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  setOpen,
}) => {
  const notifications = useSelector(
    (store: storeType) => store.notifications.notifications
  );
  const projects = useSelector((store: storeType) => store.projects);

  const spring = useSpring({
    opacity: open ? 1 : 0,
    scale: open ? 1 : 1.2,
    config: {
      tension: 600,
      friction: 50,
    },
  });

  const [currentAction, setCurrentAction] = React.useState<string | null>(null);

  return (
    <Portal>
      <a.section
        className="notifications fixed top-0 left-0 w-screen h-screen bg-gray-825 text-gray-300 flex flex-col"
        style={{
          ...spring,
          pointerEvents: open ? "all" : "none",
        }}
      >
        <header className="header flex justify-between items-center mb-4 p-4">
          <h3 className="text-lg text-gray-100 font-semibold font-noto">
            Notifications
          </h3>
          <button
            name="close modal"
            className="p-1 text-2xl text-gray-300 ring-1 ring-gray-300 hover:text-gray-200 hover:ring-gray-200 rounded-full transition-all focus:outline-none active:bg-gray-700 relative"
            onClick={() => {
              setOpen(false);
            }}
          >
            <IoMdClose />
            <div className="absolute top-full left-1/2 -translate-x-1/2 text-sm font-bold hidden sm:block pt-1 text-gray-200 font-noto">
              ESC
            </div>
          </button>
        </header>
        <div className="flex flex-1">
          {notifications?.length > 0 ? (
            <ul className="mb-4 flex-1">
              {notifications?.map((notification, index) => (
                <li className="p-3 px-6 flex items-center gap-3 bg-gray-800 hover:bg-gray-750 border-l-2 border-b border-b-gray-700 first:border-t border-t-gray-700 border-l-gray-800 hover:border-l-blue-500 group">
                  <div className="notification-icon text-xl">
                    {getNotificationIcon(notification)}
                  </div>
                  <div className="flex-1">
                    <div className="notification-title text-gray-100 font-semibold capitalize  font-noto group-hover:text-white">
                      {`${notification.type} ${notification.subject}`}
                    </div>
                    <div className="notification-description text-gray-300 text-ss">
                      {getNotificationDescription(notification)}
                    </div>
                  </div>
                  <div className="notification-action">
                    {getNotificationActionButton(
                      notification,
                      projects.loading,
                      projects.method,
                      notification.ref,
                      currentAction,
                      setCurrentAction
                    )}
                  </div>
                  <div className="notification-date text-gray-400 text-sm font-medium w-32 flex justify-end truncate">
                    {getDate(notification.date, {
                      format: "short calendar",
                    })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-1 items-center font-noto flex-1">
              <IoMdNotificationsOff className="text-[10rem] text-gray-600 mt-32" />
              <h3 className="text-blue-500 text-lg font-bold text-center">
                No Notifications Yet
              </h3>
              <div className="text-sm font-semibold text-gray-400 text-center">
                <p>You have no notifications right now.</p>
                <p>Come back later.</p>
              </div>
            </div>
          )}
        </div>
      </a.section>
    </Portal>
  );
};

export default NotificationModal;
