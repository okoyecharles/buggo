import { HiOutlineUsers, HiUsers } from "react-icons/hi";
import { IoTicket, IoTicketOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";

const navLinks = [
  {
    name: "Dashboard",
    icon: ({ className, active }: { className: string; active: boolean }) =>
      active ? (
        <MdSpaceDashboard className={className} title="Dashboard" />
      ) : (
        <MdOutlineSpaceDashboard className={className} title="Dashboard" />
      ),
    href: "/dashboard",
    admin: false
  },
  {
    name: "Tickets",
    icon: ({ className, active }: { className: string; active: boolean }) =>
      active ? (
        <IoTicket className={className} title="Tickets" />
      ) : (
        <IoTicketOutline className={className} title="Tickets" />
      ),
    href: "/tickets",
    admin: false
  },
  {
    name: "Users",
    icon: ({ className, active }: { className: string; active: boolean }) =>
      active ? (
        <HiUsers className={className} title="Users" />
      ) : (
        <HiOutlineUsers className={className} title="Users" />
      ),
    href: "/users",
    admin: true
  },
];

export default navLinks;
