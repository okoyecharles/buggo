import { IoMdClose, IoMdReturnRight } from "react-icons/io";
import Modal from ".";
import { Project } from "../../redux/reducers/projects/types";
import { useEffect, useReducer, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { TailSpinLoader, ThreeDotsLoader } from "../Loader";
import User from "../../redux/reducers/user/types";
import { getUsers } from "../../redux/actions/userActions";
import { searchByNameOrEmail } from "../../utils/searchHelper";
import Image from "next/image";
import { restrictLength } from "../../utils/stringHelper";
import Highlighter from "react-highlight-words";
import store from "../../redux/configureStore";
import { updateProject } from "../../redux/actions/projectActions";
import { toast } from "react-toastify";

const projectMembersReducer = (state: User[], action: any) => {
  switch (action.type) {
    case "ADD":
      if (state.find((member) => member._id === action.payload._id)) {
        return state;
      }
      return [action.payload, ...state];
    case "REMOVE":
      return state.filter((member) => member._id !== action.payload);
    case "RESET":
      return action.payload;
    default:
      return state;
  }
};

const ProjectAssignPopup: React.FC<{
  open: boolean;
  setOpen: any;
  project: Project;
  loading: boolean;
  method: any;
}> = ({ open, setOpen, project, loading, method }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");
  const [showClose, setShowClose] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);

  const [users, setUsers] = useState<null | User[]>(null);

  const [searchTimeOutID, setSearchTimeOutID] = useState<any>(null);

  const [members, updateMembers] = useReducer(
    projectMembersReducer,
    project.team
  );

  const searchUsers = async () => {
    setUsers(null);
    const { users } = await getUsers();
    const filteredUsers = searchByNameOrEmail(search, users);
    setUsers(filteredUsers);
  };

  useEffect(() => {
    setShowClose(search.length > 0);

    if (search.length > 0) {
      if (searchTimeOutID) {
        clearTimeout(searchTimeOutID);
      }
      setSearchTimeOutID(
        setTimeout(() => {
          searchUsers();
          setSearching(true);
        }, 1000)
      );
    } else {
      clearTimeout(searchTimeOutID);
      setSearching(false);
      setUsers(null);
    }
  }, [search]);

  useEffect(() => {
    if (open) {
      setSearch("");
      updateMembers({ type: "RESET", payload: project.team });
      searchRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open && !loading && !method.update) {
      setOpen(false);
      toast.success("Members assigned successfully");
    }
  }, [loading, method])

  return (
    <Modal open={open} setOpen={setOpen} style={{ padding: 0 }}>
      <div className="modal__container p-4">
        <header className="header flex justify-between items-center">
          <h3 className="text-lg text-gray-100 font-semibold">
            Assign Members
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

        <p className="font-semibold flex items-center text-gray-400 gap-1 mt-1">
          <IoMdReturnRight className="text-xl" /> {project.title}
        </p>

        {/* Assigned user list */}
        <ul className="assigned-users-wrapper flex gap-1 mt-2 bg-gray-850 px-2 p-1 rounded h-12 overflow-x-scroll">
          {members.length === 0 && (
            <p className="text-gray-400 self-center">No members assigned</p>
          )}
          {members.map((member: User) => (
            <>
              <li className="flex gap-2 bg-gray-950 items-center p-2 rounded-lg group select-none">
                <div className="h-6 w-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                </div>
                <span>{restrictLength(member.name.split(" ")[0], 10)}</span>
                <IoMdClose
                  className="text-xl cursor-pointer text-gray-600 hover:text-gray-200 transition"
                  onClick={() => {
                    updateMembers({ type: "REMOVE", payload: member._id });
                  }}
                />
              </li>
            </>
          ))}
        </ul>

        {/* Search bar */}
        <div className="search-wrapper relative mt-4">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search user by name or email"
            className="bg-gray-900 text-ss placeholder:text-gray-500 hover:bg-gray-950 focus:bg-gray-950 focus:ring-1 ring-blue-500/75 text-gray-200 rounded py-2 px-3 pr-9 outline-none w-full transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch
            className={`search-icon text-gray-500 cursor-pointer absolute top-1/2 -translate-y-1/2 right-3 lg:right-2 hover:text-gray-400 transition ${
              showClose
                ? "opacity-0 pointer-events-none rotate-90"
                : "opacity-100 pointer-events-auto rotate-0"
            }`}
            onClick={() => {
              searchRef.current?.focus();
            }}
            onMouseDown={(e) => e.preventDefault()}
          />
          <MdOutlineClose
            className={`close-icon text-xl text-gray-500 cursor-pointer absolute top-1/2 -translate-y-1/2 right-3 lg:right-2 hover:text-gray-400 transition ${
              showClose
                ? "opacity-100 pointer-events-auto rotate-0"
                : "opacity-0 pointer-events-none -rotate-90"
            }`}
            onClick={() => {
              setSearch("");
              searchRef.current?.focus();
            }}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>

        {/* List of users */}
        <ul className="users-wrapper flex flex-col gap-2 mt-1 p-2 h-60 bg-gray-850 overflow-y-scroll rounded-sm">
          {!searching ? (
            <li className="text-gray-400">
              Please enter atleast a character to search
            </li>
          ) : !users ? (
            <TailSpinLoader color="#1aa6fe" className="self-center my-4" />
          ) : !users.length ? (
            <li className="text-gray-400">No users found</li>
          ) : (
            users.map((user) => (
              <>
                <li className="flex items-center gap-2 p-2 px-3 bg-gray-950 rounded cursor-pointer select-none">
                  <div className="">
                    <Image
                      src={user.image}
                      width={100}
                      height={100}
                      alt={user.name}
                      className="rounded-full h-10 w-10"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-200">
                      <Highlighter
                        autoEscape={true}
                        textToHighlight={restrictLength(user.name, 25)}
                        searchWords={[search]}
                        highlightClassName="bg-blue-500/0 text-blue-500"
                      />
                    </h4>
                    <p className="text-gray-400 text-sm">
                      <Highlighter
                        autoEscape={true}
                        textToHighlight={restrictLength(user.email, 30)}
                        searchWords={[search]}
                        highlightClassName="bg-blue-500/0 text-blue-500"
                      />
                    </p>
                  </div>
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    checked={members.some(
                      (member: User) => member._id === user._id
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateMembers({
                          type: "ADD",
                          payload: user,
                        });
                      } else {
                        updateMembers({
                          type: "REMOVE",
                          payload: user._id,
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </li>
              </>
            ))
          )}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 bg-gray-850 p-4 py-3 justify-end">
        <button
          className="px-6 p-2 bg-blue-600 text-blue-50 rounded-sm font-semibold hover:bg-blue-700 group transition disabled:opacity-75"
          disabled={loading && method.update}
          onClick={() => {
            store.dispatch(
              updateProject({
                id: project._id,
                project: { team: members.map((member: User) => member._id) },
              })
            );
          }}
        >
          {loading && method.update ? <ThreeDotsLoader /> : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default ProjectAssignPopup;
