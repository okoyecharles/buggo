import React from "react";
import Ticket from "../../../redux/reducers/tickets/types";
import { BsPlusLg } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import moment from "moment";

interface TicketsSectionProps {
  tickets: Ticket[] | undefined;
}

const getTicketPriority = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return "bg-blue-500 text-blue-50";
    case "medium":
      return "bg-orange-500 text-orange-50";
    case "high":
      return "bg-red-500 text-red-50";
    default:
      return "bg-gray-500 text-gray-50";
  }
};

const getTicketStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-500 text-blue-50";
    case "open":
      return "bg-blue-500 text-blue-50";
    case "in progress":
      return "bg-orange-500 text-orange-50";
    case "resolved":
      return "bg-green-500 text-green-50";
    case "closed":
      return "bg-red-500 text-red-50";
    default:
      return "bg-gray-500 text-gray-50";
  }
};

const TicketsSection: React.FC<TicketsSectionProps> = ({ tickets }) => {
  return (
    <section>
      <header className="p-3 px-6 h-16 lg:px-3 shadow-sm items-center shadow-gray-950 flex justify-between">
        <h1 className="font-bold text-gray-100 text-lg">Tickets</h1>
        <button className="group cursor-pointer" id="create-ticket">
          <BsPlusLg className="bg-gray-700 text-blue-400 group-hover:bg-blue-500 text-4xl p-3 rounded-full group-hover:text-white group-hover:rounded-xl group-active:bg-blue-600 transition disabled:opacity-75" />
        </button>
        <Tooltip
          anchorId="create-ticket"
          content="Create Ticket"
          place="left"
        />
      </header>
      <div className="tickets-grid">
        <header className="grid grid-cols-7 px-4 mt-4 uppercase">
          <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto col-span-2">
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
          <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto ">
            Assigned
          </div>
        </header>
        <ul className="px-4 flex flex-col">
          {tickets?.length ? (
            tickets.map((ticket) => (
              <li className="grid grid-cols-7 p-2 pb-4 border-b border-gray-600 hover:bg-gray-825 transition-all">
                <header className="flex flex-col gap-1 col-span-2">
                  <h3 className="font-semibold font-noto text-gray-100">
                    {ticket.title}
                  </h3>
                  <span className="text-white text-sm flex items-center gap-1">
                    <BiComment className="text-base text-orange-500" />
                    {ticket.comments.length}
                  </span>
                </header>
                <div className="flex items-center">
                  <span
                    className={`${getTicketPriority(
                      ticket.priority
                    )} bg-red-500 text-white rounded p-2 py-1 text-center w-24 font-semibold text-ss font-noto`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`${getTicketStatus(
                      ticket.status
                    )} bg-red-500 text-white rounded p-2 py-1 text-center w-24 font-semibold text-ss font-noto`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-ss text-orange-400 font-semibold font-noto">
                    {ticket.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-ss text-gray-200 font-noto">
                    {moment(ticket?.createdAt).format("L")}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-ss text-gray-500 font-noto text-center">
                    No team member assigned
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-gray-300 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-blue-500">
                No tickets found for this project
              </h3>
              <p className="text-ss text-gray-400 text-center">
                You can be the first to create a ticket for this project by
                clicking the <span className="text-blue-500">+</span> icon
              </p>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default TicketsSection;
