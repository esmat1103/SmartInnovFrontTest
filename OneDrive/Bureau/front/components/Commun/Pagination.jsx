import React from 'react';
import Image from 'next/image';
import ChevronLeft from '/public/assets/Pagination/chevron-left.svg';
import ChevronRight from '/public/assets/Pagination/chevron-right.svg';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <button
                className={`link ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <Image src={ChevronLeft} alt="Previous" width={15} height={15}/>
            </button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={`link ${currentPage === number ? 'active' : ''}`}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}
            <button
                className={`link ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <Image src={ChevronRight} alt="Next" width={15} height={15}/>
            </button>
        </div>
    );
};

export default Pagination;
