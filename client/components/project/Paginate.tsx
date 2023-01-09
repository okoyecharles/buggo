import React, { useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Pluralize from "react-pluralize";

interface PaginateProps {
  pageCount: number;
  handlePageChange: (data: any) => void;
  indexOfFirstProject: number;
  indexOfLastProject: number;
  totalItems: number;
  itemName: string;
}

const Paginate: React.FC<PaginateProps> = ({
  pageCount,
  handlePageChange,
  indexOfFirstProject,
  indexOfLastProject,
  totalItems,
  itemName,
}) => {
  const paginateRef = useRef(null);

  useEffect(() => {
    if (paginateRef.current) {
      console.log(paginateRef.current);
    }
  }, [paginateRef.current])

  return (
    <nav className="flex flex-col lg:flex-row items-center gap-4 lg:w-fit lg:self-end mt-4">
      <p className="font-semibold text-ss text-gray-400">
        Showing {indexOfFirstProject + 1} -{" "}
        {Math.min(totalItems, indexOfLastProject)} of{" "}
        <Pluralize singular={itemName} count={totalItems} />
      </p>
      <ReactPaginate
        ref={paginateRef}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        className="flex items-center p-2 gap-2 bg-gray-900 rounded-sm text-ss font-noto justify-center select-none"
        pageClassName="bg-gray-850 text-gray-500 font-semibold rounded-sm hover:bg-gray-800 hover:text-gray-100 active:bg-gray-700 overflow-hidden rounded transition"
        pageLinkClassName="py-1 px-3 flex items-center justify-center"
        activeLinkClassName="bg-orange-500/80 text-gray-100"
        previousLabel={<MdNavigateBefore />}
        nextLabel={<MdNavigateNext />}
        previousClassName="bg-gray-850 text-2xl text-gray-500 font-semibold rounded-sm hover:bg-gray-800 hover:text-gray-100 active:bg-gray-700 overflow-hidden rounded transition"
        previousLinkClassName="flex items-center justify-center"
        nextLinkClassName="flex items-center justify-center"
        nextClassName="bg-gray-850 text-2xl text-gray-500 font-semibold rounded-sm hover:bg-gray-800 hover:text-gray-100 active:bg-gray-700 overflow-hidden rounded transition"
      />
    </nav>
  );
};

export default Paginate;
