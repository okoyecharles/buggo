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
import Pagination from '../components/project/Pagination';

export default function Home() {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const projects = useSelector((store: storeType) => store.projects);
  const tickets = useSelector((store: storeType) => store.tickets);

  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(2);

  const lastItemIndex = currentPage * projectsPerPage;
  const firstItemIndex = lastItemIndex - projectsPerPage;
  const currentProjects = projects.projects.slice(
    firstItemIndex,
    lastItemIndex
  );

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
          {getGreeting()},{' '}
          <span className="text-gray-100">{currentUser?.user.name}!</span>
        </h2>
      </header>
      <section className="p-4 bg-gray-750 mt-2 rounded ring-1 ring-gray-700 lg:w-3/4">
        <header className="flex justify-between items-center">
          <h3 className="text-white text-xl font-bold">Recent Projects</h3>

          <button className="group cursor-pointer" id="create-project">
            <BsPlusLg className="bg-gray-700 text-blue-400 group-hover:bg-blue-500 text-4xl p-3 rounded-full group-hover:text-white group-hover:rounded-xl group-active:bg-blue-600 transition" />
          </button>
          <Tooltip anchorId="create-project" content="Create Project" />
        </header>

        <ProjectsGrid projects={currentProjects} />
      </section>
      <Pagination
        itemsPerPage={projectsPerPage}
        totalNumber={projects.projects.length}
        paginate={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
}
