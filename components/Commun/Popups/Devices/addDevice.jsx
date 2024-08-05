import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '../../Alerts/success-alert';
import ErrorAlert from '../../Alerts/error-alert';
import { createDevice } from '@app/utils/apis/devices';
import { fetchCountries, fetchStates } from '@app/utils/apis/location'; 
import { createSensor } from '@app/utils/apis/sensors'; 
import { fetchSensorTypes } from '@app/utils/apis/sensorTypes'; 
import axios from 'axios';
import removeIcon from '/public/assets/Table/delete.svg'; 
import { v4 as uuidv4 } from 'uuid'; 

const AddDevice = ({ isOpen, onClose, onDeviceAdded }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deviceData, setDeviceData] = useState({
    deviceName: '',
    macAddress: '',
    countryId: '', 
    countryName: '', 
    state: '',
    adminID: '',
    clients: [],
    sensors: [],
    status: '',
    latitude: '', 
    longitude: '' 
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]); 
  const [admins, setAdmins] = useState([]);
  const timeoutRef = useRef(null);
  const sensorsUUID = uuidv4();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesData, statesData, sensorTypesData, adminsData] = await Promise.all([
          fetchCountries(),
          fetchStates(),
          fetchSensorTypes(),
          axios.get('http://localhost:3008/users/role/admin', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }).then(response => response.data)
        ]);

        setCountries(countriesData);
        setStates(statesData);
        setSensorTypes(sensorTypesData); 
        setAdmins(adminsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [showErrorAlert]);

  const handleCloseAlerts = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'sensors') {
      const selectedSensor = sensorTypes.find(sensor => sensor.sensorReference === value);
  
      if (selectedSensor) {
        setDeviceData(prevData => ({
          ...prevData,
          sensors: [...prevData.sensors, { ref: selectedSensor.sensorReference, id:sensorsUUID }]
        }));
      }
    } else if (name === 'countryId') {
      const selectedCountry = countries.find(country => String(country.id) === value);
      setDeviceData({
        ...deviceData,
        countryId: value,
        countryName: selectedCountry ? selectedCountry.name : '',
      });
    } else if (name === 'admin') {
      const selectedAdmin = admins.find(admin => admin.firstName === value);
      setDeviceData({
        ...deviceData,
        adminID: selectedAdmin ? selectedAdmin._id : '',
      });
    } else {
      setDeviceData({ ...deviceData, [name]: value });
    }
  };
  
  const validateForm = () => {
    const requiredFields = ['deviceName', 'macAddress', 'countryId', 'state', 'adminID', 'clients', 'sensors', 'status'];
  
    // Regular expression for MAC address validation
    const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  
    for (const field of requiredFields) {
      if (!deviceData[field] || (field === 'sensors' && deviceData.sensors.length === 0)) {
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
  
    try {
      const newDeviceData = {
        ...deviceData,
        location: {
          type: 'Point',
          coordinates: [parseFloat(deviceData.longitude), parseFloat(deviceData.latitude)]
        }
      };
  
      const newDevice = await createDevice(newDeviceData);
      console.log('New device created:', newDevice);
  
      if (!newDevice._id) {
        throw new Error('Device ID is not returned');
      }
  
      const updatedSensors = await Promise.all(deviceData.sensors.map(async (sensor) => {
        try {
          const sensorType = sensorTypes.find(type => type.sensorReference === sensor.ref);
  
          if (sensorType) {
            const newSensor = {
              type: sensorType.sensorName,
              thresholdMin: '',
              thresholdMax: '',
              state: '',
              params: [],
              deviceID: newDevice._id,
              macAddress: deviceData.macAddress,
              sensorID:  sensor.id,
            };
  
            if (sensorType.pulse === 'Yes') {
              newSensor.startIndex = 0;
            }
  
            await createSensor(newSensor);

            return { ref: sensor.ref };
          }
        } catch (sensorError) {
          console.error(`Error creating sensor ${sensor.ref}:`, sensorError);
          throw sensorError;
        }
      }));
  
      setDeviceData(prevData => ({
        ...prevData,
        sensors: updatedSensors
      }));
  
      setShowSuccessAlert(true);
      onDeviceAdded();
  
      timeoutRef.current = setTimeout(() => {
        setDeviceData({
          deviceName: '',
          macAddress: '',
          countryId: '',
          countryName: '',
          state: '',
          adminID: '',
          clients: [],
          sensors: [],
          status: '',
          latitude: '',
          longitude: ''
        });
        handleCloseAlerts();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding device:', error.response ? error.response.data : error.message);
      setAlertMessage('Error adding device');
      setShowErrorAlert(true);
    }
  };

  const handleRemoveSensor = (sensorId) => {
    setDeviceData({
      ...deviceData,
      sensors: deviceData.sensors.filter(sensor => sensor.id !== sensorId),
    });
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Device added successfully!" onClose={handleCloseAlerts} />}
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
              <option key={country._id} value={country.id}>
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
            id="admin"
            name="admin"
            className="input-field custom-select"
            value={deviceData.adminID}
            onChange={handleChange}
          >
            <option value="" disabled>Select Admin</option>
            {admins.map((admin) => (
              <option key={admin._id} value={admin.firstName}>
                {admin.firstName} {admin.lastName}
              </option>
            ))}
          </select>
        </div>
         <div className="form-group">
        <select
            id="sensors"
            name="sensors"
            className="input-field custom-select"
            value=""
            onChange={handleChange}
          >
            <option value="" disabled>Select Sensor</option>
            {sensorTypes.map(sensorType => (
              <option key={sensorType._id} value={sensorType.sensorReference}>
                {sensorType.sensorReference}
              </option>
            ))}
          </select>
        </div>
        <div className="selected-sensors">
          <ul>
            {deviceData.sensors.map(sensor => (
              <li key={sensor._id} className='selected-sensor d-inline-block'>
                {sensor.ref}
                <button type="button" onClick={() => handleRemoveSensor(sensor.id)}>
                  <Image src={removeIcon} alt="Remove" height={20} />
                </button>
              </li>
            ))}
          </ul>
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
            <option value="In use">In use</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDevice;
