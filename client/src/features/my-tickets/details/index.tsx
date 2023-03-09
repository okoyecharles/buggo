import React, { useState } from "react";
import { GroupedTickets, Ticket } from "../../../types/models";
import MyTicketsProjects from "./projects";

interface MyTicketsDetailsBarProps {
  group: GroupedTickets[];
  scrollToTicketGroup: (id: string) => void;
  detailsBarOpen: boolean;
  setDetailsBarOpen: any;
}

const MyTicketsDetailsBar: React.FC<MyTicketsDetailsBarProps> = ({
  group,
  scrollToTicketGroup,
  detailsBarOpen,
  setDetailsBarOpen,
}) => {
  return (
    <aside
      className={`
      my-tickets-details-bar
      fixed top-[64px] bottom-[60px] lg:static
      lg:translate-x-0 ${detailsBarOpen ? "translate-x-0" : "translate-x-full"}
      w-screen lg:w-60 bg-gray-850 z-50
      flex flex-col transition-all
    `}
    >
      <header className="py-3 px-6 h-16 items-center shadow-gray-950 justify-between bg-gray-800 z-10 hidden lg:flex">
        <h1 className="font-bold text-gray-100 text-lg z-50">My Tickets</h1>
      </header>
      <div className="flex flex-col flex-1">
        <MyTicketsProjects
          scrollToTicketGroup={scrollToTicketGroup}
          group={group}
          setDetailsBarOpen={setDetailsBarOpen}
        />
      </div>
    </aside>
  );
};

export default MyTicketsDetailsBar;
