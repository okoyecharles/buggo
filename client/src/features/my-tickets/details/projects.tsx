import React from "react";
import { GroupedTickets } from "../../../types/models";
import { Tooltip } from "react-tooltip";
import { returnWithTwoDigitsOrMore } from "../../../utils/stringHelper";

interface MyTicketsProjectsProps {
  group: GroupedTickets[];
}

const MyTicketsProjects: React.FC<MyTicketsProjectsProps> = ({ group }) => {

  return (
    <>
      <header className="flex-1 p-1 mb-4 flex items-center gap-1">
        <span className="uppercase text-gray-100 text-sm font-semibold">
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
      <ul className="flex flex-col text-ss font-semibold">
        <li className="bg-gray-700 p-2 rounded-l-md text-gray-100 flex gap-1 mb-4 select-none cursor-pointer transition-colors">
          <span>All Projects</span>
          <span className="ml-auto flex items-center justify-end w-6 truncate text-sm">
            {returnWithTwoDigitsOrMore(
              group.reduce(
                (a, b) => a + b.ticketCount.open,
                0
              )
            )}
          </span>
          <span className="w-6 flex items-center justify-end text-gray-400 mr-1 truncate text-sm">
            {returnWithTwoDigitsOrMore(
              group.reduce(
                (a, b) => a + b.ticketCount.closed,
                0
              )
            )}
          </span>
        </li>
        {group.map((project) => (
          <li
            className="hover:bg-gray-700 p-2 rounded-l-md text-gray-100 flex gap-1 select-none cursor-pointer transition-colors"
            key={project._id}
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
    </>
  );
};

export default MyTicketsProjects;
