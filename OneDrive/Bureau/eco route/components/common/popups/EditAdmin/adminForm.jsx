import React from 'react';

const AdminForm = ({ adminData, handleInputChange,governorates,municipalities }) => {
  return (
    <form className='mt-3'>
      <div className="form-group">
        <input
          type="text"
          id="first_name"
          name="first_name"
          placeholder="First Name"
          className=" input-2 mr1"
          value={adminData.first_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="last_name"
          name="last_name"
          placeholder="Last Name"
          className="input-2 ml-1"
          value={adminData.last_name}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className="custom-input"
          value={adminData.email}
          onChange={handleInputChange}
          readOnly
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="custom-input"
          value={adminData.password}
          onChange={handleInputChange}
          readOnly
        />
      </div>

      <div className="form-group"> 
          <div className="custom-select-wrapper">
            <select
              id="governorate"
              name="governorate"
              className="custom-select"
              value={adminData.governorate}
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
              value={adminData.municipality}
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
      
    </form>
  );
};

export default AdminForm;
