import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store, { storeType } from "../redux/configureStore";
import { fetchProjects } from "../redux/actions/projectActions";
import { fetchTickets } from "../redux/actions/ticketActions";
import getGreeting from "../src/utils/strings/greeting";
import { Tooltip } from "react-tooltip";
import TicketStats from "../src/features/tickets/Stats";
import { AiFillQuestionCircle } from "react-icons/ai";
import ProjectSection from "../src/features/projects";
import { searchProjectByName } from "../src/utils/strings/search";
import Layout from "../src/layout";

export default function Home() {
  const user = useSelector((store: storeType) => store.currentUser.user);
  const projects = useSelector((store: storeType) => store.projects);
  const tickets = useSelector((store: storeType) => store.tickets);

  const [projectSearch, setProjectSearch] = useState<string>("");
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    // Fetch projects if user state updates
    if (!projects.loading && !projects.method.list)
      store.dispatch(fetchProjects());

    if (pageLoaded) return;

    // Fetch tickets only on initial load
    if (!tickets.loading) store.dispatch(fetchTickets());

    setPageLoaded(true);
  }, [user]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="m-4">
        <h2 className="text-lg lg:text-xl font-noto flex flex-col">
          <span className="text-gray-200 text-ss">{getGreeting()}</span>
          <div className="text-orange-400 font-semibold leading-5">
            Welcome Back!
          </div>
        </h2>
      </header>
      <div className="grid gap-16 xl:gap-4 xl:grid-cols-4 m-4">
        <ProjectSection
          projects={searchProjectByName(projectSearch, projects.projects)}
          loading={projects.loading}
          method={projects.method}
          search={projectSearch}
          setSearch={setProjectSearch}
        />
        <section className="ticketStats xl:col-span-1 bg-gray-850 rounded flex flex-col p-4">
          <header className="mb-4">
            <h3 className="text-xl font-bold text-white  flex items-center justify-between">
              Ticket Stats{" "}
              <AiFillQuestionCircle
                className="text-gray-500 hover:text-blue-400 text-2xl hover:scale-105 outline-none transition"
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

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
