import React from 'react';
import { useState } from 'react';

const BinForm = ({ binData, handleInputChange,governorates,municipalities}) => {
  const [latitude, setLatitude] = useState(binData?.location?.latitude || '');
  const [longitude, setLongitude] = useState(binData?.location?.longitude || '');

  const handleLatitudeChange = (event) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitude(event.target.value);
  };
  return (
    <form className='mt-3 '>
      <div className="form-group"> 
          <div className="custom-select-wrapper">
            <select
              id="governorate"
              name="governorate"
              className="custom-select"
              value={binData.governorate}
              onChange={handleInputChange}
            >
              <option value="">Select Governorate</option>
              {governorates.map(governorate => (
                <option key={governorate} value={governorate}>{governorate}</option>
              ))}
            </select>
          </div>
        </div>  

        <div className="form-group">
          <div className="custom-select-wrapper">
            <select
              id="municipality"
              name="municipality"
              className="custom-select"
              value={binData.municipality}
              onChange={handleInputChange}
            > 
              <option value="">Select Municipality</option>
              {municipalities && municipalities.map(municipality => {
                console.log("Municipalities:", municipalities);
                return (
                    <option key={municipality} value={municipality}>{municipality}</option>
                );
            })}
            </select>
          </div>
        </div> 
        
        <div className="form-group">
        <input
        type="text"
        name="latitude"
        placeholder="Latitude"
        className="input-2 ml-1 "
        value={latitude}
        onChange={handleLatitudeChange}
        readOnly
        />
      <input
        type="text"
        name="longitude"
        placeholder="Longitude"
        className="input-2 ml-1 "
        value={longitude}
        onChange={handleLongitudeChange}
        readOnly
        />
       </div>
       <div className="form-group">
          <input
            type="text"
            id="location_name"
            name="location_name"
            placeholder="Location Name"
            className="input-2 ml-1 "
            value={binData.location_name}
            onChange={handleInputChange}
          />
        </div>
     
        <div className="form-group">
        <input
            type="number"
            id="filling_level"
            name="filling_level"
            placeholder="Filling Level"
            className="input-2 ml-1 "
            value={binData.filling_level}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <select
          id="status"
          name="status"
          className="custom-select "
          value={binData.status}
          onChange={handleInputChange}
          > 
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            </select>
        </div> 
        <div className="form-group">
          <select
          id="tilt_status"
          name="tilt_status"
          className="custom-select "
          value={binData.tilt_status}
          onChange={handleInputChange}
          >
            <option value="">Tilt Status</option>
            <option value="Fallen">Fallen</option>
            <option value="Stable">Stable</option>
            </select>
        </div>   
      </form>
  );
};

export default BinForm;
