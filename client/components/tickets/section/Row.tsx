import React, { useMemo, useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Pluralize from "react-pluralize";
import getDate from "@/core/utils/strings/date";
import { Ticket } from "@/core/types/models";
import {
  getTicketPriority,
  getTicketStatus,
} from "@/core/utils/strings/class";
import { BsThreeDots } from "react-icons/bs";
import TicketOptionsPopup from "./Options";
import { useSelector } from "react-redux";
import { storeType } from "@/redux/configureStore";
import ImageRow from "@/core/components/imageCluster";
import getAuthorization from "@/core/utils/authorization";
import { a } from "@react-spring/web";
import { Tooltip } from "react-tooltip";

interface TicketRowProps {
  ticket: Ticket | undefined;
  ticketDetails: Ticket | null;
  showTicketDetails: any;
  setTicketDetails: any;
  ticketRowTrail: any;
}

const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  ticketDetails,
  showTicketDetails,
  setTicketDetails,
  ticketRowTrail,
}) => {
  const user = useSelector((store: storeType) => store.currentUser.user);
  const project = useSelector((store: storeType) => store.project.project);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Set ticket details if the ticket id matches the ticket details id
    if (ticket?._id === ticketDetails?._id) setTicketDetails(ticket);
  }, [ticket]);

  const canUpdateTicket = useMemo(() => {
    return getAuthorization("ticket", "update", user, project, ticket);
  }, [project, ticket, user?._id]);

  return (
    <a.li
      className="ticket-row min-h-[70px] grid gap-2 grid-cols-6 lg:grid-cols-16 xl:grid-cols-15 border-b border-gray-600 hover:bg-gray-850 transition-colors group relative cursor-pointer"
      id={`ticket-row-${ticket?._id}`}
      onClick={() => {
        setTicketDetails(ticket);
        showTicketDetails(true);
      }}
      style={ticketRowTrail}
    >
      <header className="flex flex-col gap-1 lg:col-span-4 px-1 pl-4 select-none justify-center">
        <h3
          className="font-semibold font-noto text-gray-100 truncate"
          id={`ticket-title-${ticket?._id}`}
        >
          {ticket?.title}
        </h3>
        <Tooltip
          anchorId={`ticket-title-${ticket?._id}`}
          content={ticket?.title}
          delayShow={1000}
        />
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
      <div className="flex items-center px-1 lg:col-span-2">
        <span
          className={`${getTicketPriority(
            ticket?.priority
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto hover:ring-4 transition-all`}
        >
          {ticket?.priority}
        </span>
      </div>
      <div className="flex items-center px-1 lg:col-span-2">
        <span
          className={`${getTicketStatus(
            ticket?.status
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto hover:ring-4 transition-all`}
        >
          {ticket?.status}
        </span>
      </div>
      <div className="flex items-center px-1 lg:col-span-2">
        <span className="capitalize text-sm xl:text-ss text-orange-400 font-semibold font-noto">
          {ticket?.type}
        </span>
      </div>
      <div className="flex items-center px-1 lg:col-span-2">
        <span className="text-sm xl:text-ss text-gray-200 font-noto">
          {getDate(ticket?.createdAt, { format: "L" })}
        </span>
      </div>
      <div className="flex items-center justify-between pl-1 lg:col-span-4 xl:col-span-3">
        <ImageRow
          model={ticket!}
          maxImages={3}
          continueText=" "
          emptyText="No team"
        />
        {
          // Every option behind it needs the same authorization, so without it
          // the menu would open empty
          canUpdateTicket ? (
            <button
              className="p-1 pr-4 items-center justify-center transition hidden lg:flex"
							name="options"
							aria-expanded={optionsOpen}
              aria-controls={`ticket-options-${ticket?._id}`}
							aria-label={`Ticket options for ${ticket?.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setOptionsOpen(!optionsOpen);
              }}
            >
              <BsThreeDots className="text-lg text-white opacity-0 group-hover:opacity-100" />
            </button>
          ) : null
        }
      </div>
      <TicketOptionsPopup
        open={optionsOpen}
        setOpen={setOptionsOpen}
        ticket={ticket!}
      />
    </a.li>
  );
};

export default TicketRow;
