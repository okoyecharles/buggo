import React, { useState } from "react";
import MyTicketsSearch from "./search";
import { GroupedTickets, Ticket } from "../../../types/models";
import MyTicketsProjects from "./projects";

interface MyTicketsDetailsBarProps {
  group: GroupedTickets[];
}

const MyTicketsDetailsBar: React.FC<MyTicketsDetailsBarProps> = ({ group }) => {
  const [search, setSearch] = useState<string>("");

  return (
    <aside className="my-tickets-details-bar w-full lg:w-60 bg-gray-850 z-50">
      <header
        className="
        p-2 px-2 h-16 flex shadow-sm shadow-gray-950
        "
      >
        <MyTicketsSearch search={search} setSearch={setSearch} />
      </header>
      <div className="py-2 pl-2 overflow-y-auto">
        <MyTicketsProjects group={group} />
      </div>
    </aside>
  );
};

export default MyTicketsDetailsBar;
