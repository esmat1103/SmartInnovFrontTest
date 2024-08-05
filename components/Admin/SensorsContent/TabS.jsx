import React, { useState, useEffect } from 'react';
import TableHeaderS from '@components/Commun/Sensors/TabHeaderS'; 
import TableBodyS from '@components/Commun/Sensors/TabBodyS'; 
import deleteW from '@public/assets/Table/deleteW.svg';
import Pagination from '@components/Commun/Pagination';
import DropdownFilter from '../../commun/fliter';
import SearchBar from '@components/Commun/search'; 
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import { fetchSensors, updateSensorById, deleteSensorById } from '@app/utils/apis/sensors'; 
import { fetchSensorTypes } from '@app/utils/apis/sensorTypes';
import { getDevicesByAdminId } from '@app/utils/apis/devices';

const filterOptions = {
  'All sensors': '',
  'Enabled sensors': 'Enabled',
  'Disabled sensors': 'Disabled',
  'Pulsed sensors': 'Yes',
  'Non-pulsed sensors': 'No',
};

const TableS = () => {
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

  useEffect(() => {
    fetchSensorData();

    const ws = new WebSocket('ws://localhost:3001/sensors');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      if (data.message === 'Sensor created' || data.message === 'Sensor deleted' || data.message === 'Sensor updated') {
        fetchSensorData(); 
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

  const fetchSensorData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const devices = await getDevicesByAdminId(userId);
      const deviceIds = devices.map(device => device._id);
  
      const sensors = await fetchSensors();
      console.log('Fetched sensors:', sensors);
      const filteredSensors = sensors.filter(sensor => deviceIds.includes(sensor.deviceID));
      console.log('Filtered sensors:', filteredSensors);
  
      const sensorTypes = await fetchSensorTypes();
      console.log('Fetched sensor types:', sensorTypes);
  
      const mergedData = filteredSensors.map(sensor => {
        const sensorType = sensorTypes.find(type => type.sensorName === sensor.type);
        return { 
          ...sensor, 
          sensorReference: sensorType ? sensorType.sensorReference : '', 
          sensorName: sensorType ? sensorType.sensorName : '', 
          rangeMin: sensorType ? sensorType.rangeMin : '',
          rangeMax: sensorType ? sensorType.rangeMax : '',
          pulse: sensorType ? sensorType.pulse : '',
          coefficient: sensorType ? sensorType.coefficient : '',
          description: sensorType ? sensorType.description : '',
          unit: sensorType ? sensorType.unit : ''
        };
      });
      console.log('Merged data:', mergedData);
  
      setTableData(mergedData);
      filterData(mergedData, searchTerm, filterOption);
    } catch (error) {
      console.error('Error fetching sensors:', error);
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

    if (filterOption === 'Enabled') {
      filtered = filtered.filter(sensor => sensor.state === 'Enabled');
    } else if (filterOption === 'Disabled') {
      filtered = filtered.filter(sensor => sensor.state === 'Disabled');
    } else if (filterOption === 'Yes') {
      filtered = filtered.filter(sensor => sensor.pulse === 'Yes');
    } else if (filterOption === 'No') {
      filtered = filtered.filter(sensor => sensor.pulse === 'No');
    }

    setFilteredData(filtered);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSensorById(id);
      setRefresh(!refresh); 
    } catch (error) {
      console.error('Error deleting sensor:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await updateSensorById(id, updatedData);
      setRefresh(!refresh); 
    } catch (error) {
      console.error('Error updating sensor:', error);
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    filterData(tableData, value, filterOption);
  };

  const handleFilterChange = (description) => {
    const internalValue = filterOptions[description] || '';
    setFilterOption(internalValue);
    filterData(tableData, searchTerm, internalValue);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;

  const handleDeleteSelected = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(selectedRows.map(id => deleteSensorById(id)));
      setRefresh(!refresh); 
      setShowDeleteConfirmation(false);
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected sensors:', error);
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
          <TableHeaderS
            handleHeaderCheckboxChange={handleHeaderCheckboxChange}
            allSelected={allSelected}
          />
          <TableBodyS
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

export default TableS;
