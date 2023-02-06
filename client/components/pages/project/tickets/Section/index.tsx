import React, { useState } from "react";
import Ticket from "../../../../../types/Ticket";
import { BsPlusLg } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import CreateTicketModal from "../Modals/ticketCreate";
import TicketRow from "./Row";
import TicketDetailsBar from "./details";
import Paginate from "../../../../Pagination";

interface TicketsSectionProps {
  tickets: Ticket[] | undefined;
  loading: boolean;
  method: any;
}

const TicketsSection: React.FC<TicketsSectionProps> = ({
  tickets,
  loading,
  method,
}) => {
  const [ticketCreateOpen, setTicketCreateOpen] = useState<boolean>(false);

  const [ticketDetailsOpen, setTicketDetailsOpen] = useState<boolean>(false);
  const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);

  const [ticketsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets?.slice(indexOfFirstTicket, indexOfLastTicket)!;

  const ticketPageCount = Math.ceil((tickets?.length || 0) / ticketsPerPage);
  const handleTicketPageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <section className="project-tickets flex-1 relative">
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
              {currentTickets.map((ticket) => (
                <TicketRow
                  ticket={ticket}
                  showTicketDetails={setTicketDetailsOpen}
                  setTicketDetails={setTicketDetails}
                  ticketDetails={ticketDetails}
                />
              ))}
            </ul>
          </div>
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
      </div>
      {tickets?.length && (
        <div className="p-3 px-6 flex justify-center lg:justify-end">
          <Paginate
            pageCount={ticketPageCount}
            handlePageChange={handleTicketPageChange}
            indexOfFirstItem={indexOfFirstTicket}
            indexOfLastItem={indexOfLastTicket}
            totalItems={tickets?.length || 0}
            itemName="ticket"
          />
        </div>
      )}
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
