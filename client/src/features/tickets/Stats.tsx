import React from "react";
import { storeType } from "../../../redux/configureStore";
import { a, useTrail } from "@react-spring/web";
import TicketGroupChart from "./charts";

interface Props {
  ticketStore: storeType["tickets"];
}

const TicketStats: React.FC<Props> = ({
  ticketStore: { loading, tickets },
}) => {
  const trail = useTrail(3, {
    from: { y: 40, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { mass: 1, tension: 1000, friction: 100 },
  });

  return (
    <>
      <div className="flex flex-col md:flex-row xl:flex-col gap-4 relative">
        <a.div
          style={trail[0]}
          className="row-span-1 bg-gray-900 p-3 rounded shadow flex-1 relative"
        >
          <TicketGroupChart tickets={tickets} subject="type" />
        </a.div>
        <a.div
          style={trail[1]}
          className="row-span-1 bg-gray-900 p-3 rounded shadow flex-1 relative"
        >
          <TicketGroupChart tickets={tickets} subject="status" />
        </a.div>
        <a.div
          style={trail[2]}
          className="row-span-1 bg-gray-900 p-3 rounded shadow flex-1 relative"
        >
          <TicketGroupChart tickets={tickets} subject="priority" />
        </a.div>
        <div
          className={`no-tickets flex flex-col justify-center xl:flex-1 absolute top-0 left-0 w-full h-full bg-gray-850 ${
            tickets.length === 0 && !loading
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } transition-all`}
        >
          <h3 className="text-blue-500 text-lg mb-4 font-bold text-center">
            You don't have enough tickets
          </h3>
          <p className="text-center text-ss text-gray-400">
            You need at least 1 ticket to view these statistics. You can create
            a ticket on a project you are a member of.
          </p>
        </div>
      </div>
    </>
  );
};

export default TicketStats;
