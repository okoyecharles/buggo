import Head from "next/head";
import React from "react";

const tickets = () => {
  return (
    <>
      <Head>
        <title>Bug tracker - Tickets</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-gray-400 text-xl font-semibold font-open">
        Tickets
      </h1>
    </>
  );
};

export default tickets;
