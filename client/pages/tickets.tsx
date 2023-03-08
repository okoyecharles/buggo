import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import store, { storeType } from "../redux/configureStore";
import MyTicketsDetailsBar from "../src/features/my-tickets/details";
import MyTicketsSection from "../src/features/my-tickets/section";
import { fetchTickets } from "../redux/actions/ticketActions";
import { GroupedTickets, Ticket } from "../src/types/models";
import Head from "next/head";
import Layout from "../src/layout";

export default function Tickets() {
  const tickets = useSelector((store: storeType) => store.tickets);

  const [scrolledTicketGroup, setScrolledTicketGroup] = useState<null | {
    id: string;
  }>(null);
  const [detailsBarOpen, setDetailsBarOpen] = useState(false);

  useEffect(() => {
    store.dispatch(fetchTickets());
  }, []);

  const ticketsByProjects = useMemo(() => {
    const projects: GroupedTickets[] = [];
    tickets.tickets.forEach((ticket) => {
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
  }, [tickets.tickets]);

  const scrollToTicketGroup = (id: string) => {
    const sectionHeader = document.getElementById(id);
    if (sectionHeader) {
      sectionHeader.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setScrolledTicketGroup({
        id,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Tickets</title>
      </Head>
      <div className="flex flex-col lg:flex-row h-full isolate relative">
        <MyTicketsDetailsBar
          detailsBarOpen={detailsBarOpen}
          setDetailsBarOpen={setDetailsBarOpen}
          scrollToTicketGroup={scrollToTicketGroup}
          group={ticketsByProjects}
        />
        <MyTicketsSection
          setDetailsBarOpen={setDetailsBarOpen}
          group={ticketsByProjects}
          scrolledTicketGroup={scrolledTicketGroup}
        />
      </div>
    </>
  );
}

Tickets.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
