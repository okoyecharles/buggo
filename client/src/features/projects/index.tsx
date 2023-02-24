import React, { useState } from "react";
import ProjectSearch from "./Search";
import { BsPlusLg } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import ProjectsGrid from "./Grid";
import Paginate from "../pagination";
import { Project } from "../../types/models";
import CreateProjectModal from "./modal/projectCreate";

interface ProjectSectionProps {
  projects: Project[];
  loading: boolean;
  method: {};
  search: string;
  setSearch: any;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({
  projects,
  loading,
  method,
  search,
  setSearch,
}) => {
  const [projectsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const projectPageCount = Math.ceil(projects.length / projectsPerPage);
  const handleProjectPageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  return (
    <section className="projects flex flex-col xl:col-span-3">
      <div className="p-4 bg-gray-750 relative rounded ring-1 ring-gray-700">
        <header className="flex gap-2 items-center">
          <h3 className="text-white text-xl font-bold mr-auto">
            Recent Projects
          </h3>

          <div className="hidden lg:block">
            <ProjectSearch search={search} setSearch={setSearch} />
          </div>

          <button
            className="group cursor-pointer"
            id="create-project"
            onClick={() => {
              setCreateModalOpen(true);
            }}
          >
            <BsPlusLg className="bg-gray-700 text-blue-400 group-hover:bg-blue-500 text-4xl p-3 rounded-full group-hover:text-white group-hover:rounded-xl group-active:bg-blue-600 transition disabled:opacity-75" />
          </button>
          <Tooltip anchorId="create-project" content="Create Project" />
        </header>
        <div className="lg:hidden">
          <ProjectSearch search={search} setSearch={setSearch} />
        </div>
        <ProjectsGrid
          projects={currentProjects}
          loading={loading}
          method={method}
          search={search}
        />
      </div>
      <Paginate
        pageCount={projectPageCount}
        handlePageChange={handleProjectPageChange}
        indexOfFirstItem={indexOfFirstProject}
        indexOfLastItem={indexOfLastProject}
        totalItems={projects.length}
        itemName={"project"}
      />
      <CreateProjectModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
        loading={loading}
        method={method}
      />
    </section>
  );
};

export default ProjectSection;
