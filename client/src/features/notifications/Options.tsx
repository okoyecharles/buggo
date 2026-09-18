import { BsCheck2All, BsFillTrashFill } from "react-icons/bs";
import { Notification } from "../../types/models";
import { OptionsButton } from "../../components/Button";
import OptionsPopup from "../../components/Options";
import store from "../../../redux/configureStore";
import {
  deleteNotification,
  readNotification,
} from "../../../redux/actions/notificationActions";

const NotificationOptionsPopup: React.FC<{
  open: boolean;
  setOpen: any;
  notification: Notification;
  method: {
    [key: string]: boolean;
  };
}> = ({ open, setOpen, notification, method }) => {
  return (
    <OptionsPopup open={open} setOpen={setOpen} style="top-12 right-2">
      {/* Nothing left to mark once it has been read */}
      {!notification.read && (
        <>
          <OptionsButton
            processing={method.read}
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
        processing={method.delete}
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
