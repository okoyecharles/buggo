import React from "react";
import { GroupedTickets } from "../../../types/models";
import { Tooltip } from "react-tooltip";
import { returnWithTwoDigitsOrMore } from "../../../utils/components/string";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";

interface MyTicketsProjectsProps {
  group: GroupedTickets[];
  scrollToTicketGroup: (id: string) => void;
  setDetailsBarOpen: any;
}

const MyTicketsProjects: React.FC<MyTicketsProjectsProps> = ({
  group,
  scrollToTicketGroup,
  setDetailsBarOpen,
}) => {
  return (
    <>
      <header className="p-3 pr-5 lg:px-1 lg:pl-3 bg-gray-800 lg:bg-gray-900 flex items-center gap-1 z-40">
        <button
          className="rounded p-1 bg-gray-825 active:bg-gray-850 transition-colors shadow-sm mr-[1ch] lg:hidden"
          onClick={() => {
            setDetailsBarOpen(false);
          }}
        >
          <IoIosArrowBack className="text-2xl text-white" />
        </button>
        <span className="lg:uppercase text-white lg:text-gray-100 lg:text-sm font-semibold">
          Projects
        </span>
        <div id="open-tickets-icon" className="w-6 flex ml-auto justify-end">
          <span className="open-icon h-4 w-4 bg-blue-500 rounded"></span>
        </div>
        <div id="closed-tickets-icon" className="w-6 flex mr-2 justify-end">
          <span className="closed-icon h-4 w-4 bg-red-500 rounded"></span>
        </div>
        <Tooltip
          anchorId="open-tickets-icon"
          content="Open tickets"
          place="bottom"
        />
        <Tooltip
          anchorId="closed-tickets-icon"
          content="Closed tickets"
          place="bottom"
        />
      </header>
      <div className="ticket-group-project-list flex-1 relative">
        <ul className="flex flex-col text-ss font-semibold overflow-y-scroll w-full absolute top-0 bottom-0 p-4 lg:px-0 lg:pl-2">
          <li className="bg-gray-700 p-2 lg:rounded-l-md text-gray-100 flex gap-1 mb-4 select-none cursor-pointer transition-colors rounded">
            <span>All Projects</span>
            <span className="ml-auto flex items-center justify-end w-6 truncate text-sm">
              {returnWithTwoDigitsOrMore(
                group.reduce((a, b) => a + b.ticketCount.open, 0)
              )}
            </span>
            <span className="w-6 flex items-center justify-end text-gray-400 mr-1 truncate text-sm">
              {returnWithTwoDigitsOrMore(
                group.reduce((a, b) => a + b.ticketCount.closed, 0)
              )}
            </span>
          </li>
          {group.map((project) => (
            <li
              className="hover:bg-gray-750 active:bg-gray-700 p-2 lg:rounded-l-md text-gray-100 flex gap-1 select-none cursor-pointer transition-colors rounded"
              key={project._id}
              onClick={() => {
                setDetailsBarOpen(false);
                scrollToTicketGroup(`ticket-group-${project._id}`);
              }}
            >
              <span className="truncate">{project.title}</span>
              <span className="ml-auto flex items-center justify-end w-6 truncate text-sm">
                {returnWithTwoDigitsOrMore(project.ticketCount.open)}
              </span>
              <span className="w-6 flex items-center justify-end text-gray-400 mr-1 truncate text-sm">
                {returnWithTwoDigitsOrMore(project.ticketCount.closed)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MyTicketsProjects;
