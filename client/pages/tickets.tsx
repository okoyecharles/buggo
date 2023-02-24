import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import store, { storeType } from "../redux/configureStore";
import MyTicketsDetailsBar from "../src/features/my-tickets/details";
import MyTicketsSection from "../src/features/my-tickets/section";
import { fetchTickets } from "../redux/actions/ticketActions";
import { GroupedTickets, Ticket } from "../src/types/models";
import Head from "next/head";

const tickets = () => {
  const tickets = useSelector((store: storeType) => store.tickets);
  const user = useSelector((store: storeType) => store.currentUser.user);

  useEffect(() => {
    store.dispatch(fetchTickets());
  }, []);

  const groupTicketsByProjects = (tickets: Ticket[]) => {
    const projects: GroupedTickets[] = [];
    tickets.forEach((ticket) => {
      const projectExists = projects.some(
        (project) => project._id === ticket.project._id
      );

      if (!projectExists) {
        projects.push({
          _id: ticket.project._id,
          title: ticket.project.title,
          ticketCount: {
            open: 0,
            closed: 0,
          },
          tickets: [],
        });
      }
      const ticketOpen = ticket.status === "open";
      const projectIndex = projects.findIndex(
        (project) => project._id === ticket.project._id
      );

      if (ticketOpen) {
        projects[projectIndex].ticketCount.open++;
      } else {
        projects[projectIndex].ticketCount.closed++;
      }
      projects[projectIndex].tickets.push(ticket);
    });
    return projects;
  };

  return (
    <>
      <Head>
        <title>Tickets</title>
      </Head>
      <div className="flex flex-col lg:flex-row h-full isolate">
        <MyTicketsDetailsBar group={groupTicketsByProjects(tickets.tickets)} />
        <MyTicketsSection group={groupTicketsByProjects(tickets.tickets)} />
      </div>
    </>
  );
};

export default tickets;
