import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import store, { storeType } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { fetchProjectById } from "../../redux/actions/projectActions";
import ProjectDetailsBar from "../../components/pages/project/details";
import TicketsSection from "../../components/pages/project/tickets/Section";
import ProjectDeleteModal from "../../components/pages/dashboard/projects/Modals/projectDelete";
import Head from "next/head";

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const project = useSelector((store: storeType) => store.project);

  const [ticketCreateOpen, setTicketCreateOpen] = useState<boolean>(false);
  const [projectDeleteOpen, setProjectDeleteOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!project.loading && id) {
      store.dispatch(fetchProjectById(id as string));
    } else {
      router.replace("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Project - {project.project?.title || "Loading..."}</title>
      </Head>
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
    </>
  );
};

export default ProjectDetails;
