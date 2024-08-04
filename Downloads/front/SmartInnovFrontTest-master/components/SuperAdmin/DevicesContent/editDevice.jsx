import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '@components/Commun/Alerts/success-alert'; 
import ErrorAlert from '@components/Commun/Alerts/error-alert'; 
import { updateDeviceById } from '@app/utils/apis/devices'; 
import { fetchSensors, createSensor, deleteSensorById } from '@app/utils/apis/sensors'; 
import { fetchCountries, fetchStates } from '@app/utils/apis/location';
import removeIcon from '/public/assets/Table/delete.svg';
import axios from 'axios';
import { fetchSensorTypes } from '@app/utils/apis/sensorTypes';
import { v4 as uuidv4 } from 'uuid'; 

const EditDevice = ({ isOpen, onClose, initialDeviceData }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deviceData, setDeviceData] = useState({
    ref: '',
    deviceName: '',
    macAddress: '',
    countryId: '',
    countryName: '',
    state: '',
    adminID: '',
    sensors: [],
    status: '',
    latitude: '',
    longitude: '',
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [admins, setAdmins] = useState([]);

 

  useEffect(() => {
    if (initialDeviceData) {
      console.log('Initial Device Data:', initialDeviceData);
      const { location } = initialDeviceData;
      setDeviceData({
        ...initialDeviceData,
        latitude: location?.coordinates[1] || '', 
        longitude: location?.coordinates[0] || '' 
      });
    } else {
      setDeviceData({
        deviceName: '',
        macAddress: '',
        countryId: '',
        countryName: '',
        state: '',
        adminID: '',
        sensors: [],
        status: '',
        latitude: '',
        longitude: '',
      });
    }
  
    fetchInitialData();
  }, [isOpen, initialDeviceData]);

  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [showErrorAlert]);
  
  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found in localStorage.');
      }
      
      const [countriesData, statesData, sensorsData, sensorTypesData, adminsData] = await Promise.all([
        fetchCountries(),
        fetchStates(),
        fetchSensors(),
        fetchSensorTypes(),
        axios.get('http://localhost:3008/users/role/admin', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => response.data)
      ]);

      setCountries(countriesData);
      setStates(statesData);
      setSensors(sensorsData);
      setSensorTypes(sensorTypesData);
      setAdmins(adminsData);
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
  
    if (name === 'countryId') {
      const selectedCountry = countries.find(country => String(country.id) === value);
      setDeviceData({
        ...deviceData,
        countryId: value,
        countryName: selectedCountry ? selectedCountry.name : ''
      });
    } else if (name === 'adminID') {
      setDeviceData({
        ...deviceData,
        adminID: value,
        admin: admins.find(admin => admin._id === value)?.firstName || ''
      });
    } else if (name === 'sensors') {
      const sensorsUUID = uuidv4();
      const selectedSensor = sensorTypes.find(sensor => sensor._id === value);
      if (selectedSensor && !deviceData.sensors.find(sensor => sensor.id === value)) {

        setDeviceData(prevData => ({
          ...prevData,
          sensors: [...prevData.sensors, { ref: selectedSensor.sensorReference, id: sensorsUUID }]
        }));
  
        try {
          await createSensor({
            type: selectedSensor.sensorName,
            thresholdMin: '',
            thresholdMax: '',
            state: '',
            params: [],
            deviceID: deviceData._id,
            macAddress: deviceData.macAddress,
            sensorID: sensorsUUID,
          });
        } catch (error) {
          console.error('Error creating sensor:', error);
          setAlertMessage('Error creating sensor');
          setShowErrorAlert(true);
        }
      }
    } else {
      setDeviceData({ ...deviceData, [name]: value });
    }
  };
  
  const handleRemoveSensor = async (sensorId) => {
    console.log('Attempting to remove sensor with ID:', sensorId);

    try {
      const updatedSensors = deviceData.sensors.filter(sensor => sensor.id !== sensorId);
      setDeviceData(prevData => ({
        ...prevData,
        sensors: updatedSensors,
      }));
  
      const sensorToDelete = sensors.find(sensor => {
        const isMatch = sensor.sensorID === sensorId;
        console.log('Comparing:', sensor.sensorID, 'with', sensorId, 'Match:', isMatch);
        return isMatch;
      });
  
      console.log('Sensor to delete:', sensorToDelete);
  
      if (sensorToDelete && sensorToDelete._id) {  
        // Delete sensor from the backend
        await deleteSensorById(sensorToDelete._id);  
        console.log('Sensor successfully deleted');
      } else {
        console.log('Sensor not found in sensors collection or _id is missing');
      }
    } catch (error) {
      console.error('Error removing sensor:', error.response ? error.response.data : error.message);
      setAlertMessage('Error removing sensor');
      setShowErrorAlert(true);
    }
  };
  
  const validateForm = () => {
    const requiredFields = ['deviceName', 'macAddress', 'countryId', 'state', 'adminID', 'sensors', 'status', 'latitude', 'longitude'];
    
    const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

    for (const field of requiredFields) {
      if (!deviceData[field]) {
        setAlertMessage('Please fill in all the required fields !');
        setShowErrorAlert(true);
        return false;
      }
    }
    if (deviceData.macAddress && !macAddressRegex.test(deviceData.macAddress)) {
      setAlertMessage('Please enter a valid MAC address !');
      setShowErrorAlert(true);
      return false;
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
    await updateDeviceById(deviceData._id, updatedDeviceData);
    
    console.log('Device updated:', updatedDeviceData);
    
    await Promise.all(deviceData.sensors.map(async (sensor) => {
      const sensorType = sensorTypes.find(type => type._id === sensor.id);
      
      if (sensorType) {
        console.log('Creating sensor with type:', sensorType.sensorName);
        
        await createSensor({
          type: sensorType.sensorName,
          thresholdMin: '',
          thresholdMax: '',
          state: '',
          params: [],
          deviceID: deviceData._id,
          macAddress: deviceData.macAddress,
          sensorID: sensor.id,
        });
      } else {
        console.log('Sensor type not found for sensor ID:', sensor.id);
      }
    }));
  
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
            onChange={handleChange}
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
          <select
            id="adminID"
            name="adminID"
            className="input-field custom-select"
            value={deviceData.adminID}
            onChange={handleChange}
          >
            <option value="" disabled>Select Admin</option>
            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.firstName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            id="sensors"
            name="sensors"
            className="input-field custom-select"
            onChange={handleChange}
            value=""
          >
            <option value="" disabled>Select Sensor</option>
            {sensorTypes.map((sensor) => (
              <option key={sensor._id} value={sensor._id}>
                {sensor.sensorReference}
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
