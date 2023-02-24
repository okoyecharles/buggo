import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

interface MyTicketsSearchProps {
  search: string;
  setSearch: (search: string) => void;
}

const MyTicketsSearch: React.FC<MyTicketsSearchProps> = ({
  search,
  setSearch,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showClose, setShowClose] = useState<boolean>(false);

  useEffect(() => {
    setShowClose(search.length > 0);
  }, [search]);

  return (
    <div className="search-wrapper relative flex flex-1">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search by name or other..."
        className="bg-gray-900 text-ss placeholder:text-gray-500 hover:bg-gray-950 focus:bg-gray-950 text-gray-200 rounded py-2 px-2 pr-7 outline-none w-full transition-all font-medium"
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
          inputRef.current?.focus();
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
          inputRef.current?.focus();
        }}
        onMouseDown={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default MyTicketsSearch;
