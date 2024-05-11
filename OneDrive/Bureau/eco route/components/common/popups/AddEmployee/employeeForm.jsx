import React from 'react';

const EmployeeForm = ({ employeeData, handleInputChange ,governorates,municipalities}) => {
  return (
    <form className='mt-3'>
      <div className="form-group">
        <input
          type="text"
          id="first_name"
          name="first_name"
          placeholder="First Name"
          className=" input-2 mr1"
          value={employeeData.first_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="last_name"
          name="last_name"
          placeholder="Last Name"
          className="input-2 ml-1"
          value={employeeData.last_name}
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
          value={employeeData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="custom-input"
          value={employeeData.password}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          placeholder="Phone Number"
          className="custom-input"
          value={employeeData.phone_number}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group"> 
          <div className="custom-select-wrapper">
            <select
              id="governorate"
              name="governorate"
              className="custom-select"
              value={employeeData.governorate}
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
              value={employeeData.municipality}
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

        <div className="form-group"></div>
      <div className="form-group">
        <input
          type="number"
          id="years_of_experience"
          name="years_of_experience"
          placeholder="Years of Experience"
          className="input-2 ml-1"
          value={employeeData.years_of_experience}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
};

export default EmployeeForm;
