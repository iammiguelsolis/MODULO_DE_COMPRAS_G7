import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const pageNeighbours = 1;

    const totalBlocks = pageNeighbours * 2 + 5;

    if (totalPages <= totalBlocks) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - pageNeighbours, 1);
      const rightSiblingIndex = Math.min(currentPage + pageNeighbours, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

      const firstPageIndex = 1;
      const lastPageIndex = totalPages;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        let leftItemCount = 3 + 2 * pageNeighbours;
        let leftRange = [];
        for (let i = 1; i <= leftItemCount; i++) {
          leftRange.push(i);
        }
        pageNumbers.push(...leftRange, '...', totalPages);

      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        let rightItemCount = 3 + 2 * pageNeighbours;
        let rightRange = [];
        for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
          rightRange.push(i);
        }
        pageNumbers.push(firstPageIndex, '...', ...rightRange);

      } else {
        let middleRange = [];
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          middleRange.push(i);
        }
        pageNumbers.push(firstPageIndex, '...', ...middleRange, '...', lastPageIndex);
      }
    }

    return pageNumbers.map((page, index) => {
      if (typeof page === 'string') {
        return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
      }

      return (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`pagination-number ${currentPage === page ? 'active' : ''}`}>
          {page}
        </button>
      );
    });
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-container">
      <span className="pagination-info">
        Mostrando {startItem}-{endItem} de {totalItems} licitaciones
      </span>
      <nav className="pagination-nav">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
        <div className="pagination-numbers">
          {getPageNumbers()}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Siguiente
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
