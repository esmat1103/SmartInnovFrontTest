import React, { useState, useEffect } from 'react';
import TableHeader from '@components/Commun/clients/TabHeader';
import TableBody from '@components/Commun/clients/TabBody';
import AddButton from '@components/Commun/Buttons/AddButton';
import deleteW from '../../../public/assets/Table/deleteW.svg';
import Pagination from '../../Commun/Pagination';
import SearchBar from '@components/Commun/search';
import DateFilter from '@components/Commun/date-filter';
import DropdownFilter from '../../commun/fliter';
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import axios from 'axios';
import AddClient from '@components/Commun/Popups/Clients/AddForm';
import jwt from 'jsonwebtoken';

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [error, setError] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);

 
    const fetchEndusers = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwt.decode(token);

        if (!decodedToken || !decodedToken.userId) {
          console.error('Invalid token or unable to extract userId.');
          return;
        }

        const loggedInAdminId = decodedToken.userId; 

        const response = await axios.get('http://localhost:3008/users/role/enduser', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const filteredEndusers = response.data.filter(enduser => enduser.createdByAdmin === loggedInAdminId);

        setTableData(filteredEndusers);
      } catch (error) {
        setError('Error fetching clients');
        console.error('Error fetching Clients', error);
      }
    };



  useEffect(() => {
    fetchEndusers();
    const ws = new WebSocket('ws://localhost:3008');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      if (data.message === 'Enduser created' || data.message === 'User deleted' || data.message === 'Enduser updated') {
        fetchEndusers(); 
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);


  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3008/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDataChanged(!dataChanged); 
    } catch (error) {
      setError('Error deleting client');
      console.error('Error deleting client:', error);
    }
  };

  const handleEdit = (id) => {
    console.log('Editing client with id:', id);
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
      setSelectedRows(tableData.map(row => row._id));
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(false); 
    selectedRows.forEach(id => handleDelete(id));
    setSelectedRows([]);
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirmation(false); 
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;
  const filterOptions = ['Option 1', 'Option 2', 'Option 3'];

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
            <DeleteAllButton
              onClick={handleDeleteSelected}
              hovered={hovered}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              buttonText="Delete Selected"
              imageSrc={deleteW}
              altText="delete"
            />
          )}
          </div>
          <div className='flex mt-2 mb-1'>
            <DateFilter onChange={(date) => console.log('Selected date:', date)} />
            <DropdownFilter options={filterOptions} onChange={(option) => console.log('Selected option:', option)} />
          </div>
        </div>
        <table className="table-auto">
          <TableHeader handleHeaderCheckboxChange={handleHeaderCheckboxChange} />
          <TableBody
            tableData={tableData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
          />
        </table>
        <div className='pagination-container'>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(tableData.length / rowsPerPage)}
            onPageChange={onPageChange}
          />
        </div>
        {isFormOpen && <AddClient isOpen={isFormOpen} onClose={toggleForm} />}
        {isFormOpen && <div className="table-overlay"></div>}
      </div>
      {showDeleteConfirmation && (
      <DeleteConfirmation 
        item={deleteItem} 
        onConfirmDelete={confirmDelete} 
        onCancelDelete={cancelDelete} 
      />
    )}

    </div>
  );
};

export default Table;