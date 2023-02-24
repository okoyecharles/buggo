import React, { useEffect } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Pluralize from "react-pluralize";
import getDate from "../../../utils/dateHelper";
import { Ticket } from "../../../types/models";
import { getTicketPriority, getTicketStatus } from "../../../utils/classHelper";

interface TicketRowProps {
  ticket: Ticket | undefined;
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
    if (ticket?._id === ticketDetails?._id) setTicketDetails(ticket);
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
          {ticket?.title}
        </h3>
        <div className="flex gap-4">
          <span className="text-gray-200 text-sm font-semibold flex items-center gap-1">
            <FaCommentAlt className="text-base text-orange-500/80" />
            {ticket?.comments.length}
          </span>
          <span className="text-gray-200 text-sm font-semibold flex items-center gap-1">
            <AiFillClockCircle className="text-base text-orange-500/80" />
            <Pluralize singular="hr" count={ticket?.time_estimate} />
          </span>
        </div>
      </header>
      <div className="flex items-center px-1">
        <button
          className={`${getTicketPriority(
            ticket?.priority
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket?.priority}
        </button>
      </div>
      <div className="flex items-center px-1">
        <button
          className={`${getTicketStatus(
            ticket?.status
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket?.status}
        </button>
      </div>
      <div className="flex items-center px-1">
        <span className="capitalize text-sm xl:text-ss text-orange-400 font-semibold font-noto">
          {ticket?.type}
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
