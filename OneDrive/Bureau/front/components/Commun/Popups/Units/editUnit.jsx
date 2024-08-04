import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '@components/Commun/Alerts/success-alert'; 
import ErrorAlert from '@components/Commun/Alerts/error-alert'; 
import { updateUnitById } from '@app/utils/apis/units'; 

const EditUnit = ({ isOpen, onClose, initialUnitData }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [unitData, setUnitData] = useState(initialUnitData || {});
  const timeoutRef = useRef(null);

  const closeSuccessAlert = () => setShowSuccessAlert(false);
  const closeErrorAlert = () => setShowErrorAlert(false);

  const validateForm = () => {
    console.log('Unit Data:', unitData);

    const requiredFields = ['unitName', 'SensorType', 'MeasuredParameter'];

    for (const field of requiredFields) {
      if (!unitData[field]) {
        setErrorAlertMessage('Please fill in all the required fields!');
        setShowErrorAlert(true);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const updatedData = {
        unitName: unitData.unitName,
        SensorType: unitData.SensorType,
        MeasuredParameter: unitData.MeasuredParameter,
        Abbreviation: unitData.Abbreviation

      };
      await updateUnitById(unitData._id, updatedData);
      setShowSuccessAlert(true);
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating unit:', error);
      setErrorAlertMessage('Error updating unit!');
      setShowErrorAlert(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialUnitData) {
      setUnitData(initialUnitData);
    }
  }, [initialUnitData]);

  if (!isOpen) return null;

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Unit updated successfully!" onClose={closeSuccessAlert} />}
      {showErrorAlert && <ErrorAlert message={errorAlertMessage} onClose={closeErrorAlert} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            id="unitName"
            name="unitName"
            className="input-field"
            placeholder="Unit Name"
            value={unitData.unitName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="SensorType"
            name="SensorType"
            className="input-field"
            placeholder="Sensor Type"
            value={unitData.SensorType || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="MeasuredParameter"
            name="MeasuredParameter"
            className="input-field"
            placeholder="Measured Parameter"
            value={unitData.MeasuredParameter || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="Abbreviation"
            name="Abbreviation"
            className="input-field"
            placeholder="Abbreviation"
            value={unitData.Abbreviation || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">Update Unit</button>
        </div>
      </form>
    </div>
  );
};

export default EditUnit;
