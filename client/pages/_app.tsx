import React, { useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import store from "../redux/configureStore";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import { validateUserSession } from "../redux/actions/userActions";
import Head from "next/head";
import UnAuthorized from "../src/features/unauthorized";

export default function App({ Component, pageProps }: AppProps) {
  // Use the layout defined at the page level, if defined
  const getLayout = (Component as any).getLayout || ((page: any) => page);

  const protectedRoute = (Component as any).protected || false;

  useEffect(() => {
    store.dispatch(validateUserSession());
  }, []);

  const admin = useMemo(() => {
    return !!store.getState().currentUser.user?.admin;
  }, [store.getState().currentUser.user]);

  return (
    <>
      <Head>
        <link rel="icon" href="/circle-logo.ico" />
      </Head>
      <ToastContainer position={"bottom-right"} />
      <Provider store={store}>
        {protectedRoute && !admin
          ? getLayout(<UnAuthorized />)
          : getLayout(<Component {...pageProps} />)}
      </Provider>
    </>
  );
}
