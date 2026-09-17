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

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);

  const project = useSelector((store: storeType) => store.project);

  const [ticketCreateOpen, setTicketCreateOpen] = useState<boolean>(false);
  const [projectDeleteOpen, setProjectDeleteOpen] = useState<boolean>(false);

  // `id` is only known once the router has parsed the url, which happens a
  // render after mount on a direct load
  useEffect(() => {
    if (!router.isReady) return;
    if (!id) {
      router.replace("/dashboard");
      return;
    }

    store.dispatch(fetchProjectById(id as string));
    setPageLoaded(true);
  }, [router.isReady, id]);

  // Send the user back if the project could not be loaded; the error
  // middleware has already explained why
  useEffect(() => {
    if (pageLoaded && !project.loading && !project.project) {
      router.replace("/dashboard");
    }
  }, [project.project, project.loading, pageLoaded]);

  return (
    <>
      <Head>
        <title>Buggo | Project - {project?.project?.title}</title>
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
