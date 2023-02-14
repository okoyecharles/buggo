import React from "react";
import Modal from "../modal";
import { User } from "../../types/models";
import { IoMdClose, IoMdNotificationsOff } from "react-icons/io";
import { useSelector } from "react-redux";
import { storeType } from "../../redux/configureStore";
import { BsPersonPlusFill } from "react-icons/bs";
import getDate from "../../utils/dateHelper";

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

  return (
    <Modal open={open} setOpen={setOpen} style={{ padding: 0 }}>
      <header className="header flex justify-between items-center mb-4 p-3">
        <h3 className="text-lg text-gray-100 font-semibold">Notifications</h3>
        <button
          name="close modal"
          className="p-1 text-2xl text-gray-400 ring-1 ring-gray-400 hover:text-gray-200 hover:ring-gray-200 rounded-full transition-all focus:outline-none active:bg-gray-700 relative"
          onClick={() => {
            setOpen(false);
          }}
        >
          <IoMdClose />
          <div className="absolute top-full left-1/2 -translate-x-1/2 text-sm font-bold hidden sm:block pt-1 opacity-50 text-gray-400">
            ESC
          </div>
        </button>
      </header>
      <div>
        {notifications?.length > 0 ? (
          <ul className="mb-4">
            {notifications?.map((notification, index) => (
              <li
                key={index}
                className="px-3 py-2 border-gray-500 first-of-type:border-t border-b grid grid-cols-12 gap-2 bg-gray-850"
              >
                <div className="col-span-1 flex justify-center gap-2">
                  <BsPersonPlusFill className="text-xl text-white" />
                </div>
                <div className="col-span-9 flex flex-col">
                  <h3 className="text-xsm font-bold text-blue-500 uppercase">
                    {notification.type} {notification.subject}
                  </h3>
                  <p
                    className="text-ss text-gray-200"
                    dangerouslySetInnerHTML={{ __html: notification.message }}
                  />
                </div>
                <div className="col-span-2 flex flex-col justify-center">
                  <p className="text-sm text-gray-400 font-semibold">
                    {getDate(notification.date, {
                      format: "from now",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-1 items-center">
            <IoMdNotificationsOff className="text-[7.5rem] text-gray-500" />
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
    </Modal>
  );
};

export default NotificationModal;
