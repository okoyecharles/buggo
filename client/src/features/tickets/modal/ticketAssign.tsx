import { useSelector } from "react-redux";
import store, { storeType } from "../../../../redux/configureStore";
import { Ticket, User } from "../../../types/models";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../modal";
import { IoMdClose, IoMdReturnRight } from "react-icons/io";
import Image from "next/image";
import { restrictLength } from "../../../utils/components/string";
import { FaSearch } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { updateTicket } from "../../../../redux/actions/ticketActions";
import { ThreeDotsLoader } from "../../loader";
import Highlighter from "react-highlight-words";
import { searchByNameOrEmail } from "../../../utils/strings/search";

const ticketMembersReducer = (state: User[], action: any) => {
  switch (action.type) {
    case "ADD":
      if (state.find((member) => member._id === action.payload._id)) {
        return state;
      }
      return [action.payload, ...state].sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    case "REMOVE":
      return state.filter((member) => member._id !== action.payload);
    case "RESET":
      return action.payload.sort((a: any, b: any) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    default:
      return state;
  }
};

const TicketAssignModal: React.FC<{
  open: boolean;
  setOpen: any;
  ticket: Ticket;
  loading: boolean;
  method: any;
}> = ({ open, setOpen, ticket, loading, method }) => {
  const project = useSelector((store: storeType) => store.project.project!);

  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");
  const [showClose, setShowClose] = useState<boolean>(false);

  const [members, updateMembers] = useReducer(
    ticketMembersReducer,
    ticket.team
  );
  const searchedMembers = useMemo(() => {
    return searchByNameOrEmail(search, project.team);
  }, [search, project.team]);

  useEffect(() => {
    setShowClose(search.length > 0);
  }, [search]);

  useEffect(() => {
    if (open) {
      setSearch("");
      updateMembers({ type: "RESET", payload: ticket.team });
      searchRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open && !loading && !method.update) {
      setOpen(false);
      toast.success("Members assigned successfully");
    }
  }, [loading, method]);

  return (
    <Modal open={open} setOpen={setOpen} style={{ padding: 0 }}>
      <div className="modal__container p-4">
        <header className="header flex justify-between items-center">
          <h3 className="text-lg text-gray-100 font-semibold">
            Assign Members
          </h3>
          <button
            name="close modal"
            className="p-1 text-2xl text-gray-400 hover:text-gray-200 rounded-full transition-all focus:outline-none active:bg-gray-700 relative"
            onClick={() => {
              setOpen(false);
            }}
          >
            <IoMdClose />
          </button>
        </header>

        <p className="font-semibold flex items-center text-gray-400 gap-1 mt-1">
          <IoMdReturnRight className="text-xl" />{" "}
          <span className="truncate">{ticket.title}</span>
        </p>

        {/* Assigned member list */}
        <ul className="invited-users-wrapper flex gap-1 mt-2 bg-gray-850 px-2 p-1 rounded h-12 overflow-x-scroll">
          {members.length === 0 && (
            <p className="text-gray-400 self-center">No members assigned...</p>
          )}
          {members.map((member: User) => (
            <>
              <li
                className="flex gap-2 bg-gray-950 items-center p-2 rounded-lg group select-none"
                key={member._id}
              >
                <div className="h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={30}
                    height={30}
                    className="h-full object-center object-cover bg-gray-850"
                  />
                </div>
                <span className="truncate">{member.name.split(" ")[0]}</span>
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

        {/* Search */}
        <div className="search-wrapper relative mt-4">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search member by name or email"
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
          {!searchedMembers.length ? (
            <p className="text-gray-400">No members found...</p>
          ) : (
            searchedMembers.map((member) => (
              <li
                className="flex items-center gap-2 p-2 px-3 bg-gray-950 rounded cursor-pointer select-none"
                key={member._id}
              >
                <div className="">
                  <Image
                    src={member.image}
                    width={100}
                    height={100}
                    alt={member.name}
                    className="rounded-full h-10 w-10"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-200">
                    <Highlighter
                      autoEscape={true}
                      textToHighlight={restrictLength(member.name, 25)}
                      searchWords={[search.trim()]}
                      highlightClassName="bg-blue-500/0 text-blue-500"
                    />
                  </h4>
                  <p className="text-gray-400 text-sm">
                    <Highlighter
                      autoEscape={true}
                      textToHighlight={restrictLength(
                        member.email.split("@")[0],
                        30
                      )}
                      searchWords={[search.trim()]}
                      highlightClassName="bg-blue-500/0 text-blue-500"
                    />
                    <span className="text-gray-200/30">
                      @{member.email.split("@")[1]}
                    </span>
                  </p>
                </div>
                <input
                  id="default-checkbox"
                  type="checkbox"
                  checked={members.some(
                    (user: User) => user._id === member._id
                  )}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateMembers({
                        type: "ADD",
                        payload: member,
                      });
                    } else {
                      updateMembers({
                        type: "REMOVE",
                        payload: member._id,
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
          className="px-6 p-2 bg-blue-600 text-blue-50 rounded-sm font-semibold hover:bg-blue-700 group transition disabled:opacity-75"
          disabled={loading && method.update}
          onClick={() => {
            store.dispatch(
              updateTicket(ticket._id, {
                team: members.map((member: User) => member._id),
              })
            );
          }}
        >
          {loading && method.update ? <ThreeDotsLoader /> : "Assign"}
        </button>
      </div>
    </Modal>
  );
};

export default TicketAssignModal;
