import React from "react";
import { GroupedTickets, Ticket } from "../../../types/models";
import { returnWithTwoDigitsOrMore } from "../../../utils/components/string";
import { useSelector } from "react-redux";
import { storeType } from "../../../../redux/configureStore";
import moment from "moment";

interface MyTicketsStatsProps {
  group: GroupedTickets[];
}

const getTicketsCreatedThisWeek = (tickets: Ticket[]) => {
  const now = moment().startOf("week");
  return tickets.filter((ticket) => {
    const ticketDate = moment(ticket.createdAt);
    return ticketDate >= now;
  }).length;
};

const getTicketsCreatedThisMonth = (tickets: Ticket[]) => {
  const now = moment().startOf("month");
  return tickets.filter((ticket) => {
    const ticketDate = moment(ticket.createdAt);
    return ticketDate >= now;
  }).length;
};

const MyTicketsStats: React.FC<MyTicketsStatsProps> = ({ group }) => {
  const tickets = useSelector((store: storeType) => store.tickets.tickets);

  return (
    <ul className="flex gap-2 overflow-x-scroll px-4 py-3">
      <li className="h-24 min-w-[7rem] rounded bg-gray-900 hover:bg-gray-950 flex flex-col justify-center items-center select-none transition-colors p-2">
        <p className="text-3xl font-bold text-blue-400">
          {returnWithTwoDigitsOrMore(
            group.reduce((a, b) => a + b.ticketCount.open, 0)
          )}
        </p>
        <p className="font-bold text-sm text-blue-500">Open Tickets</p>
      </li>
      <li className="h-24 min-w-[7rem] rounded bg-gray-900 hover:bg-gray-950 flex flex-col justify-center items-center select-none transition-colors p-2">
        <p className="text-3xl font-bold text-red-400">
          {returnWithTwoDigitsOrMore(
            group.reduce((a, b) => a + b.ticketCount.closed, 0)
          )}
        </p>
        <p className="font-bold text-sm text-red-500">Closed Tickets</p>
      </li>
      <li className="h-24 min-w-[7rem] rounded bg-gray-900 hover:bg-gray-950 flex flex-col justify-center items-center select-none transition-colors p-2">
        <p className="text-3xl font-bold text-green-400">
          {returnWithTwoDigitsOrMore(getTicketsCreatedThisWeek(tickets))}
        </p>
        <p className="font-bold text-sm text-green-500">This week</p>
      </li>
      <li className="h-24 min-w-[7rem] rounded bg-gray-900 hover:bg-gray-950 flex flex-col justify-center items-center select-none transition-colors p-2">
        <p className="text-3xl font-bold text-green-400">
          {returnWithTwoDigitsOrMore(getTicketsCreatedThisMonth(tickets))}
        </p>
        <p className="font-bold text-sm text-green-500">This month</p>
      </li>
    </ul>
  );
};

export default MyTicketsStats;
