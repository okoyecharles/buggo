import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import store, { storeType } from "../redux/configureStore";
import MyTicketsDetailsBar from "../components/pages/my-tickets/details";
import MyTicketsSection from "../components/pages/my-tickets/tickets";
import { fetchTickets } from "../redux/actions/ticketActions";

const tickets = () => {
  const tickets = useSelector((store: storeType) => store.tickets);

  useEffect(() => {
    store.dispatch(fetchTickets());
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <MyTicketsDetailsBar tickets={tickets.tickets} />
      <MyTicketsSection tickets={tickets.tickets} />
    </div>
  );
};

export default tickets;
