import { useRouter } from "next/router";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import ProjectDeleteModal from "../../components/pages/dashboard/projects/Modals/projectDelete";

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const project = useSelector((store: storeType) => store.project);
  const socket = useContext(SocketContext);

  const [ticketCreateOpen, setTicketCreateOpen] = useState<boolean>(false);
  const [projectDeleteOpen, setProjectDeleteOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!project.loading && id) {
      store.dispatch(fetchProjectById(id as string, socket));
    } else {
      router.replace("/");
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
        setProjectDeleteOpen={setProjectDeleteOpen}
        project={project.project}
        loading={project.loading}
        method={project.method}
        setTicketCreateOpen={setTicketCreateOpen}
      />
      <TicketsSection
        tickets={project.project?.tickets}
        loading={project.loading}
        method={project.method}
        ticketCreateOpen={ticketCreateOpen}
        setTicketCreateOpen={setTicketCreateOpen}
      />
      <ProjectDeleteModal
        open={projectDeleteOpen}
        setOpen={setProjectDeleteOpen}
        loading={project.loading}
        method={project.method}
        project={project.project}
      />
    </div>
  );
};

export default ProjectDetails;
