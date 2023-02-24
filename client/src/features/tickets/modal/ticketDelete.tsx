import { deleteTicket } from "../../../../redux/actions/ticketActions";
import store from "../../../../redux/configureStore";
import { Ticket } from "../../../types/models";
import { useEffect } from "react";
import Modal from "../../modal";
import { ThreeDotsLoader } from "../../loader";
import getDate from "../../../utils/dateHelper";

const TicketDeleteModal: React.FC<{
  open: boolean;
  setOpen: any;
  ticket: Ticket;
  loading: boolean;
  method: {
    [key: string]: any;
  };
}> = ({ open, setOpen, ticket, loading, method }) => {
  const handleDelete = () => {
    store.dispatch(deleteTicket(ticket._id));
  };

  useEffect(() => {
    if (open && !method.delete) {
      setOpen(false);
    }
  }, [method.delete]);

  return (
    <Modal open={open} setOpen={setOpen} style={{ padding: 0 }}>
      <div className="p-4">
        <header className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-white">Delete Ticket</h2>
          <p className="text-gray-200 mb-4">
            Are you sure you want to delete this ticket?
          </p>
        </header>
        <div className="shadow-lg gap-2 bg-gray-700 p-2 rounded mb-2">
          <p className="text-sm text-blue-500 capitalize">
            {getDate(ticket.createdAt)}
          </p>
          <p className="font-semibold text-gray-100">{ticket.title}</p>
        </div>
        <p className="text-gray-400 text-xsm mb-2">
          This action will delete all comments associated with this ticket.
        </p>
      </div>
      <div className="flex gap-2 bg-gray-850 p-4 py-3 justify-end">
        <button
          className="px-6 p-2 hover:underline text-white font-semibold"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-6 p-2 bg-red-500 text-red-50 rounded-sm font-semibold hover:bg-red-600 active:bg-red-700 transition-colors disabled:opacity-75"
          disabled={loading && method.delete}
          onClick={handleDelete}
        >
          {loading && method.delete ? <ThreeDotsLoader /> : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default TicketDeleteModal;
