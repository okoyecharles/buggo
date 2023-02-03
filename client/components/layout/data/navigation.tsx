import { HiUsers } from "react-icons/hi";
import { IoTicket } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";

const navLinks = [
  {
    name: "Dashboard",
    icon: (className: string) => (
      <MdSpaceDashboard className={className} title="Dashboard" />
    ),
    href: "/",
  },
  {
    name: "Tickets",
    icon: (className: string) => (
      <IoTicket className={className} title="Tickets" />
    ),
    href: "/tickets",
  },
  {
    name: "Users",
    icon: (className: string) => (
      <HiUsers className={className} title="Users" />
    ),
    href: "/users",
  },
];

export default navLinks;