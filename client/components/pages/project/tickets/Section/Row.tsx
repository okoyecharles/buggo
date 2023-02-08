import React, { useEffect } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Pluralize from "react-pluralize";
import getDate from "../../../../../utils/dateHelper";
import { Ticket } from "../../../../../types/models";

const getTicketPriority = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return "bg-blue-500 text-blue-50 ring-blue-500/30";
    case "medium":
      return "bg-orange-500 text-orange-50 ring-orange-500/30";
    case "high":
      return "bg-red-500 text-red-50 ring-red-500/30";
    default:
      return "bg-gray-500 text-gray-50 ring-gray-500/30";
  }
};

const getTicketStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-500 text-blue-50 ring-blue-500/30";
    case "open":
      return "bg-blue-500 text-blue-50 ring-blue-500/30";
    case "in progress":
      return "bg-orange-500 text-orange-50 ring-orange-500/30";
    case "resolved":
      return "bg-green-500 text-green-50 ring-green-500/30";
    case "closed":
      return "bg-red-500 text-red-50 ring-red-500/30";
    default:
      return "bg-gray-500 text-gray-50 ring-gray-500/30";
  }
};

interface TicketRowProps {
  ticket: Ticket;
  ticketDetails: Ticket | null;
  showTicketDetails: any;
  setTicketDetails: any;
}

const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  ticketDetails,
  showTicketDetails,
  setTicketDetails,
}) => {
  useEffect(() => {
    // Set ticket details if the ticket id matches the ticket details id
    if (ticket._id === ticketDetails?._id) setTicketDetails(ticket);
  }, [ticket]);

  return (
    <li className="ticket-row grid gap-2 grid-cols-6 lg:grid-cols-7 pt-2 pb-4 border-b border-gray-600 hover:bg-gray-825 transition-all">
      <header className="flex flex-col gap-1 lg:col-span-2 px-1 pl-2 select-none">
        <h3
          className="font-semibold font-noto text-gray-100 hover:underline cursor-pointer"
          onClick={() => {
            showTicketDetails(true);
            setTicketDetails(ticket);
          }}
        >
          {ticket.title}
        </h3>
        <div className="flex gap-4">
          <span className="text-gray-200 text-sm font-semibold flex items-center gap-1">
            <FaCommentAlt className="text-base text-orange-500/80" />
            {ticket.comments.length}
          </span>
          <span className="text-gray-200 text-sm font-semibold flex items-center gap-1">
            <AiFillClockCircle className="text-base text-orange-500/80" />
            <Pluralize singular="hr" count={ticket.time_estimate} />
          </span>
        </div>
      </header>
      <div className="flex items-center px-1">
        <button
          className={`${getTicketPriority(
            ticket.priority
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket.priority}
        </button>
      </div>
      <div className="flex items-center px-1">
        <button
          className={`${getTicketStatus(
            ticket.status
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket.status}
        </button>
      </div>
      <div className="flex items-center px-1">
        <span className="capitalize text-sm xl:text-ss text-orange-400 font-semibold font-noto">
          {ticket.type}
        </span>
      </div>
      <div className="flex items-center px-1">
        <span className="text-sm xl:text-ss text-gray-200 font-noto">
          {getDate(ticket?.createdAt, { format: "L" })}
        </span>
      </div>
      <div className="flex items-center px-1">
        <span className="text-sm text-gray-500 font-noto text-center">
          No team member assigned
        </span>
      </div>
    </li>
  );
};

export default TicketRow;
