import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import deleteIcon from '../../../public/assets/Table/delete.svg';
import exportIcon from '../../../public/assets/Table/export.svg';
import DeleteConfirmation from '@components/Commun/Popups/Devices/DeleteConfirmationModal';
import SensorsPopup from '@components/Commun/Popups/Devices/SensorsPopup';
import { getDeviceById, deleteDeviceById } from '@app/utils/apis/devices';
import { fetchSensors } from '@app/utils/apis/sensors';
import axios from 'axios';

const TableBodyD = ({ tableData, selectedRows, handleCheckboxChange, refreshData, token }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSensorsPopupVisible, setIsSensorsPopupVisible] = useState(false);
  const [editDeviceData, setEditDeviceData] = useState(null);
  const [deviceSensors, setDeviceSensors] = useState([]);
  const [clients, setClients] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
          const token = localStorage.getItem('token');
          
          if (!token) {
            throw new Error('No token found in localStorage.');
          }
        console.log("Fetching clients with token:", token);
        const response = await axios.get('http://localhost:3008/users/role/enduser', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Response data:", response.data);
        const clientsData = response.data;
        const clientsMap = clientsData.reduce((acc, client) => {
          acc[client._id] = client.firstName;
          return acc;
        }, {});
        setClients(clientsMap);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  const handleDeleteClick = (deviceId) => {
    setShowDeleteConfirmation(true);
    setDeleteItem(deviceId);
  };

  const confirmDelete = async () => {
    try {
      const deviceToDelete = tableData.find((item) => item._id === deleteItem);
      if (deviceToDelete && deviceToDelete.sensors) {
        const sensors = await fetchSensors();
        await Promise.all(
          deviceToDelete.sensors.map(async (sensorReference) => {
            const sensor = sensors.find((s) => s.sensorReference === sensorReference);
            if (sensor) {
              await updateSensorById(sensor._id, { deviceID: null });
            }
          })
        );
      }

      await deleteDeviceById(deleteItem);
      refreshData();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting device or updating sensors:', error);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setIsSensorsPopupVisible(false);
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
        {tableData.map((row) => (
          <tr key={row._id} className="table-row-box nunito f12">
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
            <td className='f11 nunito pl23 center'>{row.admin}</td>
            <td className='f11 nunito pl23'>
              <button className="box-cell f11 button-like" onClick={() => handleButtonClick(row._id)}>
                {row.sensors.length}
              </button>
            </td>
            <td className="f11 nunito center">
              <div className={ row.status === 'In use' ? 'box-cellE f11' : row.status === 'Maintenance' ? 'box-cellD f11' : row.status === 'Suspended' ? 'box-cellH f11' : 'default-class f11'}>
                {row.status}
              </div>
            </td>
            <td className="text-center">
              <div className="flex justify-center ">
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
      {showDeleteConfirmation && (
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
