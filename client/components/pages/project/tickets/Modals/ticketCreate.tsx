import React from "react";
import Modal from "../../../../modal";
import { IoMdClose } from "react-icons/io";

interface CreateTicketModalProps {
  open: boolean;
  setOpen: any;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  open,
  setOpen,
}) => {
  return (
    <Modal open={open} setOpen={setOpen}>
      <header>
        <header className="header flex justify-between items-center">
          <h3 className="text-lg text-gray-100 font-semibold">
            Create a Ticket
          </h3>
          <button
            name="close modal"
            className="text-2xl text-gray-500 hover:text-gray-200 transition"
            onClick={() => {
              setOpen(false);
            }}
          >
            <IoMdClose />
          </button>
        </header>
      </header>
    </Modal>
  );
};

export default CreateTicketModal;
