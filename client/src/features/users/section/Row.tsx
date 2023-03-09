import React from "react";
import { User } from "../../../types/models";
import Image from "next/image";
import getDate from "../../../utils/strings/date";
import { BsTrashFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import UserDeleteModal from "../modal/userDelete";
import Highlighter from "react-highlight-words";

interface UserRowProps {
  user: User;
  setUsers: any;
  search: string;
}

const UserRow: React.FC<UserRowProps> = ({ user, setUsers, search }) => {
  const [deleteOpen, setDeleteOpen] = React.useState<boolean>(false);

  return (
    <li className="grid grid-cols-8 gap-2 border-b border-gray-700 lg:hover:bg-gray-850 transition-all relative">
      <div className="col-span-4 lg:col-span-3 flex items-center gap-2 pl-4 p-2">
        <div className="h-8 lg:h-10 aspect-square flex rounded-full bg-gray-700">
          <Image
            src={user.image}
            alt={user.name}
            width={40}
            height={40}
            className="w-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col justify-between overflow-hidden">
          <h3 className="text-gray-100 font-bold text-ss truncate">
            <Highlighter
              autoEscape={true}
              textToHighlight={user.name}
              searchWords={[search.trim()]}
              highlightClassName="bg-orange-500/75 text-white"
            />
          </h3>
          <p className="text-gray-300 text-sm truncate">
            <Highlighter
              autoEscape={true}
              textToHighlight={user.email}
              searchWords={[search.trim()]}
              highlightClassName="bg-orange-500/75 text-white"
            />
          </p>
        </div>
      </div>

      <div className="col-span-4 lg:col-span-1 p-1 flex items-center text-sm font-semibold text-gray-100">
        {getDate(user.createdAt, {
          format: "short month year",
        })}
      </div>

      <div className="col-span-4 p-1 items-center hidden lg:flex">
        {user.admin ? (
          <span className="text-gray-100 text-sm p-1 px-4 rounded bg-blue-500 font-bold font-noto">
            Admin
          </span>
        ) : (
          <span className="text-gray-100 text-sm p-1 px-4 rounded bg-orange-500 font-bold  font-noto">
            Developer
          </span>
        )}
      </div>

      <div className="absolute top-2 right-2 lg:right-4 flex bg-gray-850 lg:bg-gray-700 rounded-md">
        {!user.admin ? (
          <>
            <button
              id={`delete-user-${user._id}`}
              className="p-2 text-gray-400 hover:text-white transition-all"
              onClick={() => {
                setDeleteOpen(true);
              }}
            >
              <BsTrashFill />
            </button>
            <Tooltip
              anchorId={`delete-user-${user._id}`}
              content="Delete user"
            />
          </>
        ) : null}
      </div>

      <UserDeleteModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        setUsers={setUsers}
        user={user}
      />
    </li>
  );
};

export default UserRow;
