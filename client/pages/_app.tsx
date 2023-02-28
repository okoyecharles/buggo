import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/configureStore";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import { validateUserSession } from "../redux/actions/userActions";

export default function App({ Component, pageProps }: AppProps) {
  // Use the layout defined at the page level, if defined
  const getLayout = (Component as any).getLayout || ((page: any) => page);

  useEffect(() => {
    store.dispatch(validateUserSession());
  }, []);

  return (
    <>
      <ToastContainer position={"bottom-right"} />
      <Provider store={store}>
        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </>
  );
}
