import React, { useEffect, useMemo, useState } from "react";
import { User } from "../../../types/models";
import UserRow from "./Row";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

interface UsersSectionProps {
  users: User[];
  setUsers: any;
  search: string;
}

const UsersSection: React.FC<UsersSectionProps> = ({
  users,
  setUsers,
  search,
}) => {
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "joined" | null>(null);

  const sortedUsers = useMemo(() => {
    const sortField = sortBy === "name" ? "name" : "createdAt";

    if (!sort || !sortBy) return users;

    return users.sort((a, b) => {
      if (a[sortField] > b[sortField]) {
        return sort === "asc" ? 1 : -1;
      } else if (a[sortField] < b[sortField]) {
        return sort === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });
  }, [sort, sortBy, users]);

  const handleSort = (field: any) => {
    if (sortBy !== field) {
      setSortBy(field);
      setSort("asc");
      return;
    }

    // Switch sort modes
    if (!sort) setSort("asc");
    else if (sort === "asc") setSort("desc");
    else if (sort === "desc") setSort(null);
  };

  return (
    <section className="lg:p-3">
      <header className="grid gap-2 grid-cols-8 uppercase">
        <div
          className="py-3 px-1 pl-4 text-sm text-gray-200 font-bold font-noto col-span-4 lg:col-span-3 flex items-center justify-between hover:bg-gray-825 active:bg-gray-850 cursor-pointer select-none transition-colors"
          onClick={() => handleSort("name")}
        >
          Name
          <span className="flex flex-col">
            <FaSortUp
              className={`text-gray-500 ${
                sortBy === "name" && sort === "asc" ? "text-white" : ""
              }`}
            />
            <FaSortDown
              className={`text-gray-500 -mt-3 ${
                sortBy === "name" && sort === "desc" ? "text-white" : ""
              }`}
            />
          </span>
        </div>
        <div
          className="px-1 pl-4 text-sm text-gray-200 font-bold font-noto flex items-center justify-between hover:bg-gray-825 active:bg-gray-850 cursor-pointer select-none transition-colors col-span-4 lg:col-span-1"
          onClick={() => handleSort("joined")}
        >
          Joined
          <span className="flex flex-col">
            <FaSortUp
              className={`text-gray-500 ${
                sortBy === "joined" && sort === "asc" ? "text-white" : ""
              }`}
            />
            <FaSortDown
              className={`text-gray-500 -mt-3 ${
                sortBy === "joined" && sort === "desc" ? "text-white" : ""
              }`}
            />
          </span>
        </div>
        <div className="py-3 px-1 text-sm text-gray-200 font-bold font-noto col-span-4 hidden lg:block">
          Site Role
        </div>
      </header>
      <hr className="border-gray-700" />
      <ul className="users-list">
        {sortedUsers.map((user) => (
          <UserRow
            key={user._id}
            user={user}
            setUsers={setUsers}
            search={search}
          />
        ))}
      </ul>
    </section>
  );
};

export default UsersSection;
