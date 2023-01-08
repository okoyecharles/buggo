import Head from "next/head";
import React from "react";

const users = () => {
  return (
    <>
      <Head>
        <title>Bug tracker - Users</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="m-4 text-gray-400 text-xl font-semibold font-open">
        Users
      </h1>
    </>
  );
};

export default users;
