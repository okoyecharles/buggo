import React from "react";
import { Ticket } from "../../../../types/models";
import { Tooltip } from "react-tooltip";
import { returnWithTwoDigitsOrMore } from "../../../../utils/stringHelper";

interface MyTicketsProjectsProps {
  tickets: Ticket[];
}

const MyTicketsProjects: React.FC<MyTicketsProjectsProps> = ({ tickets }) => {
  const getTicketsProjects = (tickets: Ticket[]) => {
    const projects: {
      _id: string;
      title: string;
      ticketCount: {
        open: number;
        closed: number;
      };
    }[] = [];
    tickets.forEach((ticket) => {
      const projectExists = projects.some(
        (project) => project._id === ticket.project._id
      );

      if (!projectExists) {
        projects.push({
          _id: ticket.project._id,
          title: ticket.project.title,
          ticketCount: {
            open: 0,
            closed: 0,
          },
        });
      }

      const ticketOpen = ticket.status === "open";
      const projectIndex = projects.findIndex(
        (project) => project._id === ticket.project._id
      );

      if (ticketOpen) {
        projects[projectIndex].ticketCount.open++;
      } else {
        projects[projectIndex].ticketCount.closed++;
      }
    });
    return projects;
  };

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
            {returnWithTwoDigitsOrMore(33)}
          </span>
          <span className="w-6 flex items-center justify-end text-gray-400 mr-1 truncate text-sm">
            {returnWithTwoDigitsOrMore(6)}
          </span>
        </li>
        {getTicketsProjects(tickets).map((project) => (
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
