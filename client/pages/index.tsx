import Head from "next/head";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store, { storeType } from "../redux/configureStore";
import { fetchProjects } from "../redux/actions/projectActions";
import { useRouter } from "next/router";
import { fetchTickets } from "../redux/actions/ticketActions";
import Layout from "../components/Layout";

export default function Home() {
  const router = useRouter();
  const projects = useSelector((store: storeType) => store.projects);
  const tickets = useSelector((store: storeType) => store.tickets);

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
      <h1 className="m-4 text-gray-400 text-xl font-semibold font-open">
        Home
      </h1>
    </>
  );
}
