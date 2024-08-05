import React, { useState } from 'react';
import Image from 'next/image';
import removeIcon from '/public/assets/Table/delete.svg';

const SensorsPopup = ({ closePopup, sensors }) => {
  const [sensorData, setSensorData] = useState([
    { 
      export: false, 
      startDate: '', 
      endDate: '', 
      frequency: '',
      selectedSensors: []
    },
  ]);
 
  const handleInputChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    setSensorData(prevState => {
      const updatedSensors = [...prevState];
      updatedSensors[index] = { ...updatedSensors[index], [name]: type === 'checkbox' ? checked : value };
      return updatedSensors;
    });
  };

  const handleSensorChange = (index, event) => {
    const { value } = event.target;
    setSensorData(prevState => {
      const updatedSensors = [...prevState];
      if (!updatedSensors[index].selectedSensors.includes(value)) {
        updatedSensors[index] = { ...updatedSensors[index], selectedSensors: [...updatedSensors[index].selectedSensors, value] };
      }
      return updatedSensors;
    });
  };

  const handleRemoveSensor = (index, sensorToRemove) => {
    setSensorData(prevState => {
      const updatedSensors = [...prevState];
      updatedSensors[index] = {
        ...updatedSensors[index],
        selectedSensors: updatedSensors[index].selectedSensors.filter(sensor => sensor !== sensorToRemove)
      };
      return updatedSensors;
    });
  };

  const handleSave = () => {
    console.log('Saving sensors:', sensorData);
    closePopup(); 
  };

  const handleExport = (sensor) => {
    console.log(`Exporting data for ${sensor.selectedSensors.join(', ')} from ${sensor.startDate} to ${sensor.endDate} with frequency ${sensor.frequency}`);
  };

  return (
    <div className="sensors-popup-overlay">
      <div className="sensors-popup">
        {sensorData.map((sensor, index) => (
          <div key={index} className="sensors-popup-input-container">
              <select
                className="input-field custom-select"
                name="selectedSensors"
                value=""
                onChange={e => handleSensorChange(index, e)}
              >
                <option value="" disabled>Select Sensor</option>
                {sensors
                  .filter(sensorItem => !sensorData[index].selectedSensors.includes(sensorItem.id))
                  .map((sensorItem, sensorIndex) => (
                    <option key={sensorIndex} value={sensorItem.id}>{sensorItem.ref}</option>
                  ))}
              </select>
            <div className="selected-sensors-pop">
              {sensor.selectedSensors.map((selectedSensor, sensorIndex) => (
                <div key={sensorIndex} className="selected-sensor d-inline-block">
                  {sensors.find(sensorItem => sensorItem.id === selectedSensor)?.ref || selectedSensor}
                  <button type="button" className="remove-button" onClick={() => handleRemoveSensor(index, selectedSensor)}>
                    <Image src={removeIcon} alt="Remove" height={10} width={12} className="pic" />
                  </button>
                </div>
              ))}
            </div>
            <label>
              Export:
              <input
                type="checkbox"
                name="export"
                checked={sensor.export}
                onChange={e => handleInputChange(index, e)}
              />
            </label>
            {sensor.export && (
              <div className="export-options">
                <label>
                  Start Date:
                  <div className="custom-date-input">
                    <input
                      type="date"
                      name="startDate"
                      value={sensor.startDate}
                      onChange={e => handleInputChange(index, e)}
                    />
                  </div>
                </label>
                <label>
                  End Date:
                  <div className="custom-date-input">
                    <input
                      type="date"
                      name="endDate"
                      value={sensor.endDate}
                      onChange={e => handleInputChange(index, e)}
                    />
                  </div>
                </label>
                <label>
                  Frequency:
                  <select
                    name="frequency"
                    value={sensor.frequency}
                    onChange={e => handleInputChange(index, e)}
                  >
                    <option value="">Select Frequency</option>
                    <option value="seconds">Every few seconds</option>
                    <option value="hours">Every 8 hours</option>
                  </select>
                </label>
                <button className="export-button" onClick={() => handleExport(sensor)}>Export</button>
              </div>
            )}
          </div>
        ))}
        <div className='center1'>
          <button className="add-button" onClick={handleSave}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SensorsPopup;
