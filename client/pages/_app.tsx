import Head from "next/head";
import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import UnAuthorized from "@/core/components/unauthorized";
import store, { storeType } from "@/redux/configureStore";
import { validateUserSession } from "@/redux/actions/userActions";
import type { AppProps } from "next/app";
import * as reactToastify from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import "@/styles/globals.css";

// Lives inside the Provider so it re-renders when the session check loads
// the user -- reading the store directly from App never updates.
function AdminOnly({ children }: { children: React.ReactNode }) {
  const user = useSelector((store: storeType) => store.currentUser.user);
  // Nothing to decide until the user loads; the layout sends signed out
  // visitors to the login page
  if (!user) return null;
  if (!user.admin) return <UnAuthorized />;
  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  // Use the layout defined at the page level, if defined
  const getLayout = (Component as any).getLayout || ((page: any) => page);
  const protectedRoute = (Component as any).protected || false;
  // progamatically import toastify css

  useEffect(() => {
    store.dispatch(validateUserSession());
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/circle-logo.ico" />
      </Head>
      <reactToastify.ToastContainer position={"bottom-right"} />
      <Provider store={store}>
        {protectedRoute
          ? getLayout(
              <AdminOnly>
                <Component {...pageProps} />
              </AdminOnly>,
            )
          : getLayout(<Component {...pageProps} />)}
      </Provider>
    </>
  );
}
