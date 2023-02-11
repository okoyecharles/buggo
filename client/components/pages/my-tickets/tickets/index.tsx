import React from "react";
import { Ticket } from "../../../../types/models";

interface MyTicketsSectionProps {
  tickets: Ticket[];
}

const MyTicketsSection: React.FC<MyTicketsSectionProps> = ({ tickets }) => {
  return (
    <section className="my-tickets flex-1 relative">Tickets go here</section>
  );
};

export default MyTicketsSection;
