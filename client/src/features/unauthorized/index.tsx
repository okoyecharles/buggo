import Head from "next/head";
import React from "react";
import { FaLock } from "react-icons/fa";

const UnAuthorized = () => {
  return (
    <>
      <Head>
        <title>Unauthorized</title>
      </Head>
      <main className="p-3">
        <div className="flex flex-col gap-1 items-center font-noto flex-1">
          <FaLock className="text-[10rem] text-gray-300 mt-32 mb-2" />
          <h3 className="text-blue-400 text-lg font-bold text-center">
            You're not authorized
          </h3>
          <div className="text-ss text-gray-400 text-center">
            <p>Sorry but you don't have permission to access this page.</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default UnAuthorized;
