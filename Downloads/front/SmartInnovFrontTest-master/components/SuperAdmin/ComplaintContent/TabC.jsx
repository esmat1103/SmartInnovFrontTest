import React, { useState } from 'react';
import HeaderC from './Header';
import AddButton from '@components/Commun/Buttons/AddButton';
import cl1 from '../../../public/assets/Table/1.png';
import cl5 from '../../../public/assets/Table/cl5.jpeg';
import cl2 from '../../../public/assets/Table/cl2.jpeg';
import cl3 from '../../../public/assets/Table/cl3.jpeg';
import cl4 from '../../../public/assets/Table/cl4.jpeg';
import deleteW from '../../../public/assets/Table/deleteW.svg';
import Pagination from '../../Commun/Pagination';
import FormClient from '@components/Commun/Popups/Clients/form';
import DateFilter from '@components/Commun/date-filter';
import DropdownFilter from '../../commun/fliter';
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import TableBodyC from './TabBodyC';

const TabC = () => {
 const [tableData, setTableData] = useState([
    { sensorId: '#SEN001', sensorType: 'Temperature', sensorStatus: 'Active', sensorUrgency: 'Low', lastRecordedData: '22.5°C', batteryStatus: '80%', lastCommunication: '2024-06-14 10:00', id: '#FRTL', clientName: 'Jane Doe', complaintDetails: 'Issue with sensor reading', status: 'Open', urgency: 'High', actionDue: '2024-06-20', dateTime: '2024-06-14 09:00' },
    { sensorId: '#SEN002', sensorType: 'Humidity', sensorStatus: 'Inactive', sensorUrgency: 'Low', lastRecordedData: '60%', batteryStatus: '20%', lastCommunication: '2024-06-14 11:00', id: '#LKIH', clientName: 'John Smith', complaintDetails: 'Battery not charging', status: 'In Progress', urgency: 'Medium', actionDue: '2024-06-21', dateTime: '2024-06-14 10:00' },
    { sensorId: '#SEN003', sensorType: 'Pressure', sensorStatus: 'Active', sensorUrgency: 'Medium', lastRecordedData: '1013 hPa', batteryStatus: '50%', lastCommunication: '2024-06-14 12:00', id: '#XCVB', clientName: 'Mary Johnson', complaintDetails: 'Intermittent connectivity', status: 'Resolved', urgency: 'Low', actionDue: '2024-06-22', dateTime: '2024-06-14 11:00' },
    { sensorId: '#SEN004', sensorType: 'Light', sensorStatus: 'Active', sensorUrgency: 'High', lastRecordedData: '300 lx', batteryStatus: '90%', lastCommunication: '2024-06-14 13:00', id: '#QWER', clientName: 'James Brown', complaintDetails: 'Incorrect data', status: 'Open', urgency: 'High', actionDue: '2024-06-23', dateTime: '2024-06-14 12:00' },
    { sensorId: '#SEN005', sensorType: 'Proximity', sensorStatus: 'Inactive', sensorUrgency: 'High', lastRecordedData: 'N/A', batteryStatus: '10%', lastCommunication: '2024-06-14 14:00', id: '#TYUI', clientName: 'Emily Davis', complaintDetails: 'Sensor not responding', status: 'In Progress', urgency: 'Medium', actionDue: '2024-06-24', dateTime: '2024-06-14 13:00' },
    { sensorId: '#SEN006', sensorType: 'Temperature', sensorStatus: 'Active', sensorUrgency: 'Low', lastRecordedData: '21.8°C', batteryStatus: '85%', lastCommunication: '2024-06-14 15:00', id: '#FRTL1', clientName: 'Jane Doe', complaintDetails: 'Issue with sensor reading', status: 'Open', urgency: 'High', actionDue: '2024-06-25', dateTime: '2024-06-14 14:00' },
    { sensorId: '#SEN007', sensorType: 'Humidity', sensorStatus: 'Inactive', sensorUrgency: 'Low', lastRecordedData: '58%', batteryStatus: '15%', lastCommunication: '2024-06-14 16:00', id: '#LKIH2', clientName: 'John Smith', complaintDetails: 'Battery not charging', status: 'In Progress', urgency: 'Medium', actionDue: '2024-06-26', dateTime: '2024-06-14 15:00' },
    { sensorId: '#SEN008', sensorType: 'Pressure', sensorStatus: 'Active', sensorUrgency: 'Medium', lastRecordedData: '1015 hPa', batteryStatus: '55%', lastCommunication: '2024-06-14 17:00', id: '#XCVB3', clientName: 'Mary Johnson', complaintDetails: 'Intermittent connectivity', status: 'Resolved', urgency: 'Low', actionDue: '2024-06-27', dateTime: '2024-06-14 16:00' },
    { sensorId: '#SEN009', sensorType: 'Light', sensorStatus: 'Active', sensorUrgency: 'Low', lastRecordedData: '290 lx', batteryStatus: '88%', lastCommunication: '2024-06-14 18:00', id: '#QWER4', clientName: 'James Brown', complaintDetails: 'Incorrect data', status: 'Open', urgency: 'High', actionDue: '2024-06-28', dateTime: '2024-06-14 17:00' },
    { sensorId: '#SEN010', sensorType: 'Proximity', sensorStatus: 'Inactive', sensorUrgency: 'High', lastRecordedData: 'N/A', batteryStatus: '12%', lastCommunication: '2024-06-14 19:00', id: '#XCVB5', clientName: 'Mary Johnson', complaintDetails: 'Sensor not responding', status: 'In Progress', urgency: 'Medium', actionDue: '2024-06-29', dateTime: '2024-06-14 18:00' },
    { sensorId: '#SEN009', sensorType: 'Light', sensorStatus: 'Active', sensorUrgency: 'Low', lastRecordedData: '290 lx', batteryStatus: '88%', lastCommunication: '2024-06-14 18:00', id: '#QWER4', clientName: 'James Brown', complaintDetails: 'Incorrect data', status: 'Open', urgency: 'High', actionDue: '2024-06-28', dateTime: '2024-06-14 17:00' },
    { sensorId: '#SEN010', sensorType: 'Proximity', sensorStatus: 'Inactive', sensorUrgency: 'High', lastRecordedData: 'N/A', batteryStatus: '12%', lastCommunication: '2024-06-14 19:00', id: '#XCVB5', clientName: 'Mary Johnson', complaintDetails: 'Sensor not responding', status: 'In Progress', urgency: 'Medium', actionDue: '2024-06-29', dateTime: '2024-06-14 18:00' },
  ]);


  
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 11;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 
  const [deleteItem, setDeleteItem] = useState(null); 


  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = (id) => {
  };

  const handleEdit = (id) => {
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
    setShowDeleteConfirmation(true); 
  };
  
  const confirmDelete = () => {
    const updatedData = tableData.filter((row) => !selectedRows.includes(row.id));
    setTableData(updatedData);
    setSelectedRows([]);
    setShowDeleteConfirmation(false);
  };
  

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (<>
    <div className="container-tab">
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
          <div className='flex'>
            <DateFilter onChange={(date) => console.log('Selected date:', date)} />
            <DropdownFilter options={filterOptions} onChange={(option) => console.log('Selected option:', option)} />
          </div>
        </div>
        <table className="mt table-auto">
          <HeaderC handleHeaderCheckboxChange={handleHeaderCheckboxChange} />
          <TableBodyC
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
        {isFormOpen && <FormClient isOpen={isFormOpen} onClose={toggleForm} />}
        {isFormOpen && <div className="table-overlay"></div>}
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          item={deleteItem}
          onConfirmDelete={confirmDelete}
          onCancelDelete={cancelDelete}
        />
      )}
 </> );
};

export default TabC;
