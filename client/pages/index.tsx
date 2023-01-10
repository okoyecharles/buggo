import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import store, { storeType } from '../redux/configureStore';
import { fetchProjects } from '../redux/actions/projectActions';
import { fetchTickets } from '../redux/actions/ticketActions';
import { getGreeting } from '../utils/InterfaceHelper';
import { BsPlusLg } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import ProjectsGrid from '../components/project/ProjectsGrid';
import Paginate from '../components/project/Paginate';
import TicketStats from '../components/charts/Tickets/TicketStats';
import { AiFillQuestionCircle } from 'react-icons/ai';
import ProjectSearch from '../components/project/ProjectSearch';

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
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-orange-400/90">
          {getGreeting()},{' '}
          <span className="text-gray-200 text-orange-400/90 whitespace-nowrap">
            {currentUser?.user.name}!
          </span>
        </h2>
      </header>
      <div className="grid gap-16 xl:gap-4 xl:grid-cols-4">
        <section className="projects flex flex-col xl:col-span-3">
          <div className="p-4 bg-gray-750 mt-2 rounded ring-1 ring-gray-700">
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
            totalItems={projects.projects.length}
            itemName={'project'}
          />
        </section>
        <section className="ticketStats xl:col-span-1 bg-gray-850 rounded flex flex-col p-4">
          <header className="mb-4">
            <h3 className="text-xl font-bold text-white  flex items-center justify-between">
              Ticket Stats{' '}
              <AiFillQuestionCircle
                className="text-gray-500 hover:text-blue-600 text-2xl hover:scale-105 outline-none transition"
                id="ticketStats__info"
              />
            </h3>
            <Tooltip
              anchorId="ticketStats__info"
              content="Statistics based on your tickets"
            />
          </header>
          <TicketStats ticketStore={tickets} />
        </section>
      </div>
    </>
  );
}
