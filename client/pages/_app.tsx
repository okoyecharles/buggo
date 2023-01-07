import React from "react";
import { Provider } from "react-redux";
import store from "../redux/configureStore";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import Layout from "../components/Layout";

export default function App({ Component, pageProps, ...appProps }: AppProps) {
  const isLayoutNeeded =
    Component.name !== "Login" && Component.name !== "Register";
  const LayoutComponent = isLayoutNeeded ? Layout : React.Fragment;

  return (
    <>
      <ToastContainer position="bottom-right" />
      <Provider store={store}>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </Provider>
    </>
  );
}
