import React, { useMemo, useState } from "react";
import { BsDot, BsFilter, BsPlusLg } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import TicketRow from "./Row";
import TicketDetailsBar from "../details";
import Paginate from "../../pagination";
import { Ticket } from "../../../types/models";
import { useSelector } from "react-redux";
import { storeType } from "../../../../redux/configureStore";
import CreateTicketModal from "../modal/ticketCreate";
import Authorized from "../../../utils/authorization";
import { a, useSpring, useTrail } from "@react-spring/web";

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
  const user = useSelector((store: storeType) => store.currentUser.user);
  const project = useSelector((store: storeType) => store.project.project);

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
    return tickets.filter((ticket) => ticket.author === user?._id);
  };

  const [ticketsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filterByAuthor(
    filterByStatus(tickets || [], statusFilter),
    authorFilter
  )?.slice(indexOfFirstTicket, indexOfLastTicket)!;
  const totalTicketsLength = filterByAuthor(
    filterByStatus(tickets || [], statusFilter),
    authorFilter
  ).length;

  const ticketPageCount = Math.ceil(totalTicketsLength / ticketsPerPage);
  const handleTicketPageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  const canCreateTicket = useMemo(() => {
    return Authorized("project", "ticket-create", user, project);
  }, [user, project]);

  const ticketListTrail = useTrail(currentTickets.length, {
    from: { y: 30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { mass: 1, tension: 1000, friction: 100 },
  });
  const ticketListSpring = useSpring({
    from: { height: 0 },
    to: { height: currentTickets.length ? (70 * currentTickets.length) : 80 },
    config: { mass: 1, tension: 1000, friction: 100 },
  });

  return (
    <section className="project-tickets flex-1 relative">
      <header className="p-3 px-6 h-16 lg:px-3 shadow-sm items-center shadow-gray-950 flex justify-between">
        <h1 className="font-bold text-gray-100 text-lg">Tickets</h1>
        {canCreateTicket ? (
          <>
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
          </>
        ) : null}
      </header>
      <div className="tickets-filter flex p-4">
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
          <Tooltip
            anchorId="status-filter"
            content={`Filter by status - ${statusFilter}`}
          />
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
          <Tooltip
            anchorId="author-filter"
            content={`Filter by author - ${authorFilter}`}
          />
        </div>
      </div>
      <div className="tickets-grid text-ss lg:text-base overflow-x-scroll lg:overflow-visible">
        {tickets?.length ? (
          <div className="tickets-grid-container w-[992px] lg:w-auto">
            <header className="grid gap-2 grid-cols-6 lg:grid-cols-16 xl:grid-cols-15 lg:px-4 uppercase">
              <div className="py-3 px-1 pl-4 text-sm text-gray-200 font-bold font-noto lg:col-span-4">
                Ticket
              </div>
              <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto lg:col-span-2">
                Priority
              </div>
              <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto lg:col-span-2">
                Status
              </div>
              <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto lg:col-span-2">
                Type
              </div>
              <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto lg:col-span-2">
                Created
              </div>
              <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto lg:col-span-4 xl:col-span-3">
                Assigned
              </div>
            </header>
            <hr className="border-gray-700 lg:mx-4" />
            <a.ul className="lg:px-4 flex flex-col" style={ticketListSpring}>
              {currentTickets.length ? (
                currentTickets.map((ticket, index) => (
                  <TicketRow
                    key={ticket._id}
                    ticket={ticket}
                    showTicketDetails={setTicketDetailsOpen}
                    setTicketDetails={setTicketDetails}
                    ticketDetails={ticketDetails}
                    ticketRowTrail={ticketListTrail[index]}
                  />
                ))
              ) : (
                <div className="p-4 text-gray-300 flex flex-col  lg:items-center justify-center">
                  <h3 className="text-lg font-semibold text-orange-500">
                    No tickets matched the current filter
                  </h3>
                  <p className="text-ss text-gray-400">
                    This means that no{" "}
                    {statusFilter === "open" ? "open" : "closed"} tickets
                    created by {authorFilter === "me" ? "you" : "anyone"} were
                    found on this project.
                  </p>
                </div>
              )}
            </a.ul>
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
            totalItems={totalTicketsLength}
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
