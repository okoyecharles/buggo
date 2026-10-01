import React, { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

interface UsersSearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  fit?: boolean;
}

const UsersSearch: React.FC<UsersSearchProps> = ({ search, setSearch, fit }) => {
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [showClose, setShowClose] = React.useState(false);

  useEffect(() => {
    setShowClose(search.length > 0);
  }, [search])

  return (
    <div className={`users-search-wrapper relative`}>
      <input
        ref={searchRef}
        type="text"
        placeholder="Search user"
        className={`bg-gray-850 text-ss placeholder:text-gray-500 hover:bg-gray-900 focus:bg-gray-900 text-gray-200 rounded py-2 px-3 pr-9 lg:py-1 lg:px-2 lg:pr-7 outline-none transition-all font-semibold ${fit ? "w-full" : ""}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FaSearch
        className={`search-icon text-gray-500 cursor-pointer absolute top-1/2 -translate-y-1/2 right-3 lg:right-2 hover:text-gray-400 transition ${
          showClose
            ? "opacity-0 pointer-events-none rotate-90"
            : "opacity-100 pointer-events-auto rotate-0"
        }`}
        onClick={() => {
          searchRef.current?.focus();
        }}
        onMouseDown={(e) => e.preventDefault()}
      />
      <MdOutlineClose
        className={`close-icon text-xl text-gray-500 cursor-pointer absolute top-1/2 -translate-y-1/2 right-3 lg:right-2 hover:text-gray-400 transition ${
          showClose
            ? "opacity-100 pointer-events-auto rotate-0"
            : "opacity-0 pointer-events-none -rotate-90"
        }`}
        onClick={() => {
          setSearch("");
          searchRef.current?.focus();
        }}
        onMouseDown={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default UsersSearch;
