import React, { useState, useEffect } from 'react';
import AddButton from '@components/Commun/Buttons/AddButton';
import deleteW from '@public/assets/Table/deleteW.svg';
import Pagination from '@components/Commun/Pagination';
import DropdownFilter from '../../commun/fliter'; 
import SearchBar from '@components/Commun/search'; 
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import { deleteSensorTypeById, fetchSensorTypes, updateSensorTypeById } from '@app/utils/apis/sensorTypes';
import TableHeaderT from '@components/Commun/Sensors/TabHeaderT';
import TableBodyT from '@components/Commun/Sensors/TabBodyT';
import AddType from '@components/Commun/Popups/Sensors/addType';

const TableT = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 11;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [filterOption, setFilterOption] = useState(''); 
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;
 
  const filterOptions = {
    'All sensors':'',
    'Pulsed sensors': 'Yes',
    'Non-pulsed sensors': 'No',
  };

  useEffect(() => {
    fetchSensorTypeData();

    const ws = new WebSocket('ws://localhost:3001/sensorTypes');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      if (data.message === 'Sensor Type created' || data.message === 'Sensor Type deleted' || data.message === 'Sensor Type updated') {
        fetchSensorTypeData(); 
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
  }, [refresh]);

  const fetchSensorTypeData = async () => {
    try {
      const sensors = await fetchSensorTypes();
      setTableData(sensors);
      filterData(sensors, searchTerm, filterOption);
    } catch (error) {
      console.error('Error fetching sensors types:', error);
    }
  };

  const filterData = (data, searchTerm, filterOption) => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(sensor =>
        Object.values(sensor).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof value === 'number' && value.toString().includes(searchTerm))
        )
      );
    }

    if (filterOption === 'Yes') {
      filtered = filtered.filter(sensor => sensor.pulse === 'No');
    } else if (filterOption === 'No') {
      filtered = filtered.filter(sensor => sensor.pulse === 'Yes');
    }

    setFilteredData(filtered);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSensorTypeById(id);
      setRefresh(!refresh); 
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting sensor type:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await updateSensorTypeById(id, updatedData);
      setRefresh(!refresh); 
    } catch (error) {
      console.error('Error updating sensor type:', error);
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
    setSelectedRows(allSelected ? [] : tableData.map(row => row._id));
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

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
      await Promise.all(selectedRows.map(id => deleteSensorTypeById(id)));
      setRefresh(!refresh); 
      setShowDeleteConfirmation(false);
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected sensors types:', error);
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
          <AddButton text="Add Sensor Type" onClick={toggleForm} />
        </div>
      </div>
      <div className="mt-5 table-container">
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
          <div className="">
            <DropdownFilter
              options={Object.keys(filterOptions)} 
              onChange={handleFilterChange} 
            />
          </div>
        </div>
        <table className="table-auto">
          <TableHeaderT
            handleHeaderCheckboxChange={handleHeaderCheckboxChange}
            allSelected={allSelected}
          />
          <TableBodyT
            tableData={filteredData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
          />
        </table>
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / rowsPerPage)} 
            onPageChange={onPageChange}
          />
        </div>
        {isFormOpen && <AddType isOpen={isFormOpen} onClose={toggleForm} onSensorTypeAdded={() => setRefresh(!refresh)} />}
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

export default TableT;
