import React from 'react';

interface PaginationProps {
  itemsPerPage: number;
  totalNumber: number;
  currentPage: number;
  paginate: any;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage,
  totalNumber,
  currentPage,
  paginate,
}) => {
  const PageNumbers: any = [];

  for (let i = 1; i <= Math.ceil(totalNumber / itemsPerPage); i++) {
    PageNumbers.push(i);
  }

  return (
    <nav>
      <ul>
        {currentPage > 1 && (
          <li className="inline-block">
            <button onClick={() => paginate(currentPage - 1)}>Prev</button>
          </li>
        )}
        {PageNumbers.map((number: number) => (
          <li key={number} className="inline-block">
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
        {currentPage < PageNumbers.length && (
          <li className="inline-block">
            <button onClick={() => paginate(currentPage + 1)}>Next</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
