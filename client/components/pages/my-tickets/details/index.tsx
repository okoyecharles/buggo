import React, { useState } from "react";
import MyTicketsSearch from "./search";
import { Ticket } from "../../../../types/models";
import MyTicketsProjects from "./projects";

interface MyTicketsDetailsBarProps {
  tickets: Ticket[];
}

const MyTicketsDetailsBar: React.FC<MyTicketsDetailsBarProps> = ({
  tickets,
}) => {
  const [search, setSearch] = useState<string>("");

  return (
    <aside className="my-tickets-details-bar w-full lg:w-60 bg-gray-850 relative">
      <header
        className="
        p-2 px-2 h-16 flex shadow-sm shadow-gray-950
        "
      >
        <MyTicketsSearch search={search} setSearch={setSearch} />
      </header>
      <div className="py-2 pl-2 h-full overflow-y-auto">
        <MyTicketsProjects tickets={tickets} />
      </div>
    </aside>
  );
};

export default MyTicketsDetailsBar;
