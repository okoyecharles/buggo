import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store, { storeType } from "../redux/configureStore";
import { fetchProjects } from "../redux/actions/projectActions";
import { fetchTickets } from "../redux/actions/ticketActions";
import { getGreeting } from "../utils/InterfaceHelper";
import { BsPlusLg } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import ProjectsGrid from "../components/project/ProjectsGrid";
import Paginate from "../components/project/Paginate";

export default function Home() {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const projects = useSelector((store: storeType) => store.projects);
  const tickets = useSelector((store: storeType) => store.tickets);

  const [projectsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const projectPageCount = Math.ceil(
    projects.projects.length / projectsPerPage
  );
  const handleProjectPageChange = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  useEffect(() => {
    if (!projects.loading) store.dispatch(fetchProjects());
    if (!tickets.loading) store.dispatch(fetchTickets());
  }, []);

  return (
    <>
      <Head>
        <title>Bug tracker - Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h2 className="text-xl font-semibold text-orange-400/90">
          {getGreeting()},{" "}
          <span className="text-gray-100">{currentUser?.user.name}!</span>
        </h2>
      </header>
      <div className="projects lg:w-3/4 flex flex-col">
        <section className="p-4 bg-gray-750 mt-2 rounded ring-1 ring-gray-700">
          <header className="flex justify-between items-center">
            <h3 className="text-white text-xl font-bold">Recent Projects</h3>

            <button className="group cursor-pointer" id="create-project">
              <BsPlusLg className="bg-gray-700 text-blue-400 group-hover:bg-blue-500 text-4xl p-3 rounded-full group-hover:text-white group-hover:rounded-xl group-active:bg-blue-600 transition" />
            </button>
            <Tooltip anchorId="create-project" content="Create Project" />
          </header>
          <ProjectsGrid projects={currentProjects} />
        </section>
        <Paginate
          pageCount={projectPageCount}
          handlePageChange={handleProjectPageChange}
          indexOfFirstProject={indexOfFirstProject}
          indexOfLastProject={indexOfLastProject}
          totalItems={projects.projects.length}
          itemName={'project'}
        />
      </div>
    </>
  );
}
