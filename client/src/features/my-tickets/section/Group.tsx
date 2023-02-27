import React, { useEffect, useState } from "react";
import { GroupedTickets } from "../../../types/models";
import TicketGroupRow from "./Row";
import { a, useSpring, useTrail } from "@react-spring/web";
import { BsPlus, BsPlusLg } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import Link from "next/link";

interface TicketGroupProps {
  project: GroupedTickets;
  scrolledTicketGroup: { id: string } | null;
}

const TicketGroup: React.FC<TicketGroupProps> = ({
  project,
  scrolledTicketGroup,
}) => {
  const [groupOpen, setGroupOpen] = useState(true);
  const [groupScrolled, setGroupScrolled] = useState(false);
  const [groupScrolledTimeoutID, setGroupScrolledTimeoutID] =
    useState<any>(null);

  const trail = useTrail(project.tickets.length, {
    translateX: groupOpen ? "0%" : "-110%",
    config: {
      tension: 400,
      friction: 40,
    },
  });

  const toggleSpring = useSpring({
    height: groupOpen ? `${project.tickets.length * (57.59 + 8)}px` : "0px",
    config: {
      tension: 400,
      friction: 40,
    },
  });

  useEffect(() => {
    const projectId = scrolledTicketGroup?.id.split("-")[2];
    if (projectId === project._id) {
      setGroupScrolled(true);
      clearTimeout(groupScrolledTimeoutID);
      setGroupScrolledTimeoutID(
        setTimeout(() => {
          setGroupScrolled(false);
        }, 2000)
      );
    } else {
      setGroupScrolled(false);
    }
  }, [scrolledTicketGroup]);

  return (
    <article key={project._id}>
      <header
        className={`flex items-center gap-1 font-noto font-semibold text-gray-200 hover:text-white py-1 my-1 cursor-pointer group ${
          groupScrolled ? "bg-blue-500/40 text-white" : ""
        } transition-all px-2 md:px-0 md:rounded`}
        onClick={() => setGroupOpen((prev) => !prev)}
        id={`ticket-group-${project._id}`}
      >
        <button>
          <MdOutlineKeyboardArrowRight
            className={`text-xl  text-blue-400 ${
              groupOpen ? "rotate-90" : "rotate-0"
            } transition-all`}
          />
        </button>
        <span className="truncate">
          {project.title}
        </span>
        <Link
          href={`/project/${project._id}`}
          className="ml-auto text-xl text-gray-200 transition opacity-0 group-hover:opacity-100 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <AiOutlineLink />
        </Link>
      </header>
      <a.ul
        className="flex flex-col md:gap-2 overflow-hidden"
        style={toggleSpring}
      >
        {project.tickets.map((ticket, i) => (
          <TicketGroupRow
            springProps={trail[i]}
            ticket={ticket}
            key={ticket._id}
          />
        ))}
      </a.ul>
    </article>
  );
};

export default TicketGroup;
