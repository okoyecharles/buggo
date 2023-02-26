import React from "react";
import { GroupedTickets } from "../../../types/models";
import MyTicketsStats from "./Stats";
import TicketGroup from "./Group";

interface MyTicketsSectionProps {
  group: GroupedTickets[];
  scrolledTicketGroup: { id: string } | null;
}

const MyTicketsSection: React.FC<MyTicketsSectionProps> = ({ group, scrolledTicketGroup }) => {
  return (
    <section className="flex-1 relative">
      <header className="py-3 px-6 h-16 shadow-sm items-center shadow-gray-950 flex justify-between">
        <h1 className="font-bold text-gray-100 text-lg">My Tickets</h1>
      </header>
      <div className="py-3">
        <MyTicketsStats group={group} />
        <div className="tickets-grid text-ss lg:text-base">
          {group?.length && (
            <div className="tickets-grid-container">
              <hr className="border border-gray-850" />
              <header className="grid gap-2 grid-cols-4 md:grid-cols-5 px-4 mt-4 uppercase">
                <div className="py-3 text-sm text-gray-200 font-bold font-noto col-span-2">
                  Status / Title
                </div>
                <div className="py-3 text-sm text-gray-200 font-bold font-noto hidden md:block">
                  Priority
                </div>
                <div className="py-3 text-sm text-gray-200 font-bold font-noto ">
                  Type
                </div>
                <div className="py-3 text-sm text-gray-200 font-bold font-noto ">
                  Created
                </div>
              </header>

              <hr className="border-gray-700 md:mx-4" />

              <div className="tickets-project-container md:px-4 flex flex-col gap-1">
                {group.map((project) => (
                  <TicketGroup project={project} scrolledTicketGroup={scrolledTicketGroup} key={project._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyTicketsSection;
