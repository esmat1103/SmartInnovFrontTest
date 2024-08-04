import React, { useState, useEffect } from 'react';
import TableHeaderD from './TabHeaderD'; 
import TableBodyD from './TabBodyD'; 
import deleteW from '@public/assets/Table/deleteW.svg';
import Pagination from '@components/Commun/Pagination';
import SearchBar from '@components/Commun/search';
import DropdownFilter from '../../commun/fliter';
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import { getDevicesByClientId, deleteDeviceById } from '@app/utils/apis/devices'; 

const filterOptions = {
  'All devices': '',
  'Devices under Maintenance': 'Maintenance',
  'Devices in Use': 'In use',
  'Devices suspended': 'Suspended'
};

const TableD = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [filterOption, setFilterOption] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID is not available');
        }
        const data = await getDevicesByClientId(userId);
        setTableData(data);
        filterData(data, searchTerm, filterOption); // Apply filter and search on fetch
      } catch (error) {
        console.error('Error fetching devices:', error);
        setError('Failed to fetch devices.');
      }
    };

    fetchDeviceData();
    const ws = new WebSocket('ws://localhost:4002');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message === 'Device created' || data.message === 'Device updated' || data.message === 'Device deleted') {
        fetchDeviceData(); 
      }
    };

    return () => {
      ws.close();
    };
  }, [refresh]);

  const filterData = (data, searchTerm, filterOption) => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(device =>
        Object.values(device).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof value === 'number' && value.toString().includes(searchTerm))
        )
      );
    }

    if (filterOption) {
      filtered = filtered.filter(device => device.status === filterOption); 
    }

    setFilteredData(filtered);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDeviceById(id);
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    setAllSelected(!allSelected);
    setSelectedRows(allSelected ? [] : filteredData.map(row => row._id));
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    filterData(tableData, value, filterOption);
  };

  const handleFilterChange = (description) => {
    const internalValue = filterOptions[description] || '';
    setFilterOption(internalValue);
    filterData(tableData, searchTerm, internalValue);
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(selectedRows.map(id => deleteDeviceById(id)));
      setRefresh(!refresh);
      setSelectedRows([]);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting selected devices:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="container-tab">
      <div className="top-container flex justify-between">
        <div className="top-left-text nunito f30 "></div>
        <div className="top-right-container flex">
          <SearchBar onChange={handleSearchChange} />
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
          <div className=''>
            <DropdownFilter
              options={Object.keys(filterOptions)} 
              onChange={handleFilterChange} 
            />
          </div>
        </div>
        <table className="table-auto">
          <TableHeaderD handleHeaderCheckboxChange={handleHeaderCheckboxChange} />
          <TableBodyD
            tableData={filteredData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
          />
        </table>
        <div className='pagination-container'>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      {isFormOpen && (
        <div className="table-overlay" onClick={toggleForm}></div>
      )}
     {showDeleteConfirmation && (
        <DeleteConfirmation
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default TableD;
