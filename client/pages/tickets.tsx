import React from "react";
import { useSelector } from "react-redux";
import { storeType } from "../redux/configureStore";
import MyTicketsDetailsBar from "../components/pages/my-tickets/details";
import MyTicketsSection from "../components/pages/my-tickets/tickets";

const tickets = () => {
  const tickets = useSelector((store: storeType) => store.tickets);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <MyTicketsDetailsBar tickets={tickets.tickets} />
      <MyTicketsSection tickets={tickets.tickets} />
    </div>
  );
};

export default tickets;
