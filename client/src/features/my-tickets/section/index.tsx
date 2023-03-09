import React from "react";
import { GroupedTickets } from "../../../types/models";
import MyTicketsStats from "./Stats";
import TicketGroup from "./Group";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

interface MyTicketsSectionProps {
  group: GroupedTickets[];
  scrolledTicketGroup: { id: string } | null;
  setDetailsBarOpen: any;
}

const MyTicketsSection: React.FC<MyTicketsSectionProps> = ({
  group,
  scrolledTicketGroup,
  setDetailsBarOpen,
}) => {
  return (
    <section className="flex-1 relative">
      <header className="p-3 px-4 md:px-10 lg:px-6 h-16 shadow-sm items-center shadow-gray-950 flex justify-between sticky top-[64px] bg-gray-800 z-10">
        <h1 className="font-bold text-gray-100 text-md z-50 lg:opacity-0 lg:select-none">
          My Tickets
        </h1>
        <button
          className="rounded p-1 bg-gray-825 active:bg-gray-850 transition-colors shadow-sm lg:hidden"
          onClick={() => {
            setDetailsBarOpen(true);
          }}
        >
          <HiOutlineMenuAlt3 className="text-2xl text-white" />
        </button>
      </header>
      <div className="lg:max-h-[calc(100vh-129px)] lg:overflow-y-scroll">
        <MyTicketsStats group={group} />
        <hr className="border border-gray-850" />
        <div className="ticket-group-grid text-ss lg:text-base">
          {group?.length ? (
            <div className="tickets-grid-container">
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

              <div
                className="tickets-project-container md:px-4 flex flex-col gap-1"
              >
                {group.map((project) => (
                  <TicketGroup
                    project={project}
                    scrolledTicketGroup={scrolledTicketGroup}
                    key={project._id}
                  />
                ))}
              </div>
            </div>
          ): (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-316px)] lg:h-[calc(100vh-258px)] p-4">
              <h1 className="text-blue-500 text-xl font-bold">
                No tickets found
              </h1>
              <p className="text-gray-300 text-ss text-center">
                You can create a new ticket by creating / joining a project, then creating a ticket in the project.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyTicketsSection;
