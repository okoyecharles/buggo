import { BsCheck2All, BsFillTrashFill } from "react-icons/bs";
import { Notification } from "@/core/types/models";
import { OptionsButton } from "@/core/components/button";
import OptionsPopup from "@/core/components/options";
import store, { storeType } from "@/redux/configureStore";
import { useSelector } from "react-redux";
import {
  deleteNotification,
  readNotification,
} from "@/redux/actions/notificationActions";

const NotificationOptionsPopup: React.FC<{
  open: boolean;
  setOpen: any;
  notification: Notification;
}> = ({ open, setOpen, notification }) => {
  const pending = useSelector(
    (store: storeType) => store.notifications.pending,
  );

  return (
    <OptionsPopup id={`notification-options-${notification._id}`} open={open} setOpen={setOpen} style="top-12 right-2">
      {/* Nothing left to mark once it has been read */}
      {!notification.read && (
        <>
          <OptionsButton
            processing={pending.read}
            onClick={() => {
              store.dispatch(readNotification(notification._id));
              setOpen(false);
            }}
          >
            Mark as Read
            <BsCheck2All />
          </OptionsButton>

          <hr className="border-gray-800" />
        </>
      )}

      <OptionsButton
        color="red-500"
        processing={pending.delete}
        onClick={() => {
          store.dispatch(deleteNotification(notification._id));
          setOpen(false);
        }}
      >
        Delete
        <BsFillTrashFill />
      </OptionsButton>
    </OptionsPopup>
  );
};

export default NotificationOptionsPopup;
