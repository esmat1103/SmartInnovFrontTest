import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '@components/Commun/Alerts/success-alert';
import ErrorAlert from '@components/Commun/Alerts/error-alert';
import { updateDeviceById } from '@app/utils/apis/devices';
import { updateSensorById, fetchSensors } from '@app/utils/apis/sensors';
import { fetchCountries, fetchStates } from '@app/utils/apis/location';
import removeIcon from '/public/assets/Table/delete.svg';
import axios from 'axios';

const EditDevice = ({ isOpen, onClose, initialDeviceData }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deviceData, setDeviceData] = useState(initialDeviceData || {
    ref: '',
    deviceName: '',
    macAddress: '',
    countryId: '',
    countryName: '',
    state: '',
    adminID: '',
    clients: '',
    clientsIDs: [], 
    sensors: [],
    status: '',
    latitude: '',
    longitude: ''
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [userName, setUserName] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    setUserName(userName || '');
    if (!userName) {
      setAlertMessage('User name is not available');
      setShowErrorAlert(true);
    }

    fetchInitialData();
  }, [isOpen]);

  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [showErrorAlert]);

  useEffect(() => {
    if (initialDeviceData) {
      console.log('Initial Device Data:', initialDeviceData);
      const { location } = initialDeviceData;
      setDeviceData({
        ...initialDeviceData,
        latitude: location?.coordinates?.[1] || '', 
        longitude: location?.coordinates?.[0] || '' 
      });
    }
  }, [initialDeviceData]);
  
  
  
  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found in localStorage.');
      }
  
      const [countriesData, statesData, sensorsData, allClientsData] = await Promise.all([
        fetchCountries(),
        fetchStates(),
        fetchSensors(),
        axios.get('http://localhost:3008/users/role/enduser', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => response.data)
      ]);
  
      setCountries(countriesData);
      setStates(statesData);
      const unassignedSensors = sensorsData.filter(sensor => !sensor.deviceID);
      setSensors(unassignedSensors);
  
      const userId = localStorage.getItem('userId'); 
      if (!userId) {
        throw new Error('User ID is not available in localStorage.');
      }
      
      const filteredClients = allClientsData.filter(client => client.createdByAdmin === userId);
      setClients(filteredClients);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setAlertMessage('Error fetching initial data');
      setShowErrorAlert(true);
    }
  };
  

  const handleCloseAlerts = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'latitude' || name === 'longitude') {
      setDeviceData({
        ...deviceData,
        [name]: parseFloat(value) 
      });
    } else if (name === 'countryId') {
      const selectedCountry = countries.find(country => String(country.id) === value);
      setDeviceData({
        ...deviceData,
        countryId: value,
        countryName: selectedCountry ? selectedCountry.name : '',
      });
    } else {
      setDeviceData({ ...deviceData, [name]: value });
    }
  };
  

  const validateForm = () => {
    console.log('Device Data:', deviceData); // Add this for debugging
    const requiredFields = ['deviceName', 'macAddress', 'clientsIDs', 'countryId', 'state', 'adminID', 'status', 'latitude', 'longitude'];
    for (const field of requiredFields) {
      if (!deviceData[field] || (Array.isArray(deviceData[field]) && deviceData[field].length === 0)) {
        setAlertMessage(`Please fill in the ${field} field!`);
        setShowErrorAlert(true);
        return false;
      }
    }
    return true;
  };
  
   

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const updatedDeviceData = {
      ...deviceData,
      latitude: parseFloat(deviceData.latitude),
      longitude: parseFloat(deviceData.longitude),
      location: {
        type: 'Point',
        coordinates: [parseFloat(deviceData.longitude), parseFloat(deviceData.latitude)] 
      }
    };
  
    try {
      const updatedDevice = await updateDeviceById(deviceData._id, updatedDeviceData);
  
      setShowSuccessAlert(true);
      setTimeout(() => {
        handleCloseAlerts();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating device:', error);
      setAlertMessage('Error updating device');
      setShowErrorAlert(true);
    }
  };
  

  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Device updated successfully!" onClose={handleCloseAlerts} />}
      {showErrorAlert && <ErrorAlert message={alertMessage} onClose={handleCloseAlerts} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
          <input
            type="text"
            id="deviceName"
            name="deviceName"
            className="input-field"
            placeholder="Device Name"
            value={deviceData.deviceName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="macAddress"
            name="macAddress"
            className="input-field"
            placeholder="Mac Address"
            value={deviceData.macAddress}
            readOnly
          />
        </div>
        <div className="form-group">
        <div className='flex'>
          <select
            id="countryId"
            name="countryId"
            className="input-field custom-select mr-2"
            value={deviceData.countryId}
            onChange={handleChange}
          >
            <option value="" disabled>Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          <select
            id="state"
            name="state"
            className="input-field custom-select"
            value={deviceData.state}
            onChange={handleChange}
          >
            <option value="" disabled>Select State</option>
            {states
              .filter((state) => state.country_id === parseInt(deviceData.countryId))
              .map((state) => (
                <option key={state._id} value={state.name}>
                  {state.name}
                </option>
              ))}
          </select>
          </div> 
          </div>
        <div className="form-group">
          <div className='flex'>
          <input
            type="number"
            id="latitude"
            name="latitude"
            className="input-field mr-2"
            placeholder="Latitude"
            value={deviceData.latitude}
            onChange={handleChange}
          />
          <input
            type="number"
            id="longitude"
            name="longitude"
            className="input-field"
            placeholder="Longitude"
            value={deviceData.longitude}
            onChange={handleChange}
          />
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            readOnly
            id="adminID"
            name="adminID"
            className="input-field"
            value={userName}
          />
        </div>
        <div className="form-group">
          <select
            id="clients"
            name="clients"
            className="input-field custom-select"
            value=""
            onChange={(e) => {
              const selectedClientId = e.target.value;
              if (selectedClientId && !deviceData.clientsIDs.includes(selectedClientId)) {
                setDeviceData(prevData => ({
                  ...prevData,
                  clientsIDs: [...prevData.clientsIDs, selectedClientId]
                }));
              }
            }}
          >
            <option value="" disabled>Select Client</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>
                {client.firstName}
              </option>
            ))}
          </select>
        </div>
        <div className='selected-clients'>
            {deviceData.clientsIDs.length > 0 && (
              <ul>
                {deviceData.clientsIDs.map((clientId, index) => {
                  const client = clients.find(c => c._id === clientId);
                  return client ? (
                    <li key={index} className='selected-client d-inline-block'>
                      {client.firstName}
                      <button
                        type="button"
                        onClick={() => {
                          setDeviceData(prevData => ({
                            ...prevData,
                            clientsIDs: prevData.clientsIDs.filter(id => id !== clientId)
                          }));
                        }}
                      >
                        <Image src={removeIcon} alt="Remove" height={15} />
                      </button>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>
        <div className="form-group">
          <select
          id="sensors"
          name="sensors"
          className="input-field custom-select"
          value=""
          onChange={(e) => {
            const selectedSensorId = e.target.value;
            const selectedSensor = sensors.find(sensor => sensor._id === selectedSensorId);
            if (selectedSensor && !deviceData.sensors.includes(selectedSensor._id)) {
              setDeviceData(prevData => ({...prevData,sensors: [...prevData.sensors, selectedSensor._id]

              }));
            }
          }}>
            <option value="" disabled>Select Sensor</option>
            {sensors.map(sensor => (
              <option key={sensor._id} value={sensor._id}>
                {sensor.ref} 
              </option>
            ))}
            </select>
      </div>
      <div className="selected-sensors">
            {deviceData.sensors.map(sensor => (
              <li key={sensor.id} className="selected-sensor d-inline-block">
                {sensor.ref}
                <button type="button"  onClick={() => handleRemoveSensor(sensor.id)}>
                  <Image src={removeIcon} alt="Remove" height={20} />
                </button>
              </li>
            ))}
        </div>

        <div className="form-group">
          <select
            id="status"
            name="status"
            className="input-field custom-select"
            value={deviceData.status}
            onChange={handleChange}
          >
            <option value="" disabled>Select Status</option>
            <option value="In use">In Use</option>
            <option value="Suspended">Suspended</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditDevice;
