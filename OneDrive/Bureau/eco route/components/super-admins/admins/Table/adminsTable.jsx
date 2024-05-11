import React, { useState } from 'react';
import Pagination from '@/components/common/pagination';
import chevronr from '@/public/main_content/rightchevron.svg';
import chevronl from '@/public/main_content/leftchevron.svg';
import chevronlWhite from '@/public/main_content/leftw.svg';
import chevronrWhite from '@/public/main_content/rightW.svg';
import Image from 'next/image';
import AdminsRow from './adminsRow';

const AdminTable = ({ admins, handleDeleteIconClick, handleEditIconClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [hoveredLeft, setHoveredLeft] = useState(false);
    const [hoveredRight, setHoveredRight] = useState(false);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = admins.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleMouseEnterLeft = () => {
        setHoveredLeft(true);
    };

    const handleMouseLeaveLeft = () => {
        setHoveredLeft(false);
    };

    const handleMouseEnterRight = () => {
        setHoveredRight(true);
    };

    const handleMouseLeaveRight = () => {
        setHoveredRight(false);
    };

    return (
    <>
      <table className="workers-table mb-5">
            <thead>
                <tr>
                    <th className='f14 fw400 poppins tab_grey'>Admin Picture</th>
                    <th className='f14 fw400 poppins tab_grey'>First Name</th>
                    <th className='f14 fw400 poppins tab_grey'>Last Name</th>
                    <th className='f14 fw400 poppins tab_grey'>Email</th>
                    <th className='f14 fw400 poppins tab_grey'>Governorate</th>
                    <th className='f14 fw400 poppins tab_grey'>Municipality</th>
                    <th className='pl-3 f14 fw400 poppins tab_grey'>Action</th>
                </tr>
            </thead>
            <tbody>
            {currentItems.map(admin => (
                <AdminsRow 
                    key={admin.uid} 
                    admin={admin}
                    handleDeleteIconClick={handleDeleteIconClick}
                    handleEditIconClick={handleEditIconClick} 
                />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8">
                  <div className="pagination-container">
                    <div className='page-link mx-2' onClick={prevPage}>
                      <Image
                        src={hoveredLeft ? chevronlWhite : chevronl}
                        alt='chevron'
                        width={10}
                        onMouseEnter={handleMouseEnterLeft}
                        onMouseLeave={handleMouseLeaveLeft}
                      />
                    </div>
                    <Pagination
                      itemsPerPage={itemsPerPage}
                      totalItems={admins.length}
                      currentPage={currentPage}
                      paginate={paginate}
                    />
                    <div className='page-link mx-2' onClick={nextPage}>
                      <Image
                        src={hoveredRight ? chevronrWhite : chevronr}
                        alt='chevron'
                        width={10}
                        onMouseEnter={handleMouseEnterRight}
                        onMouseLeave={handleMouseLeaveRight}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
        </table>
      </>
    );
};

export default AdminTable;
