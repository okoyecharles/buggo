import React from "react";
import ProjectCard from "./card";
import { Project } from "../../types/models";
import { a, useSpring, useTrail } from "@react-spring/web";
import useMediaQuery from "../../hooks/useMediaQuery";
interface ProjectsListType {
  projects: Project[];
  loading: boolean;
  search: string;
  method: {
    [key: string]: any;
  };
}

const ProjectsList: React.FC<ProjectsListType> = ({
  projects,
  loading,
  method,
  search,
}) => {
  const [currentEdit, setCurrentEdit] = React.useState<string>("");

  const isMobile = useMediaQuery("(max-width: 992px)");
  const projectHeight = isMobile ? 156.41 : 122.81;

  const projectListSpring = useSpring({
    height: `${projects?.length * projectHeight + (projects.length - 1) * 8}px`,
    config: { mass: 1, tension: 1000, friction: 100 },
  });
  const projectListTrail = useTrail(projects.length, {
    from: { y: 30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { mass: 1, tension: 1000, friction: 100 },
  });

  return (
    <a.ul
      className={`project__list flex flex-col gap-2 mt-4 overflow-y-hidden`}
      style={projectListSpring}
    >
      {projects?.map((project, index) => (
        <ProjectCard
          key={project._id}
          project={project}
          loading={loading}
          method={method}
          search={search}
          currentEdit={currentEdit}
          setCurrentEdit={setCurrentEdit}
          projectCardTrail={projectListTrail[index]}
        />
      ))}
    </a.ul>
  );
};

export default ProjectsList;
