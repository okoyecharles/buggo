import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import store, { storeType } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { fetchProjectById } from "../../redux/actions/projectActions";
import TicketsSection from "../../src/features/tickets/section";
import ProjectDeleteModal from "../../src/features/projects/modal/projectDelete";
import Head from "next/head";
import ProjectDetailsBar from "../../src/features/projects/details";
import Layout from "../../src/layout";

export default function ProjectDetails() {
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
        <title>Project - {project?.project?.title}</title>
      </Head>
      <div className="flex flex-col lg:flex-row h-full isolate">
        <ProjectDetailsBar
          project={project.project}
          loading={project.loading}
          method={project.method}
          setProjectDeleteOpen={setProjectDeleteOpen}
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
}

ProjectDetails.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
