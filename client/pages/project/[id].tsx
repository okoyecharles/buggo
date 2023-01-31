import { useRouter } from "next/router";
import React, { useEffect } from "react";
import store, { storeType } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { fetchProjectById } from "../../redux/actions/projectActions";
import ProjectDetailsBar from "../../components/project/ProjectDetails";
import TicketsSection from "../../components/project/ProjectDetails/TicketsSection";

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const project = useSelector((store: storeType) => store.project);
  const tickets = useSelector((store: storeType) => store.tickets);

  useEffect(() => {
    if (!project.loading && id) {
      store.dispatch(fetchProjectById(id as string));
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <ProjectDetailsBar project={project.project} />
      <div className="project-tickets flex-1">
        <TicketsSection tickets={project.project?.tickets} />
        <div className="ticket-comments"></div>
      </div>
    </div>
  );
};

export default ProjectDetails;
