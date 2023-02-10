import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef } from "react";
import store, { storeType } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { fetchProjectById } from "../../redux/actions/projectActions";
import ProjectDetailsBar from "../../components/pages/project/details";
import TicketsSection from "../../components/pages/project/tickets/Section";
import {
  socketCommentOnTicket,
  socketCreateTicket,
  socketDeleteTicket,
} from "../../redux/actions/ticketActions";
import SocketContext from "../../components/context/SocketContext";

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const project = useSelector((store: storeType) => store.project);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!project.loading && id) {
      store.dispatch(fetchProjectById(id as string, socket));
    }
  }, []);

  useEffect(() => {
    if (project.project?._id) {
      socket?.on("get-project-ticket", (ticket: any) => {
        store.dispatch(socketCreateTicket(ticket));
      });

      socket?.on("get-project-ticket-delete", (ticketId: any) => {
        store.dispatch(socketDeleteTicket(ticketId));
      });

      socket?.on("get-ticket-comment", (comment: any) => {
        store.dispatch(socketCommentOnTicket(comment));
      });
    }
  }, [project.project?._id]);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <ProjectDetailsBar
        project={project.project}
        loading={project.loading}
        method={project.method}
      />
      <TicketsSection
        tickets={project.project?.tickets}
        loading={project.loading}
        method={project.method}
      />
    </div>
  );
};

export default ProjectDetails;
