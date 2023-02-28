import Head from "next/head";
import React from "react";
import Layout from "../src/layout";

export default function Users() {
  return (
    <>
      <Head>
        <title>All Users</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-gray-400 text-xl font-semibold font-open">Users</h1>
    </>
  );
}

Users.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
