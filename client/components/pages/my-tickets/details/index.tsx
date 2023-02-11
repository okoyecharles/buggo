import React from "react";
import MyTicketsSearch from "./search";
import { Ticket } from "../../../../types/models";

interface MyTicketsDetailsBarProps {
  tickets: Ticket[];
}

const MyTicketsDetailsBar: React.FC<MyTicketsDetailsBarProps> = ({
  tickets,
}) => {
  const getTicketsProjects = (tickets: Ticket[]) => {
    const projects: {
      _id: string;
      title: string;
    }[] = [];

    tickets.forEach((ticket) => {
      if (!projects.some((project) => project._id === ticket.project._id)) {
        projects.push({
          _id: ticket.project._id,
          title: ticket.project.title,
        });
      }
    });

    return projects;
  };

  return (
    <aside className="my-tickets-details-bar w-full lg:w-56 bg-gray-850 relative">
      <header
        className="
        p-3 px-6 h-16 lg:px-3 flex justify-between items-center shadow-sm shadow-gray-950 font-semibold text-gray-300 cursor-pointer transition-colors
        hover:bg-gray-825 hover:text-gray-100
        "
      >
        <MyTicketsSearch />
      </header>
    </aside>
  );
};

export default MyTicketsDetailsBar;
