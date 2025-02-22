import React from "react";

interface PaginationProps {
  challengesPerPage: number;
  totalChallenges: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ challengesPerPage, totalChallenges, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalChallenges / challengesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className="px-4 py-2 border rounded hover:bg-gray-200 dark:bg-gray-900 dark:text-white"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination; 