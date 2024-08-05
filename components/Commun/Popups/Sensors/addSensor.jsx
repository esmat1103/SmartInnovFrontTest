import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '../../Alerts/success-alert';
import ErrorAlert from '../../Alerts/error-alert';
import { createSensor } from '@app/utils/apis/sensors';
import { fetchUnits } from '@app/utils/apis/units';

const AddSensor = ({ isOpen, onClose, onSensorAdded }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [units, setUnits] = useState([]);
  const [sensorData, setSensorData] = useState({
    sensorReference: '',
    sensorName: '',
    unit: '',
    rangeMin: '',
    rangeMax: '',
    thresholdMin: '',
    thresholdMax: '',
    pulse: '',
    startIndex: '',
    coefficient: '',
    state: ''
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
    setSensorData({ ...sensorData, [name]: value });
  };

  const handlePulseChange = (e) => {
    const pulseValue = e.target.value;
    setSensorData((prevState) => ({
      ...prevState,
      pulse: pulseValue,
      ...(pulseValue === 'Yes' ? { startIndex: '', coefficient: '' } : {})
    }));
  };

  const validateForm = () => {
    const requiredFields = ['sensorReference', 'sensorName', 'unit', 'rangeMin', 'rangeMax', 'thresholdMin', 'thresholdMax', 'pulse', 'state'];
    for (const field of requiredFields) {
      if (!sensorData[field]) {
        setAlertMessage('Please fill in all the required fields!');
        setShowErrorAlert(true);
        return false;
      }
    }
    if (sensorData.pulse === 'Yes' && (!sensorData.coefficient || !sensorData.startIndex)) {
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
      const newSensor = await createSensor(sensorData);
      setShowSuccessAlert(true);
      onSensorAdded();
      timeoutRef.current = setTimeout(() => {
        setSensorData({
          sensorReference: '',
          sensorName: '',
          unit: '',
          rangeMin: '',
          rangeMax: '',
          thresholdMin: '',
          thresholdMax: '',
          pulse: '',
          startIndex: '',
          coefficient: '',
          state: ''
        });
        handleCloseAlerts();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding sensor:', error);
      setAlertMessage('Error adding sensor: ' + (error.response?.data?.message || error.message));
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
            value={sensorData.sensorReference}
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
            value={sensorData.sensorName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group select-container">
          <select
            id="unit"
            name="unit"
            className="input-field custom-select"
            value={sensorData.unit}
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
              value={sensorData.rangeMin}
              onChange={handleChange}
            />
            <input
              type="number"
              id="rangeMax"
              name="rangeMax"
              className="input-field"
              placeholder="Range Max"
              value={sensorData.rangeMax}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <div className='flex'>
            <input
              type="number"
              id="thresholdMin"
              name="thresholdMin"
              className="input-field mr-2"
              placeholder="Threshold Min"
              value={sensorData.thresholdMin}
              onChange={handleChange}
            />
            <input
              type="number"
              id="thresholdMax"
              name="thresholdMax"
              className="input-field"
              placeholder="Threshold Max"
              value={sensorData.thresholdMax}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <select
            id="state"
            name="state"
            className="input-field custom-select"
            value={sensorData.state}
            onChange={handleChange}
          >
            <option value="" disabled>Select State</option>
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
        <div className="form-group select-container">
          <select
            id="pulse"
            name="pulse"
            className="input-field custom-select"
            value={sensorData.pulse}
            onChange={handlePulseChange}
          >
            <option value="" disabled>Pulse</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        
        {sensorData.pulse === 'Yes' && (
          <>
            <div className="form-group">
              <input
                type="number"
                id="coefficient"
                name="coefficient"
                className="input-field"
                placeholder="Coefficient"
                value={sensorData.coefficient}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                id="startIndex"
                name="startIndex"
                className="input-field"
                placeholder="Start Index"
                value={sensorData.startIndex}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <button type="submit" className="submit-button">Add Sensor</button>
        </div>
      </form>
    </div>
  );
};

export default AddSensor;
