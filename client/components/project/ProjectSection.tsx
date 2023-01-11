import React, { FormEvent, useEffect, useState } from 'react';
import ProjectSearch from './ProjectSearch';
import { BsPlusLg } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import ProjectsGrid from './ProjectsGrid';
import Paginate from './Paginate';
import { Project } from '../../redux/reducers/projects/types';
import { IoMdClose } from 'react-icons/io';
import Loader from '../Loader';
import store from '../../redux/configureStore';
import { createProject } from '../../redux/actions/projectActions';
import { toast } from 'react-toastify';
import Modal from '../modals';

interface ProjectSectionProps {
  projects: Project[];
  loading: boolean;
  method: {};
}

const ProjectSection: React.FC<ProjectSectionProps> = ({
  projects,
  loading,
  method,
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
            <ProjectSearch />
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
          <ProjectSearch />
        </div>
        <ProjectsGrid
          projects={currentProjects}
          loading={loading}
          method={method}
        />
      </div>
      <Paginate
        pageCount={projectPageCount}
        handlePageChange={handleProjectPageChange}
        indexOfFirstProject={indexOfFirstProject}
        indexOfLastProject={indexOfLastProject}
        totalItems={projects.length}
        itemName={'project'}
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

const CreateProjectModal = ({
  open,
  setOpen,
  loading,
  method,
}: {
  open: boolean;
  setOpen: any;
  loading: boolean;
  method: {
    [key: string]: any;
  };
}) => {
  const [title, setTitle] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTitleError(null);

    if (!title) {
      setTitleError('Title is required');
      return;
    }

    if (title.length < 5) {
      setTitleError('Title must be at least 5 characters');
      return;
    }

    if (title.length > 25) {
      setTitleError('Title must be less than 25 characters');
      return;
    }

    const projectData = { title };
    store.dispatch(createProject(projectData));
  };

  // Close modal if project has been created
  useEffect(() => {
    if (open && loading === false && !method.create) {
      setOpen(false);
      setTitle('');
      setTitleError(null);
      toast.success('Project created successfully');
    }
  }, [loading, method]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <header className="header flex justify-between items-center">
        <h3 className="text-base text-gray-100 font-semibold">
          Create a Project
        </h3>
        <button
          name="close modal"
          className="text-2xl text-gray-500 hover:text-gray-200 transition"
          onClick={() => {
            setOpen(false);
          }}
        >
          <IoMdClose />
        </button>
      </header>

      <form action="" className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-col mt-4">
          <label
            htmlFor="name"
            className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
              titleError && 'text-red-300'
            }`}
          >
            Title {titleError && <span className="text-red-300"> - </span>}
            <span className="capitalize font-normal italic text-red-300">
              {titleError ? `${titleError}` : ''}
            </span>
          </label>
          <input
            type="text"
            id="name"
            ref={inputRef}
            name="name"
            placeholder="eg. Limitless horizons"
            className="p-3 text-ss bg-gray-950 rounded outline-none text-gray-200 mb-1 sm:p-2"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <p className="text-xsm">You can assign members after creation.</p>
        </div>

        <button
          className="font-open font-semibold px-4 py-2 text-ss mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 hover:text-blue-100 disabled:opacity-80 disabled:cursor-not-allowed  transition flex justify-center"
          disabled={loading && method.create}
          type="submit"
        >
          {loading && method.create ? <Loader /> : 'Create'}
        </button>
      </form>
    </Modal>
  );
};

export default ProjectSection;
