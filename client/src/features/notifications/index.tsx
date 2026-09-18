import React, { useEffect } from "react";
import { User } from "../../types/models";
import { IoMdClose, IoMdNotificationsOff } from "react-icons/io";
import { useSelector } from "react-redux";
import { storeType } from "../../../redux/configureStore";
import getDate from "../../utils/strings/date";
import Portal from "../portal";
import { useSpring, a } from "@react-spring/web";
import {
  getNotificationActions,
  getNotificationDescription,
  getNotificationIcon,
  getNotificationTitle,
} from "../../utils/components/notification";
import { ThreeDotsLoader } from "../loader";
import { BsThreeDotsVertical } from "react-icons/bs";
import NotificationOptionsPopup from "./Options";
import { readNotifications } from "../../../redux/actions/notificationActions";
import store from "../../../redux/configureStore";
import { useRouter } from "next/router";

interface NotificationModalProps {
  open: boolean;
  setOpen: any;
  user: User | null;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  setOpen,
}) => {
  const { notifications, method } = useSelector(
    (store: storeType) => store.notifications,
  );
  const unread = notifications.filter((notification) => !notification.read);
  const router = useRouter();
  // Every action taken this session, keyed by notification id
  const [pending, setPending] = React.useState<Record<string, string>>({});
  // Only one row menu is open at a time
  const [openOptions, setOpenOptions] = React.useState<string | null>(null);
  useEffect(() => {
    // Close notification modal when route changes
    setOpen(false);
  }, [router.pathname]);

  const spring = useSpring({
    opacity: open ? 1 : 0,
    scale: open ? 1 : 1.2,
    config: {
      tension: 600,
      friction: 50,
    },
  });

  return (
    <Portal>
      <a.section
        className="notifications fixed top-0 left-0 w-screen h-screen bg-gray-825 text-gray-300 flex flex-col"
        style={{
          ...spring,
          pointerEvents: open ? "all" : "none",
        }}
        onKeyDown={(e) => {
          if (open && e.key === "Escape") {
            setOpen(false);
          }
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
        {unread.length > 0 && (
          <div className="flex justify-start px-4 lg:px-6 mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-ss font-medium rounded h-8 px-3 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              disabled={method.readAll}
              onClick={() => {
                store.dispatch(readNotifications());
              }}
            >
              Mark all as read
            </button>
          </div>
        )}
        <div className="flex flex-1">
          {notifications?.length > 0 ? (
            <ul className="mb-4 flex-1">
              {notifications?.map((notification) => {
                return (
                  <li
                    key={notification._id}
                    className={`p-3 lg:px-6 flex items-center gap-3 border-l-2 border-b border-b-gray-700 first:border-t border-t-gray-700 ${
                      notification.read
                        ? "bg-gray-800 border-l-gray-800"
                        : "bg-gray-750 border-l-blue-500"
                    }`}
                  >
                    <div className="notification-icon text-xl self-start mt-1">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`notification-title font-bold capitalize font-noto ${
                          notification.read ? "text-gray-400" : "text-white"
                        }`}
                      >
                        {getNotificationTitle(notification)}
                      </h3>
                      <p
                        className={`notification-description text-sm lg:text-ss ${
                          notification.read ? "text-gray-500" : "text-gray-300"
                        }`}
                      >
                        {getNotificationDescription(notification)}
                      </p>
                      <div className="notification-date text-gray-300 mt-2 text-xsm font-noto font-semibold flex lg:hidden truncate">
                        {getDate(notification.createdAt, {
                          format: "short calendar",
                        })}
                      </div>
                    </div>
                    <div className="notification-action flex items-center gap-2">
                      {getNotificationActions(notification).map((action) => (
                        <button
                          key={action.key}
                          className={`text-ss rounded-full lg:rounded h-10 w-10 lg:h-8 flex items-center justify-center ${
                            action.variant === "primary"
                              ? "bg-blue-500 hover:bg-blue-600 text-white lg:w-32"
                              : "bg-red-500 hover:bg-red-600 text-white lg:w-24"
                          }`}
                          disabled={Boolean(pending[notification._id])}
                          onClick={() => {
                            action.handler();
                            setPending((processed) => ({
                              ...processed,
                              [notification._id]: action.key,
                            }));
                          }}
                        >
                          {pending[notification._id] === action.key ? (
                            <ThreeDotsLoader className="text-red-500" />
                          ) : (
                            <>
                              <span className="hidden lg:inline text-ss font-medium">
                                {action.label}
                              </span>
                              <span className="lg:hidden">{action.icon}</span>
                            </>
                          )}
                        </button>
                      ))}
                      <div className="relative">
                        <button
                          name="notification options"
                          className="h-10 w-10 rounded-full lg:h-8 lg:w-8 lg:rounded flex items-center justify-center text-gray-300 ring-1 ring-gray-600 hover:text-gray-100 hover:ring-gray-400 transition-colors"
                          onClick={() => {
                            setOpenOptions(
                              openOptions === notification._id
                                ? null
                                : notification._id,
                            );
                          }}
                        >
                          <BsThreeDotsVertical />
                        </button>
                        <NotificationOptionsPopup
                          open={openOptions === notification._id}
                          setOpen={() => setOpenOptions(null)}
                          notification={notification}
                          method={method}
                        />
                      </div>
                    </div>
                    <div className="notification-date text-gray-400 text-sm font-medium w-32 hidden lg:flex justify-end truncate">
                      {getDate(notification.createdAt, {
                        format: "short calendar",
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col gap-1 items-center font-noto flex-1">
              <IoMdNotificationsOff className="text-[10rem] text-gray-400 mt-32" />
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
