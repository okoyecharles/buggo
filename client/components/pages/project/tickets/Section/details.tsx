import React from "react";
import Ticket from "../../../../../redux/reducers/tickets/types";

interface TicketDetailsBarProps {
  ticket: Ticket | null;
  open: boolean;
  setOpen: any;
}

const TicketDetailsBar: React.FC<TicketDetailsBarProps> = ({
  open,
  setOpen,
  ticket,
}) => {
  return (
    <aside className="bg-gray-850 absolute top-0 right-0 w-56 h-full hidden">

    </aside>
  );
};

export default TicketDetailsBar;
