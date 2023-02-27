import React from "react";
import { Ticket } from "../../../types/models";
import { getTicketPriority } from "../../../utils/strings/class";
import getDate from "../../../utils/strings/date";
import { BsCheck } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { a } from "@react-spring/web";

interface MyTicketsRowProps {
  ticket: Ticket;
  springProps: any;
}

const TicketGroupRow: React.FC<MyTicketsRowProps> = ({ ticket, springProps }) => {
  return (
    <a.li
      className="ticket-row grid gap-2 grid-cols-4 md:grid-cols-5 py-[15.5px] md:py-3 border-b border-gray-700 md:border-none md:rounded-md md:bg-gray-825 hover:bg-gray-850 transition-colors"
      style={springProps}
    >
      <header className="flex items-center gap-2 col-span-2 px-1 md:pl-4">
        <span
          className={`p-1 m-1 rounded-full h-fit w-fit ${
            ticket?.status === "closed"
              ? "bg-red-500 text-red-50"
              : "bg-blue-500 text-blue-50"
          }`}
        >
          {ticket?.status === "closed" ? (
            <IoMdClose className="text-lg" id="ticket-status-icon-closed" />
          ) : (
            <BsCheck className="text-lg" id="ticket-status-icon-open" />
          )}
        </span>
        <h3 className="font-semibold font-noto text-gray-100 truncate">
          {ticket?.title}
        </h3>
      </header>
      <div className="items-center px-1 hidden md:flex">
        <button
          className={`${getTicketPriority(
            ticket?.priority
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket?.priority}
        </button>
      </div>
      <div className="flex items-center px-1">
        <span className="capitalize text-sm xl:text-ss text-orange-400 font-semibold font-noto">
          {ticket?.type}
        </span>
      </div>
      <div className="flex items-center px-1 pr-4">
        <span className="text-sm xl:text-ss text-gray-200 font-noto">
          {getDate(ticket?.createdAt, { format: "L" })}
        </span>
      </div>
    </a.li>
  );
};

export default TicketGroupRow;
