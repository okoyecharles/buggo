import React from "react";
import ProjectCard from "./card";
import { Project } from "../../types/models";
import { useSpring, useTrail } from "@react-spring/web";
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

  return (
      <ul className={`project__list flex flex-col gap-2 mt-4`}>
        {projects?.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            loading={loading}
            method={method}
            search={search}
            currentEdit={currentEdit}
            setCurrentEdit={setCurrentEdit}
          />
        ))}
      </ul>
  );
};

export default ProjectsList;
