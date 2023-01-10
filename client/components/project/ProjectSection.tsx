import React, { useState } from "react";
import ProjectSearch from "./ProjectSearch";
import { BsPlusLg } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import ProjectsGrid from "./ProjectsGrid";
import Paginate from "./Paginate";
import { Project } from "../../redux/reducers/projects/types";

interface ProjectSectionProps {
  projects: Project[];
};

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  const [projectsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const projectPageCount = Math.ceil(
    projects.length / projectsPerPage
  );
  const handleProjectPageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <section className="projects flex flex-col xl:col-span-3">
      <div className="p-4 bg-gray-750 relative rounded ring-1 ring-gray-700">
        <header className="flex gap-2 items-center">
          <h3 className="text-white text-xl font-bold mr-auto">
            Recent Projects
          </h3>

          <div className="hidden lg:block">
            <ProjectSearch />
          </div>

          <button className="group cursor-pointer" id="create-project">
            <BsPlusLg className="bg-gray-700 text-blue-400 group-hover:bg-blue-500 text-4xl p-3 rounded-full group-hover:text-white group-hover:rounded-xl group-active:bg-blue-600 transition" />
          </button>
          <Tooltip anchorId="create-project" content="Create Project" />
        </header>
        <div className="lg:hidden">
          <ProjectSearch />
        </div>
        <ProjectsGrid projects={currentProjects} />
      </div>
      <Paginate
        pageCount={projectPageCount}
        handlePageChange={handleProjectPageChange}
        indexOfFirstProject={indexOfFirstProject}
        indexOfLastProject={indexOfLastProject}
        totalItems={projects.length}
        itemName={"project"}
      />
    </section>
  );
};

export default ProjectSection;
