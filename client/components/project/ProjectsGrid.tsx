import React from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "../../redux/reducers/projects/types";

interface ProjectsGridType {
  projects: Project[];
};

const ProjectsGrid: React.FC<ProjectsGridType> = ({ projects }) => {
  return (
    <div className="project__container flex flex-col gap-2 mt-4">
      {projects?.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsGrid;
