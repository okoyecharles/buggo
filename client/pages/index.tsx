import Head from 'next/head';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import store, { storeType } from '../redux/configureStore';
import { fetchProjects } from '../redux/actions/projectActions';
import { useRouter } from 'next/router';
import { fetchTickets } from '../redux/actions/ticketActions';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();
  const projects = useSelector((store: storeType) => store.projects);
  const tickets = useSelector((store: storeType) => store.tickets);
  const currentUser = useSelector((store: storeType) => store.currentUser);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login/?redirect=true');
      return;
    };

    if (!projects.loading) store.dispatch(fetchProjects());
    if (!tickets.loading) store.dispatch(fetchTickets());
  }, []);

  return (
    <>
      <Head>
        <title>Bug tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout />
    </>
  );
}
