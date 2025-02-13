import React from "react";
import { CPagination, CPaginationItem } from "@coreui/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      <CPagination align="end" className="mt-3">
        <CPaginationItem disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </CPaginationItem>

        {totalPages > 5 && currentPage > 3 && (
          <>
            <CPaginationItem onClick={() => onPageChange(1)}>1</CPaginationItem>
            <CPaginationItem disabled>...</CPaginationItem>
          </>
        )}

        {[...Array(totalPages)]
          .map((_, index) => index + 1)
          .filter((page) => page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2))
          .map((page) => (
            <CPaginationItem
              key={page}
              active={currentPage === page}
              onClick={() => onPageChange(page)}
            >
              {page}
            </CPaginationItem>
          ))}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <CPaginationItem disabled>...</CPaginationItem>
            <CPaginationItem onClick={() => onPageChange(totalPages)}>{totalPages}</CPaginationItem>
          </>
        )}

        <CPaginationItem disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
          Next
        </CPaginationItem>
      </CPagination>
    </div>
  );
};

export default Pagination;
