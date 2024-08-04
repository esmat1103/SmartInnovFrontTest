import React, { useState } from 'react';

const TableHeader = ({ handleHeaderCheckboxChange }) => {
  return (
    <thead className="table-header darkgrey">
      <tr className="table-header-row">
        <th>
          <input 
            type="checkbox" 
            className="custom-checkbox" 
            onChange={handleHeaderCheckboxChange} 
          />
        </th>
        <th className='f12 nunito '>ID</th>
        <th className='f12 nunito  pl23'>Name</th>
        <th className='f12 nunito '>Email</th>
        <th className='f12 nunito pl17'>Phone Number</th>
        <th className='f12 nunito pl23'>Created At</th>
        <th className='f12 nunito pl50'>Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;