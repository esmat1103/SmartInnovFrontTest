import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '../../Alerts/success-alert';
import ErrorAlert from '../../Alerts/error-alert';
import { updateSensorById, fetchSensors } from '@app/utils/apis/sensors'; 
import { fetchUnits } from '@app/utils/apis/units'; 
import { updateSensorTypeById } from '@app/utils/apis/sensorTypes';
import { fetchDevices, updateDeviceById } from '@app/utils/apis/devices'; 

const EditType = ({ isOpen, onClose, initialSensorTypeData }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [sensorTypeData, setSensorTypeData] = useState(initialSensorTypeData || {});
  const [units, setUnits] = useState([]); 
  const [showAdditionalFields, setShowAdditionalFields] = useState(initialSensorTypeData && initialSensorTypeData.pulse === 'Yes');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [showErrorAlert]);

  const closeSuccessAlert = () => setShowSuccessAlert(false);
  const closeErrorAlert = () => setShowErrorAlert(false);

  const validateForm = () => {
    const requiredFields = ['sensorReference', 'sensorName', 'unit', 'rangeMin', 'rangeMax', 'pulse'];
    
    for (const field of requiredFields) {
      if (!sensorTypeData[field]) {
        setErrorAlertMessage('Please fill in all the required fields !');
        setShowErrorAlert(true);
        return false;
      }
    }
    
    if (showAdditionalFields && (sensorTypeData.pulse === 'Yes') && (!sensorTypeData.coefficient)) {
      setErrorAlertMessage('Please fill in all the required fields !');
      setShowErrorAlert(true);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      const updatedSensorTypeData = {
        sensorReference: sensorTypeData.sensorReference,
        sensorName: sensorTypeData.sensorName,
        unit: sensorTypeData.unit,
        rangeMin: sensorTypeData.rangeMin,
        rangeMax: sensorTypeData.rangeMax,
        pulse: sensorTypeData.pulse,
        coefficient: sensorTypeData.pulse === 'No' ? '0' : sensorTypeData.coefficient,
      };
  
      await updateSensorTypeById(sensorTypeData._id, updatedSensorTypeData);
  
      const sensors = await fetchSensors();
  
      for (const sensor of sensors) {
        if (sensor.type === initialSensorTypeData.sensorName) {
          await updateSensorById(sensor._id, { type: sensorTypeData.sensorName });
        }
      }
  
      const devices = await fetchDevices();
  
      for (const device of devices) {
        const sensorsToUpdate = device.sensors.filter(sensor => sensor.ref === initialSensorTypeData.sensorReference);
        
        if (sensorsToUpdate.length > 0) {
          const updatedSensors = device.sensors.map(sensor => 
            sensor.ref === initialSensorTypeData.sensorReference
              ? { ...sensor, ref: sensorTypeData.sensorReference }
              : sensor
          );
  
          await updateDeviceById(device._id, { sensors: updatedSensors });
        }
      }
  
      setShowSuccessAlert(true);
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating sensor type:', error);
      setErrorAlertMessage('Error updating sensor type: ' + (error.response?.data?.message || error.message));
      setShowErrorAlert(true);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSensorTypeData({ ...sensorTypeData, [name]: value });
  };

  const handlePulseChange = (e) => {
    const pulseValue = e.target.value;
    setSensorTypeData({ ...sensorTypeData, pulse: pulseValue });
    setShowAdditionalFields(pulseValue === 'Yes');
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialSensorTypeData) {
      setSensorTypeData(initialSensorTypeData);
      setShowAdditionalFields(initialSensorTypeData.pulse === 'Yes');
    }
  }, [initialSensorTypeData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unitsData = await fetchUnits(); 
        setUnits(unitsData);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    fetchData();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Sensor updated successfully!" onClose={closeSuccessAlert} />}
      {showErrorAlert && <ErrorAlert message={errorAlertMessage} onClose={closeErrorAlert} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            id="sensorReference"
            name="sensorReference"
            className="input-field"
            placeholder="Sensor Reference"
            value={sensorTypeData.sensorReference || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="sensorName"
            name="sensorName"
            className="input-field"
            placeholder="Sensor Name"
            value={sensorTypeData.sensorName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group select-container">
          <select
            id="unit"
            name="unit"
            className="input-field custom-select"
            value={sensorTypeData.unit || ''}
            onChange={handleChange}
          >
            <option value="" disabled>Select Unit</option>
            {units.map((unit) => (
              <option key={unit._id} value={unit.unitName}>{unit.unitName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <div className='flex'>
            <input
              type="number"
              id="rangeMin"
              name="rangeMin"
              className="input-field mr-2"
              placeholder="Range Min"
              value={sensorTypeData.rangeMin || ''}
              onChange={handleChange}
            />
            <input
              type="number"
              id="rangeMax"
              name="rangeMax"
              className="input-field"
              placeholder="Range Max"
              value={sensorTypeData.rangeMax || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group select-container">
          <select
            id="pulse"
            name="pulse"
            className="input-field custom-select"
            value={sensorTypeData.pulse || ''}
            onChange={handlePulseChange}
          >
            <option value="" disabled>Select Pulse</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        {showAdditionalFields && (
          <>
            <div className="form-group">
              <input
                type="number"
                id="coefficient"
                name="coefficient"
                className="input-field"
                placeholder="Coefficient"
                value={sensorTypeData.coefficient || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div className="form-group">
          <button type="submit" className="submit-button">Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditType;
