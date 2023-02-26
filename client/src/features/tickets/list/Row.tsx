import React, { useCallback, useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Pluralize from "react-pluralize";
import getDate from "../../../utils/dateHelper";
import { Ticket } from "../../../types/models";
import { getTicketPriority, getTicketStatus } from "../../../utils/classHelper";
import { BsThreeDots } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import TicketOptionsPopup from "./Options";
import { useSelector } from "react-redux";
import { storeType } from "../../../../redux/configureStore";
import Image from "next/image";
import ImageRow from "../../../components/ImageRow";

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
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const project = useSelector((store: storeType) => store.project.project);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Set ticket details if the ticket id matches the ticket details id
    if (ticket?._id === ticketDetails?._id) setTicketDetails(ticket);
  }, [ticket]);

  const isInProjectTeam = useCallback(() => {
    return project?.team.some(
      (member: any) => member._id === currentUser.user?._id
    );
  }, [project, currentUser.user?._id]);

  return (
    <li
      className="ticket-row grid gap-2 grid-cols-6 lg:grid-cols-16 xl:grid-cols-15 pt-2 pb-4 border-b border-gray-600 hover:bg-gray-850 transition-all group relative cursor-pointer"
      onClick={() => {
        showTicketDetails(true);
        setTicketDetails(ticket);
      }}
    >
      <header className="flex flex-col gap-1 lg:col-span-4 px-1 pl-4 select-none">
        <h3 className="font-semibold font-noto text-gray-100">
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
      <div className="flex items-center px-1 lg:col-span-2">
        <button
          className={`${getTicketPriority(
            ticket?.priority
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket?.priority}
        </button>
      </div>
      <div className="flex items-center px-1 lg:col-span-2">
        <button
          className={`${getTicketStatus(
            ticket?.status
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket?.status}
        </button>
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
          // Show options button if user is a project member
          isInProjectTeam() ? (
            <button
              className="p-1 pr-4 items-center justify-center transition hidden lg:flex"
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
    </li>
  );
};

export default TicketRow;
