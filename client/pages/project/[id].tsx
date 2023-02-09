import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import store, { storeType } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { fetchProjectById } from "../../redux/actions/projectActions";
import ProjectDetailsBar from "../../components/pages/project/details";
import TicketsSection from "../../components/pages/project/tickets/Section";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config/Backend";
import { socketCreateTicket } from "../../redux/actions/ticketActions";

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const project = useSelector((store: storeType) => store.project);
  const currentUser = useSelector((store: storeType) => store.currentUser);

  const socket = useRef<any>(null);

  useEffect(() => {
    if (!project.loading && id) {
      store.dispatch(fetchProjectById(id as string));
    }
  }, []);

  useEffect(() => {
    if (project.project?._id) {
      socket.current = io(SOCKET_URL);

      socket.current.emit("join-project-room", {
        projectId: project.project._id,
        userId: currentUser.user?._id,
      });

      socket.current.on("get-project-ticket", (ticket: any) => {
        store.dispatch(socketCreateTicket(ticket));
      });
    }

    return () => {
      if (socket.current) socket.current.disconnect();
    }
  }, [project.project?._id])

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <ProjectDetailsBar
        project={project.project}
        loading={project.loading}
        method={project.method}
      />
      <TicketsSection
        socket={socket.current}
        tickets={project.project?.tickets}
        loading={project.loading}
        method={project.method}
      />
    </div>
  );
};

export default ProjectDetails;
