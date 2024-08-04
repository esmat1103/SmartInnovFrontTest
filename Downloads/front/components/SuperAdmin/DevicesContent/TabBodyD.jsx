import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import deleteIcon from '../../../public/assets/Table/delete.svg';
import editIcon from '../../../public/assets/Table/edit.svg';
import exportIcon from '../../../public/assets/Table/export.svg';
import DeleteConfirmation from '@components/Commun/Popups/Devices/DeleteConfirmationModal';
import SensorsPopup from '@components/Commun/Popups/Devices/SensorsPopup';
import EditDevice from './editDevice'; 
import { getDeviceById, deleteDeviceById } from '@app/utils/apis/devices';
import { deleteSensorById, fetchSensors } from '@app/utils/apis/sensors';

const TableBodyD = ({ tableData, selectedRows, handleCheckboxChange, refreshData }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSensorsPopupVisible, setIsSensorsPopupVisible] = useState(false);
  const [editDeviceData, setEditDeviceData] = useState(null);
  const [deviceSensors, setDeviceSensors] = useState([]);
  const [clientsData, setClientsData] = useState({});
  const [adminsData, setAdminsData] = useState({}); 

  useEffect(() => {
    const fetchClientNames = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in localStorage.');
        }

        const response = await axios.get('http://localhost:3008/users/role/enduser', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const clients = response.data;
        const clientDataMap = clients.reduce((map, client) => {
          map[client._id] = client.firstName; 
          return map;
        }, {});
        
        setClientsData(clientDataMap);
      } catch (error) {
        console.error('Failed to fetch client names:', error);
      }
    };

    const fetchAdminNames = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in localStorage.');
        }

        const response = await axios.get('http://localhost:3008/users/role/admin', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const admins = response.data;
        const adminDataMap = admins.reduce((map, admin) => {
          map[admin._id] = `${admin.firstName} ${admin.lastName}`; 
          return map;
        }, {});
        
        setAdminsData(adminDataMap);
      } catch (error) {
        console.error('Failed to fetch admin names:', error);
      }
    };

    fetchClientNames();
    fetchAdminNames();
  }, []);

  const handleEditClick = (deviceId) => {
    const deviceToEdit = tableData.find((item) => item._id === deviceId);
    const deviceDataWithId = { ...deviceToEdit, id: deviceToEdit._id };
    setEditDeviceData(deviceDataWithId);
    setIsPopupVisible(true);
  };

  const handleDeleteClick = (deviceId) => {
    setShowDeleteConfirmation(true);
    setDeleteItem(deviceId);
  };

  const confirmDelete = async () => {
    try {
      const deviceToDelete = tableData.find((item) => item._id === deleteItem);
      if (!deviceToDelete) {
        throw new Error('Device not found.');
      }
  
      const sensors = await fetchSensors();
  
      const sensorsToDelete = sensors.filter((s) => s.deviceID === deleteItem);
  
      await Promise.all(
        sensorsToDelete.map(async (sensor) => {
          await deleteSensorById(sensor._id);
        })
      );
  
      await deleteDeviceById(deleteItem);
  
      refreshData();
  
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting device or sensors:', error);
    }
  };
  

  const closePopup = () => {
    setIsPopupVisible(false);
    setIsSensorsPopupVisible(false);
    setEditDeviceData(null);
    setDeviceSensors([]);
  };

  const handleButtonClick = async (deviceId) => {
    try {
      const device = await getDeviceById(deviceId);
      setDeviceSensors(device.sensors || []);
      setIsSensorsPopupVisible(true);
    } catch (error) {
      console.error('Failed to fetch device sensors:', error);
    }
  };

  return (
    <>
      <tbody className='darkgrey'>
        {tableData.map((row, index) => (
          <tr key={index} className="table-row-box nunito f12">
            <td>
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectedRows.includes(row._id)}
                onChange={() => handleCheckboxChange(row._id)}
              />
            </td>
            <td className='f11 nunito pl23 darkgrey center'>{row.deviceName}</td>
            <td className='f11 nunito fw600 darkgrey center'>{row.macAddress}</td>
            <td className='f11 nunito pl17 center'>
              <div className="box-cell f11">{row.countryName}</div>
            </td>
            <td className='f11 nunito pl17 center'>
              <div className="box-cell f11">{row.state}</div>
            </td>
            <td className='f11 nunito pl23 center'>
              {console.log('Admin ID:', row.adminID)} 
              {console.log('Admins Data:', adminsData)} 
              {adminsData[row.adminID] || row.adminID}
            </td>
            <td className='f11 nunito pl50 center'>
              {row.clientsIDs.map(clientID => clientsData[clientID] || clientID).join(', ')}
            </td>
            <td className='f11 nunito pl23 '>
              <button className="box-cell f11 button-like" onClick={() => handleButtonClick(row._id)}>
                {row.sensors.length}
              </button>
            </td>
            <td className="f11 nunito center">
              <div className={
                row.status === 'In use' ? 'box-cellE f11' : 
                row.status === 'Maintenance' ? 'box-cellD f11' : 
                row.status === 'Suspended' ? 'box-cellH f11' : 
                'default-class f11'
              }>
                {row.status}
              </div>
            </td>
            <td className="text-center">
              <div className="flex justify-center ">
                <button onClick={() => handleEditClick(row._id)}>
                  <Image src={editIcon} alt='edit' width={20} height={20} />
                </button>
                <button onClick={() => handleDeleteClick(row._id)}>
                  <Image src={exportIcon} alt='export' width={20} height={20} />
                </button>
                <button onClick={() => handleDeleteClick(row._id)}>
                  <Image src={deleteIcon} alt='delete' width={20} height={20} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {isPopupVisible && (
        <>
        <EditDevice
          initialDeviceData={editDeviceData}
          isOpen={isPopupVisible}
          onClose={closePopup}
        />
         <div className="table-overlay"></div>
        </>
      )}
      {showDeleteConfirmation && deleteItem && (
        <DeleteConfirmation
          item={deleteItem}
          onConfirmDelete={confirmDelete}
          onCancelDelete={() => setShowDeleteConfirmation(false)}
        />
      )}
      {isSensorsPopupVisible && (
        <SensorsPopup
          closePopup={closePopup}
          sensors={deviceSensors}
        />
      )}
    </>
  );
};

export default TableBodyD;
