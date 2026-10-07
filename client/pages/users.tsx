import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout";
import { BsDot } from "react-icons/bs";
import UsersSection from "@/components/admins/section";
import UsersSearch from "@/components/admins/Search";
import { useSelector } from "react-redux";
import store, { storeType } from "@/redux/configureStore";
import { searchByNameOrEmail } from "@/core/utils/strings/search";
import { TailSpinLoader } from "@/core/components/loader";
import { IoSearch } from "react-icons/io5";
import { a, useSpring } from "@react-spring/web";
import { getAllUsers } from "@/redux/actions/adminActions";

export default function Users() {
  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const { users, pending } = useSelector(
    (state: storeType) => state.adminUsers,
  );

  useEffect(() => {
    store.dispatch(getAllUsers());
  }, []);

  const searchedUsers = useMemo(() => {
    return searchByNameOrEmail(search, users);
  }, [users, search]);

  const searchSpring = useSpring({
    y: openSearch ? 0 : -54,
    config: {
      tension: 300,
      friction: 30,
    },
  });
  const searchContainerSpring = useSpring({
    height: openSearch ? 54 : 0,
    config: {
      tension: 300,
      friction: 30,
    },
  });

  return (
    <>
      <Head>
        <title>All Users</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="p-3 px-4 md:px-10 lg:px-6 h-16 shadow-sm items-center shadow-gray-950 flex sticky top-[64px] bg-gray-800 z-10">
        <h1 className="font-bold text-gray-100 text-md z-50 border-r border-gray-600 pr-2 lg:pr-4">
          All Users
        </h1>
        <p className="text-sm font-noto font-semibold text-gray-400 ml-2 lg:ml-4 flex items-center">
          <span id="users-total-count" className="text-white">
            {users.length} total
          </span>
          <BsDot className="text-xl text-gray-600 hidden lg:block" />
          <span id="users-admin-count" className="text-blue-400 hidden lg:block">
            {users.filter((user) => user.admin).length} admin
          </span>
        </p>

        <button className="p-2 bg-gray-850 rounded-full ml-auto text-gray-200 hover:text-white active:bg-gray-900 transition-colors lg:hidden">
          <IoSearch
            className="text-lg"
            onClick={() => setOpenSearch((prev) => !prev)}
          />
        </button>

        <div className="hidden lg:block ml-auto">
          <UsersSearch search={search} setSearch={setSearch} />
        </div>
      </header>

      <a.div
        style={searchContainerSpring}
        className="overflow-hidden lg:hidden shadow-sm shadow-gray-900"
      >
        <a.div style={searchSpring} className="p-2">
          <UsersSearch search={search} setSearch={setSearch} fit />
        </a.div>
      </a.div>

      {pending.list ? (
        <div className="flex justify-center h-[calc(100%-129px)]">
          <TailSpinLoader
            color="orange"
            height={50}
            width={50}
            className="mt-16"
          />
        </div>
      ) : (
        <UsersSection users={searchedUsers} search={search} />
      )}
    </>
  );
}

Users.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
Users.protected = true;
