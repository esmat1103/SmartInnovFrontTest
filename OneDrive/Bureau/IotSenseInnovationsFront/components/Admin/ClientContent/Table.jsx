import React, { useState } from 'react';
import Image from 'next/image';
import TableHeader from './TabHeader';
import TableBody from './TabBody';
import cl1 from '../../../public/assets/Table/1.png';
import cl5 from '../../../public/assets/Table/cl5.jpeg';
import cl2 from '../../../public/assets/Table/cl2.jpeg';
import cl3 from '../../../public/assets/Table/cl3.jpeg';
import cl4 from '../../../public/assets/Table/cl4.jpeg';
import deleteW from '../../../public/assets/Table/deleteW.svg';
import clear from '../../../public/assets/Table/delete.svg';
import Pagination from '../../Commun/Pagination';
import DateFilter from '../../Commun/date-filter';
import DropdownFilter from '../../Commun/fliter';
import SearchBar from './search';
import AddButton from '../../Commun/Buttons/AddButton';
import FormClient from '../../Commun/Popups/Clients/form';


const Table = () => {
  const [tableData, setTableData] = useState([
    { id: '#FRTL', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phoneNumber: '9876543210', createdAt: '2024-06-14', imageUrl: cl1},
    { id: '#LKIH', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phoneNumber: '9876543211', createdAt: '2024-06-14', imageUrl: cl2 },
    { id: '#XCVB', firstName: 'Mary', lastName: 'Johnson', email: 'mary@example.com', phoneNumber: '9876543212', createdAt: '2024-06-14', imageUrl: cl3 },
    { id: '#QWER', firstName: 'James', lastName: 'Brown', email: 'james@example.com', phoneNumber: '9876543213', createdAt: '2024-06-14', imageUrl: cl4 },
    { id: '#TYUI', firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', phoneNumber: '9876543214', createdAt: '2024-06-14', imageUrl: cl5 },
    { id: '#FRTL1', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phoneNumber: '9876543210', createdAt: '2024-06-14', imageUrl: cl1},
    { id: '#LKIH2', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phoneNumber: '9876543211', createdAt: '2024-06-14', imageUrl: cl2 },
    { id: '#XCVB3', firstName: 'Mary', lastName: 'Johnson', email: 'mary@example.com', phoneNumber: '9876543212', createdAt: '2024-06-14', imageUrl: cl3 },
    { id: '#QWER4', firstName: 'James', lastName: 'Brown', email: 'james@example.com', phoneNumber: '9876543213', createdAt: '2024-06-14', imageUrl: cl4 },
    { id: '#XCVB5', firstName: 'Mary', lastName: 'Johnson', email: 'mary@example.com', phoneNumber: '9876543212', createdAt: '2024-06-14', imageUrl: cl3 },
    { id: '#QWER6', firstName: 'James', lastName: 'Brown', email: 'james@example.com', phoneNumber: '9876543213', createdAt: '2024-06-14', imageUrl: cl4 },    
  ]);

  
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = (id) => {
    // Handle delete logic here
  };

  const handleEdit = (id) => {
    // Handle edit logic here
  };

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map(row => row.id));
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;

  const filterOptions = ['Option 1', 'Option 2', 'Option 3'];

  const handleDeleteSelected = () => {
    const updatedData = tableData.filter((row) => !selectedRows.includes(row.id));
    setTableData(updatedData);
    setSelectedRows([]);
  };

  return (
    <div className="container-tab">
      <div className="top-container flex justify-between">
        <div className="top-left-text nunito f30 "></div>
        <div className="top-right-container flex">
          <SearchBar />
          <AddButton text="Add Client" onClick={toggleForm} />
        </div>
      </div>
      <div className='mt-5 table-container'>
        <div className="filters-container flex justify-between">
          <div className="delete-button-container">
            {selectedRows.length > 0 && (
              <button onClick={handleDeleteSelected} className="delete-button flex" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <Image src={hovered ? deleteW : clear} alt="clear" width={20} height={20} />
                <p className='mt2 mx-1'>Delete Selected</p>
              </button>
            )}
          </div>
          <div className='flex'>
            <DateFilter onChange={(date) => console.log('Selected date:', date)} />
            <DropdownFilter options={filterOptions} onChange={(option) => console.log('Selected option:', option)} />
          </div>
        </div>
        <table className="mt-2 table-auto">
          <TableHeader handleHeaderCheckboxChange={handleHeaderCheckboxChange} />
          <TableBody
            tableData={tableData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
          />
          <tfoot>
            <tr>
              <td colSpan="8">
                <div className='pagination-container'>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(tableData.length / rowsPerPage)}
                    onPageChange={onPageChange}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        {isFormOpen && <FormClient isOpen={isFormOpen} onClose={toggleForm} />}
        {isFormOpen && <div className="table-overlay"></div>}
      </div>
    </div>
  );


};

export default Table;