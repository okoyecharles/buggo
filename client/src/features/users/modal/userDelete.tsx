import { useRouter } from "next/router";
import { User } from "../../../types/models";
import { useState } from "react";
import { deleteUser } from "../../../../redux/actions/userActions";
import Modal from "../../modal";
import getDate from "../../../utils/strings/date";
import { ThreeDotsLoader } from "../../loader";

const UserDeleteModal: React.FC<{
  open: boolean;
  setOpen: any;
  user: User;
  setUsers: any;
}> = ({ open, setOpen, user, setUsers }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);

    const newUsers = await deleteUser(user._id);
    setLoading(false);
    setOpen(false);

    setUsers(newUsers);
  };

  return (
    <Modal open={open} setOpen={setOpen} style={{ padding: 0 }}>
      <div className="p-4">
        <header className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-white">Delete User</h2>
          <p className="text-gray-200 mb-4">
            Are you sure you want to delete this user?
          </p>
        </header>
        <div className="shadow-lg gap-2 bg-gray-700 p-2 rounded mb-2">
          <p className="text-sm text-blue-400 capitalize">
            Joined {getDate(user?.createdAt, { format: "short month year" })}
          </p>
          <p className="font-semibold text-gray-100">{user?.name}</p>
        </div>
        <p className="text-gray-400 text-xsm mb-2">
          This action will delete all projects, tickets and comments associated
          with this user.
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
          disabled={loading}
          onClick={handleDelete}
        >
          {loading ? <ThreeDotsLoader /> : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default UserDeleteModal;
