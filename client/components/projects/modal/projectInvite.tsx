import { IoMdClose, IoMdReturnRight } from "react-icons/io";
import Modal from "@/core/components/modal";
import { Project, SearchedUser } from "@/core/types/models";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { TailSpinLoader, ThreeDotsLoader } from "@/core/components/loader";
import { searchUsersRequest } from "@/redux/actions/userActions";
import Image from "next/image";
import { restrictLength } from "@/core/utils/components/string";
import Highlighter from "react-highlight-words";
import store, { storeType } from "@/redux/configureStore";
import { inviteToProject } from "@/redux/actions/projectActions";
import { validateInvitees } from "@/core/utils/validation/project";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SEARCH_DEBOUNCE_DELAY } from "@/core/data/app";

const projectInviteesReducer = (state: SearchedUser[], action: any) => {
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

const ProjectInviteModal: React.FC<{
  open: boolean;
  setOpen: any;
  project: Project;
}> = ({ open, setOpen, project }) => {
  const inviting = useSelector(
    (store: storeType) => store.project.pending.update,
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [invitees, updateInvitees] = useReducer(projectInviteesReducer, []);
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setUsers([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    // Typing again before the delay ends cancels this search, and a response
    // that arrives after the query changed is ignored so it can't overwrite
    // newer results.
    let cancelled = false;
    const timeoutId = setTimeout(async () => {
      const searchResponse = await searchUsersRequest(trimmedQuery);
      if (cancelled) return;
      if (searchResponse.ok) {
        setUsers(searchResponse.users);
      } else {
        toast.error(searchResponse.error?.message || "Something went wrong");
      }
      setSearching(false);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  // Filtered on render so invites and joins that happen while the modal is
  // open are reflected without searching again.
  const unInvitedUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user._id !== project.author._id && // Not the project author
        !project.invitees.find((invitee) => invitee.user._id === user._id) && // Not already invited
        !project.team.find((member) => member._id === user._id) // Not in the project team
      );
    });
  }, [users, project]);

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    } else {
      setQuery("");
      updateInvitees({ type: "RESET", payload: [] });
    }
  }, [open]);

  return (
    <Modal
      id={`invite-project-modal-${project._id}`}
      open={open}
      setOpen={setOpen}
      style={{ padding: 0 }}
    >
      <div className="modal__container p-4">
        <header className="header flex justify-between items-center">
          <h3 className="text-lg text-gray-100 font-semibold">
            Invite Members
          </h3>
          <button
            title="close"
            aria-label="close modal"
            className="p-1 text-2xl text-gray-400 hover:text-gray-200 rounded-full transition-all focus:outline-none active:bg-gray-700"
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

        {/* Invited user list */}
        <ul className="invited-users-wrapper flex gap-1 mt-2 bg-gray-850 px-2 p-1 rounded h-12 overflow-x-scroll">
          {invitees.length === 0 && (
            <p className="text-gray-400 self-center">No members invited...</p>
          )}
          {invitees.map((invitee: SearchedUser) => (
            <>
              <li
                className="flex gap-2 bg-gray-950 items-center p-2 rounded-lg group select-none"
                key={invitee._id}
              >
                <div className="h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={invitee.image}
                    alt={invitee.name}
                    width={30}
                    height={30}
                    className="h-full object-center object-cover bg-gray-850"
                  />
                </div>
                <span className="truncate">{invitee.name.split(" ")[0]}</span>
                <button
                  className="text-xl text-gray-600 hover:text-gray-200 transition"
                  title="remove"
                  aria-label={"Remove " + invitee.email + " from invitees"}
                  onClick={() => {
                    updateInvitees({ type: "REMOVE", payload: invitee._id });
                  }}
                >
                  <IoMdClose />
                </button>
              </li>
            </>
          ))}
        </ul>

        {/* Search */}
        <div className="search-wrapper relative mt-4">
          <label>
            <span className="sr-only">Search Users to Invite</span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search user by name or email"
              className="bg-gray-900 text-ss placeholder:text-gray-500 hover:bg-gray-950 focus:bg-gray-950 focus:ring-1 ring-blue-500/75 text-gray-200 rounded py-2 px-3 pr-9 outline-none w-full transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <FaSearch
            className={`search-icon text-gray-500 cursor-pointer absolute top-1/2 -translate-y-1/2 right-3 lg:right-2 hover:text-gray-400 transition ${
              query.length > 0
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
              query.length > 0
                ? "opacity-100 pointer-events-auto rotate-0"
                : "opacity-0 pointer-events-none -rotate-90"
            }`}
            onClick={() => {
              setQuery("");
              searchRef.current?.focus();
            }}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>

        {/* List of users */}
        <ul className="users-wrapper flex flex-col gap-2 mt-1 p-2 h-60 bg-gray-850 overflow-y-scroll rounded-sm">
          {!query.length ? (
            <li className="text-gray-400">
              Please enter atleast one character to search
            </li>
          ) : searching ? (
            <TailSpinLoader color="#1aa6fe" className="self-center my-4" />
          ) : !unInvitedUsers.length ? (
            <li className="text-gray-400">No users found</li>
          ) : (
            unInvitedUsers.map((user) => (
              <li
                className="flex items-center gap-2 p-2 px-3 bg-gray-950 rounded cursor-pointer select-none"
                key={user._id}
              >
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
                      searchWords={[query.trim()]}
                      highlightClassName="bg-blue-500/0 text-blue-500"
                    />
                  </h4>
                  <p className="text-gray-400 text-sm">
                    <Highlighter
                      autoEscape={true}
                      textToHighlight={restrictLength(
                        user.email.split("@")[0],
                        30,
                      )}
                      searchWords={[query.trim()]}
                      highlightClassName="bg-blue-500/0 text-blue-500"
                    />
                    <span className="text-gray-200/30">
                      @{user.email.split("@")[1]}
                    </span>
                  </p>
                </div>
                <input
                  id="default-checkbox"
                  type="checkbox"
                  checked={invitees.some(
                    (invitee: SearchedUser) => invitee._id === user._id,
                  )}
                  aria-label={"invite " + user.email + " to project"}
                  aria-checked={invitees.some(
                    (invitee: SearchedUser) => invitee._id === user._id,
                  )}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateInvitees({
                        type: "ADD",
                        payload: user,
                      });
                    } else {
                      updateInvitees({
                        type: "REMOVE",
                        payload: user._id,
                      });
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 bg-gray-850 p-4 py-3 justify-end">
        <button
          aria-label="Confirm Invite"
          className="px-6 p-2 bg-blue-600 text-blue-50 rounded-sm font-semibold hover:bg-blue-700 group transition disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={inviting || !invitees.length}
          onClick={async () => {
            const payload = invitees.map((invitee: SearchedUser) => ({
              user: invitee._id,
              email: invitee.email,
            }));

            const inviteesValidationError = validateInvitees(payload);
            if (inviteesValidationError) {
              toast.error(inviteesValidationError);
              return;
            }

            const ok = await store.dispatch(
              inviteToProject(project._id, payload),
            );
            if (ok) {
              toast.success("Members invited successfully");
              setOpen(false);
            }
          }}
        >
          {inviting ? <ThreeDotsLoader /> : "Invite"}
        </button>
      </div>
    </Modal>
  );
};

export default ProjectInviteModal;
