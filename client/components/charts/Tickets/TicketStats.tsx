import React from "react";
import TicketsByType from "./TicketsByType";
import { storeType } from "../../../redux/configureStore";

interface Props {
  ticketStore: storeType["tickets"];
}

const TicketStats: React.FC<Props> = ({
  ticketStore: { error, loading, tickets },
}) => {
  return tickets.length && !loading ? (
    <TicketsByType tickets={tickets} />
  ) : (
    <div className="no-tickets flex flex-col justify-center xl:flex-1">
      <h3 className="text-blue-500/90 text-lg mb-4 font-bold text-center">You don't have enough tickets</h3>
      <p className="text-center text-ss text-gray-400">
        You need at least 1 ticket to view these statistics. You can create
        a ticket on a project you have been assigned to.
      </p>
    </div>
  );
};

export default TicketStats;
