import React, { useEffect, useRef, useState } from "react";
import { BsDot, BsFilter, BsPlusLg } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import CreateTicketModal from "../Modals/ticketCreate";
import TicketRow from "./Row";
import TicketDetailsBar from "./details";
import Paginate from "../../../../Pagination";
import { Ticket } from "../../../../../types/models";
import { useSelector } from "react-redux";
import { storeType } from "../../../../../redux/configureStore";

interface TicketsSectionProps {
  tickets: Ticket[] | undefined;
  loading: boolean;
  method: any;
  ticketCreateOpen: boolean;
  setTicketCreateOpen: any;
}

const TicketsSection: React.FC<TicketsSectionProps> = ({
  ticketCreateOpen,
  setTicketCreateOpen,
  tickets,
  loading,
  method,
}) => {
  const currentUser = useSelector((store: storeType) => store.currentUser);

  const [ticketDetailsOpen, setTicketDetailsOpen] = useState<boolean>(false);
  const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");

  const filterByStatus = (tickets: Ticket[], status: string) => {
    if (status === "all") return tickets;
    return tickets.filter((ticket) => ticket.status === status);
  };

  const filterByAuthor = (tickets: any[], author: string) => {
    if (author === "all") return tickets;
    return tickets.filter((ticket) => ticket.author === currentUser.user?._id);
  };

  const [ticketsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filterByAuthor(
    filterByStatus(tickets || [], statusFilter),
    authorFilter
  )?.slice(indexOfFirstTicket, indexOfLastTicket)!;

  const ticketPageCount = Math.ceil((tickets?.length || 0) / ticketsPerPage);
  const handleTicketPageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <section className="project-tickets flex-1 relative z-20">
      <header className="p-3 px-6 h-16 lg:px-3 shadow-sm items-center shadow-gray-950 flex justify-between">
        <h1 className="font-bold text-gray-100 text-lg">Tickets</h1>
        <button
          className="group cursor-pointer disabled:opacity-75"
          id="create-ticket"
          onClick={() => {
            setTicketCreateOpen(true);
          }}
          disabled={loading && method.details}
        >
          <BsPlusLg className="bg-gray-700 text-blue-400 group-hover:bg-blue-500 text-4xl p-3 rounded-full group-hover:text-white group-hover:rounded-xl group-active:bg-blue-600 transition disabled:opacity-75" />
        </button>
        <Tooltip
          anchorId="create-ticket"
          content="Create Ticket"
          place="left"
        />
      </header>
      <div className="tickets-filter flex px-4 pt-4">
        <div className="tickets-filter-container flex  rounded overflow-hidden">
          <span className="bg-gray-900 select-none flex items-center justify-center p-1">
            <BsFilter className="text-2xl text-orange-400" />
          </span>
          <button className="text-sm flex items-center pl-4 bg-gray-850 border-r border-r-gray-700 font-semibold text-gray-100 relative">
            {statusFilter === "all"
              ? "All Statuses"
              : statusFilter === "open"
              ? "Open"
              : "Closed"}{" "}
            <BsDot className="text-2xl text-gray-600" />
            <select
              name="status-filter"
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </button>
          <button className="text-sm flex items-center pl-2 bg-gray-850 font-semibold text-gray-100 relative">
            {authorFilter === "me" ? "Me" : "Everyone"}{" "}
            <BsDot className="text-2xl text-gray-600" />
            <select
              name="author-filter"
              id="author-filter"
              value={authorFilter}
              onChange={(e) => {
                setAuthorFilter(e.target.value);
              }}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="all">Everyone</option>
              <option value="me">Me</option>
            </select>
          </button>
        </div>
      </div>
      <div className="tickets-grid overflow-x-scroll text-ss lg:text-base">
        {tickets?.length ? (
          <div className="tickets-grid-container w-[992px] lg:w-auto">
            <header className="grid gap-2 grid-cols-6 lg:grid-cols-7 px-4 mt-4 uppercase">
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
              <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto ">
                Assigned
              </div>
            </header>
            <ul className="px-4 flex flex-col">
              {currentTickets.length ? (
                currentTickets.map((ticket) => (
                  <TicketRow
                    key={ticket._id}
                    ticket={ticket}
                    showTicketDetails={setTicketDetailsOpen}
                    setTicketDetails={setTicketDetails}
                    ticketDetails={ticketDetails}
                  />
                ))
              ) : (
                <div className="p-4 text-gray-300 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold text-orange-500">
                    No tickets matched the current filter
                  </h3>
                  <p className="text-ss text-gray-400 text-center">
                    This means that no{" "}
                    {statusFilter === "open" ? "open" : "closed"} tickets
                    created by {authorFilter === "me" ? "you" : "anyone"} were
                    found on this project.
                  </p>
                </div>
              )}
            </ul>
          </div>
        ) : (
          <div className="p-4 text-gray-300 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-blue-500">
              No tickets found for this project
            </h3>
            <p className="text-ss text-gray-400 text-center">
              You can be the first to create a ticket for this project by
              clicking the <span className="text-blue-500">+</span> icon
            </p>
          </div>
        )}
      </div>
      {tickets?.length ? (
        <div className="p-3 px-6 flex justify-center lg:justify-end">
          <Paginate
            pageCount={ticketPageCount}
            handlePageChange={handleTicketPageChange}
            indexOfFirstItem={indexOfFirstTicket}
            indexOfLastItem={indexOfLastTicket}
            totalItems={currentTickets?.length || 0}
            itemName="ticket"
          />
        </div>
      ) : null}
      <CreateTicketModal
        open={ticketCreateOpen}
        setOpen={setTicketCreateOpen}
        loading={loading}
        method={method}
      />
      <TicketDetailsBar
        ticket={ticketDetails}
        open={ticketDetailsOpen}
        setOpen={setTicketDetailsOpen}
      />
    </section>
  );
};

export default TicketsSection;
