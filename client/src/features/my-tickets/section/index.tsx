import React from "react";
import { GroupedTickets, Ticket } from "../../../types/models";
import MyTicketsStats from "./stats";
import { BsPlus, BsPlusLg } from "react-icons/bs";
import { FaCommentAlt } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";
import Pluralize from "react-pluralize";
import getDate from "../../../utils/dateHelper";
import { getTicketPriority, getTicketStatus } from "../../../utils/classHelper";
import MyTicketsRow from "./row";

interface MyTicketsSectionProps {
  group: GroupedTickets[];
}

const MyTicketsSection: React.FC<MyTicketsSectionProps> = ({ group }) => {
  return (
    <section className="flex-1 relative">
      <header className="py-3 px-6 h-16 shadow-sm items-center shadow-gray-950 flex justify-between">
        <h1 className="font-bold text-gray-100 text-lg">My Tickets</h1>
      </header>
      <div className="py-3">
        <MyTicketsStats group={group} />
        <div className="tickets-grid overflow-x-scroll text-ss lg:text-base">
          {group?.length && (
            <div className="tickets-grid-container w-[768px] lg:w-auto">
              <hr className="border border-gray-850" />
              <header className="grid gap-2 grid-cols-5 lg:grid-cols-6 px-4 mt-4 uppercase">
                <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto lg:col-span-2">
                  Ticket
                </div>
                <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto ">
                  Priority
                </div>
                <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto ">
                  Status
                </div>
                <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto ">
                  Type
                </div>
                <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto ">
                  Created
                </div>
              </header>

              <div className="tickets-project-container px-4 flex flex-col gap-8">
                {group.map((project) => (
                  <article key={project._id}>
                    <header className="flex items-center gap-2 font-noto font-semibold text-white my-2">
                      <button
                        className="group cursor-pointer"
                        id="create-ticket"
                      >
                        <BsPlus className="bg-gray-700 text-blue-400 group-hover:bg-blue-500 text-3xl p-1 rounded-full group-hover:text-white group-hover:rounded-xl group-active:bg-blue-600 transition disabled:opacity-75" />
                      </button>
                      {project.title}
                    </header>
                    <ul className="flex flex-col">
                      {project.tickets.map((ticket) => (
                        <MyTicketsRow ticket={ticket} key={ticket._id} />
                      ))}
                    </ul>
                  </article>
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
