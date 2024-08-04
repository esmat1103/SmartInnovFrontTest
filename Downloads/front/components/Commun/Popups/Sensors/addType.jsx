import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '../../Alerts/success-alert';
import ErrorAlert from '../../Alerts/error-alert';

import { fetchUnits } from '@app/utils/apis/units';
import { createSensorType } from '@app/utils/apis/sensorTypes';

const AddType = ({ isOpen, onClose, onSensorTypeAdded }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [units, setUnits] = useState([]);
  const [sensorTypeData, setSensorTypeData] = useState({
    sensorReference: '',
    sensorName: '',
    unit: '',
    rangeMin: '',
    rangeMax: '',
    pulse: '',
    coefficient: '',
  });
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [showErrorAlert]);

  useEffect(() => {
    const getUnits = async () => {
      try {
        const fetchedUnits = await fetchUnits();
        setUnits(fetchedUnits);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    getUnits();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCloseAlerts = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSensorTypeData({ ...sensorTypeData, [name]: value });
  };

  const handlePulseChange = (e) => {
    const pulseValue = e.target.value;
    setSensorTypeData((prevState) => ({
      ...prevState,
      pulse: pulseValue,
      ...(pulseValue === 'Yes' ? { coefficient: '' } : {})
    }));
  };

  const validateForm = () => {
    const requiredFields = ['sensorReference', 'sensorName', 'unit', 'rangeMin', 'rangeMax', 'pulse'];
    for (const field of requiredFields) {
      if (!sensorTypeData[field]) {
        setAlertMessage('Please fill in all the required fields!');
        setShowErrorAlert(true);
        return false;
      }
    }
    if (sensorTypeData.pulse === 'Yes' && (!sensorTypeData.coefficient )) {
      setAlertMessage('Please fill in all the required fields!');
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
      const newSensorType = await createSensorType(sensorTypeData);
      setShowSuccessAlert(true);
      onSensorTypeAdded();
      timeoutRef.current = setTimeout(() => {
        setSensorTypeData({
          sensorReference: '',
          sensorName: '',
          unit: '',
          rangeMin: '',
          rangeMax: '',
          pulse: '',
          coefficient: '',
        });
        handleCloseAlerts();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding sensor type:', error);
      setAlertMessage('Error adding sensor type: ' + (error.response?.data?.message || error.message));
      setShowErrorAlert(true);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Sensor added successfully!" onClose={handleCloseAlerts} />}
      {showErrorAlert && <ErrorAlert message={alertMessage} onClose={handleCloseAlerts} />}
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
            value={sensorTypeData.sensorReference}
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
            value={sensorTypeData.sensorName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group select-container">
          <select
            id="unit"
            name="unit"
            className="input-field custom-select"
            value={sensorTypeData.unit}
            onChange={handleChange}
          >
            <option value="" disabled>Unit</option>
            {units.map((unit) => (
              <option key={unit._id} value={unit.unitName}>
                {unit.unitName}
              </option>
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
              value={sensorTypeData.rangeMin}
              onChange={handleChange}
            />
            <input
              type="number"
              id="rangeMax"
              name="rangeMax"
              className="input-field"
              placeholder="Range Max"
              value={sensorTypeData.rangeMax}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group select-container">
          <select
            id="pulse"
            name="pulse"
            className="input-field custom-select"
            value={sensorTypeData.pulse}
            onChange={handlePulseChange}
          >
            <option value="" disabled>Pulse</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        
        {sensorTypeData.pulse === 'Yes' && (
          <>
            <div className="form-group">
              <input
                type="number"
                id="coefficient"
                name="coefficient"
                className="input-field"
                placeholder="Coefficient"
                value={sensorTypeData.coefficient}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <button type="submit" className="submit-button">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddType;
