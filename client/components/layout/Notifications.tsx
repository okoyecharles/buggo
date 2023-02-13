import React from "react";
import Modal from "../modal";
import { User } from "../../types/models";
import { IoMdClose } from "react-icons/io";

interface NotificationModalProps {
  open: boolean;
  setOpen: any;
  user: User | null;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  setOpen,
}) => {
  return (
    <Modal open={open} setOpen={setOpen}>
      <header className="header flex justify-between items-center">
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
      <p>Coming Soon...</p>
    </Modal>
  );
};

export default NotificationModal;
